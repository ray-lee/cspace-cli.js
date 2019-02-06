import forEach from '../helpers/forEach';
import getConnection from '../helpers/getConnection';
import loadModule from '../helpers/loadModule';
import output from '../helpers/output';

const bulkUpdate = (cspace, resource, controller) => {
  const {
    search,
    update,
  } = controller;

  if (!search || typeof search !== 'object') {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('Search parameters not found');
  }

  if (!update || (typeof update !== 'object' && typeof update !== 'function')) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('Update data/function not found');
  }

  const doUpdate = (item) => {
    const { uri } = item;

    const getUpdateData = Promise.resolve(
      (typeof update === 'function') ? update(item, () => cspace.read(uri)) : update,
    );

    return getUpdateData
      .then((data) => {
        if (global.argv.verbose) {
          output.print(`Updating ${uri}:`);
          output.print(data);
        }

        if (global.argv.dryrun) {
          return undefined;
        }

        return cspace.update(uri, { data });
      });
  };

  return forEach(cspace, resource, search, doUpdate);
};

export default ({
  command: 'bulk-update <resource> [controlfile]',
  describe: 'Find and update records within a resource.',

  builder: yargs => yargs
    .positional('resource', {
      describe: 'The resource to search.',
      type: 'string',
    })
    .positional('controlfile', {
      describe: 'A JavaScript file containing the search parameters and the update data or update function. If not provided, read from standard input.',
      type: 'string',
    })
    .group(['dryrun', 'pagesize', 'startpage', 'endpage'], 'Bulk Update Options:')
    .option('dryrun', {
      describe: 'Perform a dry run. Everything will be done except sending the updates.',
      type: 'boolean',
      default: false,
    })
    .option('pagesize', {
      describe: 'Page size to use when searching for records.',
      type: 'number',
      default: 100,
    })
    .option('startpage', {
      describe: 'The first page number of records to update, 0 indexed.',
      type: 'number',
      default: 0,
    })
    .option('endpage', {
      describe: 'The last page number of records to update. Use Infinity to update through the last page of records.',
      type: 'number',
      default: Infinity,
    }),

  handler: argv => loadModule(argv.controlfile)
    .then(controller => getConnection()
      .then(cspace => bulkUpdate(cspace, argv.resource, controller)))
    .catch(error => output.errorResponse(error)),
});
