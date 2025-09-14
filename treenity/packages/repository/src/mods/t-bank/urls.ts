interface IUrl {
  method: string;
  url: string;
}

interface ITBankUrl {
  payment: {
    init: IUrl;
    confirm: IUrl;
    refund: IUrl;
  };
}

const getFullUrl = (url: string): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? 'https://securepay.tinkoff.ru' : 'https://securepay.tinkoff.ru';

  return baseUrl + url;
};

export const TBankUrls: ITBankUrl = {
  payment: {
    init: {
      url: getFullUrl('/v2/Init'),
      method: 'POST',
    },
    confirm: {
      url: getFullUrl('/v2/Confirm'),
      method: 'POST',
    },
    refund: {
      url: getFullUrl('/v2/Cancel'),
      method: 'POST',
    },
  },
};
