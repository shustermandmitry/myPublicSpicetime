import type { Application } from '@/declarations';
import { SessionServiceMeta } from '@/mods/session/session.meta';
import type { Params, ServiceConstructorParams } from '@treenity/feathers-service';
import { awaitService, feathersContext, TreenityService } from '@treenity/feathers-service';
import { NotFound } from '@feathersjs/errors';
import { Id } from '@feathersjs/feathers';

type SessionRequest = { userId: number; sessionId: string; payload?: any };

class SessionService extends TreenityService<any> {
  storageServicePath: string = null!;
  storage: any = null!;
  expiresIn: string | number = 86400;
  customMethods: string[] = ['kill'];

  constructor({ meta }: ServiceConstructorParams<SessionServiceMeta>) {
    super();
    if (!meta.storageServicePath) {
      throw new Error('Storage path is required');
    }
    this.storageServicePath = meta.storageServicePath;
    this.expiresIn = meta.expiresIn;
  }

  async setup(app: Application, path: string) {
    this.storage = await awaitService(app, this.storageServicePath);
  }

  public kill(data: { userId: Id }, params: Params) {
    const { userId } = data;
    const key = this.getKey('*', userId);
    const sessionKeys = this.storage.getKeys(key);
    if (!sessionKeys) {
      throw new NotFound(`User ${userId} sessions not found`);
    }

    for (const sessionKey of sessionKeys) {
      this.storage.remove(sessionKey);
    }

    return true;
  }

  private getKey(sessionId: string, userId: number | string) {
    return `session:${userId}:${sessionId}`;
  }

  private stringToData(data: { key: string; data: string }) {
    const value = data ? JSON.parse(data.data) : null;
    return {
      ...data,
      data: value,
    };
  }

  async create(data: SessionRequest, params: Params) {
    const { sessionId, userId, payload } = data;

    await this.storage.create(
      {
        key: this.getKey(sessionId, userId),
        data: payload,
      },
      params,
    );

    return data;
  }

  async get(userId: Id, params: Params) {
    const { sessionId } = params.query!;
    const key = this.getKey(sessionId, userId);
    return await this.storage.get(key);
  }

  async remove(userId: number, params: Params) {
    const { sessionId } = params.query!;
    const value = await this.get(userId, { query: { sessionId } });
    if (value) {
      const key = this.getKey(sessionId, userId);

      await this.storage.remove(key);
    }

    return true;
  }
}

export default SessionService;

feathersContext.add('sys.session', SessionService);
