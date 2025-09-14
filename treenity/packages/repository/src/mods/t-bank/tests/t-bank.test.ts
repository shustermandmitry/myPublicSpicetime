// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import { services } from '@/services';
import { Application, feathers } from '@feathersjs/feathers';
import { awaitService, ServiceConstructorParams } from '@treenity/feathers-service';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import TBankService from '@/mods/t-bank/t-bank.service';
import { TBankServiceMetaEntity } from '@/mods/t-bank/entity/tbank.entity';
import { TBankCreateDataEntity } from '@/mods/t-bank/entity';

enableFetchMocks();
const meta = {
  $id: '6A3Ae2kPbPu23XT9z9iADp5',
  $name: 't-bank_service',
  $type: 't-bank.service',
  terminalKey: '1723185003568DEMO',
  password: '2QGc!7t^fA%IyRB1',
  publicKey:
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv5yse9ka3ZQE0feuGtemYv3IqOlLck8zHUM7lTr0za6lXTszRSXfUO7jMb+L5C7e2QNFs+7sIX2OQJ6a+HG8kr+jwJ4tS3cVsWtd9NXpsU40PE4MeNr5RqiNXjcDxA+L4OsEm/BlyFOEOh2epGyYUd5/iO3OiQFRNicomT2saQYAeqIwuELPs1XpLk9HLx5qPbm8fRrQhjeUD5TLO8b+4yCnObe8vy/BMUwBfq+ieWADIjwWCMp2KTpMGLz48qnaD9kdrYJ0iyHqzb2mkDhdIzkim24A3lWoYitJCBrrB2xM05sm9+OdCI1f7nPNJbl5URHobSwR94IRGT7CJcUjvwIDAQAB',
  webhookUrl: 'http://2.3.1.195:8081/api/timely/t-bank',
  webhookProxyUrl: 'http://2.3.1.195:8081/api/timely/payments',
  successUrl: 'http://localhost:3000/event-purchase/35/141',
  failUrl: 'http://localhost:3000/event-purchase/35/141',
  payType: 'T',
  taxation: 'osn',
  tax: 'vat10',
  paymentObject: 'another',
  paymentMethod: 'full_prepayment',
} as any;

describe('T-bank service run tests', () => {
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
    const path = '/t-bank';
    app.use(
      path,
      new TBankService({
        meta,
      } as ServiceConstructorParams<any>),
    );
    const service = await awaitService(app, path);
    expect(service).not.toEqual(undefined);
  });
});

describe('TBank service', () => {
  let app: Application;
  const path = '/paypal';
  const storagePath = '/sys/redis';
  let service: TBankService;
  beforeAll(async () => {
    app = feathers() as Application;
    app.set('tree', { root: __dirname + '/db' });
    app.configure(services);
    app.use(path, new TBankService({ meta } as ServiceConstructorParams<TBankServiceMetaEntity>));

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

  it('Create order', async () => {
    const data: TBankCreateDataEntity = {
      buyerId: 2,
      lang: 'ru',
      quantity: 1,
      createDate: '1',
      dueDate: '2',
      amount: 500,
      userName: 'fullName',
      email: 'test@mail.ru',
      additional: {
        paymentMethod: 'tinkoff',
        customId: '1',
      },
      item: {
        title: 'title item',
        description: 'desription item',
      },
    };

    fetchMock.mockOnceIf(
      'https://securepay.tinkoff.ru/v2/Init',
      JSON.stringify({
        Success: true,
        PaymentId: 'test payment id',
        PaymentURL: 'test payment url',
        Amount: 500,
      }),
    );

    const result = await service.createOrder(data);
    expect(result).toBeDefined();
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, params]] = calls;
    expect(url).toEqual('https://securepay.tinkoff.ru/v2/Init');
    expect(params!.method).toEqual('POST');
    expect(params!.headers).toStrictEqual({ 'Content-Type': 'application/json' });
    const body = JSON.parse(params!.body as any);
    expect(body).toStrictEqual({
      TerminalKey: '1723185003568DEMO',
      Amount: 500,
      CustomerKey: '2',
      OrderId: '1',
      Description: 'desription item',
      PayType: 'T',
      DATA: { Email: 'test@mail.ru', paymentMethod: 'tinkoff', customId: '1' },
      Receipt: {
        Email: 'test@mail.ru',
        Taxation: 'osn',
        Items: [
          {
            PaymentMethod: 'full_prepayment',
            PaymentObject: 'another',
            Name: 'title item',
            Price: 500,
            Quantity: 1,
            Amount: 500,
            Tax: 'vat10',
          },
        ],
      },
      RedirectDueDate: '2',
      NotificationURL: 'http://2.3.1.195:8081/api/timely/t-bank',
      SuccessURL: 'http://localhost:3000/event-purchase/35/141',
      FailURL: 'http://localhost:3000/event-purchase/35/141',
      Language: 'ru',
      Token: '236544a335837300607e91f063208206ef79515357bd1d97b413c86a86dd6351',
    });
  });

  it('Approve with autirization', async () => {
    const paymentId = 'testPaymentId';
    const amount = 1000;

    fetchMock.mockOnceIf(
      'https://securepay.tinkoff.ru/v2/Confirm',
      JSON.stringify({
        Success: true,
        PaymentId: 'test payment id',
        PaymentURL: 'test payment url',
        Amount: 500,
      }),
    );

    const result = await service.approveWithAuthorization(paymentId, amount);
    expect(result).toBeDefined();
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, params]] = calls;
    expect(url).toEqual('https://securepay.tinkoff.ru/v2/Confirm');
    expect(params!.method).toEqual('POST');
    expect(params!.headers).toStrictEqual({ 'Content-Type': 'application/json' });
    const body = JSON.parse(params!.body as any);
    expect(body).toStrictEqual({
      TerminalKey: '1723185003568DEMO',
      PaymentId: paymentId,
      Amount: amount,
      Token: 'c367aeae487c77d41988dc1764127a3016b4f69efcc475aaca0ca742b9bad8c9',
    });
  });

  it('Refund', async () => {
    const paymentId = 'testPaymentId';
    const amount = 1000;

    fetchMock.mockOnceIf(
      'https://securepay.tinkoff.ru/v2/Cancel',
      JSON.stringify({
        Success: true,
        PaymentId: 'test payment id',
        PaymentURL: 'test payment url',
        Amount: 500,
      }),
    );

    const result = await service.refund(paymentId, 100);
    expect(result).toBeDefined();
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(1);
    const [[url, params]] = calls;
    expect(url).toEqual('https://securepay.tinkoff.ru/v2/Cancel');
    expect(params!.method).toEqual('POST');
    expect(params!.headers).toStrictEqual({ 'Content-Type': 'application/json' });
    const body = JSON.parse(params!.body as any);
    expect(body).toStrictEqual({
      TerminalKey: '1723185003568DEMO',
      PaymentId: paymentId,
      Token: '0570e277fb4fba2d9b0ba47ab5a15a316ea09d8da7bc9d4fa8017962a4a48e84',
    });
  });

  it('Verify webhook', async () => {
    const Token = '190f451b2781eefd3e237b51ce8b678173f48113b1c4102a63bace66342d7595';

    const result = await service.verifyWebhook({ test: 1, Token: Token }, {});
    expect(result).toBeUndefined();
  });

  it('Verify webhook error', async () => {
    const Token = 'test';

    try {
      await service.verifyWebhook({ test: 1, Token: Token }, {});
    } catch (e: any) {
      expect(e.message).toEqual(
        'Webhook t-bank verification failed with outer token: 190f451b2781eefd3e237b51ce8b678173f48113b1c4102a63bace66342d7595 and our token test',
      );
    }
  });
});
