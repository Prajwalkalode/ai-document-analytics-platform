import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const servicesDir = path.resolve(process.cwd(), 'services');
if (!fs.existsSync(servicesDir)) {
  console.error('No services directory found');
  process.exit(1);
}

const services = fs.readdirSync(servicesDir).filter((name) => {
  const pkg = path.join(servicesDir, name, 'package.json');
  return fs.existsSync(pkg);
});

let failed = false;
const summaries = [];
for (const svc of services) {
  const cwd = path.join(servicesDir, svc);
  console.log(`\n=== Running coverage for ${svc} ===`);
  const res = spawnSync('npm', ['run', 'coverage'], { cwd, encoding: 'utf8', shell: true });
  const output = `${res.stdout || ''}\n${res.stderr || ''}`;
  // Print the full per-service output so individual reports remain visible
  console.log(output);
  if (res.status !== 0) {
    console.error(`Coverage command failed for ${svc}`);
    console.error(output);
    failed = true;
    summaries.push({ service: svc, error: true, output });
    continue;
  }

  // Try to extract the Coverage summary block produced by Vitest
  const combined = output;
  const regex =
    /Statements\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)[\s\S]*?Branches\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)[\s\S]*?Functions\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)[\s\S]*?Lines\s*:\s*([\d.]+)%\s*\(\s*(\d+)\/(\d+)\s*\)/i;
  const m = combined.match(regex);
  if (m) {
    summaries.push({
      service: svc,
      statements: { pct: m[1], covered: m[2], total: m[3] },
      branches: { pct: m[4], covered: m[5], total: m[6] },
      functions: { pct: m[7], covered: m[8], total: m[9] },
      lines: { pct: m[10], covered: m[11], total: m[12] },
    });
  } else {
    // Fallback: no parsed summary
    summaries.push({ service: svc, error: false, output });
  }
}

// Print consolidated table
console.log('\nCoverage Summary\n');
const header = ['Service', 'Statements', 'Branches', 'Functions', 'Lines'];
const rows = [header];
for (const s of summaries) {
  if (s.error) {
    rows.push([s.service, 'ERROR', 'ERROR', 'ERROR', 'ERROR']);
    continue;
  }
  if (!s.statements) {
    rows.push([s.service, 'N/A', 'N/A', 'N/A', 'N/A']);
    continue;
  }
  const st = `${s.statements.pct}% (${s.statements.covered}/${s.statements.total})`;
  const br = `${s.branches.pct}% (${s.branches.covered}/${s.branches.total})`;
  const fn = `${s.functions.pct}% (${s.functions.covered}/${s.functions.total})`;
  const ln = `${s.lines.pct}% (${s.lines.covered}/${s.lines.total})`;
  rows.push([s.service, st, br, fn, ln]);
}

// Compute column widths
const colWidths = rows[0].map((_, ci) => Math.max(...rows.map((r) => (r[ci] || '').length)));
const pad = (str, w) => str + ' '.repeat(w - str.length);

// Print header
const headerLine = rows[0].map((c, ci) => pad(c, colWidths[ci])).join(' | ');
console.log(headerLine);
console.log(headerLine.replace(/./g, '-'));
// Print data rows
for (let i = 1; i < rows.length; i++) {
  const line = rows[i].map((c, ci) => pad(c, colWidths[ci])).join(' | ');
  console.log(line);
}

process.exit(failed ? 1 : 0);
