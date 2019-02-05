import getConnection from '../helpers/getConnection';
import loadModule from '../helpers/loadModule';
import output from '../helpers/output';

export default ({
  command: 'update <resource> <dataFile>',
  describe: 'Update a resource.',

  builder: yargs => yargs
    .positional('resource', {
      describe: 'The resource to update.',
      type: 'string',
    })
    .positional('dataFile', {
      describe: 'Path to a JavaScript file containing the record data or a JavaScript function that returns the data.',
      type: 'string',
      normalize: true,
    }),

  handler: argv => loadModule(argv.dataFile)
    .then(updateData => getConnection()
      .then((cspace) => {
        if (typeof updateData === 'function') {
          return cspace.read(argv.resource)
            .then(response => cspace.update(argv.resource, {
              data: updateData(response.data),
            }));
        }

        return cspace.update(argv.resource, {
          data: updateData,
        });
      })
      .then(response => output.printResponse(response))
      .catch(error => output.errorResponse(error))),
});
