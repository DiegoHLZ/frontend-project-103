import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseFile = (filePath) => {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  
  if (!content) {
    return {};
  }

  if (ext === '.yml' || ext === '.yaml') {
    return yaml.load(content) || {};
  } else if (ext === '.json') {
    try {
      return JSON.parse(content);
    } catch {
      throw new Error(`Failed to parse file: ${filePath}. Invalid JSON format.`);
    }
  }

  throw new Error(`Unsupported file extension: ${ext}`);
};

export default parseFile;