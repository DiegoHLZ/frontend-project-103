import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const parseFile = (filePath) => {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf-8').trim(); // Eliminar espacios extra
  
  if (!content) {
    return {}; // Retorna un objeto vacío si el archivo está vacío
  }

  if (ext === '.yml' || ext === '.yaml') {
    return yaml.load(content) || {}; // Devuelve {} si YAML es nulo
  } else if (ext === '.json') {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse file: ${filePath}. Invalid JSON format.`);
    }
  }

  throw new Error(`Unsupported file extension: ${ext}`);
};

export default parseFile;