#!/usr/bin/env node
import path from 'path';
import { Command } from 'commander';
import { fileURLToPath } from 'url';

import parseFile from './parsers.js';
import buildDiff from './diffBuilder.js';
import formatDiff from './formatters/index.js';

// Función principal que genera el diff con formateo
export function genDiff(file1Path, file2Path, format = 'stylish') {
  try {
    const file1 = parseFile(file1Path);
    const file2 = parseFile(file2Path);

    // Construye un objeto raíz con una lista de hijos
    const diff = {
      type: 'root',
      children: buildDiff(file1, file2),
    };

    // Valida que diff.children sea un array válido
    if (!Array.isArray(diff.children)) {
      throw new Error('Failed to generate diff: Invalid diff structure');
    }

    return formatDiff(diff, format);
  } catch (error) {
    throw new Error(`Failed to generate diff: ${error.message}`);
  }
}

// Configuración de la línea de comandos
const program = new Command();

program
  .version('1.0.0')
  .description(`
Compares two configuration files and shows a difference.

Example:
  gendiff --format plain file1.json file2.json
  gendiff --format stylish file1.yml file2.yml
  `)
  .arguments('<file1> <file2>')
  .option('-f, --format <type>', 'output format', 'stylish') // Default: 'stylish'
  .action((file1Path, file2Path, options) => {
    try {
      const fullPath1 = path.resolve(file1Path);
      const fullPath2 = path.resolve(file2Path);

      // Genera el diff y lo muestra en consola
      const diff = genDiff(fullPath1, fullPath2, options.format);
      console.log(diff);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1); // Sale con un código de error
    }
  });

// Verificación para evitar ejecución al importar
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program.parse(process.argv);
}

export default genDiff;
