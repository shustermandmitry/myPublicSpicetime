/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { ListTagsType } from './types';

export const tagsListText = [
  'a',
  'abbr',
  'address',
  'b',
  'bdi',
  'bdo',
  'blockquote',
  'cite',
  'code',
  'del',
  'dfn',
  'em',
  'figcaption',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'ins',
  'kbd',
  'label',
  'legend',
  'mark',
  'output',
  'p',
  'pre',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'small',
  'strong',
  'sub',
  'summary',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
];
export const tagsListForm = [
  'button',
  'datalist',
  'fieldset',
  'form',
  'input',
  'label',
  'legend',
  'meter',
  'option',
  'optgroup',
  'select',
  'textarea',
];
export const tagsListStructure = [
  'article',
  'aside',
  'body',
  'div',
  'footer',
  'header',
  'hgroup',
  'main',
  'nav',
  'section',
];
export const tagsListTable = [
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'caption',
  'col',
  'colgroup',
];
export const tagsListMultimedia = [
  'audio',
  'video',
  'img',
  'map',
  'area',
  'source',
  'track',
  'figure',
  'figcaption',
  'picture',
];
export const tagsListScripts = ['style', 'link', 'script', 'noscript'];
export const tagsListMeta = ['meta', 'title', 'base', 'noscript', 'link'];
export const tagsListEmbedding = ['embed', 'iframe', 'object', 'param'];

export const tagsList = (type: ListTagsType) => {
  const list =
    type === 'text'
      ? tagsListText
      : type === 'form'
        ? tagsListForm
        : type === 'structure'
          ? tagsListStructure
          : type === 'table'
            ? tagsListTable
            : type === 'multimedia'
              ? tagsListMultimedia
              : type === 'scripts'
                ? tagsListScripts
                : type === 'meta'
                  ? tagsListMeta
                  : tagsListEmbedding;

  return list.map(tag => ({ label: tag, value: tag }));
};

export const VISIBILITY_OPTIONS = [
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
];
