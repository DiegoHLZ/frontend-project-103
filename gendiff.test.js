import { readFileSync } from 'fs';
import genDiff from './gendiff.mjs';
import buildDiff from './diffBuilder.js';
import path from 'path';

const flatExpectedOutput = `{
  - follow: false
    host: codica.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const nestedExpectedOutput = `{
  common: {
    + follow: false
      setting1: Value 1
    - setting2: 200
    - setting3: true
    + setting3: null
    + setting4: blah blah
    + setting5: {
          key5: value5
      }
      setting6: {
          doge: {
            - wow: 
            + wow: so much
          }
          key: value
        + ops: vops
      }
  }
  group1: {
    - baz: bas
    + baz: bars
      foo: bar
    - nest: {
          key: value
      }
    + nest: str
  }
- group2: {
      abc: 12345
      deep: {
          id: 45
      }
  }
+ group3: {
      deep: {
          id: {
              number: 45
          }
      }
      fee: 100500
  }
}`;

test('Comparación de archivos JSON con formato plano', () => {
  const file1Path = path.resolve('__fixtures__/file1_nest.json');
  const file2Path = path.resolve('__fixtures__/file2_nest.json');

  const plainExpectedOutput = `
Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]
Property 'group4.default' was updated. From null to ''
Property 'group4.foo' was updated. From 0 to null
Property 'group4.isNested' was updated. From false to 'none'
Property 'group4.key' was added with value: false
Property 'group4.nest.bar' was updated. From '' to 0
Property 'group4.nest.isNested' was removed
Property 'group4.someKey' was added with value: true
Property 'group4.type' was updated. From 'bas' to 'bar'
`.trim();

  const result = genDiff(file1Path, file2Path, 'plain');
  console.log(result);
  expect(result.trim()).toEqual(plainExpectedOutput);
});

test('Comparación de archivos JSON planos', () => {
  const file1Path = path.resolve('__fixtures__/file1.json');
  const file2Path = path.resolve('__fixtures__/file2.json');

  const result = genDiff(file1Path, file2Path);
  console.log(result);
  expect(result.trim()).toEqual(flatExpectedOutput.trim());
});

test('Comparación de archivos YAML planos', () => {
  const file1Path = path.resolve('__fixtures__/file1.yml');
  const file2Path = path.resolve('__fixtures__/file2.yml');

  const result = genDiff(file1Path, file2Path);
  console.log(result);
  expect(result.trim()).toEqual(flatExpectedOutput.trim());
});

test('Comparación de archivos JSON con estructura anidada', () => {
  const file1Path = path.resolve('__fixtures__/file1_nest.json');
  const file2Path = path.resolve('__fixtures__/file2_nest.json');
  const expectedResult = readFileSync(path.resolve('__fixtures__/stylish-result.txt'), 'utf-8').trim();

  const result = genDiff(file1Path, file2Path);
  console.log(result);
  expect(result.trim()).toEqual(expectedResult);
});

test('Comparación de archivos YAML con estructura anidada', () => {
  const file1Path = path.resolve('__fixtures__/file1_nest.yml');
  const file2Path = path.resolve('__fixtures__/file2_nest.yml');
  const plainResult = readFileSync(path.resolve('__fixtures__/plain-result.txt'), 'utf-8').trim();

  const result = genDiff(file1Path, file2Path, 'plain');
  console.log(result);
  expect(result.trim()).toEqual(plainResult);
});

test('Manejo de archivos vacíos', () => {
  const file1Path = path.resolve('__fixtures__/file_empty.json');
  const file2Path = path.resolve('__fixtures__/file2.json');
  
  expect(() => genDiff(file1Path, file2Path)).not.toThrow();
});

test('Error al parsear archivos inválidos', () => {
  const file1Path = path.resolve('__fixtures__/file_invalid.json');
  const file2Path = path.resolve('__fixtures__/file2.json');

  expect(() => genDiff(file1Path, file2Path)).toThrow(/Failed to parse file/);
});

test('Comparación de archivos JSON en formato JSON', () => {
  const file1Path = path.resolve('__fixtures__/file1_nest.json');
  const file2Path = path.resolve('__fixtures__/file2_nest.json');

  const expectedOutput = JSON.stringify({
    type: 'root',
    children: buildDiff(
      JSON.parse(readFileSync(file1Path, 'utf-8')),
      JSON.parse(readFileSync(file2Path, 'utf-8'))
    ),
  }, null, 2);

  const result = genDiff(file1Path, file2Path, 'json');
  expect(result).toEqual(expectedOutput);
});