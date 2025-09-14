import { IBaseClientApi, IHandler, IRegistrationData, ISignInData } from '../types';

interface IHandlerPassword extends IHandler {}

export const passwordHandler = (clientApi: IBaseClientApi): IHandlerPassword => ({
  async signIn(data: ISignInData) {
    const { email, password } = data;
    return clientApi.sys.auth.create({
      strategy: 'password',
      email,
      password,
    });
  },
  async registration(data: IRegistrationData) {
    const { email, password, lang } = data;
    await clientApi.sys.auth.registration({
      strategy: 'password',
      email,
      password,
      lang,
    });

    return;
  },
  resend: function (): Promise<void> {
    throw new Error('Resend not implemented.');
  },
});
