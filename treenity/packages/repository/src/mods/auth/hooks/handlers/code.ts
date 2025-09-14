import { IBaseClientApi, IHandler, IRegistrationData, IResendData, ISignInData } from '../types';

interface IHandlerCode extends IHandler {}

const STORAGE_KEY = 'auth_storage';

interface StorageData {
  authCode: string;
  email: string;
}

export const codeHandler = (clientApi: IBaseClientApi): IHandlerCode => {
  const getStorageData = (): StorageData => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {} as StorageData;
    }
  };

  const setStorageData = (email: string, authCode: string): void => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email, authCode }));
    } catch (error) {
      console.error('Failed to save auth codes to session storage:', error);
    }
  };

  const clearStorageData = () => {
    sessionStorage.clear();
  };

  return {
    async signIn(data: ISignInData) {
      const { authCode } = getStorageData();
      const { code } = data;
      const tokens = await clientApi.sys.auth.create({
        strategy: 'code',
        authCode: authCode,
        code,
      });

      clearStorageData();

      return tokens;
    },
    async registration(data: IRegistrationData) {
      const storageValue = getStorageData();
      const { email, lang } = data;
      const { authCode } = await clientApi.sys.auth.registration({
        strategy: 'code',
        authCode: storageValue.authCode,
        email,
        lang,
      });
      setStorageData(email!, authCode!);
      return;
    },
    async resend(): Promise<void> {
      const storageValue = getStorageData();
      const { authCode } = await clientApi.sys.auth.resendCode({
        strategy: 'code',
        authCode: storageValue.authCode,
        email: storageValue.email!,
      });
      setStorageData(storageValue.email!, authCode!);
      return;
    },
  };
};
