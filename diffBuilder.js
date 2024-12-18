import _ from 'lodash';

const ADD_VALUE = 'added';
const REMOVED_VALUE = 'removed';
const NESTED_VALUE = 'nested';
const CHANGED_VALUE = 'changed';
const UNCHANGED_VALUE = 'unchanged';

function buildDiff(dataFile1, dataFile2) {
  if (!dataFile1 || !dataFile2) {
    throw new Error('Invalid input: One or both files are empty or corrupted.');
  }

  const keys = _.sortBy(_.union(Object.keys(dataFile1), Object.keys(dataFile2)));

  if (keys.length === 0) {
    return [];
  }

  return keys.map((key) => {
    if (!(key in dataFile1)) {
      return { key, type: ADD_VALUE, value: dataFile2[key] };
    }
    if (!(key in dataFile2)) {
      return { key, type: REMOVED_VALUE, value: dataFile1[key] };
    }

    const valueInFile1 = dataFile1[key];
    const valueInFile2 = dataFile2[key];

    if (_.isPlainObject(valueInFile1) && _.isPlainObject(valueInFile2)) {
      return {
        key,
        type: NESTED_VALUE,
        children: buildDiff(valueInFile1, valueInFile2),
      };
    }

    if (!_.isEqual(valueInFile1, valueInFile2)) {
      return {
        key,
        type: CHANGED_VALUE,
        oldValue: valueInFile1,
        newValue: valueInFile2,
      };
    }

    return { key, type: UNCHANGED_VALUE, value: valueInFile1 };
  });
}

export default buildDiff;
