import getConnection from '../helpers/getConnection';
import loadModule from '../helpers/loadModule';
import output from '../helpers/output';

export default ({
  command: 'update <resource> <updateFile>',
  describe: 'Update a resource.',

  builder: yargs => yargs
    .positional('resource', {
      describe: 'The resource to update.',
      type: 'string',
    })
    .positional('updateFile', {
      describe: 'Path to a JavaScript file containing the update data or an update function.',
      type: 'string',
      normalize: true,
    }),

  handler: (argv) => {
    let update;

    try {
      update = loadModule(argv.updateFile);
    } catch (err) {
      return Promise.reject(err);
    }

    return getConnection()
      .then((cspace) => {
        if (typeof update === 'function') {
          return cspace.read(argv.resource)
            .then(response => cspace.update(argv.resource, {
              data: update(response.data),
            }));
        }

        return cspace.update(argv.resource, {
          data: update,
        });
      })
      .then(response => output.printResponse(response))
      .catch(error => output.errorResponse(error.response));
  },
});
