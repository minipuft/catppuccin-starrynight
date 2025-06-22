import { promises as fs } from "fs";
import * as path from "path";

/**
 * Helper to derive `replace-map.json` from `build/css-audit/duplicate-report.md`.
 *
 * Extraction logic:
 *   • Scans for patterns like `cdf-alias('--old-token', '--new-token')`
 *   • Also supports inline arrow syntax `--old -> --new` (future-proof)
 *   • Skips pairs where old === new.
 *
 * Usage
 *   ts-node scripts/generateReplaceMap.ts [--report <mdPath>] [--out <jsonPath>]
 */

interface CliOpts {
  reportPath: string;
  outPath: string;
}

function parseCli(): CliOpts {
  const args = process.argv.slice(2);
  let reportPath = path.resolve("build/css-audit/duplicate-report.md");
  let outPath = path.resolve("build/css-audit/replace-map.json");

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--report") {
      const nxt = args[i + 1];
      if (nxt) {
        reportPath = path.resolve(nxt);
        i++;
      }
    } else if (a === "--out") {
      const nxt = args[i + 1];
      if (nxt) {
        outPath = path.resolve(nxt);
        i++;
      }
    }
  }

  return { reportPath, outPath };
}

async function main() {
  const { reportPath, outPath } = parseCli();

  const md = await fs.readFile(reportPath, "utf8");

  const map: Record<string, string> = {};

  // Pattern 1: @include cdf-alias('--old', '--new') or cdf-alias(old, new)
  const aliasRegex =
    /cdf-alias\((?:'|\")?--([^,'\")\s]+)(?:'|\")?\s*,\s*(?:'|\")?--([^,'\")\s]+)(?:'|\")?/g;
  // Pattern 2: inline arrow --old -> --new
  const arrowRegex = /--([a-zA-Z0-9_-]+)\s*->\s*--([a-zA-Z0-9_-]+)/g;

  let m: RegExpExecArray | null;

  while ((m = aliasRegex.exec(md))) {
    const oldTok = `--${m[1]}`;
    const newTok = `--${m[2]}`;
    if (oldTok !== newTok) {
      map[oldTok] = newTok;
    }
  }

  while ((m = arrowRegex.exec(md))) {
    const oldTok = `--${m[1]}`;
    const newTok = `--${m[2]}`;
    if (oldTok !== newTok) {
      map[oldTok] = newTok;
    }
  }

  const sorted = Object.keys(map).sort();
  const outData = sorted.reduce<Record<string, string>>((acc, k) => {
    acc[k] = map[k]!;
    return acc;
  }, {});

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(outData, null, 2) + "\n", "utf8");

  console.log(
    `📝 replace-map.json generated with ${
      sorted.length
    } entries → ${path.relative(process.cwd(), outPath)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
