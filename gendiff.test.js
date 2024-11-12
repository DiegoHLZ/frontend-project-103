import genDiff from './gendiff.mjs';
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

test('Comparación de archivos JSON planos', () => {
  const file1Path = path.resolve('__fixtures__/file1.json');
  const file2Path = path.resolve('__fixtures__/file2.json');

  const result = genDiff(file1Path, file2Path);
  console.log(result);
  expect(result).toEqual(flatExpectedOutput);
});

test('Comparación de archivos YAML planos', () => {
  const file1Path = path.resolve('__fixtures__/file1.yml');
  const file2Path = path.resolve('__fixtures__/file2.yml');

  const result = genDiff(file1Path, file2Path);
  console.log(result); 
  expect(result).toEqual(flatExpectedOutput);
});

test('Comparación de archivos JSON con estructura anidada', () => {
  const file1Path = path.resolve('__fixtures__/file1_nest.json');
  const file2Path = path.resolve('__fixtures__/file2_nest.json');

  const result = genDiff(file1Path, file2Path);
  console.log(result);
  expect(result).toEqual(nestedExpectedOutput);
});

test('Comparación de archivos YAML con estructura anidada', () => {
  const file1Path = path.resolve('__fixtures__/file1_nest.yml');
  const file2Path = path.resolve('__fixtures__/file2_nest.yml');

  const result = genDiff(file1Path, file2Path);
  console.log(result);
  expect(result).toEqual(nestedExpectedOutput);
});
