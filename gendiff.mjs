#!/usr/bin/env node

import path from 'path';
import { Command } from 'commander';
import _ from 'lodash';
import parseFile from './parsers.js';
import { fileURLToPath } from 'url';

// Función para construir el diff recursivo
function buildDiff(file1, file2) {
  const allKeys = _.union(Object.keys(file1), Object.keys(file2)).sort();

  return allKeys.map((key) => {
    if (!_.has(file1, key)) {
      return { key, type: 'added', value: file2[key] };
    }
    if (!_.has(file2, key)) {
      return { key, type: 'removed', value: file1[key] };
    }
    const value1 = file1[key];
    const value2 = file2[key];
    if (_.isObject(value1) && _.isObject(value2)) {
      return { key, type: 'nested', children: buildDiff(value1, value2) };
    }
    if (value1 !== value2) {
      return { key, type: 'changed', oldValue: value1, newValue: value2 };
    }
    return { key, type: 'unchanged', value: value1 };
  });
}

// Función para formatear el diff en estilo "stylish"
function formatStylish(diff, depth = 1) {
  const indent = (depthLevel) => ' '.repeat(depthLevel * 4 - 2);
  const lines = diff.map((node) => {
    const { key, type } = node;
    const currentIndent = indent(depth);
    const nestedIndent = indent(depth + 1);

    switch (type) {
      case 'added':
        return `${currentIndent}+ ${key}: ${stringify(node.value, depth + 1)}`;
      case 'removed':
        return `${currentIndent}- ${key}: ${stringify(node.value, depth + 1)}`;
      case 'unchanged':
        return `${currentIndent}  ${key}: ${stringify(node.value, depth + 1)}`;
      case 'changed':
        return [
          `${currentIndent}- ${key}: ${stringify(node.oldValue, depth + 1)}`,
          `${currentIndent}+ ${key}: ${stringify(node.newValue, depth + 1)}`,
        ].join('\n');
      case 'nested':
        return `${currentIndent}  ${key}: {\n${formatStylish(node.children, depth + 1)}\n${nestedIndent}}`;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  });
  return lines.join('\n');
}

// Función auxiliar para convertir objetos a cadena con indentación adecuada
function stringify(value, depth) {
  if (!_.isObject(value)) {
    return value;
  }
  const indent = ' '.repeat(depth * 4);
  const closingIndent = ' '.repeat((depth - 1) * 4);
  const lines = Object.entries(value).map(
    ([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`
  );
  return `{\n${lines.join('\n')}\n${closingIndent}}`;
}

// Función principal que genera el diff con formateo
export function genDiff(file1Path, file2Path, format = 'stylish') {
  const file1 = parseFile(file1Path);
  const file2 = parseFile(file2Path);
  const diff = buildDiff(file1, file2);

  if (format === 'stylish') {
    return `{\n${formatStylish(diff)}\n}`;
  }

  throw new Error(`Unknown format: ${format}`);
}

const program = new Command();

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<file1> <file2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((file1Path, file2Path, options) => {
    const fullPath1 = path.resolve(file1Path);
    const fullPath2 = path.resolve(file2Path);
    console.log(genDiff(fullPath1, fullPath2, options.format));
  });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program.parse(process.argv);
}

export default genDiff;
