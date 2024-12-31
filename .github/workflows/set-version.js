import fs from 'fs';
const manifest = JSON.parse(fs.readFileSync('module.json', 'utf8'));
const tagVersion = process.argv[2].split('/').slice(-1)[0];
if (!tagVersion || !tagVersion.startsWith('v')) {
  console.error(`Invalid version specified: ${tagVersion}`);
  process.exitCode = 1;
} else {
  manifest.version = tagVersion.substring(1);
  fs.writeFileSync('module.json', JSON.stringify(manifest, null, 2));
  console.log(tagVersion);
};