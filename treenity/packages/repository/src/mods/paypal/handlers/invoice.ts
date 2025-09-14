import { PayPalUrls } from '@/mods/paypal/urls';
import { PaypalApiClient } from '@/mods/paypal/handlers/client';
import { IdRequest } from '@/utils';
import { set } from '@s-libs/micro-dash';
import { Conflict } from '@treenity/feathers-service';
import { PaypalCreateDataEntity } from '@/mods/paypal/entity/paypal.create-data.entity';
import { PaypalConfigEntity } from '@/mods/paypal/entity/paypal.config.entity';
import { PaypalServiceMetaEntity } from '@/mods/paypal/entity/paypal.entity';

export type IPaypalInvoiceConfig = Pick<PaypalConfigEntity, 'invoice'>['invoice'] &
  Pick<PaypalConfigEntity, 'currencyCode'> &
  Pick<PaypalServiceMetaEntity, 'domainName'>;

export class PaypalInvoiceHandler {
  private apiClient: PaypalApiClient;
  private config: IPaypalInvoiceConfig;

  constructor(client: PaypalApiClient, config: IPaypalInvoiceConfig) {
    this.apiClient = client;
    this.config = config;
  }

  async generateInvoiceNumber(): Promise<number> {
    const { url, method } = PayPalUrls.invoice.generateNumber;
    const response = await this.apiClient.request<{ invoice_number: number }>(
      url as string,
      method,
      {},
    );
    const { invoice_number } = response;
    return invoice_number;
  }

  async createInvoice(data: PaypalCreateDataEntity): Promise<string> {
    const { url, method } = PayPalUrls.invoice.create;
    const headers = {};
    set(headers, ['Prefer'], 'return=representation');
    const invoice_number = await this.generateInvoiceNumber();
    const { item, amount, email, createDate, dueDate, userName, quantity, additional } = data;
    const { description, title } = item;

    const body = {
      detail: {
        invoice_number: invoice_number,
        invoice_date: createDate, // now date
        payment_term: {
          term_type: 'DUE_ON_DATE_SPECIFIED', //TODO: in meta The payment for the invoice is due upon receipt of the invoice.
          due_date: dueDate,
        },
        currency_code: this.config.currencyCode,
      },
      invoicer: {
        name: {
          given_name: this.config.domainName,
        },
        website: data.website,
        additional_notes: JSON.stringify(additional),
      },
      primary_recipients: [
        {
          billing_info: {
            name: {
              given_name: userName,
              surname: userName,
            },
            email_address: email,
          },
        },
      ],
      items: [
        {
          name: title,
          description: description, //Participants append
          quantity: quantity?.toString(),
          unit_amount: {
            currency_code: this.config.currencyCode,
            value: amount,
          },
          unit_of_measure: 'QUANTITY',
        },
      ],
    };

    const response = await this.apiClient.request<IdRequest<string>>(
      url as string,
      method,
      body,
      headers,
    );
    const { id } = response;

    return id;
  }

  async sendInvoice(data: PaypalCreateDataEntity): Promise<{ paymentLink: string; id: string }> {
    const { url: _url, method } = PayPalUrls.invoice.send;
    const invoiceId = await this.createInvoice(data);
    if (!invoiceId) {
      throw new Conflict('Failed to create invoice');
    }

    const url = _url.replace(':invoiceId', invoiceId);
    const body = {
      subject: this.config.mailSubject,
      note: this.config.mailNote,
      send_to_recipient: this.config.sendToRecipient,
      send_to_invoicer: this.config.sendToInvoicer,
    };

    const { href } = await this.apiClient.request(url, method, body);
    return { paymentLink: href, id: invoiceId };
  }
}
