// parsers.js
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseFile = (filePath) => {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  if (ext === '.yml' || ext === '.yaml') {
    return yaml.load(content);
  } else if (ext === '.json') {
    return JSON.parse(content);
  }

  throw new Error(`Unsupported file extension: ${ext}`);
};

export default parseFile;
