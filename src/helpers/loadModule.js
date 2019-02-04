import fs from 'fs';
import path from 'path';
import requireFromString from 'require-from-string';

const loadModuleString = (moduleString, filename) => {
  let exportObj;
  let parseErr;

  try {
    exportObj = requireFromString(moduleString, filename);
  } catch (err) {
    parseErr = err;
  }

  if (
    typeof exportObj === 'undefined'
    || (typeof exportObj === 'object' && exportObj && Object.keys(exportObj).length === 0)
  ) {
    // The string may be raw JSON, or some other JavaScript that doesn't assign anything to
    // module.exports. Try prepending 'module.exports='.

    try {
      exportObj = requireFromString(`module.exports=${moduleString}`);
      parseErr = undefined;
    } catch (err) {
      // eslint-disable-line no-empty
    }
  }

  if (parseErr) {
    return Promise.reject(parseErr);
  }

  const type = typeof exportObj;

  if (
    !exportObj
    || (type !== 'object' && type !== 'function')
    || (type === 'object' && Object.keys(exportObj).length === 0)
  ) {
    const sourceName = (typeof filename === 'undefined') ? 'input' : filename;

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(`No object or function (found ${exportObj === null ? 'null' : type}) in ${sourceName}`);
  }

  return Promise.resolve(exportObj);
};

const loadModuleFile = (modulePath) => {
  const absModulePath = path.resolve(process.cwd(), modulePath);

  if (!fs.existsSync(absModulePath)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(`File not found: ${modulePath}`);
  }

  const moduleString = fs.readFileSync(absModulePath, 'utf8');

  return loadModuleString(moduleString, modulePath);
};

export default (modulePath) => {
  // if (modulePath === '-') {
  //   return loadModuleStream();
  // }

  return loadModuleFile(modulePath);
};
