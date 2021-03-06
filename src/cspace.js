import yargs from 'yargs';
import bulkUpdate from './commands/bulk-update';
import create from './commands/create';
import deleteCommand from './commands/delete';
import find from './commands/find';
import read from './commands/read';
import systeminfo from './commands/systeminfo';
import update from './commands/update';
import workflow from './commands/workflow';

yargs
  .command(bulkUpdate)
  .command(create)
  .command(deleteCommand)
  .command(find)
  .command(read)
  .command(systeminfo)
  .command(update)
  .command(workflow)

  .group(['url', 'login', 'password'], 'Connection Options:')

  .option('url', {
    alias: 'u',
    describe: 'URL of the CollectionSpace service. Typically ends with /cspace-services, e.g. https://nightly.collectionspace.org/cspace-services.',
  })
  .option('login', {
    alias: 'l',
    describe: 'Login name (email) of the CollectionSpace user.',
  })
  .option('password', {
    alias: 'p',
    describe: 'Password of the CollectionSpace user.',
  })

  .group(['format', 'jscolor', 'jsdepth', 'jsmaxarraylen', 'jsonindent', 'verbose'], 'Output Options:')

  .option('verbose', {
    alias: 'v',
    describe: 'Print verbose messages.',
    type: 'boolean',
    default: false,
  })
  .option('headers', {
    alias: 'h',
    describe: 'Print headers of API responses.',
    type: 'boolean',
    default: false,
  })
  .option('format', {
    alias: 'f',
    describe: 'Format to use when printing data. Use js (the default) to print data as JavaScript object/array literals, for human readability or copying into JS programs. Use json to print data as JSON, for use by other programs.',
    choices: ['js', 'json'],
    default: 'js',
  })
  .option('jscolor', {
    describe: 'Use ANSI color codes when pretty printing data as JavaScript object/array literals. This option only has an effect if format is set to js.',
    type: 'boolean',
    default: true,
  })
  .option('jsdepth', {
    describe: 'Recursion depth when printing data as JavaScript object/array literals. This option only has an effect if format is set to js.',
    type: 'number',
    default: Infinity,
  })
  .option('jsmaxarraylen', {
    describe: 'Maximum number of array elements to show when printing arrays as JavaScript array literals. This option only has an effect if format is set to js.',
    type: 'number',
    default: Infinity,
  })
  .option('jsonindent', {
    describe: 'Number of space characters to use to indent nested values when printing data as JSON, capped at 10. This option only has an effect if format is set to json.',
    type: 'number',
    default: 0,
  })

  .demandCommand(1, 1, 'Specify a command.', 'Too many commands.')
  .strict()
  .middleware([
    // Set the parsed argv into a global, so it doesn't have to be passed everywhere.
    (argv) => { global.argv = argv; },
  ])
  .parse();
