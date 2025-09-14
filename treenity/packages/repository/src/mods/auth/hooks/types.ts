export type AuthStrategyType = 'password' | 'code' | 'telegram';

export interface IRegistrationRequest {
  strategy?: AuthStrategyType;
  email?: string;
  password?: string;
  code?: string;
  authCode?: string;
  lang?: string;
}

export interface ITelegramRegistrationRequest {
  strategy: AuthStrategyType;
  data: string;
}

export interface ISignInRequest extends IRegistrationRequest {}

export interface IRegistrationData extends Omit<IRegistrationRequest, 'strategy' | 'authCode'> {}
export interface ISignInResponse extends Omit<IRegistrationResponse, 'strategy' | 'authCode'> {}

export interface ISignInData extends IRegistrationData {}
export interface ITelegramSignInData extends ITelegramRegistrationRequest {}
export interface IResendData extends IRegistrationData {}

export type AccessTokens = {
  accessToken: string;
  refreshToken: string;
  accessExpiredIn: number;
  refreshExpiredIn: number;
};

export interface IHandler {
  registration(data: IRegistrationData): Promise<void>;
  signIn(data: ISignInData | ITelegramSignInData): Promise<AccessTokens>;
  resend(): Promise<void>;
}

export interface ISignInResponse extends AccessTokens {
  role: string;
}

export interface IAuthStoreFull extends IHandler {
  handlers: Record<AuthStrategyType, IHandler>;
  getHandler(key: AuthStrategyType): IHandler;
  setTokens(tokens: Partial<AccessTokens>): Promise<void>;
  signIn(data: ISignInData | ITelegramSignInData): Promise<ISignInResponse>;
  isAuth(): boolean;
  logout(): void;
  check(path: string): Promise<boolean>;
}

export interface IRegistrationResponse {
  authCode?: string;
}

export interface IBaseClientApi {
  sys: {
    auth: {
      registration(data: IRegistrationRequest): Promise<IRegistrationResponse>;
      resendCode(data: IRegistrationRequest): Promise<IRegistrationResponse>;
      // sign in
      create(data: ISignInRequest | ITelegramSignInData): Promise<AccessTokens>;
    };
    access_control: {
      check(data: { query: { path: string } }): Promise<boolean>;
    };
  };
}
