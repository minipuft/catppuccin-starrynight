import { promises as fs } from "fs";
import * as path from "path";
// postcss-scss has no types – suppress for now
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import scss from "postcss-scss";

/**
 * Walk the given directory recursively collecting every file that matches the supplied extension.
 */
async function walk(
  dir: string,
  ext: string,
  collected: string[] = []
): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, ext, collected);
    } else if (entry.isFile() && fullPath.endsWith(ext)) {
      collected.push(fullPath);
    }
  }
  return collected;
}

interface TokenCollection {
  cssProps: Set<string>;
  mixins: Set<string>;
  functions: Set<string>;
  uses: Set<string>;
}

async function extractTokens(filePath: string): Promise<TokenCollection> {
  const text = await fs.readFile(filePath, "utf8");
  const root = scss.parse(text);

  const collection: TokenCollection = {
    cssProps: new Set<string>(),
    mixins: new Set<string>(),
    functions: new Set<string>(),
    uses: new Set<string>(),
  };

  // Walk declarations for CSS custom properties.
  root.walkDecls((decl) => {
    if (decl.prop.startsWith("--")) {
      collection.cssProps.add(decl.prop);
    }
  });

  // Walk at-rules for mixin / function / use.
  root.walkAtRules((atRule) => {
    const name = atRule.name.toLowerCase();
    const firstParam = atRule.params.split(/\s+/)[0];

    if (name === "mixin" && firstParam) {
      collection.mixins.add(firstParam);
    } else if (name === "function" && firstParam) {
      collection.functions.add(firstParam);
    } else if (name === "use") {
      const cleaned = atRule.params.replace(/["']/g, "").trim();
      if (cleaned) collection.uses.add(cleaned);
    }
  });

  return collection;
}

async function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const srcDir = path.join(repoRoot, "src");
  const scssFiles = await walk(srcDir, ".scss");

  const baseline: Record<
    string,
    {
      cssProps: string[];
      mixins: string[];
      functions: string[];
      uses: string[];
    }
  > = {};

  for (const file of scssFiles) {
    const tokens = await extractTokens(file);
    baseline[path.relative(repoRoot, file)] = {
      cssProps: Array.from(tokens.cssProps).sort(),
      mixins: Array.from(tokens.mixins).sort(),
      functions: Array.from(tokens.functions).sort(),
      uses: Array.from(tokens.uses).sort(),
    };
  }

  // Ensure output directory exists
  const outDir = path.join(repoRoot, "build", "css-audit");
  await fs.mkdir(outDir, { recursive: true });

  // Write JSON baseline
  await fs.writeFile(
    path.join(outDir, "baseline.json"),
    JSON.stringify(baseline, null, 2),
    "utf8"
  );

  // Build summary CSV (token -> files)
  const tokenMap: Record<string, Set<string>> = {};
  for (const [file, data] of Object.entries(baseline)) {
    const allTokens = [...data.cssProps, ...data.mixins, ...data.functions];
    for (const token of allTokens) {
      if (!tokenMap[token]) tokenMap[token] = new Set();
      tokenMap[token].add(file);
    }
  }
  const csvLines: string[] = ["token,files"];
  const sortedTokens = Object.keys(tokenMap).sort();
  for (const token of sortedTokens) {
    const files = tokenMap[token]!; // non-null assertion: we always created the set earlier
    csvLines.push(`${token},${Array.from(files).join("|")}`);
  }
  await fs.writeFile(
    path.join(outDir, "baseline.csv"),
    csvLines.join("\n"),
    "utf8"
  );

  console.log(
    `CSS audit baseline generated for ${
      scssFiles.length
    } files → ${path.relative(repoRoot, outDir)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
