import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

export default function setup() {
  execSync('npm run build', { cwd: resolve(__dirname, '..'), stdio: 'pipe' });
}
