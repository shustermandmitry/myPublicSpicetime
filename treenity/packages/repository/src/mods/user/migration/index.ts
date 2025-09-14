import { migrationContext } from '@treenity/feathers-psql';
import { InitMigration } from './00001-user-init';
import { UserAddRemovedColumn } from '@/mods/user/migration/00002-user-add-removed-columns';
import { UniqEmailMigration } from '@/mods/user/migration/00003-user-add-uniq-email';

migrationContext.add('users.migration', [InitMigration, UserAddRemovedColumn, UniqEmailMigration]);
