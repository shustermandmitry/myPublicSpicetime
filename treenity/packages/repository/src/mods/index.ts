export type * from './auth/hooks/types';
export * from './auth/utils/parse-jwt.server';

import { PsqlTableService, SequelizePsqlService } from '@treenity/feathers-psql';
import './env/env.service';
import './cfg-adapter/cfg.service';

import './rest-client/rest.client.service';
import './aggregation/aggregation.service';
import './rest-server/rest.server.service';

import './telegram/telegram.meta';
import './telegram/telegram.service';

import './user/users.service';
import './user/migration';

import './telegram-user/telegram-users.service';
import './telegram-user/migration';

import './redis/redis.meta';
import './redis/redis.service';
import './session/session.service';
import './auth/auth.meta';

import './notification/notification.service';
import './notification/template.service';
import './request/request.service';

import './file/file.service';

import './security/security.service';
import './security/executor.service';
import './security/source.service';

import './short-link/link.service';

import './counter/counter.service';

import './access-control/casbin.meta';
import './access-control/casbin.service';

import './paypal/paypal.service';
import './t-bank/t-bank.service';
import './paypal/paypal.meta';

import './page-router/page-router.service';

import { feathersContext } from '@treenity/feathers-service';

import './memory';

import './clickup/clickup.service';

export * as auth from './auth/auth.service';

export * as mail from './mail/mail.service';

feathersContext.add('sys.sequelize.psql', SequelizePsqlService);
feathersContext.add('sql.table', PsqlTableService);
