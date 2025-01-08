import _ from 'lodash';

export default function formatStylish(diff, depth = 0) {
    const indent = (level) => ' '.repeat(level * 4 - 2);
    const bracketIndent = (level) => ' '.repeat(level * 4);
  
    const iter = (node, currentDepth) => {
      switch (node.type) {
        case 'root':
          return `{\n${node.children.map((child) => iter(child, currentDepth + 1)).join('\n')}\n}`;
        case 'nested':
          return `${indent(currentDepth)}  ${node.key}: {\n${node.children.map((child) => iter(child, currentDepth + 1)).join('\n')}\n${bracketIndent(currentDepth)}}`;
        case 'added':
          return `${indent(currentDepth)}+ ${node.key}: ${stringify(node.value, currentDepth + 1)}`;
        case 'removed':
          return `${indent(currentDepth)}- ${node.key}: ${stringify(node.value, currentDepth + 1)}`;
        case 'unchanged':
          return `${indent(currentDepth)}  ${node.key}: ${stringify(node.value, currentDepth + 1)}`;
        case 'changed':
          return [
            `${indent(currentDepth)}- ${node.key}: ${stringify(node.oldValue, currentDepth + 1)}`,
            `${indent(currentDepth)}+ ${node.key}: ${stringify(node.newValue, currentDepth + 1)}`,
          ].join('\n');
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    };
  
    return `{\n${diff.children.map((child) => iter(child, depth + 1)).join('\n')}\n}`;
  }
  
  function stringify(value, depth) {
    if (value === null) return 'null';
    if (_.isPlainObject(value)) {
      const indent = ' '.repeat(depth * 4);
      const closingIndent = ' '.repeat((depth - 1) * 4);
      const lines = Object.entries(value).map(
        ([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`
      );
      return `{\n${lines.join('\n')}\n${closingIndent}}`;
    }
    if (typeof value === 'string') {
      return value;
    }
    return String(value);
  }