import {
  mergeNestedProps,
  transformPathProps,
  mergeResponsiveProps,
} from '@/utils/merge-responsive-props';

describe('Prop transformation and merging utilities', () => {
  describe('transformPathProps function', () => {
    it('should handle empty objects', () => {
      expect(transformPathProps({})).toStrictEqual({});
    });

    it('should handle mixing of dot notation and array notation', () => {
      const input = {
        'users[0].address.street': 'Main St',
        'users[0].address.city': 'New York',
        'users[1].address.street': 'Broadway',
        'users[1].address.city': 'Los Angeles',
      };
      const expected = {
        users: [
          {
            address: {
              street: 'Main St',
              city: 'New York',
            },
          },
          {
            address: {
              street: 'Broadway',
              city: 'Los Angeles',
            },
          },
        ],
      };
      expect(transformPathProps(input)).toStrictEqual(expected);
    });

    it('should handle deeply nested paths', () => {
      const input = {
        'a.b.c.d.e': 'value',
        'a.b.c.d.f': 'another value',
      };
      const expected = {
        a: {
          b: {
            c: {
              d: {
                e: 'value',
                f: 'another value',
              },
            },
          },
        },
      };
      expect(transformPathProps(input)).toStrictEqual(expected);
    });

    it('should handle deeply nested paths', () => {
      const input = {
        'a.b.c.d.e': 'value',
        'a.b.c.d.f': 'another value',
      };
      const expected = {
        a: {
          b: {
            c: {
              d: {
                e: 'value',
                f: 'another value',
              },
            },
          },
        },
      };
      expect(transformPathProps(input)).toStrictEqual(expected);
    });
    it('should correctly convert dot notation and array index paths to nested object structure', () => {
      const testObject = {
        health: 50,
        'link.title': 'linkTitle',
        'link.href': 'linkHref',
        'path[0].title': 'title',
        'path[0].link.title': 'linkTitle',
        'path[0].link.href': 'linkHref',
        'path[1].title': 'title2',
        'path[1].otherProp': 'otherProp',
      };

      const resultObject = {
        health: 50,
        link: {
          title: 'linkTitle',
          href: 'linkHref',
        },
        path: [
          { title: 'title', link: { title: 'linkTitle', href: 'linkHref' } },
          { title: 'title2', otherProp: 'otherProp' },
        ],
      };

      expect(transformPathProps(testObject)).toStrictEqual(resultObject);
    });

    it('should exclude specified properties when transforming path props', () => {
      const testObject = {
        health: 50,
        'link.title': 'linkTitle',
        'link.href': 'linkHref',
        'path[0].title': 'title',
        'path[0].link.title': 'linkTitle',
        'path[0].link.href': 'linkHref',
        'path[1].title': 'title2',
        'path[1].otherProp': 'otherProp',
      };

      expect(transformPathProps(testObject, { exclude: ['path'] })).toStrictEqual({
        health: 50,
        link: {
          title: 'linkTitle',
          href: 'linkHref',
        },
      });

      expect(transformPathProps(testObject, { exclude: ['path', 'health'] })).toStrictEqual({
        link: {
          title: 'linkTitle',
          href: 'linkHref',
        },
      });
    });
  });

  describe('mergeResponsiveProps function', () => {
    it('should handle empty objects for some breakpoints', () => {
      const input = {
        sm: { prop: 'sm value' },
        md: {},
        lg: { prop: 'lg value' },
      };
      expect(mergeResponsiveProps(input, 'lg')).toStrictEqual({ prop: 'lg value' });
    });
    it('should correctly merge nested objects across breakpoints', () => {
      const input = {
        sm: { nested: { prop1: 'sm value' } },
        md: { nested: { prop2: 'md value' } },
        lg: { nested: { prop1: 'lg value', prop3: 'lg value' } },
      };
      const expected = {
        nested: {
          prop1: 'lg value',
          prop2: 'md value',
          prop3: 'lg value',
        },
      };
      expect(mergeResponsiveProps(input, 'lg')).toStrictEqual(expected);
    });

    it('should merge responsive props correctly based on breakpoint priorities', () => {
      const testObject = {
        sm: { title: 'title sm' },
        md: { title2: 'title2 md' },
        lg: { title: 'title lg' },
        xl: { title2: 'title2 xl' },
        xxl: { title3: 'title3' },
      };

      expect(mergeResponsiveProps(testObject, 'sm')).toStrictEqual({
        title: 'title sm',
        title2: 'title2 md',
        title3: 'title3',
      });
    });

    it('should handle merging of props with missing breakpoints', () => {
      const testObj2 = { sm: { prop1: 'sm' }, lg: { prop3: 'lg' } };

      // @ts-ignore
      expect(mergeResponsiveProps(testObj2, 'lg')).toStrictEqual({
        prop1: 'sm',
        prop3: 'lg',
      });

      // @ts-ignore
      expect(mergeResponsiveProps(testObj2, 'sm')).toStrictEqual({
        prop1: 'sm',
        prop3: 'lg',
      });
    });

    it('should correctly merge props for the largest breakpoint', () => {
      const testObject = {
        sm: { title: 'title sm' },
        md: { title2: 'title2 md' },
        lg: { title: 'title lg' },
        xl: { title2: 'title2 xl' },
        xxl: { title3: 'title3' },
      };

      expect(mergeResponsiveProps(testObject, 'xxl')).toStrictEqual({
        title: 'title lg',
        title2: 'title2 xl',
        title3: 'title3',
      });
    });
  });

  describe('Combined transformPathProps and mergeResponsiveProps', () => {
    it('should correctly transform and merge complex nested responsive props', () => {
      const arrayTypeOverrides = {
        sm: {
          'plans[0].title': 'title sm',
        },
        md: {
          'plans[0].body': 'body',
        },
        lg: {
          'plans[1].title': 'title',
          'plans[1].link.title': 'link title',
          'plans[1].link.url': 'link url',
          'plans[2].title': 'lg title 2',
        },
        xl: {},
        xxl: {
          'plans[0].title': 'laskldaslkdsakld',
          'plans[0].body': 'Идеальный план для начинающих',
          'plans[0].price': 'Free',
          'plans[0].description': 'Сделайте свой сайт и разместите его на домене Treenity.',
          'plans[0].featured': true,
          'plans[1].title': 'Продвинутый XXL !!!!!',
          'plans[1].body': 'План для опытных пользователей',
          'plans[1].price': '990 руб / месяц',
          'plans[1].description':
            'Используйте адаптивные шаблоны, чтобы создать уникальный сайт и размещайте его на на любом домене.',
          'plans[2].title': 'Продвинутый',
          'plans[2].body': 'Продвинутый',
          'plans[2].price': '499 руб',
          'plans[2].featured': false,
          'plans[2].description': 'фывфыв',
        },
      };
      expect(transformPathProps(mergeResponsiveProps(arrayTypeOverrides, 'xl'))).toStrictEqual({
        plans: [
          {
            title: 'title sm',
            body: 'body',
            price: 'Free',
            description: 'Сделайте свой сайт и разместите его на домене Treenity.',
            featured: true,
          },
          {
            title: 'title',
            body: 'План для опытных пользователей',
            link: {
              title: 'link title',
              url: 'link url',
            },
            price: '990 руб / месяц',
            description:
              'Используйте адаптивные шаблоны, чтобы создать уникальный сайт и размещайте его на на любом домене.',
          },
          {
            title: 'lg title 2',
            body: 'Продвинутый',
            price: '499 руб',
            featured: false,
            description: 'фывфыв',
          },
        ],
      });
    });
  });

  describe('correctly merges nested default props with overrides for different screen sizes', () => {
    const defaultOverrides = { sm: {}, md: {}, lg: {}, xl: {}, xxl: {} };
    it('', () => {
      const defaultProps = { a: 4, b: [{ c: 2 }, { c: 6 }], d: { e: 4 } };

      const overrides = {
        ...defaultOverrides,
        sm: {
          'b[0].c': 1,
        },
        lg: {
          a: 2,
          'b[2].c': 2,
          'd.b': 6,
          'd.c.a': 10,
        },
        xxl: {
          'b[3].c': 6,
          'b[0].c': 4,
        },
      };

      expect(mergeNestedProps(defaultProps, overrides, 'lg')).toMatchObject({
        a: 2,
        b: [{ c: 1 }, { c: 6 }, { c: 2 }, { c: 6 }],
        d: { b: 6, e: 4, c: { a: 10 } },
      });

      expect(mergeNestedProps(defaultProps, overrides, 'xxl')).toMatchObject({
        a: 2,
        b: [{ c: 4 }, { c: 6 }, { c: 2 }, { c: 6 }],
        d: { b: 6, e: 4, c: { a: 10 } },
      });
    });
  });
});
