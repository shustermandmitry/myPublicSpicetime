import { findLastIndex, promised } from '@treenity/js-shared/utils';
import { html } from 'htm/react';
import * as React from 'react';

export const loadedScripts: { [id: string]: any } = {};
// @ts-ignore
globalThis.__loadedScripts = loadedScripts;

interface Context {
  // html: typeof html;
  // React: typeof React;
  // require: (url: string) => Promise<any>;
  [key: string]: any;
}

interface LoadedScript {
  id: string;
  prom: Promise<any>;
  code: string;
  context: Context;
  ready: boolean;
  unload: () => void;
  onReady: () => void;
  onError: (err: any) => void;
  element?: HTMLScriptElement;
  error?: any;
}

function unload(id: string): void {
  if (loadedScripts[id]) {
    loadedScripts[id].element?.remove();
    delete loadedScripts[id];
  }
}

function fixHtmlInnerCode(code: string): string {
  const inners: number[] = [];
  let prev = 0;
  let fixedCode = '';
  for (let i = 0; i < code.length; i++) {
    const c = code[i];

    if (c === '{') {
      inners.push(i);
    } else if (c === '}') {
      const start = inners.pop() || 0;
      if (inners.length !== 0) continue;
      const end = i;
      fixedCode += code.slice(prev, start);
      fixedCode += '${' + jsxToHtm(code.slice(start + 1, end));
      prev = end;
    }
  }
  fixedCode += code.slice(prev);
  return fixedCode;
}

export function jsxToHtm(execCode: string): string {
  const tags: number[] = [];
  let prev = 0;
  let fixedCode = '';
  for (let i = 0; i < execCode.length; i++) {
    const c = execCode[i];
    const c2 = execCode[i + 1];
    if (c === '<' && c2 !== '/') {
      tags.push(i);
    } else if ((c === '<' && c2 === '/') || (c === '/' && c2 === '>')) {
      const start = tags.pop()!;
      const end = c === '<' ? execCode.indexOf('>', i) + 1 : i + 2;
      if (!tags.length) {
        fixedCode += execCode.slice(prev, start);
        fixedCode += '' + fixHtmlInnerCode(execCode.slice(start, end)) + '';
        prev = end;
        i = prev;
      }
    }
  }
  fixedCode += execCode.slice(prev);
  return fixedCode;
}

function minify(strs: TemplateStringsArray, ...objs: any[]): string {
  let res = strs[0];
  for (let i = 0; i < objs.length; i++) {
    res += objs[i].toString() + strs[i + 1];
  }
  return res.trim().split('\n').join(' ');
}

export function loadScript(id: string, code: string, context: Context): Promise<LoadedScript> {
  let loaded = loadedScripts[id] as LoadedScript;
  if (loaded) {
    if (loaded.code === code) {
      return loaded.prom || Promise.resolve(loaded);
    } else {
      unload(id);
    }
  }

  const prom = promised<LoadedScript>();
  loaded = {
    id,
    prom,
    code,
    context: {
      html,
      React,
      require: (url: string) => {
        return (globalThis as any).System.import(url);
      },
      ...context,
    },
    ready: false,
    unload() {
      unload(this.id);
    },
    onReady(this: any) {
      // @ts-ignore
      window.onerror = undefined;
      this.ready = true;
      context.onReady?.();
      this.prom.resolve(this);
      delete this.prom;
    },
    onError(this: any, err: any) {
      this.error = err;
      context.onError?.(err);
      this.prom.reject(err);
      delete this.prom;
    },
  };
  globalThis.onerror = err => loaded.onError(err);
  loadedScripts[id] = loaded;

  const codeLines = code.split('\n');
  const importsIdx = findLastIndex(codeLines, line => line.startsWith('import'));
  const imports = codeLines.slice(0, importsIdx + 1).join('\n');
  const execCode = codeLines.slice(importsIdx + 1).join('\n');
  const htmCode = jsxToHtm(execCode);
  let replaceDefaultCode = htmCode.replace(/export default/, 'const defaultComponent = ');
  if (replaceDefaultCode !== htmCode) {
    // add component if default export was replaced
    replaceDefaultCode += '\nadd(defaultComponent);';
  }

  const fixedCode = replaceDefaultCode;

  console.log(fixedCode);

  const loader = `${imports} ${minify`
  const __ls = window.__loadedScripts['${id}'];

  (async function() {
  try {
    const { useCSS, require, html, add, Render, React, ...context } = __ls.context;
    globalThis.React = React;
    globalThis.ReactDOM = React;
    `}
    ////////////// user code /////////////////

    ${fixedCode}

    ////////////// user code /////////////////
    ${minify`
    __ls.onReady();
  } catch (err) {
    __ls.onError(err);
  }
  })().catch(err => __ls.onError(err));
  //# sourceURL=${id}.js`}`;

  try {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = loader;
    loadedScripts[id].element = document.getElementsByTagName('head')[0].appendChild(script);
  } catch (err) {
    console.error('script', loaded, 'failed to load', err);
    loaded.onError(err);
  }

  return prom;
}
