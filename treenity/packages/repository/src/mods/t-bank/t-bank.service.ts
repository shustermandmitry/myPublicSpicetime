import {
  Application,
  feathersContext,
  TreenityService,
  Params,
  Conflict,
} from '@treenity/feathers-service';
import { TBankUrls } from './urls';
import { ServiceConstructorParams } from '@treenity/feathers-service';
import { TBankCreateDataEntity } from './entity';
import crypto from 'crypto';
import { TBankServiceMetaEntity } from '@/mods/t-bank/entity/tbank.entity';

class TBankService extends TreenityService<any> {
  password!: string;
  terminalKey!: string;
  webhookUrl!: string;
  webhookProxyUrl?: string;
  payType!: string;
  successUrl!: string;
  failUrl!: string;
  paymentObject!: string;
  paymentMethod!: string;
  taxation!: string;
  tax!: string;

  constructor({ meta }: ServiceConstructorParams<TBankServiceMetaEntity>) {
    super();
    this.password = meta.password ?? this.password;
    this.terminalKey = meta.terminalKey ?? this.terminalKey;
    this.webhookProxyUrl = meta.webhookProxyUrl ?? this.webhookProxyUrl;
    this.webhookUrl = meta.webhookUrl ?? this.webhookUrl;
    this.payType = meta.payType ?? this.payType;
    this.successUrl = meta.successUrl ?? this.successUrl;
    this.failUrl = meta.failUrl ?? this.failUrl;
    this.paymentObject = meta.paymentObject ?? this.paymentObject;
    this.paymentMethod = meta.paymentMethod ?? this.paymentMethod;
    this.taxation = meta.taxation ?? this.taxation;
    this.tax = meta.tax ?? this.tax;
  }

  convertUrl(url?: string, data?: object) {
    if (!url || !data) {
      return url;
    }

    Object.entries(data).forEach(([key, value]) => {
      url = url!.replace(`:${key}`, value);
    });
    return url;
  }

  async _setup(app: Application, path: string) {}

  async request<T = any>(
    url: string,
    method: string,
    body: Record<string, any>,
    _headers?: Record<string, string>,
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...(_headers || {}),
    } as Record<string, string>;

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 401) {
        throw new Error(
          (data as any)?.message || (data as any)?.error_description || 'Unauthorized',
        );
      }

      throw new Error((data as any).message);
    }

    const data = await res.json();
    if ('Success' in data && data.Success === false) {
      throw new Error(`${data.Message}, ${data.Details}`);
    }

    return data as T;
  }

  getToken(jsonObj: Record<string, any>) {
    const extractedItems: { key: string; value: any }[] = [
      { key: 'Password', value: this.password },
    ];
    for (const key in jsonObj) {
      const value = jsonObj[key];
      if (typeof value !== 'object' || value === null) {
        extractedItems.push({ key, value });
      }
    }

    extractedItems.sort((a, b) => a.key.localeCompare(b.key));

    const concatenatedValues = extractedItems.map(item => item.value).join('');
    const hash = crypto.createHash('sha256');
    hash.update(concatenatedValues, 'utf8');
    const hashedValue = hash.digest('hex');
    return hashedValue;
  }

  async refund(paymentId: string, amount: number) {
    const { url, method } = TBankUrls.payment.refund;
    const requestData: any = {
      TerminalKey: this.terminalKey,
      PaymentId: paymentId,
      Amount: amount ?? undefined,
    };

    const token = this.getToken(requestData);
    requestData.Token = token;

    const requestResult = await this.request(url, method, requestData);
    return requestResult.PaymentId;
  }

  async approveWithAuthorization(paymentId: string, amount: number) {
    const { url, method } = TBankUrls.payment.confirm;

    const requestData: any = {
      TerminalKey: this.terminalKey,
      PaymentId: paymentId,
      Amount: amount,
    };

    const token = this.getToken(requestData);
    requestData.Token = token;

    const requestResult = await this.request(url, method, requestData);
    return requestResult;
  }

  async createOrder(data: TBankCreateDataEntity) {
    const { url, method } = TBankUrls.payment.init;
    const { item, email, additional, amount, quantity, linkParams, lang, buyerId } = data;

    const requestData: any = {
      TerminalKey: this.terminalKey,
      Amount: amount,
      OrderId: additional.customId?.toString(),
      Description: item.description,
      PayType: this.payType,
      RedirectDueDate: data.dueDate,
      CustomerKey: buyerId.toString(),
      Language: lang === 'ru' ? 'ru' : 'en',
      DATA: {
        Email: email,
        ...additional,
      },
      Receipt: {
        Email: email,
        Taxation: this.taxation,
        Items: [
          {
            PaymentMethod: this.paymentMethod,
            PaymentObject: this.paymentObject,
            Name: item.title,
            Price: amount,
            Quantity: quantity,
            Amount: amount,
            Tax: this.tax,
          },
        ],
      },
      NotificationURL: this.webhookUrl,
      SuccessURL: this.convertUrl(this.successUrl, linkParams),
      FailURL: this.convertUrl(this.failUrl, linkParams),
    };

    const token = this.getToken(requestData);
    requestData.Token = token;
    const resultRequest = await this.request(url, method, requestData);
    return {
      paymentLink: resultRequest.PaymentURL,
      id: resultRequest.PaymentId,
      twoStagePayment: this.payType === 'T',
      ...resultRequest,
    };
  }

  async verifyWebhook(data: any, params: Params) {
    const { Token, ...json } = data;
    const token = this.getToken(json);
    if (token !== Token) {
      throw new Conflict(
        `Webhook t-bank verification failed with outer token: ${token} and our token ${Token}`,
      );
    }
  }

  async create(data: any, params: Params) {
    await this.verifyWebhook(data, params);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.webhookProxyUrl) {
      const response = await this.request(
        this.webhookProxyUrl,
        'POST',
        {
          ...data,
          paymentSystem: 't-bank',
        },
        headers,
      );

      return response.result;
    }
    return 'OK';
  }
}

feathersContext.add('t-bank.service', TBankService);

export default TBankService;
