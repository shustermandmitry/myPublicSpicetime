// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import PaypalService from '@/mods/paypal/paypal.service';
import { services } from '@/services';
import { Application, feathers } from '@feathersjs/feathers';
import { awaitService, ServiceConstructorParams } from '@treenity/feathers-service';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { PaypalServiceMetaEntity } from '@/mods/paypal/entity';
import RedisMock from '@/utils/redis-mock';

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

describe('Paypal service run tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = feathers() as Application;
    app.set('tree', { root: __dirname + '/db' });
    app.configure(services);
    await app.setup();
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('simple run', async () => {
    const path = '/paypal';
    app.use(
      path,
      new PaypalService({
        meta,
      } as ServiceConstructorParams<PaypalServiceMetaEntity>),
    );
    const service = await awaitService(app, path);
    expect(service).not.toEqual(undefined);
  });
});
//
describe('Paypal service', () => {
  let app: Application;
  const path = '/paypal';
  const storagePath = '/sys/redis';
  let service: PaypalService;
  beforeAll(async () => {
    app = feathers() as Application;
    app.set('tree', { root: __dirname + '/db' });
    app.configure(services);
    app.use(path, new PaypalService({ meta } as ServiceConstructorParams<PaypalServiceMetaEntity>));
    // @ts-ignore
    app.use(storagePath, new RedisMock({ id: 'key' }));

    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      JSON.stringify({
        access_token: 'new_access_token',
        token_type: 'new_token_type',
        expires_in: 1000,
      }),
    );

    await app.setup();

    fetchMock.mockClear();
    service = await awaitService(app, path);
  });

  afterAll(async () => {
    await app.teardown();
  });

  beforeEach(async () => {
    fetchMock.mockClear();
  });

  it('Request access token', async () => {
    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      JSON.stringify({
        access_token: 'new_access_token',
        token_type: 'new_token_type',
        expires_in: 1000,
      }),
    );

    const redisGetMock = jest.fn().mockImplementationOnce(() => ({ data: null }));
    const redisCreateMock = jest.fn().mockImplementationOnce(() => ({}));

    // @ts-ignore
    service.storageService = {
      get: redisGetMock,
      create: redisCreateMock,
    };

    const authResponse = await service.apiClient.requestAccessToken();

    expect(authResponse).toStrictEqual({
      access_token: 'new_access_token',
      token_type: 'new_token_type',
      expires_in: 1000,
    });

    const [[req1]] = fetchMock.mock.calls;

    const url1 = new URL((req1 as string) || '');
    expect(url1.toString()).toEqual('https://api-m.sandbox.paypal.com/v1/oauth2/token');
    const [[requestKey]] = redisGetMock.mock.calls;
    expect(redisGetMock.mock.calls).toHaveLength(1);
    expect(requestKey).toEqual('paypal-access-token');
    const [[createDataRequest, createDataParams]] = redisCreateMock.mock.calls;
    expect(redisCreateMock.mock.calls).toHaveLength(1);
    expect(createDataRequest.key).toEqual('paypal-access-token');
    expect(createDataRequest.data.access_token).toEqual('new_access_token');
    expect(createDataRequest.data.token_type).toEqual('new_token_type');
    expect(createDataParams.query.EX).toEqual(1000);
  });

  // it('Get access token with no storage', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({ data: null }));
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const accessToken = await service.getAccessToken();
  //   expect(accessToken).toBeNull();
  //   const [[requestKey]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestKey).toEqual('paypal-access-token');
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(0);
  // });
  //
  // it('Get access token from storage', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({ data: { access_token: 'abcabc', token_type: 'Bearer' } }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const accessToken = await service.getAccessToken();
  //   expect(accessToken.access_token).toEqual('abcabc');
  //   expect(accessToken.token_type).toEqual('Bearer');
  //
  //   const [[requestKey]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestKey).toEqual('paypal-access-token');
  // });
  //
  // it('Get access token from storage with data object', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({ data: {} }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const accessToken = await service.getAccessToken();
  //
  //   expect(accessToken).toBeDefined();
  //   expect(accessToken).toStrictEqual({});
  //   const [[requestKey]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestKey).toEqual('paypal-access-token');
  // });
  //
  // it('Create webhook id not found in storage', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({ data: null }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'abcabc',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //   const redisCreateMock = jest.fn().mockImplementationOnce(() => ({}));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //     create: redisCreateMock,
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/webhooks',
  //     JSON.stringify({ id: 'webhook_id' }),
  //   );
  //   const result = await service.createWebhook();
  //   expect(result).toEqual(true);
  //
  //   const [[requestDataWebhook], [requestDataAccessToken]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestDataWebhook).toBe('paypal-webhook');
  //   expect(requestDataAccessToken).toBe('paypal-access-token');
  //
  //   const [[creteDataWebhook]] = redisCreateMock.mock.calls;
  //   expect(redisCreateMock.mock.calls).toHaveLength(1);
  //   expect(creteDataWebhook.key).toBe('paypal-webhook');
  //   expect(creteDataWebhook.data.webhook_id).toBe('webhook_id');
  //
  //   const calls = fetchMock.mock.calls;
  //   const [[authReq]] = calls;
  //   expect(calls.length).toEqual(1);
  //   const authUrl = new URL((authReq as string) || '');
  //   expect(authUrl.toString()).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/webhooks',
  //   );
  // });
  //
  // it('Create webhook id with webhook id in storage', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({
  //     data: {
  //       webhook_id: 'abcabc',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const result = await service.createWebhook();
  //   expect(result).toEqual(true);
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(requestData).toBe('paypal-webhook');
  // });
  //
  // it('Get webhook id if storage have row', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({
  //     data: {
  //       webhook_id: '123',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const webhook_id = await service.getWebhookId();
  //   expect(webhook_id).toEqual('123');
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(requestData).toBe('paypal-webhook');
  // });
  //
  // it('Get webhook id if storage data null', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({
  //     data: null,
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const webhook_id = await service.getWebhookId();
  //   expect(webhook_id).toBeUndefined();
  // });
  //
  // it('Get webhook id if storage result undefined', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => undefined);
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const webhook_id = await service.getWebhookId();
  //   expect(webhook_id).toBeUndefined();
  // });
  //
  // it('Get generate invoice number', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //     JSON.stringify({
  //       invoice_number: 'invoice_number',
  //     }),
  //   );
  //   const invoice_number = await service.generateInvoiceNumber();
  //   expect(invoice_number).toEqual('invoice_number');
  //
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestData).toBe('paypal-access-token');
  // });
  //
  // it('Get generate invoice number throw error', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   fetchMock.mockRejectedValueOnce('Failed generate invoice number');
  //   let invoice_number;
  //   try {
  //     invoice_number = await service.generateInvoiceNumber();
  //   } catch (e: any) {
  //     expect(e).toEqual('Failed generate invoice number');
  //   }
  //
  //   expect(invoice_number).toBeUndefined();
  //
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestData).toBe('paypal-access-token');
  // });
  //
  // it('Create invoice ', async () => {
  //   const redisGetMock = jest.fn().mockImplementation(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data: ISendInvoice = {
  //     item: {
  //       name: 'name',
  //       description: 'description',
  //       quantity: 1,
  //       price: 100,
  //     },
  //     currencyCode: 'USD',
  //     invoice_date: '2022-01-01',
  //     due_date: '2022-01-02',
  //     recipient: {
  //       name: 'name',
  //       email: 'email',
  //     },
  //     additional: { participantId: 17 },
  //     invoicer: {
  //       name: 'invoicer_name',
  //       website: 'test-site',
  //     },
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //     JSON.stringify({
  //       invoice_number: 'invoice_number',
  //     }),
  //   );
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/invoices',
  //     JSON.stringify({
  //       id: 'invoice_id',
  //     }),
  //   );
  //
  //   const invoiceId = await service.createInvoice(data);
  //   expect(invoiceId).toEqual('invoice_id');
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //   const [[generateInvoiceNumberUrl], [createInvoiceUrl]] = calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //   );
  //   expect(createInvoiceUrl).toEqual('https://api-m.sandbox.paypal.com/v2/invoicing/invoices');
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-access-token');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Create invoice check header prefer', async () => {
  //   const redisGetMock = jest.fn().mockImplementation(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data: ISendInvoice = {
  //     item: {
  //       name: 'name',
  //       description: 'description',
  //       quantity: 1,
  //       price: 100,
  //     },
  //     currencyCode: 'USD',
  //     invoice_date: '2022-01-01',
  //     due_date: '2022-01-02',
  //     recipient: {
  //       name: 'name',
  //       email: 'email',
  //     },
  //     additional: { participantId: 17 },
  //     invoicer: {
  //       name: 'invoicer_name',
  //       website: 'test-site',
  //     },
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //     JSON.stringify({
  //       invoice_number: '1',
  //     }),
  //   );
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/invoices',
  //     JSON.stringify({
  //       id: 'invoice_id',
  //     }),
  //   );
  //
  //   const invoiceId = await service.createInvoice(data);
  //   expect(invoiceId).toEqual('invoice_id');
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //   const [[generateInvoiceNumberUrl], createInvoiceReq] = calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //   );
  //   expect(createInvoiceReq[0]).toEqual('https://api-m.sandbox.paypal.com/v2/invoicing/invoices');
  //   const requestParams = createInvoiceReq[1]!;
  //   const prefer = get(requestParams, ['headers', 'Prefer']);
  //   expect(prefer).toEqual('return=representation');
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-access-token');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Create invoice with throw error in request', async () => {
  //   const redisGetMock = jest.fn().mockImplementation(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data: ISendInvoice = {
  //     item: {
  //       name: 'name',
  //       description: 'description',
  //       quantity: 1,
  //       price: 100,
  //     },
  //     currencyCode: 'USD',
  //     invoice_date: '2022-01-01',
  //     due_date: '2022-01-02',
  //     recipient: {
  //       name: 'name',
  //       email: 'email',
  //     },
  //     additional: { participantId: 17 },
  //     invoicer: {
  //       name: 'invoicer_name',
  //       website: 'test-site',
  //     },
  //   };
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //     JSON.stringify({
  //       invoice_number: '1',
  //     }),
  //   );
  //
  //   fetchMock.mockRejectedValueOnce('Failed request create invoice');
  //
  //   try {
  //     const invoiceId = await service.createInvoice(data);
  //     expect(invoiceId).toBeUndefined();
  //   } catch (e: any) {
  //     expect(e).toEqual('Failed request create invoice');
  //   }
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-access-token');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Create invoice with failed get invoice number', async () => {
  //   const redisGetMock = jest.fn().mockImplementation(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data: ISendInvoice = {
  //     item: {
  //       name: 'name',
  //       description: 'description',
  //       quantity: 1,
  //       price: 100,
  //     },
  //     currencyCode: 'USD',
  //     invoice_date: '2022-01-01',
  //     due_date: '2022-01-02',
  //     recipient: {
  //       name: 'name',
  //       email: 'email',
  //     },
  //     additional: { participantId: 17 },
  //     invoicer: {
  //       name: 'invoicer_name',
  //       website: 'test-site',
  //     },
  //   };
  //
  //   fetchMock.mockRejectedValueOnce('Failed get invoice number');
  //
  //   try {
  //     const invoiceId = await service.createInvoice(data);
  //     expect(invoiceId).toBeUndefined();
  //   } catch (e) {
  //     expect(e).toEqual('Failed get invoice number');
  //   }
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //   const [[generateInvoiceNumberUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //   );
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestData).toBe('paypal-access-token');
  // });
  //
  // it('Send invoice', async () => {
  //   const redisGetMock = jest.fn().mockImplementation(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data: ISendInvoice = {
  //     item: {
  //       name: 'name',
  //       description: 'description',
  //       quantity: 1,
  //       price: 100,
  //     },
  //     currencyCode: 'USD',
  //     invoice_date: '2022-01-01',
  //     due_date: '2022-01-02',
  //     recipient: {
  //       name: 'name',
  //       email: 'email',
  //     },
  //     additional: { participantId: 17 },
  //     invoicer: {
  //       name: 'invoicer_name',
  //       website: 'test-site',
  //     },
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //     JSON.stringify({
  //       invoice_number: '1',
  //     }),
  //   );
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/invoices',
  //     JSON.stringify({
  //       id: 'testInvoiceId',
  //     }),
  //   );
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/invoices/testInvoiceId/send',
  //     JSON.stringify({
  //       href: 'payment_href',
  //     }),
  //   );
  //
  //   const paymentHref = await service.sendInvoice(data);
  //   expect(paymentHref.href).toEqual('payment_href');
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(3);
  //   const [[generateInvoiceNumberUrl], [createInvoiceUrl], [sendInvoiceUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //   );
  //   expect(createInvoiceUrl).toEqual('https://api-m.sandbox.paypal.com/v2/invoicing/invoices');
  //   expect(sendInvoiceUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/invoices/testInvoiceId/send',
  //   );
  //   const [[requestData], [requestDataTwo], [requestDataTree]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(3);
  //   expect(requestData).toBe('paypal-access-token');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  //   expect(requestDataTree).toBe('paypal-access-token');
  // });
  //
  // it('Send invoice with throw error in create invoice', async () => {
  //   const redisGetMock = jest.fn().mockImplementation(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data: ISendInvoice = {
  //     item: {
  //       name: 'name',
  //       description: 'description',
  //       quantity: 1,
  //       price: 100,
  //     },
  //     currencyCode: 'USD',
  //     invoice_date: '2022-01-01',
  //     due_date: '2022-01-02',
  //     recipient: {
  //       name: 'name',
  //       email: 'email',
  //     },
  //     additional: { participantId: 17 },
  //     invoicer: {
  //       name: 'invoicer_name',
  //       website: 'test-site',
  //     },
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //     JSON.stringify({
  //       invoice_number: '1',
  //     }),
  //   );
  //
  //   fetchMock.mockReject(new Error('Failed to create invoice'));
  //
  //   try {
  //     const paymentHref = await service.sendInvoice(data);
  //     expect(paymentHref).toBeUndefined();
  //   } catch (e: any) {
  //     expect(e.message).toEqual('Failed to create invoice');
  //   }
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //   const [[generateInvoiceNumberUrl], [createInvoiceUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
  //   );
  //   expect(createInvoiceUrl).toEqual('https://api-m.sandbox.paypal.com/v2/invoicing/invoices');
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-access-token');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Verify webhook', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         webhook_id: 'abcabc3',
  //       },
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'abcabc',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data = {
  //     webhook_event: 'test data',
  //   };
  //
  //   const headers = {
  //     'paypal-auth-algo': 'auth_algo',
  //     'paypal-cert-url': 'cert_url',
  //     'paypal-transmission-id': 'transmission_id',
  //     'paypal-transmission-sig': 'transmission_sig',
  //     'paypal-transmission-time': 'transmission_time',
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //     JSON.stringify({
  //       verification_status: 'SUCCESS',
  //     }),
  //   );
  //
  //   await service.verifyWebhook(data, { headers });
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //   const [[generateInvoiceNumberUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //   );
  //
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-webhook');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Verify webhook if not success', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         webhook_id: 'abcabc3',
  //       },
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'abcabc',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const data = {
  //     webhook_event: 'test data',
  //   };
  //
  //   const headers = {
  //     'paypal-auth-algo': 'auth_algo',
  //     'paypal-cert-url': 'cert_url',
  //     'paypal-transmission-id': 'transmission_id',
  //     'paypal-transmission-sig': 'transmission_sig',
  //     'paypal-transmission-time': 'transmission_time',
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //     JSON.stringify({
  //       verification_status: 'FAILED',
  //     }),
  //   );
  //
  //   try {
  //     await service.verifyWebhook(data, { headers });
  //   } catch (e: any) {
  //     expect(e.message).toEqual('Webhook verification failed');
  //   }
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //   const [[generateInvoiceNumberUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //   );
  //
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-webhook');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Webhook endpoint invoice paid', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         webhook_id: 'abcabc3',
  //       },
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'abcabc',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //
  //   const data = {
  //     event_type: 'INVOICING.INVOICE.PAID',
  //     resource: {
  //       invoice: {
  //         amount: {
  //           value: '30.00',
  //         },
  //         detail: {
  //           additional_data: JSON.stringify({ test: 1 }),
  //         },
  //         status: 'PAID',
  //       },
  //     },
  //   };
  //
  //   const headers = {
  //     'paypal-auth-algo': 'auth_algo',
  //     'paypal-cert-url': 'cert_url',
  //     'paypal-transmission-id': 'transmission_id',
  //     'paypal-transmission-sig': 'transmission_sig',
  //     'paypal-transmission-time': 'transmission_time',
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //     JSON.stringify({
  //       verification_status: 'SUCCESS',
  //     }),
  //   );
  //
  //   fetchMock.mockOnceIf(
  //     'http://localhost:3000/api/test/apihook',
  //     JSON.stringify({
  //       testData: 'SUCCESS',
  //     }),
  //   );
  //
  //   const res = await service.create(data, { headers });
  //   expect(res.data).toStrictEqual({
  //     testData: 'SUCCESS',
  //   });
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //   const [[generateInvoiceNumberUrl], [hookUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //   );
  //   expect(hookUrl).toEqual('http://localhost:3000/api/test/apihook');
  //
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-webhook');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Webhook endpoint invoice canceled', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         webhook_id: 'abcabc3',
  //       },
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'abcabc',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const data = {
  //     event_type: 'INVOICING.INVOICE.CANCELLED',
  //     resource: {
  //       invoice: {
  //         amount: {
  //           value: '30.00',
  //         },
  //         detail: {
  //           additional_data: JSON.stringify({ test: 1 }),
  //         },
  //         status: 'PAID',
  //       },
  //     },
  //   };
  //
  //   const headers = {
  //     'paypal-auth-algo': 'auth_algo',
  //     'paypal-cert-url': 'cert_url',
  //     'paypal-transmission-id': 'transmission_id',
  //     'paypal-transmission-sig': 'transmission_sig',
  //     'paypal-transmission-time': 'transmission_time',
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //     JSON.stringify({
  //       verification_status: 'SUCCESS',
  //     }),
  //   );
  //
  //   fetchMock.mockOnceIf(
  //     'http://localhost:3000/api/test/apihook',
  //     JSON.stringify({
  //       testData: 'CANCELLED',
  //     }),
  //   );
  //
  //   const res = await service.create(data, { headers });
  //   expect(res.data).toStrictEqual({
  //     testData: 'CANCELLED',
  //   });
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //   const [[generateInvoiceNumberUrl], [hookUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //   );
  //   expect(hookUrl).toEqual('http://localhost:3000/api/test/apihook');
  //
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-webhook');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Webhook endpoint invoice other event', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         webhook_id: 'abcabc3',
  //       },
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'abcabc',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const data = {
  //     event_type: 'other event',
  //     resource: {
  //       invoice: {
  //         detail: {
  //           additional_data: JSON.stringify({ test: 1 }),
  //         },
  //         status: 'PAID',
  //       },
  //     },
  //   };
  //
  //   const headers = {
  //     'paypal-auth-algo': 'auth_algo',
  //     'paypal-cert-url': 'cert_url',
  //     'paypal-transmission-id': 'transmission_id',
  //     'paypal-transmission-sig': 'transmission_sig',
  //     'paypal-transmission-time': 'transmission_time',
  //   };
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //     JSON.stringify({
  //       verification_status: 'SUCCESS',
  //     }),
  //   );
  //
  //   try {
  //     const res = await service.create(data, { headers });
  //     expect(res).toBeUndefined();
  //   } catch (e: any) {
  //     expect(e.message).toEqual('Event type is not supported');
  //   }
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //   const [[generateInvoiceNumberUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //   );
  //   const [[requestData], [requestDataTwo]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(requestData).toBe('paypal-webhook');
  //   expect(requestDataTwo).toBe('paypal-access-token');
  // });
  //
  // it('Request', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const testUrl = 'http://localhost:3000/api/test/apihook';
  //
  //   fetchMock.mockOnceIf(
  //     testUrl,
  //     JSON.stringify({
  //       verification_status: 'SUCCESS',
  //     }),
  //   );
  //   const res = await service.request(testUrl, 'POST', { test: 2 });
  //   expect(res.verification_status).toEqual('SUCCESS');
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //   const [[testRequestUrl, testRequestParams]] = fetchMock.mock.calls;
  //   expect(testRequestUrl).toEqual(testUrl);
  //   expect(testRequestParams!.method).toEqual('POST');
  //   const contentType = get(testRequestParams, ['headers', 'Content-Type']);
  //   expect(contentType).toEqual('application/json');
  //   expect(testRequestParams!.body).toEqual(JSON.stringify({ test: 2 }));
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestData).toBe('paypal-access-token');
  // });
  //
  // it('Request with headers urlencoded', async () => {
  //   const redisGetMock = jest.fn().mockImplementationOnce(() => ({
  //     data: {
  //       access_token: 'abcabc',
  //       token_type: 'Bearer',
  //     },
  //   }));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //   };
  //   const testUrl = 'http://localhost:3000/api/test/apihook';
  //
  //   fetchMock.mockOnceIf(
  //     testUrl,
  //     JSON.stringify({
  //       verification_status: 'SUCCESS',
  //     }),
  //   );
  //
  //   const headers = {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   };
  //
  //   const res = await service.request(testUrl, 'POST', { test: 1 }, headers);
  //   expect(res.verification_status).toEqual('SUCCESS');
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //
  //   const [[testRequestUrl, testRequestParams]] = fetchMock.mock.calls;
  //   expect(testRequestUrl).toEqual(testUrl);
  //   expect(testRequestParams!.method).toEqual('POST');
  //   const contentType = get(testRequestParams, ['headers', 'Content-Type']);
  //   expect(contentType).toEqual('application/x-www-form-urlencoded');
  //   expect(testRequestParams!.body).toEqual(new URLSearchParams({ test: 1 } as any));
  //
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(1);
  //   expect(requestData).toBe('paypal-access-token');
  // });
  //
  // it('Request with invalid headers', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({
  //       data: null,
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'access_token',
  //         token_type: 'Bearer',
  //       },
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'access_token',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //
  //   const redisCreateMock = jest.fn().mockImplementationOnce(() => ({}));
  //   const redisRemoveMock = jest.fn().mockImplementationOnce(() => ({}));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //     create: redisCreateMock,
  //     remove: redisRemoveMock,
  //   };
  //   const testUrl = 'http://localhost:3000/api/test/apihook1';
  //   fetchMock.mockOnceIf(testUrl, JSON.stringify({}), { status: 401 });
  //
  //   fetchMock.mockOnceIf(
  //     'https://api-m.sandbox.paypal.com/v1/oauth2/token',
  //     JSON.stringify({
  //       access_token: 'access_token',
  //       token_type: 'Bearer',
  //       expires_in: 3600,
  //     }),
  //   );
  //
  //   fetchMock.mockOnceIf(testUrl, JSON.stringify({ verification_status: 'SUCCESS' }), {
  //     status: 200,
  //   });
  //
  //   const res = await service.request(testUrl, 'POST', { test: 1 });
  //   expect(res.verification_status).toEqual('SUCCESS');
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(3);
  //
  //   const [
  //     [firstTestRequestUrl, firstTestRequestParams],
  //     [authUrl],
  //     [testRequestUrl, testRequestParams],
  //   ] = fetchMock.mock.calls;
  //   expect(firstTestRequestUrl).toEqual(testUrl);
  //   const firstAuthHeaders = get(firstTestRequestParams, ['headers', 'Authorization']);
  //   expect(firstAuthHeaders).toEqual('undefined undefined');
  //   expect(firstTestRequestParams!.method).toEqual('POST');
  //   expect(firstTestRequestParams!.body).toEqual(JSON.stringify({ test: 1 }));
  //
  //   expect(authUrl).toEqual('https://api-m.sandbox.paypal.com/v1/oauth2/token');
  //
  //   expect(testRequestUrl).toEqual(testUrl);
  //   const testAuthHeaders = get(testRequestParams, ['headers', 'Authorization']);
  //   expect(testAuthHeaders).toEqual('Bearer access_token');
  //   expect(testRequestParams!.method).toEqual('POST');
  //   expect(testRequestParams!.body).toEqual(JSON.stringify({ test: 1 }));
  //
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(3);
  //   expect(redisRemoveMock.mock.calls).toHaveLength(1);
  //   expect(requestData).toBe('paypal-access-token');
  //   expect(redisCreateMock.mock.calls).toHaveLength(1);
  // });
  //
  // it('Request with invalid headers and client id failed', async () => {
  //   const redisGetMock = jest
  //     .fn()
  //     .mockImplementationOnce(() => ({
  //       data: null,
  //     }))
  //     .mockImplementationOnce(() => ({
  //       data: {
  //         access_token: 'access_token',
  //         token_type: 'Bearer',
  //       },
  //     }));
  //
  //   const redisRemoveMock = jest.fn().mockImplementationOnce(() => ({}));
  //
  //   // @ts-ignore
  //   service.storageService = {
  //     get: redisGetMock,
  //     remove: redisRemoveMock,
  //   };
  //
  //   const testUrl = 'http://localhost:3000/api/test/apihook2';
  //   fetchMock.mockOnceIf(testUrl, JSON.stringify({}), { status: 401 });
  //
  //   fetchMock.mockOnceIf('https://api-m.sandbox.paypal.com/v1/oauth2/token', JSON.stringify({}), {
  //     status: 401,
  //   });
  //
  //   fetchMock.mockOnceIf(testUrl, JSON.stringify({}), {
  //     status: 200,
  //   });
  //
  //   try {
  //     const res = await service.request(testUrl, 'POST', { test: 1 });
  //     expect(res).toBeUndefined();
  //   } catch (e: any) {
  //     expect(e.message).toEqual('Unauthorized');
  //   }
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //
  //   const [[firstTestRequestUrl, firstTestRequestParams], [authUrl]] = fetchMock.mock.calls;
  //   expect(firstTestRequestUrl).toEqual(testUrl);
  //   const firstAuthHeaders = get(firstTestRequestParams, ['headers', 'Authorization']);
  //   expect(firstAuthHeaders).toEqual('undefined undefined');
  //   expect(firstTestRequestParams!.method).toEqual('POST');
  //   expect(firstTestRequestParams!.body).toEqual(JSON.stringify({ test: 1 }));
  //
  //   expect(authUrl).toEqual('https://api-m.sandbox.paypal.com/v1/oauth2/token');
  //   const [[requestData]] = redisGetMock.mock.calls;
  //   expect(redisGetMock.mock.calls).toHaveLength(2);
  //   expect(redisRemoveMock.mock.calls).toHaveLength(1);
  //   expect(requestData).toBe('paypal-access-token');
  // });
  //
  // it('Request with not paypal auth', async () => {
  //   const testUrl = 'http://localhost:3000/api/test/apihook2';
  //   fetchMock.mockOnceIf(testUrl, JSON.stringify({}), {
  //     status: 200,
  //   });
  //
  //   const res = await service.request(testUrl, 'POST', { test: 1 }, {}, false);
  //   expect(res).not.toBeUndefined();
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //
  //   const [[requestUrl, requestParams]] = fetchMock.mock.calls;
  //   expect(requestUrl).toEqual(testUrl);
  //   const firstAuthHeaders = get(requestParams, ['headers', 'Authorization']);
  //   expect(firstAuthHeaders).toBeUndefined();
  // });
});
