#!/usr/bin/env node

import path from 'path';
import { Command } from 'commander';
import _ from 'lodash';
import { parseFile } from './fileParser.mjs';
import { fileURLToPath } from 'url';

const program = new Command();

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<file1> <file2>')
  .option('-f, --format <type>', 'output format')
  .action((file1Path, file2Path) => {
    const fullPath1 = path.resolve(file1Path);
    const fullPath2 = path.resolve(file2Path);
    
    const file1 = parseFile(fullPath1);
    const file2 = parseFile(fullPath2);
    
    console.log(genDiff(file1, file2));
  });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program.parse(process.argv);
}

// Función principal que genera el diff
export function genDiff(file1, file2) {
  const allKeys = _.union(Object.keys(file1), Object.keys(file2));
  const sortedKeys = _.sortBy(allKeys);

  const diffLines = sortedKeys.map((key) => {
    if (_.has(file1, key) && _.has(file2, key)) {
      if (file1[key] === file2[key]) {
        return `    ${key}: ${file1[key]}`;
      } else {
        return `  - ${key}: ${file1[key]}\n  + ${key}: ${file2[key]}`;
      }
    }
    if (_.has(file1, key)) {
      return `  - ${key}: ${file1[key]}`;
    }
    return `  + ${key}: ${file2[key]}`;
  });

  return `{\n${diffLines.join('\n')}\n}`;
}

export default genDiff;