import { evaluate } from './htm-build.mjs';
import html from 'htm';
import { parseJSX } from './jsx-parser-claude.mjs';
import { build } from './htm-build.mjs';

const MODE_NONE = 0;
const MODE_STRING = 1;
const MODE_COMMENT = 3;
const MODE_COMMENT_MULTI = 4;

let mode = MODE_NONE;
let quote = '';

function checkString(c: string, c1: string) {
  if (mode === MODE_STRING) {
    if (c === quote) {
      mode = MODE_NONE;
    } else if (c === '\\') {
      // escape char - skip one
      return 2;
    }
    return 1;
  }
  if (mode === MODE_COMMENT) {
    if (c === '\n') {
      mode = MODE_NONE;
    }
    return 1;
  }
  if (mode === MODE_COMMENT_MULTI) {
    if (c === '*' && c1 === '/') {
      mode = MODE_NONE;
      return 2;
    }
    return 1;
  }
  if (c === `'` || c === '"' || c === '`') {
    mode = MODE_STRING;
    quote = c;
    return 1;
  }
  if (c === '/' && (c1 === '/' || c1 === '*')) {
    mode = c1 === '/' ? MODE_COMMENT : MODE_COMMENT_MULTI;
    return 1;
  }
}

function fixHtmlInnerCode(code: string): string {
  const inners: number[] = [];
  let prev = 0;
  let fixedCode = '';
  for (let i = 0; i < code.length; i++) {
    const c = code[i];

    // skip strings
    const l = checkString(c, code[i + 1]);
    if (l) {
      i += l - 1;
      continue;
    }

    if (c === '{') {
      inners.push(i);
    } else if (c === '}') {
      const start = inners.pop() || 0;
      if (inners.length !== 0) continue;
      const end = i;
      fixedCode += code.slice(prev, start + 1);
      fixedCode += jsxToHtm(code.slice(start + 1, end));
      prev = end;
    }
  }
  fixedCode += code.slice(prev);
  return fixedCode;
}

function splitHtmlToTokens(code: string): any[] {
  const inners: number[] = [];
  let prev = 0;
  let fixedCode: any[] = [];
  for (let i = 0; i < code.length; i++) {
    const c = code[i];

    // skip strings
    const l = checkString(c, code[i + 1]);
    if (l) {
      i += l - 1;
      continue;
    }

    if (c === '{') {
      inners.push(i);
    } else if (c === '}') {
      const start = inners.pop() || 0;
      if (inners.length !== 0) continue;
      const end = i;
      fixedCode.push(code.slice(prev, start));
      fixedCode.push({ __code: jsxToHtm(code.slice(start + 1, end)) });
      prev = end + 1;
    }
  }
  fixedCode.push(code.slice(prev));
  return fixedCode;
}

const s = (value: any): string => {
  if (value && typeof value.__code === 'string') {
    return value.__code;
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(
      Object.fromEntries(Object.entries(value).map(([k, v]: [string, any]) => [k, s(v)] as any)),
    );
  }
  return typeof value === 'string' ? `"${value}"` : value;
};
//
const isCapitalRegex = /^[A-Z]/;
//
function h(tag: any, props: any, ...children: any) {
  tag = isCapitalRegex.test(tag) ? tag : `"${tag}"`;
  return `h(${tag}, ${props}, ${children.map(s).join(', ')})`;
}
// function h(tag: any, props: any, ...children: any) {
//   return {
//     __code:
//       `\nh(` +
//       (isCapitalRegex.test(tag) ? tag : `"${tag}"`) +
//       (props || children.length ? ', ' + s(props) : '') +
//       (children.length ? `, ${children.map(s)}` : '') +
//       ')',
//   };
// }
// const htm = html.bind(h);

export function jsxToHtm(execCode: string): string {
  const tags: number[] = [];
  let prev = 0;
  let fixedCode = '';
  for (let i = 0; i < execCode.length; i++) {
    const c = execCode[i];
    const c2 = execCode[i + 1];

    // skip strings
    const l = checkString(c, c2);
    if (l) {
      i += l - 1;
      continue;
    }

    if (c === '<' && c2 !== '/') {
      tags.push(i);
    } else if ((c === '<' && c2 === '/') || (c === '/' && c2 === '>')) {
      const start = tags.pop()!;
      const end = c === '<' ? execCode.indexOf('>', i) + 1 : i + 2;
      if (!tags.length) {
        fixedCode += execCode.slice(prev, start);
        const code = splitHtmlToTokens(execCode.slice(start, end));
        fixedCode += evaluate(h, build(code), code, []);
        prev = end;
        i = prev;
      }
    }
  }
  fixedCode += execCode.slice(prev);
  return fixedCode;
}

export function minify(strs: TemplateStringsArray, ...objs: any[]): string {
  let res = strs[0];
  for (let i = 0; i < objs.length; i++) {
    res += objs[i].toString() + strs[i + 1];
  }
  return res.trim().split('\n').join(' ');
}
