/**
 * Comment out code under 'use client' and 'use server' if environment not match
 * @param isBrowser
 * @return {{transform: ((function(*, *): (null|{code: *, map: *}))|*), name: string}}
 *
 * @example
 * // 'use client' single line comment out of next line
 * import './api/some.client';
 *
 * // start 'use server' multi line comment out. can write comments here
 * import './api/some.server';
 * import './api/other.server';
 * // end 'use server'
 */
export default function isomorphicReplace(isBrowser) {
  return {
    name: 'isomorphic-import-replace',
    transform: function (code, id) {
      const updCode = replaceMatched(code, isBrowser);
      if (updCode === code) return null;

      return {
        code: updCode,
        map: this.getCombinedSourcemap(),
      };
    },
  };
}

function commentOut(str) {
  return str
    .split('\n')
    .map(s => '// ' + s)
    .join('\n');
}

const MULTILINE = /\/\/\s+start 'use (client|server)'.*?\n([\s\S]+?)\/\/\s+end 'use \1'/gm;
const SINGLELINE = /\/\/\s+'use (client|server)'.*?\n([\s\S]+?)/g;

function replaceMatched(js, isBrowser) {
  js = js.replace(MULTILINE, function (_, type, part) {
    if ((type === 'client') !== isBrowser) {
      part = commentOut(part);
    }
    if (part === 'server' && isBrowser) return commentOut(part);
    return `// start 'use ${type}'\n${part}\n// end 'use ${type}'`;
  });
  js = js.replace(SINGLELINE, function (_, type, part) {
    if ((type === 'client') !== isBrowser) {
      part = commentOut(part);
    }
    if (part === 'server' && isBrowser) return commentOut(part);
    return `// 'use ${type}'\n${part}`;
  });
  return js;
}
