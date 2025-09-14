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
import { PaypalWebhookHandler } from '@/mods/paypal/handlers/webhook';
import { set } from '@s-libs/micro-dash';

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

describe('Paypal webhook handler client', () => {
  let client: PaypalApiClient;
  let webhookHandler: PaypalWebhookHandler;
  let storage: RedisMock;
  beforeAll(async () => {
    storage = new RedisMock({ id: 'key', useData: true, useDataField: 'data' });
    client = new PaypalApiClient(
      meta.config.clientId,
      meta.config.clientToken,
      meta.accessTokenStorageKey,
      storage,
    );

    client.storage.create({
      key: 'paypal-access-token',
      data: { token_type: 'Bearer', access_token: 'token' },
    });

    webhookHandler = new PaypalWebhookHandler(client, storage, meta.config.webhook);
  });

  afterAll(async () => {
    fetchMock.mockClear();
  });

  it('Get get webhook id', async () => {
    await storage.create({
      key: meta.config.webhook.storageKey,
      data: { webhook_id: 'webhook id test' },
    });
    const result = await webhookHandler.getWebhookId();
    expect(result).toEqual('webhook id test');
  });

  it('Get get webhook id if data null', async () => {
    await storage.create({
      key: meta.config.webhook.storageKey,
      data: null,
    });
    const result = await webhookHandler.getWebhookId();
    expect(result).toBeUndefined();
  });

  it('Get get webhook id if data undefined', async () => {
    await storage.create({
      key: meta.config.webhook.storageKey,
      data: undefined,
    });
    const result = await webhookHandler.getWebhookId();
    expect(result).toBeUndefined();
  });

  it('Get get webhook id if webhook id null', async () => {
    await storage.create({
      key: meta.config.webhook.storageKey,
      data: { webhook_id: null },
    });
    const result = await webhookHandler.getWebhookId();
    expect(result).toBeNull();
  });

  it('Get get webhook id if webhook id undefined', async () => {
    await storage.create({
      key: meta.config.webhook.storageKey,
      data: { webhook_id: undefined },
    });
    const result = await webhookHandler.getWebhookId();
    expect(result).toBeUndefined();
  });

  it('Create webhook', async () => {
    await storage.create({
      key: meta.config.webhook.storageKey,
      data: null,
    });

    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v1/notifications/webhooks',
      JSON.stringify({ id: 'webhook id' }),
    );

    const result = await webhookHandler.createWebhook();
    expect(result).toBeDefined();
    expect(result).toEqual(true);
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, params]] = calls;
    expect(url).toEqual('https://api-m.sandbox.paypal.com/v1/notifications/webhooks');
    expect(params!.method).toEqual('POST');
    expect(JSON.parse(params!.body as any)).toStrictEqual({
      url: 'https://fd12-188-232-219-116.ngrok-free.app/api/timely/paypal',
      event_types: [
        {
          name: 'INVOICING.INVOICE.CANCELLED',
        },
        {
          name: 'INVOICING.INVOICE.PAID',
        },
        {
          name: 'CHECKOUT.ORDER.COMPLETED',
        },
        {
          name: 'CHECKOUT.ORDER.APPROVED',
        },
        {
          name: 'PAYMENT.ORDER.CREATED',
        },
        {
          name: 'PAYMENT.ORDER.CANCELLED',
        },
        {
          name: 'PAYMENT.CAPTURE.DENIED',
        },
        {
          name: 'PAYMENT.AUTHORIZATION.VOIDED',
        },
      ],
    });
    expect(params!.headers).toStrictEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    });

    const webhookId = await webhookHandler.getWebhookId();
    expect(webhookId).toEqual('webhook id');
  });

  it('Create webhook if webhook id have in storage', async () => {
    // @ts-ignore
    webhookHandler.storage = {
      get: jest.fn().mockImplementationOnce(() => ({ data: { webhook_id: 'webhook id' } })),
    };

    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v1/notifications/webhooks',
      JSON.stringify({ id: 'webhook id' }),
    );

    const result = await webhookHandler.createWebhook();
    expect(result).toBeDefined();
    expect(result).toEqual(true);
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
  });
  //
  // it('Verify webhook', async () => {
  //   await storage.create({
  //     key: meta.config.webhook.storageKey,
  //     data: { webhook_id: 'webhook id' },
  //   });
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
  //   await webhookHandler.verifyWebhook(data, { headers });
  //
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(1);
  //   const [[generateInvoiceNumberUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //   );
  // });
  //
  // it('Verify webhook if not success', async () => {
  //   await storage.create({
  //     key: meta.config.webhook.storageKey,
  //     data: { webhook_id: 'webhook id' },
  //   });
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
  //       verification_status: 'FAILED',
  //     }),
  //   );
  //
  //   try {
  //     await webhookHandler.verifyWebhook(data, { headers });
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
  // });
  //
  // it('Get additional properties', async () => {
  //   const data = {
  //     event_type: 'INVOICING.INVOICE.CANCELLED',
  //     resource: {
  //       invoice: {
  //         detail: {
  //           additional_data: JSON.stringify({ customId: '1' }),
  //         },
  //       },
  //     },
  //   };
  //   const additionalDataInvoiceCancelled = await webhookHandler.getAdditionalData(data);
  //   expect(additionalDataInvoiceCancelled).toBeDefined();
  //   expect(additionalDataInvoiceCancelled.customId).toEqual('1');
  //
  //   data.event_type = 'INVOICING.INVOICE.PAID';
  //   const additionalDataInvoicePaid = await webhookHandler.getAdditionalData(data);
  //   expect(additionalDataInvoicePaid).toBeDefined();
  //   expect(additionalDataInvoicePaid.customId).toEqual('1');
  //
  //   set(data, ['resource', 'purchase_units'], []);
  //   set(data, ['resource', 'purchase_units', '0', 'custom_id'], JSON.stringify({ customId: '1' }));
  //
  //   data.event_type = 'CHECKOUT.ORDER.COMPLETED';
  //   const additionalDataOrderCompleted = await webhookHandler.getAdditionalData(data);
  //   expect(additionalDataOrderCompleted).toBeDefined();
  //   expect(additionalDataOrderCompleted.customId).toEqual('1');
  //
  //   data.event_type = 'CHECKOUT.ORDER.APPROVED';
  //   const additionalDataOrderApproved = await webhookHandler.getAdditionalData(data);
  //   expect(additionalDataOrderCompleted).toBeDefined();
  //   expect(additionalDataOrderApproved.customId).toEqual('1');
  //
  //   data.event_type = 'CHECKOUT.PAYMENT-APPROVAL.REVERSED';
  //   const additionalDataOrderREVERSED = await webhookHandler.getAdditionalData(data);
  //   expect(additionalDataOrderREVERSED).toBeDefined();
  //   expect(additionalDataOrderREVERSED.customId).toEqual('1');
  //
  //   data.event_type = 'PAYMENT.ORDER.CREATED';
  //   const additionalDataOrderCreated = await webhookHandler.getAdditionalData(data);
  //   expect(additionalDataOrderCreated).toBeDefined();
  //   expect(additionalDataOrderCreated.customId).toEqual('1');
  //
  //   data.event_type = 'PAYMENT.ORDER.CANCELLED';
  //   const additionalDataOrderCanceled = await webhookHandler.getAdditionalData(data);
  //   expect(additionalDataOrderCanceled).toBeDefined();
  //   expect(additionalDataOrderCanceled.customId).toEqual('1');
  // });
  //
  // it('Webhook endpoint invoice paid', async () => {
  //   await storage.create({
  //     key: meta.config.webhook.storageKey,
  //     data: { webhook_id: 'webhook id' },
  //   });
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
  //     'https://fd12-188-232-219-116.ngrok-free.app/api/timely/payments',
  //     JSON.stringify({
  //       testData: 'SUCCESS',
  //     }),
  //   );
  //
  //   const res = await webhookHandler.webhook(data, { headers });
  //   expect(res).toStrictEqual({
  //     testData: 'SUCCESS',
  //   });
  //   const calls = fetchMock.mock.calls;
  //   expect(calls.length).toEqual(2);
  //   const [[generateInvoiceNumberUrl], [hookUrl]] = fetchMock.mock.calls;
  //   expect(generateInvoiceNumberUrl).toEqual(
  //     'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
  //   );
  //   expect(hookUrl).toEqual('https://fd12-188-232-219-116.ngrok-free.app/api/timely/payments');
  // });
});
