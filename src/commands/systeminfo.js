import getConnection from '../helpers/getConnection';
import output from '../helpers/output';

export default ({
  command: 'systeminfo',
  describe: 'Get CollectionSpace system information.',

  handler: () => getConnection({ authRequired: false })
    .then(cspace => cspace.read('systeminfo'))
    .then(response => output.printResponse(response))
    .catch(error => output.errorResponse(error)),
});
