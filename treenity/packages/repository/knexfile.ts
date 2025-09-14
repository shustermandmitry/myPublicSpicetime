// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { singleton } from './src/feathers-app';

// Load our database connection info from the app configuration
const config = singleton().get('sqlite');

module.exports = config;
