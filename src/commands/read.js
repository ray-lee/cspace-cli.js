import getConnection from '../helpers/getConnection';
import output from '../helpers/output';

export default ({
  command: 'read <resource>',
  describe: 'Read a resource.',

  builder: yargs => yargs
    .positional('resource', {
      describe: 'The resource to read.',
      type: 'string',
    }),

  handler: argv => getConnection()
    .then(cspace => cspace.read(argv.resource))
    .then(response => output.printResponse(response))
    .catch(error => output.errorResponse(error.response)),
});
