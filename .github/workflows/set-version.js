import fs from 'fs';
// Arguments:
// bun, script name, tag version, repo
const manifest = JSON.parse(fs.readFileSync('module.json', 'utf8'));
const tagVersion = process.argv[2].split('/').slice(-1)[0];
const repo = process.argv[3];
console.log('repo: ', repo);
const repoName = repo.split('/')[1];
console.log('repoName: ', repoName);
if (!tagVersion || !tagVersion.startsWith('v')) {
  console.error(`Invalid version specified: ${tagVersion}`);
  process.exitCode = 1;
} else {
  manifest.version = tagVersion.substring(1);
  manifest.manifest = `https://raw.githubusercontent.com/${repo}/${tagVersion}/module.json`
  manifest.download = `https://github.com/${repo}/releases/download/${tagVersion}/${repoName}-${tagVersion}.zip`
  fs.writeFileSync('module.json', JSON.stringify(manifest, null, 2));
  console.log(tagVersion);
};