import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const manifestPath = path.resolve('./module.json');
const repo = import.meta.env.VITE_REPO || process.env.GITHUB_REPOSITORY;
const repoName = repo.split('/')[1];

const gitTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

manifest.version = gitTag.substring(1);
manifest.manifest = `https://github.com/${repo}/releases/latest/download/module.json`;
manifest.download = `https://github.com/${repo}/releases/download/${gitTag}/${repoName}-${gitTag}.zip`;

manifest.esmodules = ['./index.js'];
//manifest.scripts = ['./lib/lib.js'];
manifest.styles = ['./styles/module.css'];

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Updated version in ${path.basename(manifestPath)} to ${gitTag}`);