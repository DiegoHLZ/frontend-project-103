import genDiff from './gendiff.mjs';
import { parseFile } from './fileParser.mjs';
import path from 'path';

test('Comparación de archivos JSON planos', () => {
  const file1Path = path.resolve('__fixtures__/file1.json');
  const file2Path = path.resolve('__fixtures__/file2.json');

  const expectedOutput = `{
  - follow: false
    host: codica.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  const result = genDiff(parseFile(file1Path), parseFile(file2Path));
  expect(result).toBe(expectedOutput);
});
