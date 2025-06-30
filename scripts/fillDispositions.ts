import { promises as fs } from "fs";
import * as path from "path";

/**
 * Quick helper to automatically fill the `Disposition:` placeholders
 * in `build/css-audit/duplicate-report.md`.
 *
 * By default we mark every duplicate as `merge` because these are
 * exact-name collisions that should share a single canonical source
 * (as decided in Phase 3). You can override the default with the
 * `--mode` CLI flag.
 *
 *     ts-node scripts/fillDispositions.ts            # writes draft with merge
 *     ts-node scripts/fillDispositions.ts --mode alias   # uses "alias"
 *
 * The script is conservative: it only transforms lines that still have
 * the placeholder pattern `Disposition: _merge | alias | ignore_`.
 */

interface CliOpts {
  mode: "merge" | "alias" | "ignore";
  reportPath: string;
}

function parseCli(): CliOpts {
  const args = process.argv.slice(2);
  let mode: "merge" | "alias" | "ignore" = "merge";
  let reportPath = path.resolve("build/css-audit/duplicate-report.md");

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--mode" && args[i + 1]) {
      const next = args[i + 1]!;
      if (next === "merge" || next === "alias" || next === "ignore") {
        mode = next;
        i++;
      }
    } else if (a === "--report" && args[i + 1]) {
      reportPath = path.resolve(args[i + 1]!);
      i++;
    }
  }

  return { mode, reportPath };
}

async function run() {
  const { mode, reportPath } = parseCli();

  let md: string;
  try {
    md = await fs.readFile(reportPath, "utf8");
  } catch (err) {
    console.error(`❌  Cannot read report at ${reportPath}`);
    process.exit(1);
  }

  const placeholderRegex = /Disposition:\s+_merge \| alias \| ignore_/g;
  const replaced = md.replace(placeholderRegex, `Disposition: ${mode}`);

  await fs.writeFile(reportPath, replaced, "utf8");
  const count = (md.match(placeholderRegex) || []).length;
  console.log(
    `✅  Updated ${count} Disposition line${
      count === 1 ? "" : "s"
    } to \"${mode}\" in ${path.relative(process.cwd(), reportPath)}`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
