import getConnection from '../helpers/getConnection';
import loadModule from '../helpers/loadModule';
import output from '../helpers/output';

export default ({
  command: 'find <resource> [paramsFile]',
  describe: 'Find records within a resource.',

  builder: yargs => yargs
    .positional('resource', {
      describe: 'The resource to search.',
      type: 'string',
    })
    .positional('paramsFile', {
      describe: 'A JavaScript file containing the search parameters. If not provided, read from standard input.',
      type: 'string',
    }),

  handler: (argv) => {
    return loadModule(argv.paramsFile)
      .then(searchParams => getConnection()
        .then(cspace => cspace.read(argv.resource, { params: searchParams })))
      .then(response => output.printResponse(response))
      .catch(error => output.errorResponse(error));
  },
});
