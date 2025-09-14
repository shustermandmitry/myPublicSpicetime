// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import PaypalService from '@/mods/paypal/paypal.service';
import { services } from '@/services';
import { Application, feathers } from '@feathersjs/feathers';
import { MemoryService, MemoryServiceOptions } from '@feathersjs/memory';
import { awaitService, ServiceConstructorParams } from '@treenity/feathers-service';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import { PaypalServiceMetaEntity } from '@/mods/paypal/entity';
import RedisMock from '@/utils/redis-mock';
import { PaypalApiClient } from '@/mods/paypal/handlers/client';

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

describe('Paypal api client', () => {
  let client: PaypalApiClient;
  beforeAll(async () => {
    client = new PaypalApiClient(
      meta.config.clientId,
      meta.config.clientToken,
      meta.accessTokenStorageKey,
      new RedisMock({ id: 'key', useData: true, useDataField: 'data' }),
    );
  });

  beforeEach(async () => {
    fetchMock.mockClear();
  });

  afterAll(async () => {
    fetchMock.mockClear();
  });

  it('Get access token not found data', async () => {
    try {
      const authResponse = await client.getAccessToken();
      expect(authResponse).toBeUndefined();
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe("No record found for id 'paypal-access-token'");
    }
  });

  it('Get access token object with empty data equal null', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: null,
    });

    const authResponse = await client.getAccessToken();
    expect(authResponse).toBeNull();
  });

  it('Get access token object with empty data equal undefined', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: undefined,
    });

    const authResponse = await client.getAccessToken();
    expect(authResponse).toBeUndefined();
  });

  it('Get access token object with empty data equal undefined', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: undefined,
    });

    const authResponse = await client.getAccessToken();
    expect(authResponse).toBeUndefined();
  });

  it('Request access token if token not found', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: undefined,
    });

    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      JSON.stringify({
        access_token: 'new_access_token',
        token_type: 'new_token_type',
        expires_in: 1000,
      }),
    );

    const result = await client.requestAccessToken();
    expect(result.access_token).toEqual('new_access_token');
    expect(result.token_type).toEqual('new_token_type');
    expect(result.expires_in).toEqual(1000);

    const [[req1, paramsRequest]] = fetchMock.mock.calls;
    expect(req1).toEqual('https://api-m.sandbox.paypal.com/v1/oauth2/token');
    const headers = paramsRequest?.headers as any;
    expect(headers['Authorization']).toEqual(
      'Basic QVFwallkbjNmaXJfVTB2WlJRR1pTS3hPUk9NRHVPczFfVW1ZeDBTX1hzUncyWDk5Y09IUFk3VTVpSy13TE1Gby1fMkdKRGp6OWRNaWJ1RmU6RU5tX0dUUEFaYWt2UHI0S0RuN2NRTF9odUlIRXpORlJJVlN4cnlSYWZoblp1U1czZXhEYXZkSUFxQnRuUHR0RzdVZktTR2lMaDBnNEh0b0c=',
    );
    expect(headers['Content-Type']).toEqual('application/x-www-form-urlencoded');
    expect(headers['isSkipNextRequest']).toEqual('true');
    expect(paramsRequest?.method).toEqual('POST');
  });

  it('Request access token if token have in storage', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: 'token',
    });

    fetchMock.mockOnceIf(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      JSON.stringify({
        access_token: 'new_access_token',
        token_type: 'new_token_type',
        expires_in: 1000,
      }),
    );

    const result = await client.requestAccessToken();
    expect(result.access_token).toEqual('new_access_token');
    expect(result.token_type).toEqual('new_token_type');
    expect(result.expires_in).toEqual(1000);

    const [[req1, paramsRequest]] = fetchMock.mock.calls;
    expect(req1).toEqual('https://api-m.sandbox.paypal.com/v1/oauth2/token');
    const headers = paramsRequest?.headers as any;
    expect(headers['Authorization']).toEqual(
      'Basic QVFwallkbjNmaXJfVTB2WlJRR1pTS3hPUk9NRHVPczFfVW1ZeDBTX1hzUncyWDk5Y09IUFk3VTVpSy13TE1Gby1fMkdKRGp6OWRNaWJ1RmU6RU5tX0dUUEFaYWt2UHI0S0RuN2NRTF9odUlIRXpORlJJVlN4cnlSYWZoblp1U1czZXhEYXZkSUFxQnRuUHR0RzdVZktTR2lMaDBnNEh0b0c=',
    );
    expect(headers['Content-Type']).toEqual('application/x-www-form-urlencoded');
    expect(headers['isSkipNextRequest']).toEqual('true');
    expect(paramsRequest?.method).toEqual('POST');
  });

  it('Request', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: { token_type: 'Bearer', access_token: 'token' },
    });

    const fetchRequest = fetchMock.mockOnceIf(
      'http://localhost:8080/testurl',
      JSON.stringify({
        request: true,
      }),
    );

    const result = await client.request('http://localhost:8080/testurl', 'POST', { test: 1 });
    expect(result).toBeDefined();
    expect(result.request).toEqual(true);
    const [[url, params]] = fetchRequest.mock.calls;
    expect(url).toEqual('http://localhost:8080/testurl');
    expect(params!.method).toEqual('POST');
    expect(params!.body).toEqual('{"test":1}');
    const headers = params!.headers as any;
    expect(headers['Content-Type']).toEqual('application/json');
    expect(headers['Authorization']).toEqual('Bearer token');
  });

  it('Request if isUrlEncoded', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: { token_type: 'Bearer', access_token: 'token' },
    });

    const fetchRequest = fetchMock.mockOnceIf(
      'http://localhost:8080/testurl',
      JSON.stringify({
        request: true,
      }),
    );

    const result = await client.request(
      'http://localhost:8080/testurl',
      'POST',
      { test: 1 },
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    );
    expect(result).toBeDefined();
    expect(result.request).toEqual(true);
    const [[url, params]] = fetchRequest.mock.calls;
    expect(url).toEqual('http://localhost:8080/testurl');
    expect(params!.method).toEqual('POST');
    // @ts-ignore
    expect(params!.body.get('test')).toEqual('1');
    const headers = params!.headers as any;
    expect(headers['Content-Type']).toEqual('application/x-www-form-urlencoded');
    expect(headers['Authorization']).toEqual('Bearer token');
    expect(headers['Authorization']).toEqual('Bearer token');
  });

  it('Request if isPaypalUrlAut equal false', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: { token_type: 'Bearer', access_token: 'token' },
    });

    const fetchRequest = fetchMock
      .mockOnceIf(
        'http://localhost:8080/testurl',
        JSON.stringify({
          request: true,
        }),
      )
      .mockOnceIf(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        JSON.stringify({
          access_token: 'new_access_token',
          token_type: 'new_token_type',
          expires_in: 1000,
        }),
      );

    const result = await client.request(
      'http://localhost:8080/testurl',
      'POST',
      { test: 1 },
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      false,
    );
    expect(result).toBeDefined();
    expect(result.request).toEqual(true);
    const [[url, params]] = fetchRequest.mock.calls;
    expect(url).toEqual('http://localhost:8080/testurl');
    expect(params!.method).toEqual('POST');
    // @ts-ignore
    expect(params!.body.get('test')).toEqual('1');
    const headers = params!.headers as any;
    expect(headers['Content-Type']).toEqual('application/x-www-form-urlencoded');
    expect(headers['Authorization']).toBeUndefined();
  });

  it('Request if error and should get auth token', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: { token_type: 'Bearer', access_token: 'token' },
    });

    const fetchRequest = fetchMock
      .mockOnceIf('http://localhost:8081/testurl', JSON.stringify({ request: false }), {
        status: 401,
      })
      .mockOnceIf(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        JSON.stringify({
          access_token: 'new_access_token',
          token_type: 'new_token_type',
          expires_in: 1000,
        }),
      )
      .mockOnceIf(
        'http://localhost:8081/testurl',
        JSON.stringify({
          request: true,
        }),
      );

    const result = await client.request('http://localhost:8081/testurl', 'POST', { test: 1 });
    expect(result).toBeDefined();
    expect(result.request).toEqual(true);
    const [
      [firstRequestUrl, firstRequestParams],
      [twoRequestUrl, twoRequestParams],
      [threeRequestUrl, threeRequestParams],
    ] = fetchRequest.mock.calls;
    expect(firstRequestUrl).toEqual('http://localhost:8081/testurl');
    expect(firstRequestParams!.method).toEqual('POST');
    expect(firstRequestParams!.body).toEqual('{"test":1}');
    const firstHeaders = firstRequestParams!.headers as any;
    expect(firstHeaders['Content-Type']).toEqual('application/json');
    expect(firstHeaders['Authorization']).toEqual('Bearer token');

    expect(twoRequestUrl).toEqual('https://api-m.sandbox.paypal.com/v1/oauth2/token');
    expect(twoRequestParams!.method).toEqual('POST');
    // @ts-ignore
    expect(twoRequestParams!.body.get('grant_type')).toEqual('client_credentials');
    const twoHeaders = twoRequestParams!.headers as any;
    expect(twoHeaders['Content-Type']).toEqual('application/x-www-form-urlencoded');
    expect(twoHeaders['Authorization']).toEqual(
      'Basic QVFwallkbjNmaXJfVTB2WlJRR1pTS3hPUk9NRHVPczFfVW1ZeDBTX1hzUncyWDk5Y09IUFk3VTVpSy13TE1Gby1fMkdKRGp6OWRNaWJ1RmU6RU5tX0dUUEFaYWt2UHI0S0RuN2NRTF9odUlIRXpORlJJVlN4cnlSYWZoblp1U1czZXhEYXZkSUFxQnRuUHR0RzdVZktTR2lMaDBnNEh0b0c=',
    );

    expect(threeRequestUrl).toEqual('http://localhost:8081/testurl');
    expect(threeRequestParams!.method).toEqual('POST');
    // @ts-ignore
    expect(threeRequestParams!.body).toEqual('{"test":1}');
    const treeHeaders = threeRequestParams!.headers as any;
    expect(treeHeaders['Content-Type']).toEqual('application/json');
    expect(treeHeaders['Authorization']).toEqual('new_token_type new_access_token');
  });

  it('Request if error and is skip next request', async () => {
    client.storage.create({
      key: 'paypal-access-token',
      data: { token_type: 'Bearer', access_token: 'token' },
    });

    const fetchRequest = fetchMock.mockOnceIf(
      'http://localhost:8080/testurl',
      JSON.stringify({ message: 'error message' }),
      { status: 401 },
    );

    try {
      const result = await client.request('http://localhost:8080/testurl', 'POST', { test: 1 }, {
        isSkipNextRequest: true,
      } as any);
      expect(result).toBeUndefined();
    } catch (e: any) {
      expect(e.message).toEqual('error message');
    }

    expect(fetchRequest.mock.calls).toHaveLength(1);
    const [[firstRequestUrl, firstRequestParams]] = fetchRequest.mock.calls;
    expect(firstRequestUrl).toEqual('http://localhost:8080/testurl');
    expect(firstRequestParams!.method).toEqual('POST');
    expect(firstRequestParams!.body).toEqual('{"test":1}');
    const firstHeaders = firstRequestParams!.headers as any;
    expect(firstHeaders['Content-Type']).toEqual('application/json');
    expect(firstHeaders['Authorization']).toEqual('Bearer token');
  });
});
