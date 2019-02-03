import util from 'util';

const formatObject = (item, options = {}) => {
  const {
    colors,
    depth,
    format,
  } = global.argv;

  if (typeof item === 'object') {
    let object = item;

    const { omitKeys } = options;

    if (omitKeys) {
      object = Object.assign({}, item);

      omitKeys.forEach((key) => {
        delete object[key];
      });
    }

    if (format === 'json') {
      return JSON.stringify(object);
    }

    return util.inspect(object, {
      depth,
      colors,
    });
  }

  return item;
};

const print = (item, options) => {
  // eslint-disable-next-line no-console
  console.log(formatObject(item, options));
};

const printResponse = (response) => {
  print(response, global.argv.verbose ? undefined : { omitKeys: ['headers'] });
};

const verbose = (item, options) => {
  if (global.argv.verbose) {
    print(item, options);
  }
};

const error = (item, options) => {
  // eslint-disable-next-line no-console
  console.error(formatObject(item, options));
};

const errorResponse = (response) => {
  error(response, global.argv.verbose ? undefined : { omitKeys: ['headers'] });
};

export default {
  print,
  printResponse,
  verbose,
  error,
  errorResponse,
};
