const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dirs = ["src/layout", "src/components", "src/features", "src/sidebar"];
// Pattern matches any occurrence of Spotify-esque container selectors that we
// might want to audit.  Extend as new containers surface.
const pattern = ".Root__|div\\[|nav\\[|aside\\[|header\\[";

let results = [];

// ==============================
// Helper: detect rg availability
// ==============================
function hasRipgrep() {
  try {
    execSync("rg --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// ==============================
// Fast path – use ripgrep if present
// ==============================
if (hasRipgrep()) {
  try {
    const cmd = `rg -nH -e "${pattern}" ${dirs.join(" ")} --glob "*.scss"`;
    const out = execSync(cmd, { encoding: "utf8" });
    out
      .trim()
      .split("\n")
      .forEach((line) => {
        if (!line) return;
        const first = line.indexOf(":");
        const second = line.indexOf(":", first + 1);
        if (first === -1 || second === -1) return;
        const file = line.slice(0, first);
        const lineNo = line.slice(first + 1, second);
        const selectorLine = line.slice(second + 1);
        const trimmed = selectorLine.trimStart();
        if (
          trimmed.startsWith("&") ||
          trimmed.startsWith("@") ||
          !trimmed.includes("{")
        ) {
          return; // skip nested / non-selector lines
        }
        const selector = trimmed.trim();
        results.push({ file, line: lineNo, selector });
      });
  } catch (e) {
    // ripgrep returns non-zero if no matches; ignore
  }
} else {
  // ==========================================================
  // Fallback – native Node.js recursive scan (cross-platform)
  // ==========================================================
  const fileMatchesRegex = new RegExp(pattern);

  /**
   * Recursively walk a directory and process .scss files.
   * @param {string} dir Absolute or relative directory path
   */
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // skip unreadable directory
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".scss")) {
        processFile(fullPath);
      }
    }
  }

  /**
   * Scan a file line-by-line and collect matches.
   * @param {string} filePath File path
   */
  function processFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((lineText, idx) => {
      if (fileMatchesRegex.test(lineText)) {
        const trimmed = lineText.trimStart();
        // Skip nested selectors that start with "&" or Sass interpolation
        if (trimmed.startsWith("&") || trimmed.startsWith("@")) return;
        // Only grab probable selector lines that open a block
        if (!trimmed.includes("{")) return;
        results.push({
          file: filePath,
          line: (idx + 1).toString(),
          selector: lineText.trim(),
        });
      }
    });
  }

  dirs.forEach((d) => walk(d));
}

// ==============================
// Classification helper
// ==============================
function classify(selector) {
  const s = selector.replace(/\s+/g, " ");
  if (/Root__right-sidebar/.test(s)) return "root-container (right-sidebar)";
  if (/Root__nav-bar/.test(s)) return "root-container (left-sidebar)";
  if (/Root__now-playing-bar/.test(s))
    return "root-container (now-playing-bar)";
  if (/Root__main-view/.test(s)) return "root-container (main-view)";
  if (/main-view-container__scroll-node/.test(s))
    return "sub-container (repeat)";
  if (/nav\[aria-label="Main"\]/.test(s)) return "sub-container (repeat)";
  return "single-use";
}

// ==============================
// Output CSV
// ==============================
const csvLines = ["file,selector,line,type"];
results.forEach((r) => {
  const label = classify(r.selector);
  csvLines.push(
    `${r.file},"${r.selector.replace(/"/g, '""')}",${r.line},${label}`
  );
});
fs.writeFileSync("scripts/dom_selectors.csv", csvLines.join("\n"));
console.log(`Wrote ${results.length} entries to scripts/dom_selectors.csv`);
