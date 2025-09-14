import { Conflict, Params, ServiceConstructorParams } from '@treenity/feathers-service';
import { IClickUpServiceMeta, IClickUpTask, IClickUpWebhook } from '@/mods/clickup/clickup.meta';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import crypto from 'crypto';
import ClickUpService from '@/mods/clickup/clickup.service';

enableFetchMocks();
jest.mock('crypto');

describe('ClickUpService', () => {
  let service: ClickUpService;
  const mockMeta: IClickUpServiceMeta = {
    $id: '6AgAe2kPbPusXT9z9iADp52',
    $name: 'click_up',
    $type: 'sys.click-up',
    listId: '123',
    authToken: 'token',
    teamId: 'team123',
    webhookEndPoint: 'http://example.com/webhook',
  };

  beforeEach(() => {
    service = new ClickUpService({
      meta: mockMeta,
    } as ServiceConstructorParams<IClickUpServiceMeta>);
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWebhook', () => {
    it('should create a webhook if it does not exist', async () => {
      const webhookData: IClickUpWebhook = {
        events: ['taskStatusUpdated'],
        list_id: parseInt(mockMeta.listId!, 10),
        endpoint: mockMeta.webhookEndPoint!,
      };
      fetchMock.mockOnceIf(
        `https://api.clickup.com/api/v2/team/${mockMeta.teamId}/webhook`,
        JSON.stringify({ webhooks: [] }),
      );
      fetchMock.mockOnceIf(
        `https://api.clickup.com/api/v2/team/${mockMeta.teamId}/webhook`,
        JSON.stringify({ webhook: webhookData }),
      );

      const result = await service.createWebhook(webhookData);

      expect(result).toEqual(webhookData);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.clickup.com/api/v2/team/${mockMeta.teamId}/webhook`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(webhookData),
        }),
      );
    });

    it('should return existing webhook if it exists', async () => {
      const existingWebhook: IClickUpWebhook = {
        events: ['taskStatusUpdated'],
        list_id: parseInt(mockMeta.listId!, 10),
        endpoint: mockMeta.webhookEndPoint!,
        secret: 'secret',
      };

      jest.spyOn(service, 'getWebhooks').mockResolvedValueOnce([existingWebhook]);

      const result = await service.createWebhook(existingWebhook);

      expect(result).toEqual(existingWebhook);
      expect(service.getWebhooks).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTask', () => {
    it('should fetch task by taskId', async () => {
      const taskId = '456';
      const mockTask: IClickUpTask = { id: taskId, name: 'Test Task' };

      fetchMock.mockResponseOnce(JSON.stringify(mockTask));

      const result = await service.getTask({ taskId });

      expect(result).toEqual(mockTask);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.clickup.com/api/v2/task/${taskId}`,
        expect.objectContaining({
          method: 'GET',
        }),
      );
    });
  });

  describe('verifySignature', () => {
    it('should throw Conflict if webhook is not found', async () => {
      jest.spyOn(service, 'getWebhook').mockResolvedValueOnce(undefined);

      const data = {};
      const params: Params = { headers: { 'x-signature': 'test-signature' } };

      await expect(service.verifySignature(data, params)).rejects.toThrow(
        new Conflict('Webhook not found'),
      );
      expect(service.getWebhook).toHaveBeenCalledWith(mockMeta.webhookEndPoint);
    });

    it('should throw Conflict if signature does not match', async () => {
      const existingWebhook: IClickUpWebhook = {
        events: ['taskStatusUpdated'],
        list_id: parseInt(mockMeta.listId!, 10),
        endpoint: mockMeta.webhookEndPoint!,
        secret: 'secret',
      };

      jest.spyOn(service, 'getWebhook').mockResolvedValueOnce(existingWebhook);

      const data = {};
      const params: Params = { headers: { 'x-signature': 'wrong-signature' } };

      const hash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('correct-signature'),
      };
      (crypto.createHmac as jest.Mock).mockReturnValue(hash);

      await expect(service.verifySignature(data, params)).rejects.toThrow(
        new Conflict('Click up signature check failed'),
      );
      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', existingWebhook.secret);
      expect(hash.update).toHaveBeenCalledWith(JSON.stringify(data));
      expect(hash.digest).toHaveBeenCalledWith('hex');
    });

    it('should not throw if signature matches', async () => {
      const existingWebhook: IClickUpWebhook = {
        events: ['taskStatusUpdated'],
        list_id: parseInt(mockMeta.listId!, 10),
        endpoint: mockMeta.webhookEndPoint!,
        secret: 'secret',
      };

      jest.spyOn(service, 'getWebhook').mockResolvedValueOnce(existingWebhook);

      const data = {};
      const params: Params = { headers: { 'x-signature': 'correct-signature' } };

      const hash = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('correct-signature'),
      };
      (crypto.createHmac as jest.Mock).mockReturnValue(hash);

      await expect(service.verifySignature(data, params)).resolves.not.toThrow();
      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', existingWebhook.secret);
      expect(hash.update).toHaveBeenCalledWith(JSON.stringify(data));
      expect(hash.digest).toHaveBeenCalledWith('hex');
    });
  });
});
