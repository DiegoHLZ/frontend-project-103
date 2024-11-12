import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function parseFile(filepath) {
  const fullPath = path.resolve(filepath);
  const fileData = fs.readFileSync(fullPath, 'utf8');

  const ext = path.extname(fullPath);
  if (ext === '.json') {
    return JSON.parse(fileData);
  } else if (ext === '.yml' || ext === '.yaml') {
    return yaml.load(fileData);
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }
}
