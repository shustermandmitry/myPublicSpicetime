import { callServices } from './call-services';
import { singleton } from './feathers-app';
import { logger } from './logger';
import { setupUnhandledRejection } from './utils/unhandled-rejection';

const app = singleton();

app.configure(callServices);

const port = app.get('port');
const host = app.get('host');

setupUnhandledRejection(logger.error.bind(logger));

app.listen(port).then(() => {
  logger.info(`- Feathers app listening on http://${host}:${port}`);
});
