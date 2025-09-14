// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import PaypalService from '@/mods/paypal/paypal.service';
import { services } from '@/services';
import { Application, feathers } from '@feathersjs/feathers';
import { MemoryService, MemoryServiceOptions } from '@feathersjs/memory';
import { awaitService, ServiceConstructorParams } from '@treenity/feathers-service';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { PaypalCreateDataEntity, PaypalServiceMetaEntity } from '@/mods/paypal/entity';
import RedisMock from '@/utils/redis-mock';
import { PaypalApiClient } from '@/mods/paypal/handlers/client';
import { PaypalOrderHandler } from '@/mods/paypal/handlers/order';

enableFetchMocks();
const meta = {
  $id: '6A3Ae2kPbPu23XT9z9iADp5',
  $name: 'paypal_service',
  $type: 'paypal.service',
  storagePath: '/sys/redis',
  accessTokenStorageKey: 'paypal-access-token',
  domainName: 'Timely',
  config: {
    clientId: 'AQpjYdn3fir_U0vZRQGZSKxOROMDuOs1_UmYx0S_XsRw2X99cOHPY7U5iK-wLMFo-_2GJDjz9dMibuFe',
    clientToken: 'ENm_GTPAZakvPr4KDn7cQL_huIHEzNFRIVSxryRafhnZuSW3exDavdIAqBtnPttG7UfKSGiLh0g4HtoG',
    currencyCode: 'USD',
    invoice: {
      mailSubject: 'Event purchase',
      mailNote: 'Event purchase',
      sendToRecipient: true,
      sendToInvoicer: true,
    },
    webhook: {
      storageKey: 'paypal-webhook',
      url: 'https://fd12-188-232-219-116.ngrok-free.app/api/timely/paypal',
      proxyUrl: 'https://fd12-188-232-219-116.ngrok-free.app/api/timely/payments',
    },
    order: {
      autoAuthorize: false,
      successUrl: 'http://localhost:3000/event-purchase/35/141',
      cancelUrl: 'http://localhost:3000/event-purchase/35/141',
    },
  },
} as unknown as PaypalServiceMetaEntity;

// @ts-ignore

describe('Paypal order handler', () => {
  let client: PaypalApiClient;
  let orderHandler: PaypalOrderHandler;
  beforeAll(async () => {
    client = new PaypalApiClient(
      meta.config.clientId,
      meta.config.clientToken,
      meta.accessTokenStorageKey,
      new RedisMock({ id: 'key', useData: true, useDataField: 'data' }),
    );

    client.storage.create({
      key: 'paypal-access-token',
      data: { token_type: 'Bearer', access_token: 'token' },
    });

    orderHandler = new PaypalOrderHandler(client, {
      ...meta.config.order,
      currencyCode: meta.config.currencyCode,
    });
  });

  beforeEach(async () => {
    fetchMock.mockClear();
  });

  afterAll(async () => {
    fetchMock.mockClear();
  });

  it('Get link', async () => {
    const data = {
      object: 'testObject',
      links: [
        {
          rel: 'test',
          href: 'href test',
        },
      ],
    };
    const result = orderHandler.getLink(data as any, 'test');
    expect(result).toEqual('href test');
  });

  it('Get link not found href', async () => {
    const data = {
      object: 'testObject',
      links: [
        {
          rel: 'test',
        },
      ],
    };
    const result = orderHandler.getLink(data as any, 'test');
    expect(result).toBeUndefined();
  });

  it('Get link not found link', async () => {
    const data = {
      object: 'testObject',
      links: [
        {
          rel: 'test',
          href: 'href test',
        },
      ],
    };
    const result = orderHandler.getLink(data as any, 'check');
    expect(result).toBeUndefined();
  });

  it('Create', async () => {
    const now = new Date().getMilliseconds();
    const data: PaypalCreateDataEntity = {
      quantity: 1,
      createDate: now.toString(),
      dueDate: now.toString(),
      amount: 500,
      userName: 'fullName',
      email: 'test@mail.ru',
      additional: {
        paymentMethod: 'paypal',
        customId: '1',
      },
      item: {
        title: 'title item',
        description: 'desription item',
      },
      lang: 'en',
      buyerId: 2,
    };

    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      JSON.stringify({
        object: 'testObject',
        links: [
          {
            rel: 'payer-action',
            href: 'href test',
          },
        ],
      }),
    );

    const result = await orderHandler.create(data);
    expect(result).toBeDefined();
    expect(result.paymentLink).toEqual('href test');
  });

  it('Create check request params', async () => {
    const now = new Date().getMilliseconds();
    const data: PaypalCreateDataEntity = {
      quantity: 1,
      createDate: now.toString(),
      dueDate: now.toString(),
      amount: 500,
      userName: 'fullName',
      email: 'test@mail.ru',
      additional: {
        paymentMethod: 'paypal',
        customId: '1',
      },
      item: {
        title: 'title item',
        description: 'desription item',
      },
      lang: 'en',
      buyerId: 1,
    };

    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      JSON.stringify({
        object: 'testObject',
        links: [
          {
            rel: 'payer-action',
            href: 'href test',
          },
        ],
      }),
    );

    const result = await orderHandler.create(data);
    expect(result).toBeDefined();
    expect(result.paymentLink).toEqual('href test');
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, requestParams]] = calls;
    expect(url).toEqual('https://api-m.sandbox.paypal.com/v2/checkout/orders');
    expect(requestParams!.method).toEqual('POST');
    expect(requestParams!.headers).toStrictEqual({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      Authorization: 'Bearer token',
    });
    expect(JSON.parse(requestParams!.body as any)).toStrictEqual({
      intent: 'AUTHORIZE',
      purchase_units: [
        {
          custom_id: '{"paymentMethod":"paypal","customId":"1"}',
          description: 'desription item',
          amount: { currency_code: 'USD', value: '500' },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            return_url: 'http://localhost:3000/event-purchase/35/141',
            cancel_url: 'http://localhost:3000/event-purchase/35/141',
          },
        },
      },
    });
  });

  it('Authorize', async () => {
    const orderId = 'orderIdTest';

    fetchMock.mockOnceIf(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/authorize`,
      JSON.stringify({
        purchase_units: [
          {
            payments: {
              authorizations: [
                {
                  id: 'testAutrizeId',
                },
              ],
            },
          },
        ],
      }),
    );

    const result = await orderHandler.authorize(orderId);
    expect(result).toBeDefined();
    expect(result).toEqual('testAutrizeId');
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, requestParams]] = calls;
    expect(url).toEqual(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/authorize`);
    expect(requestParams!.method).toEqual('POST');
    expect(requestParams!.headers).toStrictEqual({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      Authorization: 'Bearer token',
    });
  });

  it('Capture with authorization', async () => {
    const authorizationId = 'orderIdTest';

    fetchMock.mockOnceIf(
      `https://api-m.sandbox.paypal.com/v2/payments/authorizations/${authorizationId}/capture`,
      JSON.stringify({
        id: 'testCaptureId',
      }),
    );

    const result = await orderHandler.captureWithAuthorization(authorizationId, '100');
    expect(result).toBeDefined();
    expect(result).toEqual('testCaptureId');
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, requestParams]] = calls;
    expect(url).toEqual(
      `https://api-m.sandbox.paypal.com/v2/payments/authorizations/${authorizationId}/capture`,
    );
    expect(requestParams!.method).toEqual('POST');
    expect(JSON.parse(requestParams!.body as any)).toStrictEqual({
      amount: {
        currency_code: 'USD',
        value: '100',
      },
    });
    expect(requestParams!.headers).toStrictEqual({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      Authorization: 'Bearer token',
    });
  });

  it('Capture', async () => {
    const orderId = 'orderIdTest';

    fetchMock.mockOnceIf(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      JSON.stringify({
        id: 'testCaptureId',
      }),
    );

    const result = await orderHandler.capture(orderId);
    expect(result).toBeDefined();
    expect(result).toEqual('testCaptureId');
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, requestParams]] = calls;
    expect(url).toEqual(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`);
    expect(requestParams!.method).toEqual('POST');
    expect(JSON.parse(requestParams!.body as any)).toStrictEqual({});
    expect(requestParams!.headers).toStrictEqual({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      Authorization: 'Bearer token',
    });
  });

  it('Refund', async () => {
    const captureId = 'captureId';

    fetchMock.mockOnceIf(
      `https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`,
      JSON.stringify({
        id: 'testRefundId',
      }),
    );

    const result = await orderHandler.refund(captureId, 100);
    expect(result).toBeDefined();
    expect(result).toEqual('testRefundId');
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, requestParams]] = calls;
    expect(url).toEqual(
      `https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`,
    );
    expect(requestParams!.method).toEqual('POST');
    expect(JSON.parse(requestParams!.body as any)).toStrictEqual({
      amount: {
        currency_code: 'USD',
        value: 100,
      },
    });
    expect(requestParams!.headers).toStrictEqual({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      Authorization: 'Bearer token',
    });
  });

  it('Void', async () => {
    const authorizationId = 'authorizationId';

    fetchMock.mockOnceIf(
      `https://api-m.sandbox.paypal.com/v2/payments/authorizations/authorizationId/void`,
      JSON.stringify({
        id: 'testRefundId',
      }),
    );

    const result = await orderHandler.void(authorizationId);
    expect(result).toBeDefined();
    expect(result).toEqual('testRefundId');
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, requestParams]] = calls;
    expect(url).toEqual(
      `https://api-m.sandbox.paypal.com/v2/payments/authorizations/authorizationId/void`,
    );
    expect(requestParams!.method).toEqual('POST');
    expect(requestParams!.headers).toStrictEqual({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      Authorization: 'Bearer token',
    });
  });

  it('Convert url', async () => {
    const url = 'http://localhost:3000/event-purchase/:ownerId/:eventId';
    const linkParams = {
      ownerId: 1,
      eventId: 2,
    };
    const result = orderHandler.convertUrl(url, linkParams);
    expect(result).toBeDefined();
    expect(result).toEqual('http://localhost:3000/event-purchase/1/2');
  });

  it('Convert url not params', async () => {
    const url = 'http://localhost:3000/event-purchase/:ownerId/:eventId';
    const linkParams = {
      ownerId: 1,
    };
    const result = orderHandler.convertUrl(url, linkParams);
    expect(result).toBeDefined();
    expect(result).toEqual('http://localhost:3000/event-purchase/1/:eventId');
  });

  it('Convert url not params', async () => {
    const url = 'http://localhost:3000/event-purchase/:ownerId/:eventId';
    const result = orderHandler.convertUrl(url, {});
    expect(result).toBeDefined();
    expect(result).toEqual('http://localhost:3000/event-purchase/:ownerId/:eventId');
  });
});
