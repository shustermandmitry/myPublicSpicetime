import { transformPuckData } from '@/utils/transform-puck-data';

import type { Data } from '@measured/puck';
import type { Meta } from '@treenity/core';

type PuckData = Data & Meta;

const testData = {
  $id: 'randomid',
  $name: 'puckRandomId',
  $type: 'puck',
  content: [
    {
      type: 'header',
      props: {
        links: [{}, {}, {}],
        cta: {
          link: '',
          title: 'Попробовать бесплатно',
        },
        customStyles: '',
        spacing: {
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
        id: 'header-9fed51e0-3e14-46af-b08b-a908892e69bf',
      },
    },
    {
      type: 'hero',
      props: {
        title: 'TREENITY',
        body: 'Конструктор интерфейсов для вашего бизнеса',
        align: 'center',
        link: {
          title: 'Хочу создать сайт',
          url: 'https://google.com',
        },
        customStyles: '',
        spacing: {
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
        id: 'hero-d212ac4f-dee9-4ce9-a94f-b0fd7767f768',
      },
    },
    {
      type: 'plans',
      props: {
        plans: [
          {
            title: 'Базовый',
            body: 'Для начинающих',
            price: 'Free',
            featured: false,
            link: {
              title: 'Начать',
              url: '',
            },
            description: 'Сделайте свой сайт и разместите его на домене Treenity.',
          },
          {
            title: 'Продвинутый',
            body: 'План для опытных пользователей',
            price: '99 руб.',
            'price-comment': '/ месяц',
            featured: true,
            link: {
              title: 'Начать',
              url: '',
            },
            description:
              'Используйте адаптивные шаблоны, чтобы создать уникальный сайт и размещайте его на на любом домене.',
          },
        ],
        customStyles: '',
        spacing: {
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
        id: 'plans-68fe5189-2282-4f1e-ad76-9cf4b6316e8b',
      },
    },
  ],
  root: {
    props: {
      maxWidth: 1200,
      title: 'Treenity Puck',
      colors: {
        colorPrimary: '#10b981',
        backgroundSecondary: '#f8fafc',
        background: '#ffffff',
      },
      id: 'root-1200',
    },
  },
  zones: {
    'header-9fed51e0-3e14-46af-b08b-a908892e69bf:header-links-0': [],
    'header-9fed51e0-3e14-46af-b08b-a908892e69bf:header-links-1': [
      {
        type: 'link',
        props: {
          href: '',
          text: 'Link',
          customStyles: '',
          spacing: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
          },
          id: 'link-0d20ddef-dd4f-459e-a64a-469f5541a595',
        },
      },
    ],
    'header-9fed51e0-3e14-46af-b08b-a908892e69bf:header-links-2': [],
  },
};

describe('transform puck data', () => {
  it('should handle empty content and zones', () => {
    const input: PuckData = {
      $id: 'empty',
      $name: 'emptyTest',
      $type: 'puck',
      content: [],
      root: { props: { id: 'root-empty' } },
      zones: {},
    };

    const result = transformPuckData(input);

    expect(result).toEqual(input);
  });
  it('should correctly transform puck data', () => {
    const result = transformPuckData(testData);
    expect(result).toStrictEqual({
      $id: 'randomid',
      $name: 'puckRandomId',
      $type: 'puck',
      content: [
        {
          type: 'header',
          props: {
            links: [{}, {}, {}],
            id: 'header-9fed51e0-3e14-46af-b08b-a908892e69bf',
          },
        },
        {
          type: 'hero',
          props: {
            id: 'hero-d212ac4f-dee9-4ce9-a94f-b0fd7767f768',
          },
        },
        {
          type: 'plans',
          props: {
            plans: [{}, {}],
            id: 'plans-68fe5189-2282-4f1e-ad76-9cf4b6316e8b',
          },
        },
      ],
      root: {
        props: {
          id: 'root-1200',
        },
      },
      zones: {
        'header-9fed51e0-3e14-46af-b08b-a908892e69bf:header-links-0': [],
        'header-9fed51e0-3e14-46af-b08b-a908892e69bf:header-links-1': [
          {
            type: 'link',
            props: {
              id: 'link-0d20ddef-dd4f-459e-a64a-469f5541a595',
            },
          },
        ],
        'header-9fed51e0-3e14-46af-b08b-a908892e69bf:header-links-2': [],
      },
    });
  });

  it('should handle multiple content types and zones', () => {
    const input: PuckData = {
      $id: 'multiple',
      $name: 'multipleTest',
      $type: 'puck',
      content: [
        {
          type: 'header',
          props: {
            id: 'header-1',
            links: [{ url: 'https://example.com' }, { url: 'https://example.org' }],
          },
        },
        {
          type: 'paragraph',
          props: {
            id: 'para-1',
            text: 'Some text',
          },
        },
      ],
      root: { props: { id: 'root-multiple' } },
      zones: {
        'zone-1': [
          {
            type: 'button',
            props: {
              id: 'button-1',
              text: 'Click me',
              style: { color: 'red' },
            },
          },
        ],
        'zone-2': [],
      },
    };

    const result = transformPuckData(input);

    expect(result).toEqual({
      $id: 'multiple',
      $name: 'multipleTest',
      $type: 'puck',
      content: [
        {
          type: 'header',
          props: {
            id: 'header-1',
            links: [{}, {}],
          },
        },
        {
          type: 'paragraph',
          props: {
            id: 'para-1',
          },
        },
      ],
      root: { props: { id: 'root-multiple' } },
      zones: {
        'zone-1': [
          {
            type: 'button',
            props: {
              id: 'button-1',
            },
          },
        ],
        'zone-2': [],
      },
    });
  });
});
