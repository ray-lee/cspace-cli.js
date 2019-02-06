import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import getStdin from 'get-stdin';
import requireFromString from 'require-from-string';

const isValidExport = (exportObj) => {
  if (exportObj === null) {
    return false;
  }

  const type = typeof exportObj;

  if (type === 'object' || type === 'function') {
    return true;
  }

  return false;
};

const isEmptyObject = obj => (
  obj && typeof obj === 'object' && Object.keys(obj).length === 0
);

const loadModuleString = (moduleString, filename) => {
  let exportObj;
  let parseErr;

  try {
    exportObj = requireFromString(moduleString, filename);
  } catch (err) {
    parseErr = err;
  }

  if (parseErr || !isValidExport(exportObj) || isEmptyObject(exportObj)) {
    // The string may be raw JSON, or some other JavaScript that doesn't assign anything to
    // module.exports. Try prepending 'module.exports='.

    let retryExportObj;
    let retryParseErr;

    try {
      retryExportObj = requireFromString(`module.exports=${moduleString}`);
    } catch (err) {
      retryParseErr = err;
    }

    if (!retryParseErr && isValidExport(retryExportObj)) {
      exportObj = retryExportObj;
      parseErr = retryParseErr;
    }
  }

  if (parseErr) {
    return Promise.reject(parseErr);
  }

  if (!isValidExport(exportObj)) {
    const sourceName = (typeof filename === 'undefined') ? 'input' : filename;
    const type = typeof exportObj;

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

const loadModuleFromStdin = () => {
  let readModule;

  if (process.stdin.isTTY) {
    const prompt = inquirer.createPromptModule({ output: process.stderr });

    readModule = prompt([{
      type: 'editor',
      name: 'params',
      message: 'Enter search parameters as JSON or a JavaScript object literal.',
    }])
      .then(answers => answers.params);
  } else {
    readModule = getStdin();
  }

  return readModule.then(moduleString => loadModuleString(moduleString));
};

export default modulePath => (
  (typeof modulePath === 'undefined') ? loadModuleFromStdin() : loadModuleFile(modulePath)
);
