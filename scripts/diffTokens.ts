import { promises as fs } from "fs";
import * as path from "path";

interface BaselineEntry {
  cssProps: string[];
  mixins: string[];
  functions: string[];
  uses: string[];
}

interface TokenMap {
  [token: string]: string[]; // token -> array of file paths
}

/* --------------------- helper: levenshtein -------------------- */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;

  const dp = new Array(blen + 1).fill(0);
  for (let j = 0; j <= blen; j++) dp[j] = j;

  for (let i = 1; i <= alen; i++) {
    let prev = i;
    for (let j = 1; j <= blen; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1, // deletion
        prev + 1, // insertion
        dp[j - 1] + cost
      ); // substitution
      prev = temp;
    }
  }
  return dp[blen];
}

/* --------------------- priority helper ------------------------ */
function rankFile(filePath: string): number {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.startsWith("src/core")) return 0;
  if (normalized.startsWith("src/layout")) return 1;
  if (normalized.startsWith("src/components")) return 2;
  if (normalized.startsWith("src/systems")) return 3;
  if (normalized.startsWith("src/features")) return 4;
  if (normalized.startsWith("src/sidebar")) return 5;
  if (normalized.startsWith("src/search")) return 6;
  return 7;
}

function pickPreferred(files: string[]): string {
  return files.slice().sort((a, b) => rankFile(a) - rankFile(b))[0]!;
}

function invertTokenMap(
  baseline: Record<string, BaselineEntry>,
  key: keyof BaselineEntry
): TokenMap {
  const map: TokenMap = {};
  for (const [file, entry] of Object.entries(baseline)) {
    for (const token of entry[key]) {
      if (!map[token]) map[token] = [];
      map[token].push(file);
    }
  }
  return map;
}

async function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const auditDir = path.join(repoRoot, "build", "css-audit");
  const baselinePath = path.join(auditDir, "baseline.json");
  const baselineRaw = await fs.readFile(baselinePath, "utf8");
  const baseline: Record<string, BaselineEntry> = JSON.parse(baselineRaw);

  const categories: (keyof BaselineEntry)[] = [
    "cssProps",
    "mixins",
    "functions",
  ];
  const markdownSections: string[] = [
    "# Duplicate & Near-Duplicate Token Report",
    "",
  ];

  for (const category of categories) {
    const tokenMap = invertTokenMap(baseline, category);

    const exactDuplicates = Object.entries(tokenMap).filter(
      ([_t, files]) => files.length > 1
    );
    // Build section header
    markdownSections.push(`## ${category} Duplicates`);
    if (exactDuplicates.length === 0) {
      markdownSections.push("_No exact duplicates found._\n");
    } else {
      for (const [token, files] of exactDuplicates) {
        const preferred = pickPreferred(files);
        markdownSections.push(`### Token: \

	${token}`);
        markdownSections.push("Defined in:");
        for (const f of files) {
          markdownSections.push(`- \\${f}`);
        }
        markdownSections.push(`Preferred source (auto-ranked): \\

	${preferred}`);
        markdownSections.push("Disposition: _merge | alias | ignore_\n");
      }
    }

    // Near duplicates detection (simple pairwise within this category)
    const tokens: string[] = Object.keys(tokenMap);
    const nearGroups: string[][] = [];
    const visited = new Set<string>();
    const threshold = 3; // edit distance threshold
    for (let i = 0; i < tokens.length; i++) {
      const t1 = tokens[i]!;
      if (visited.has(t1)) continue;
      const group: string[] = [t1];
      for (let j = i + 1; j < tokens.length; j++) {
        const t2 = tokens[j]!;
        if (levenshtein(t1, t2) <= threshold) {
          group.push(t2);
          visited.add(t2);
        }
      }
      if (group.length > 1) {
        nearGroups.push(group);
        group.forEach((t) => visited.add(t));
      }
    }
    markdownSections.push(`### Near-Duplicate ${category}`);
    if (nearGroups.length === 0) {
      markdownSections.push("_No near-duplicate names found._\n");
    } else {
      for (const group of nearGroups) {
        markdownSections.push(`Possible variants: ${group.join(", ")}`);
        markdownSections.push("Disposition: _merge | alias | ignore_\n");
      }
    }
  }

  const reportPath = path.join(auditDir, "duplicate-report.md");
  await fs.writeFile(reportPath, markdownSections.join("\n"), "utf8");
  console.log(
    `Duplicate report written to ${path.relative(repoRoot, reportPath)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
