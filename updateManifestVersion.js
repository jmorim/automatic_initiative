import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const manifestPath = path.resolve('./module.json');

const gitTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

manifest.version = gitTag;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Updated version in ${path.basename(manifestPath)} to ${gitTag}`);