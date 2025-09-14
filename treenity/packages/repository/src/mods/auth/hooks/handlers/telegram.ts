import { IBaseClientApi, IHandler, ITelegramSignInData, IRegistrationData } from '../types';

interface IHandlerTelegram extends IHandler {}

export const telegramHandler = (clientApi: IBaseClientApi): IHandlerTelegram => ({
  async signIn(info: ITelegramSignInData) {
    return clientApi.sys.auth.create({
      strategy: 'telegram',
      data: info.data,
    });
  },
  async registration(info: IRegistrationData) {
    return;
  },
  resend: function (): Promise<void> {
    throw new Error('Resend not implemented.');
  },
});
