import fs from 'fs';
import path from 'path';

export default (modulePath) => {
  const absModulePath = path.resolve(process.cwd(), modulePath);

  if (!fs.existsSync(absModulePath)) {
    // eslint-disable-next-line no-throw-literal
    throw `File not found: ${modulePath}`;
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const exportObj = require(absModulePath);

  if (!exportObj || !('default' in exportObj)) {
    // eslint-disable-next-line no-throw-literal
    throw `The file ${modulePath} does not have a default export`;
  }

  const defaultExport = exportObj.default;
  const type = typeof defaultExport;

  if (type !== 'object' && type !== 'function') {
    // eslint-disable-next-line no-throw-literal
    throw `The default export of ${modulePath} must be an object or a function (found ${type})`;
  }

  return defaultExport;
};
