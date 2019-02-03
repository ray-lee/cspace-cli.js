import cspaceAPI from 'cspace-api';
import inquirer from 'inquirer';
import netrc from 'netrc';
import output from './output';

const getOptionName = (connName, property) => (
  [connName && connName.toLowerCase(), property.toLowerCase()]
    .filter(part => !!part)
    .join('-')
);

const getEnvName = (connName, property) => (
  ['CSPACE', connName && connName.toUpperCase(), property.toUpperCase()]
    .filter(part => !!part)
    .join('_')
);

const getPropertyValue = (connName, property) => {
  const optionName = getOptionName(connName, property);

  if (optionName in global.argv) {
    const value = global.argv[optionName];

    if (value === true) {
      // The option was specified as a flag (with no value). Prompt.

      return inquirer
        .prompt([{
          type: property === 'password' ? 'password' : 'input',
          mask: true,
          name: property,
          message: `Enter ${connName || ''}${connName ? ' ' : ''}${property}:`,
        }])
        .then(answers => answers[property]);
    }

    return Promise.resolve(value.toString());
  }

  const envName = getEnvName(connName, property);

  if (envName in process.env) {
    return Promise.resolve(process.env[envName]);
  }

  return Promise.resolve(undefined);
};

export default async (options = {}) => {
  const {
    connName,
    authRequired = true,
  } = options;

  const properties = ['url', 'username', 'password'];
  const requiredProperties = authRequired ? properties : ['url'];

  const info = {};

  await properties.reduce((promise, property) => promise
    .then(() => getPropertyValue(connName, property)
      .then((value) => {
        if (typeof value !== 'undefined') {
          info[property] = value;
        }
      })), Promise.resolve());

  if (('url' in info) && (!('username' in info) || !('password' in info))) {
    const net = netrc(global.argv.netrc);

    const netMachine = net[info.url];

    if (netMachine) {
      if (!('username' in info) && ('login' in netMachine)) {
        info.username = netMachine.login;
      }

      if (!('password' in info) && ('password' in netMachine)) {
        info.password = netMachine.password;
      }
    }
  }

  if (requiredProperties.find(property => !(property in info))) {
    output.error(`Incomplete ${connName || ''}${connName ? ' ' : ''}connection information.`);

    requiredProperties.forEach((property) => {
      if (!(property in info)) {
        const optionName = getOptionName(connName, property);
        const envName = getEnvName(connName, property);

        output.error(`Missing ${property}. Specify the --${optionName} option, set the environment variable ${envName}, or create a .netrc entry.`);
      }
    });

    process.exit(1);
  }

  output.verbose(`Using ${connName || ''}${connName ? ' ' : ''}connection information:`);

  const maskedInfo = Object.assign({}, info);

  if ('password' in info) {
    maskedInfo.password = info.password ? '•'.repeat(info.password.length) : info.password;
  }

  output.verbose(maskedInfo);

  return cspaceAPI(info);
};
