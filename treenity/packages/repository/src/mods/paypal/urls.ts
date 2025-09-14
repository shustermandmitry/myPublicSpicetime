interface IUrl {
  method: string;
  url: string;
}

// create order -> order authorize -> payment capture -> refund payment

interface IPayPalUrl {
  order: {
    create: IUrl;
    authorize: IUrl;
    capture: IUrl;
  };
  payment: {
    capture: IUrl;
    refund: IUrl;
    void: IUrl;
  };
  webhook: {
    create: IUrl;
    remove: IUrl;
    get: IUrl;
    list: IUrl;
    verify: IUrl;
    simulate: IUrl;
  };
  auth: {
    createToken: IUrl;
  };
  invoice: {
    create: IUrl;
    generateNumber: IUrl;
    send: IUrl;
  };
}

const getFullUrl = (url: string): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  // const baseUrl = isProduction ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const baseUrl = isProduction
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  return baseUrl + url;
};

export const PayPalUrls: IPayPalUrl = {
  order: {
    create: {
      url: getFullUrl('/v2/checkout/orders'),
      method: 'POST',
    },
    authorize: {
      url: getFullUrl('/v2/checkout/orders/:order_id/authorize'),
      method: 'POST',
    },
    capture: {
      url: getFullUrl('/v2/checkout/orders/:order_id/capture'),
      method: 'POST',
    },
  },
  payment: {
    capture: {
      url: getFullUrl('/v2/payments/authorizations/:authorization_id/capture'),
      method: 'POST',
    },
    refund: {
      url: getFullUrl('/v2/payments/captures/:capture_id/refund'),
      method: 'POST',
    },
    void: {
      url: getFullUrl('/v2/payments/authorizations/:authorization_id/void'),
      method: 'POST',
    },
  },
  webhook: {
    create: {
      url: getFullUrl('/v1/notifications/webhooks'),
      method: 'POST',
    },
    verify: {
      url: getFullUrl('/v1/notifications/verify-webhook-signature'),
      method: 'POST',
    },
    simulate: {
      url: getFullUrl('/v1/notifications/simulate-event'),
      method: 'POST',
    },
    remove: {
      url: getFullUrl('/v1/notifications/webhooks/:webhook_id'),
      method: 'DELETE',
    },
    get: {
      url: getFullUrl('/v1/notifications/webhooks/:webhook_id'),
      method: 'GET',
    },
    list: {
      url: getFullUrl('/v1/notifications/webhooks'),
      method: 'GET',
    },
  },
  auth: {
    createToken: {
      url: getFullUrl('/v1/oauth2/token'),
      method: 'POST',
    },
  },
  invoice: {
    create: {
      url: getFullUrl('/v2/invoicing/invoices'),
      method: 'POST',
    },
    generateNumber: {
      url: getFullUrl('/v2/invoicing/generate-next-invoice-number'),
      method: 'POST',
    },
    send: {
      url: getFullUrl(`/v2/invoicing/invoices/:invoiceId/send`),
      method: 'POST',
    },
  },
};
