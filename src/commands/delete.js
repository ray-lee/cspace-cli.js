import getConnection from '../helpers/getConnection';
import output from '../helpers/output';

export default ({
  command: 'delete <resource>',
  describe: 'Delete a resource. This performs a hard delete. To do a soft delete, use the workflow command.',

  builder: yargs => yargs
    .positional('resource', {
      describe: 'The resource to delete.',
      type: 'string',
    }),

  handler: argv => getConnection()
    .then(cspace => cspace.delete(argv.resource))
    .then(response => output.printResponse(response))
    .catch(error => output.errorResponse(error)),
});
