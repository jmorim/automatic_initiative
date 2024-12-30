import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const MODULE_ID = 'automatic-initiative-2';
const DIST_DIR = path.resolve(__dirname, 'dist');
const ZIP_NAME = `${MODULE_ID}.zip`;
const ZIP_PATH = path.resolve(__dirname, ZIP_NAME);

const zipDirectory = (source, out) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, MODULE_ID)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
}

(async () => {
  try {
    console.log('creating ZIP archive ... ');
    await zipDirectory(DIST_DIR, ZIP_PATH);
    console.log(`ZIP archive created at ${ZIP_PATH}`);
  } catch (error) {
    console.error('Error during build: ', error);
  }
})();