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
for (const svc of services) {
  const cwd = path.join(servicesDir, svc);
  console.log(`\n=== Running tests for ${svc} ===`);
  const res = spawnSync('npm', ['test'], { cwd, stdio: 'inherit', shell: true });
  if (res.status !== 0) {
    console.error(`Tests failed for ${svc}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
