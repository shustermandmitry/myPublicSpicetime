import { NotAuthenticated, Params, feathersContext } from '@treenity/feathers-service';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { AuthenticationRequest } from '@feathersjs/authentication';
import { get } from '@s-libs/micro-dash';

class PasswordStrategy extends LocalStrategy {
  defaultRole!: string;

  constructor(meta: { defaultRole: string }) {
    super();
    this.defaultRole = meta.defaultRole;
  }

  async signUp(data: AuthenticationRequest, params: Params) {
    const { passwordField, usernameField, errorMessage, entityUsernameField, entityPasswordField } =
      this.configuration;
    const username = get(data, usernameField);
    const password = get(data, passwordField);
    const lang = get(data, 'lang');

    const entity = await this.entityService.find({
      query: { [entityUsernameField]: username },
    });

    if (entity.length) {
      throw new NotAuthenticated(errorMessage);
    }

    const auth = this.app!.defaultAuthentication!();
    // @ts-ignore
    auth.emit('onRegistration', entity.at(0))

    await this.entityService.create({
      [entityUsernameField]: username,
      [entityPasswordField]: password,
      lang,
      role: this.defaultRole,
    });

    return { authentication: { strategy: this.name } };
  }
}

export default PasswordStrategy;

feathersContext.add('auth.password.strategy', PasswordStrategy);
