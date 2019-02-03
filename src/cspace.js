import yargs from 'yargs';
import create from './commands/create';
import deleteCommand from './commands/delete';
import read from './commands/read';
import systeminfo from './commands/systeminfo';
import update from './commands/update';
import workflow from './commands/workflow';

yargs
  .command(create)
  .command(deleteCommand)
  .command(read)
  .command(systeminfo)
  .command(update)
  .command(workflow)

  .group(['url', 'username', 'password'], 'Connection Information:')

  .option('url', {
    describe: 'URL of the CollectionSpace service.',
  })
  .option('username', {
    alias: 'u',
    describe: 'Username (email) of the CollectionSpace user.',
  })
  .option('password', {
    alias: 'p',
    describe: 'Password of the CollectionSpace user.',
  })

  .group(['format', 'colors', 'depth'], 'Output Formatting:')

  .option('format', {
    alias: 'f',
    describe: 'Format to use when printing objects.',
    choices: ['json', 'pretty'],
    default: 'pretty',
  })
  .option('colors', {
    alias: 'c',
    describe: 'Use ANSI color codes when pretty printing objects.',
    type: 'boolean',
    default: true,
  })
  .option('depth', {
    alias: 'd',
    describe: 'Recursion depth when pretty printing objects.',
    type: 'number',
    default: 5,
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Print verbose messages.',
    type: 'boolean',
    default: false,
  })

  .demandCommand(1, 1, 'Specify a command.', 'Too many commands.')
  .strict()
  .middleware([(argv) => { global.argv = argv; }])
  .parse();
