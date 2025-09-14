import {
  AuthenticationParams,
  AuthenticationRequest,
  AuthenticationResult,
  AuthenticationService,
  AuthenticationStrategy,
} from '@feathersjs/authentication';
import { NotAuthenticated } from '@feathersjs/errors';

export type CallbackTokensFunction = (
  authResult: AuthenticationResult,
  params: AuthenticationParams,
) => Promise<AuthenticationResult>;

export interface AuthenticationStrategyWithSignUp extends AuthenticationStrategy {
  signUp(data: AuthenticationRequest, params: AuthenticationParams): Promise<AuthenticationResult>;
  resendCode(
    data: AuthenticationRequest,
    params: AuthenticationParams,
  ): Promise<AuthenticationResult>;
}

export class AuthenticationServiceWithAuthCode extends AuthenticationService {
  strategies: {
    [key: string]: AuthenticationStrategyWithSignUp;
  } = {};

  constructor(app: any, configKey?: string, options?: {}) {
    super(app, configKey, options);
  }

  getStrategy(name: string): AuthenticationStrategyWithSignUp {
    return super.getStrategy(name) as AuthenticationStrategyWithSignUp;
  }

  getStrategies(...names: string[]): AuthenticationStrategyWithSignUp[] {
    return super.getStrategies(...names) as AuthenticationStrategyWithSignUp[];
  }

  private getAuthStrategy(
    data: AuthenticationRequest,
    params: AuthenticationParams,
  ): AuthenticationStrategyWithSignUp {
    const { strategy } = data || {};
    const authStrategies = params.authStrategies || this.configuration.authStrategies;
    const [authStrategy] = this.getStrategies(strategy!);
    const strategyAllowed = strategy ? authStrategies.includes(strategy) : undefined;

    if (!data || !authStrategy || !strategyAllowed) {
      const additionalInfo =
        (!strategy && ' (no `strategy` set)') ||
        (!strategyAllowed && ' (strategy not allowed in authStrategies)') ||
        '';

      // If there are no valid strategies or `authentication` is not an object
      throw new NotAuthenticated('Invalid authentication information' + additionalInfo);
    }

    return authStrategy;
  }

  signUp(data: AuthenticationRequest, params: AuthenticationParams): Promise<AuthenticationResult> {
    const authStrategy = this.getAuthStrategy(data, params);
    return authStrategy.signUp!(data, params);
  }

  _resendCode(
    data: AuthenticationRequest,
    params: AuthenticationParams,
  ): Promise<AuthenticationResult> {
    const authStrategy = this.getAuthStrategy(data, params);
    return authStrategy.resendCode!(data, params);
  }
}
