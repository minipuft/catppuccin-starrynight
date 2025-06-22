import { promises as fs } from "fs";
import * as path from "path";

/**
 * Phase 4 — Incremental Refactor & Replacement
 * -------------------------------------------------
 * Codemod that renames duplicated/legacy CSS custom-properties to their
 * canonical equivalents across the `src/` tree.
 *
 * USAGE
 *   ts-node scripts/replaceCssTokens.ts [--mapping <file>] [--write|-w]
 *
 * • By default the script runs in *dry-run* mode – it prints a summary of
 *   replacements without touching any files.
 * • Pass `--write` (or `-w`) to persist the changes in-place.
 * • The mapping file is a simple JSON object of `{ "--old": "--new" }` pairs.
 *   It defaults to `build/css-audit/replace-map.json` but can be overridden.
 * • Files under `src/core/` are excluded because they house canonical tokens.
 */

interface CliOptions {
  mappingPath: string;
  write: boolean;
}

function parseCli(): CliOptions {
  const args = process.argv.slice(2);
  let mappingPath = path.resolve("build/css-audit/replace-map.json");
  let write = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--mapping") {
      const next = args[i + 1];
      if (next) {
        mappingPath = path.resolve(next);
        i++;
      }
    } else if (arg === "--write" || arg === "-w") {
      write = true;
    }
  }

  return { mappingPath, write };
}

async function walk(dir: string, collected: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, collected);
    } else if (
      entry.isFile() &&
      (fullPath.endsWith(".scss") || fullPath.endsWith(".css"))
    ) {
      collected.push(fullPath);
    }
  }
  return collected;
}

function escapeReg(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main(): Promise<void> {
  const { mappingPath, write } = parseCli();

  // --- validate & load mapping
  try {
    await fs.access(mappingPath);
  } catch {
    console.error(`❌  Mapping file not found: ${mappingPath}`);
    process.exit(1);
  }

  const mapping: Record<string, string> = JSON.parse(
    await fs.readFile(mappingPath, "utf8")
  );
  const pairs = Object.entries(mapping).filter(
    ([oldTok, newTok]) => oldTok && newTok && oldTok !== newTok
  );

  if (pairs.length === 0) {
    console.log("✅  Mapping file empty or no changes required.");
    return;
  }

  const repoRoot = path.resolve(__dirname, "..", "");
  const srcDir = path.join(repoRoot, "src");

  const allFiles = await walk(srcDir);
  const targetFiles = allFiles.filter(
    (f) => !f.startsWith(path.join(srcDir, "core"))
  );

  const results: Array<{ file: string; replacements: number }> = [];

  for (const file of targetFiles) {
    let contents = await fs.readFile(file, "utf8");
    let replacements = 0;

    for (const [oldTok, newTok] of pairs) {
      const usageRe = new RegExp(`var\\(--${escapeReg(oldTok)}\\b`, "g");
      const declRe = new RegExp(`--${escapeReg(oldTok)}(?=:)`, "g");

      const before = contents;
      contents = contents
        .replace(usageRe, `var(--${newTok}`)
        .replace(declRe, newTok);

      if (before !== contents) {
        // naive count based on delta occurrences
        const diff =
          (before.match(usageRe)?.length || 0) +
          (before.match(declRe)?.length || 0);
        replacements += diff;
      }
    }

    if (replacements > 0) {
      results.push({ file: path.relative(repoRoot, file), replacements });
      if (write) {
        await fs.writeFile(file, contents, "utf8");
      }
    }
  }

  if (results.length === 0) {
    console.log(
      "✨  No matches – codebase already aligned with canonical tokens."
    );
    return;
  }

  console.log("\nCodemod Summary:");
  for (const r of results) {
    console.log(
      `  ${r.file}  →  ${r.replacements} replacement${
        r.replacements !== 1 ? "s" : ""
      }`
    );
  }
  console.log(
    "\n" +
      (write
        ? "✔️  Files updated."
        : "ℹ️  Dry-run only – re-run with --write to apply.")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
