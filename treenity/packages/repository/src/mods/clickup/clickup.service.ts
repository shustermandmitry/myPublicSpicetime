import {
  Application,
  Conflict,
  feathersContext,
  Params,
  ServiceConstructorParams,
  TreenityService,
} from '@treenity/feathers-service';
import { IClickUpServiceMeta, IClickUpTask, IClickUpWebhook } from '@/mods/clickup/clickup.meta';
import crypto from 'crypto';

class ClickUpService extends TreenityService<any> {
  listId!: string;
  teamId!: string;
  authToken!: string;
  webhookEndPoint!: string;

  constructor({ meta }: ServiceConstructorParams<IClickUpServiceMeta>) {
    super();
    this.listId = meta.listId ?? this.listId;
    this.authToken = meta.authToken ?? this.authToken;
    this.teamId = meta.teamId ?? this.teamId;
    this.webhookEndPoint = meta.webhookEndPoint ?? this.webhookEndPoint;
  }

  async _setup(app: Application, path: string) {
    if (process.env.NODE_ENV !== 'production') return;
    const data = {
      events: ['taskStatusUpdated'],
      list_id: parseInt(this.listId, 10),
    } as IClickUpWebhook;

    await this.createWebhook(data);
  }

  async request<Body = object, Response = any>(
    url: string,
    _body: Body,
    method: string = 'POST',
  ): Promise<Response> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: this.authToken,
    });

    const body = _body ? JSON.stringify(_body) : undefined;

    const response = await fetch(url, {
      method,
      headers: headers,
      body,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.err || (data as any).message || response.statusText);
    }

    const resp = await response.json();
    return resp as Response;
  }

  async createTask(task: IClickUpTask) {
    const apiUrl = `https://api.clickup.com/api/v2/list/${this.listId}/task`;
    const resp = await this.request<IClickUpTask>(apiUrl, task);
    return resp;
  }

  async updateStatusTask(taskId: string, status: string) {
    const apiUrl = `https://api.clickup.com/api/v2/task/${taskId}`;
    const resp = await this.request<IClickUpTask>(apiUrl, { status }, 'PUT');
    return resp;
  }

  async addComment(taskId: string, comment: string) {
    const apiUrl = `https://api.clickup.com/api/v2/task/${taskId}/comment`;
    const resp = await this.request<IClickUpTask>(
      apiUrl,
      { comment_text: comment, notify_all: true },
      'POST',
    );
    return resp;
  }

  async getWebhooks() {
    const apiUrl = `https://api.clickup.com/api/v2/team/${this.teamId}/webhook`;
    const { webhooks } = await this.request(apiUrl, undefined, 'GET');
    return webhooks;
  }

  async getWebhook(endpoint: string): Promise<IClickUpWebhook | undefined> {
    const webhooks = await this.getWebhooks();
    const webhook = webhooks.find((webhook: IClickUpWebhook) => webhook.endpoint === endpoint);
    return webhook;
  }

  async createWebhook(webhookRequest: IClickUpWebhook) {
    const webhook = await this.getWebhook(this.webhookEndPoint);
    if (webhook) {
      return webhook;
    }

    const apiUrl = `https://api.clickup.com/api/v2/team/${this.teamId}/webhook`;
    const webhookData: IClickUpWebhook = {
      ...webhookRequest,
      endpoint: this.webhookEndPoint,
    };

    const { webhook: _webhook } = await this.request(apiUrl, webhookData);
    return _webhook;
  }

  async getTask(data: { taskId: string }): Promise<IClickUpTask> {
    const { taskId } = data;
    const apiUrl = `https://api.clickup.com/api/v2/task/${taskId}`;
    const task = await this.request(apiUrl, undefined, 'GET');
    return task;
  }

  async verifySignature(data: any, params: Params) {
    const x_signature = params.headers?.['x-signature'];
    const webhook = await this.getWebhook(this.webhookEndPoint);
    if (!webhook) {
      throw new Conflict('Webhook not found');
    }
    const key = webhook.secret!;
    const body = JSON.stringify(data);
    const hash = crypto.createHmac('sha256', key).update(body);
    const signature = hash.digest('hex');
    if (signature != x_signature) {
      throw new Conflict('Click up signature check failed');
    }
  }
}

feathersContext.add('sys.click-up', ClickUpService);

export default ClickUpService;
