import _ from 'lodash';

const formatValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  if (value === null) {
    return 'null';
  }
  if (value === '') {
    return `''`;
  }
  return String(value);
};

const formatPlain = (diff, parentPath = '') => {
  const nodes = diff.type === 'root' ? diff.children : diff;

  if (!Array.isArray(nodes)) {
    throw new Error('Invalid diff structure: Expected an array');
  }

  const lines = nodes
    .map((node) => {
      const propertyPath = parentPath ? `${parentPath}.${node.key}` : node.key;

      switch (node.type) {
        case 'added':
          return `Property '${propertyPath}' was added with value: ${formatValue(node.value)}`;
        case 'removed':
          return `Property '${propertyPath}' was removed`;
        case 'changed':
          return `Property '${propertyPath}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`;
        case 'nested':
          return formatPlain(node.children, propertyPath);
        case 'unchanged':
          return null;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    })
    .filter(Boolean);

  return lines.join('\n');
};

export default formatPlain;