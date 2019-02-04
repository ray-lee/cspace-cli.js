import getConnection from '../helpers/getConnection';
import output from '../helpers/output';

export default ({
  command: 'workflow <transition> <resource>',
  describe: 'Perform a workflow state transition on a resource.',

  builder: yargs => yargs
    .positional('transition', {
      describe: 'The name of the workflow state transition.',
      type: 'string',
    })
    .positional('resource', {
      describe: 'The resource to read.',
      type: 'string',
    }),

  handler: argv => getConnection()
    .then(cspace => cspace.update(`${argv.resource}/workflow/${argv.transition}`))
    .then(response => output.printResponse(response))
    .catch(error => output.errorResponse(error)),
});
