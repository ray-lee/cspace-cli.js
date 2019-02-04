import getConnection from '../helpers/getConnection';
import loadModule from '../helpers/loadModule';
import output from '../helpers/output';

export default ({
  command: 'create <resource> <dataFile>',
  describe: 'Create a resource.',

  builder: yargs => yargs
    .positional('resource', {
      describe: 'The resource to create.',
      type: 'string',
    })
    .positional('dataFile', {
      describe: 'Path to a JavaScript file containing the data, or a JavaScript function that returns the data.',
      type: 'string',
      normalize: true,
    })
    .group(['follow'], 'Create Options:')
    .option('follow', {
      describe: 'Follow the URL returned in the Location header of a successful create request to retrieve the newly created record data.',
      type: 'boolean',
      default: false,
    }),

  handler: argv => loadModule(argv.dataFile)
    .then(createData => getConnection()
      .then(cspace => cspace.create(argv.resource, {
        data: (typeof createData === 'function') ? createData() : createData,
      })
        .then(response => (argv.follow ? cspace.read(response.headers.location) : response)))
      .then(response => output.printResponse(response))
      .catch(error => output.errorResponse(error))),
});
