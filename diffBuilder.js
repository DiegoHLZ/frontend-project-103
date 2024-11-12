// diffBuilder.js
import _ from 'lodash';

const buildDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();

  const diff = allKeys.map((key) => {
    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: obj2[key] };
    }

    if (!_.has(obj2, key)) {
      return { key, type: 'removed', value: obj1[key] };
    }

    const value1 = obj1[key];
    const value2 = obj2[key];

    if (_.isObject(value1) && _.isObject(value2)) {
      return { key, type: 'nested', children: buildDiff(value1, value2) };
    }

    if (value1 !== value2) {
      return { key, type: 'changed', oldValue: value1, newValue: value2 };
    }

    return { key, type: 'unchanged', value: value1 };
  });

  return diff;
};

export default buildDiff;
