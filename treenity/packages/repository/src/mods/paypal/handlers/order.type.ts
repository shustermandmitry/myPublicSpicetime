import { FromSchema } from '@treenity/feathers-service';

const PaypalOrderResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    intent: {
      type: 'string',
      enum: ['AUTHORIZE', 'CAPTURE'],
    },
    status: {
      type: 'string',
      enum: ['CREATED', 'APPROVED', 'VOIDED', 'COMPLETED'],
    },
    paymentLink: {
      type: 'string',
    },
    purchase_units: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          reference_id: {
            type: 'string',
          },
          amount: {
            type: 'object',
            properties: {
              currency_code: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
              breakdown: {
                type: 'object',
                properties: {
                  item_total: {
                    type: 'object',
                    properties: {
                      currency_code: {
                        type: 'string',
                      },
                      value: {
                        type: 'string',
                      },
                    },
                    required: ['currency_code', 'value'],
                  },
                },
                required: ['item_total'],
              },
            },
            required: ['currency_code', 'value', 'breakdown'],
          },
          payee: {
            type: 'object',
            properties: {
              email_address: {
                type: 'string',
              },
              merchant_id: {
                type: 'string',
              },
            },
            required: ['email_address', 'merchant_id'],
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                unit_amount: {
                  type: 'object',
                  properties: {
                    currency_code: {
                      type: 'string',
                    },
                    value: {
                      type: 'string',
                    },
                  },
                  required: ['currency_code', 'value'],
                },
                quantity: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
              },
              required: ['name', 'unit_amount', 'quantity'],
            },
          },
        },
        required: ['amount', 'payee', 'items'],
      },
    },
    create_time: {
      type: 'string',
      format: 'date-time',
    },
    links: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          href: {
            type: 'string',
            format: 'uri',
          },
          rel: {
            type: 'string',
            enum: ['self', 'payer-action'],
          },
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PATCH'],
          },
        },
        required: ['href', 'rel', 'method'],
      },
    },
  },
  required: ['id', 'intent', 'status', 'purchase_units', 'create_time', 'links'],
} as const;

export type PayPalOrderResponse = FromSchema<typeof PaypalOrderResponseSchema>;
