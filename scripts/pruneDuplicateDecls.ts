import { promises as fs } from "fs";
import * as path from "path";

/**
 * Phase 4 helper — pruneDuplicateDecls.ts
 * ---------------------------------------
 * Removes duplicate CSS custom-property declarations that have been
 * marked "Disposition: merge" in build/css-audit/duplicate-report.md.
 *
 * • Reads duplicate-report.md → collects { token, canonical, duplicates[] }.
 * • For every duplicate file (non-canonical) removes the `--token:` declaration.
 * • Writes a companion JSON (`build/css-audit/short-term-aliases.json`) that lists
 *   which tokens were deleted from which files — handy if you want to drop
 *   `@include cdf-alias(...)` stubs manually for one-release grace period.
 *
 * Usage
 *   ts-node scripts/pruneDuplicateDecls.ts         # dry run, prints summary
 *   ts-node scripts/pruneDuplicateDecls.ts --write # applies edits in place
 */

interface DupEntry {
  token: string;
  canonical: string;
  duplicates: string[];
}

interface CliOpts {
  reportPath: string;
  write: boolean;
}

function parseCli(): CliOpts {
  const args = process.argv.slice(2);
  let reportPath = path.resolve("build/css-audit/duplicate-report.md");
  let write = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--report" && args[i + 1]) {
      reportPath = path.resolve(args[i + 1]!);
      i++;
    } else if (a === "--write" || a === "-w") {
      write = true;
    }
  }
  return { reportPath, write };
}

async function parseDuplicateReport(mdPath: string): Promise<DupEntry[]> {
  const md = await fs.readFile(mdPath, "utf8");
  const lines = md.split(/\r?\n/);

  const entries: DupEntry[] = [];
  let currentToken: string | null = null;
  let collectingDefs = false;
  let canonical: string | null = null;
  let duplicates: string[] = [];
  let dispositionMerge = false;

  const tokenHeaderRegex = /^### Token:\s*$/;
  const tokenLineRegex = /^\s*--[a-zA-Z0-9_-]+/;
  const definedInRegex = /^Defined in:/;
  const fileBulletRegex = /^-\s+(.+\.scss)$/;
  const preferredRegex = /^\s*Preferred source.*$/;
  const canonicalPathRegex = /^\s*(?:-\s+)?(.+\.scss)$/;
  const dispositionRegex = /^\s*Disposition:\s+merge/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (tokenHeaderRegex.test(line)) {
      // reset state
      currentToken = null;
      canonical = null;
      duplicates = [];
      collectingDefs = false;
      dispositionMerge = false;
      continue;
    }

    if (currentToken === null && tokenLineRegex.test(line)) {
      currentToken = line.trim();
      continue;
    }

    if (definedInRegex.test(line)) {
      collectingDefs = true;
      continue;
    }

    if (collectingDefs && fileBulletRegex.test(line)) {
      const match = fileBulletRegex.exec(line);
      if (match && match[1]) {
        const p = match[1].trim().replace(/\\/g, "/");
        duplicates.push(p);
      }
      continue;
    }

    if (preferredRegex.test(line)) {
      const nextLine = lines[i + 1] || "";
      const match = canonicalPathRegex.exec(nextLine.trim());
      if (match && match[1]) {
        canonical = match[1].trim().replace(/\\/g, "/");
      }
      continue;
    }

    if (dispositionRegex.test(line)) {
      dispositionMerge = true;
      // Finish entry
      if (
        currentToken &&
        canonical &&
        duplicates.length > 0 &&
        dispositionMerge
      ) {
        // Remove canonical from duplicates array just in case
        const dupSet = duplicates.filter((f) => f !== canonical);
        if (dupSet.length > 0) {
          entries.push({ token: currentToken, canonical, duplicates: dupSet });
        }
      }
      // reset so we don't carry over
      currentToken = null;
    }
  }

  return entries;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function pruneFile(
  filePath: string,
  tokens: string[],
  write: boolean
): Promise<number> {
  let content: string;
  try {
    content = await fs.readFile(filePath, "utf8");
  } catch {
    return 0;
  }
  const original = content;

  for (const t of tokens) {
    const token = t.trim();
    if (!token.startsWith("--")) continue;
    const pattern = new RegExp(
      `^\\s*${escapeRegExp(token)}\\s*:[^;]+;?\\s*$`,
      "gm"
    );
    content = content.replace(pattern, "");
  }

  let removed = original.length - content.length;
  if (removed > 0 && write) {
    await fs.writeFile(filePath, content, "utf8");
  }
  return removed > 0 ? 1 : 0;
}

async function run() {
  const { reportPath, write } = parseCli();
  const dupEntries = await parseDuplicateReport(reportPath);
  if (dupEntries.length === 0) {
    console.log("ℹ️  No merge-disposition duplicates found. Nothing to prune.");
    return;
  }

  // Build map filePath -> tokens to delete
  const fileMap: Record<string, string[]> = {};
  for (const e of dupEntries) {
    for (const dup of e.duplicates) {
      if (!fileMap[dup]) fileMap[dup] = [];
      fileMap[dup].push(e.token);
    }
  }

  let changedCount = 0;
  for (const [file, toks] of Object.entries(fileMap)) {
    const abs = path.resolve(file);
    const modified = await pruneFile(abs, toks, write);
    if (modified) {
      changedCount++;
      console.log(
        `${write ? "✂️ " : "⏸"}  ${path.relative(
          process.cwd(),
          file
        )} – removed ${toks.length} duplicated token${
          toks.length === 1 ? "" : "s"
        }`
      );
    }
  }

  // Write alias plan for manual review
  const aliasPlanPath = path.resolve("build/css-audit/short-term-aliases.json");
  await fs.mkdir(path.dirname(aliasPlanPath), { recursive: true });
  await fs.writeFile(aliasPlanPath, JSON.stringify(fileMap, null, 2), "utf8");
  console.log(
    `📄  Alias plan written → ${path.relative(process.cwd(), aliasPlanPath)}`
  );

  console.log(
    write
      ? `✅  Pruned ${changedCount} file${changedCount === 1 ? "" : "s"}.`
      : "💡  Dry run complete – add --write to modify files."
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
