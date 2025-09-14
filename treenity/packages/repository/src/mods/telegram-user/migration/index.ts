import { migrationContext } from '@treenity/feathers-psql';
import { InitMigration } from './00001-telegram-user-init';

migrationContext.add('telegram_user.migration', [InitMigration]);
