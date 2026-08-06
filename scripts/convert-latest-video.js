const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const ffmpeg = require('ffmpeg-static');

const rootDir = process.cwd();
const testResultsDir = path.join(rootDir, 'test-results');
const outputDir = path.join(rootDir, 'artifacts');

function timestampForFilename(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-')
    + '_'
    + [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds()),
    ].join('-');
}

const timestampedOutputFile = path.join(
  outputDir,
  `portfolio-headed-demo-${timestampForFilename()}.mp4`,
);

function findVideos(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return findVideos(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.webm') ? [fullPath] : [];
  });
}

const sourceVideo = findVideos(testResultsDir)
  .map((file) => ({ file, modifiedAt: fs.statSync(file).mtimeMs }))
  .sort((a, b) => b.modifiedAt - a.modifiedAt)[0];

if (!sourceVideo) {
  throw new Error('No Playwright .webm video found under test-results.');
}

fs.mkdirSync(outputDir, { recursive: true });

execFileSync(
  ffmpeg,
  [
    '-y',
    '-i',
    sourceVideo.file,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    timestampedOutputFile,
  ],
  { stdio: 'inherit' },
);

console.log(`MP4 video created at ${timestampedOutputFile}`);
