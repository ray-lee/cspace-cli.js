import getConnection from '../helpers/getConnection';
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
      describe: 'A JavaScript file containing the search parameters. Use - to read from standard input.',
      type: 'string',
      default: '-',
    }),

  handler: (argv) => {
    return getConnection()
      .then(cspace => cspace.read(argv.resource))
      .then(response => output.printResponse(response))
      .catch(error => output.errorResponse(error));
  },
});
