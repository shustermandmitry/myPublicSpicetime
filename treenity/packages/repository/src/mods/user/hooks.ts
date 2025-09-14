import { userCreatedSchema } from '@/mods/user/user.meta';
import { dataValidator } from '@/validators';
import { HookContext, NextFunction } from '@feathersjs/feathers';
import { getValidator } from '@treenity/json-schema';
import bcrypt from 'bcryptjs';

const userValidator = getValidator(userCreatedSchema, dataValidator);
export const userValidatorHook = async (context: HookContext, next: NextFunction) => {
  await userValidator(context.arguments[0]);
  return next();
};

const hashSize = 10;

export const hashPassword = async (context: HookContext, next: NextFunction) => {
  const [data] = context.arguments;
  const { password } = data;

  const hash = await bcrypt.hash(password, hashSize);

  if (!hash) {
    throw new Error('Hash was not created');
  }

  data.password = hash;
};
