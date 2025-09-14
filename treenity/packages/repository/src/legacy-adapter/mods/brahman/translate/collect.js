import { get } from '@s-libs/micro-dash';

function getString(meta, field, startPath) {
  const str = get(meta, field);
  return {
    path: `${startPath}.${field}`,
    ...str,
  };
}

export function collectStrings(startNode) {
  const pages = startNode.findAllChildren({ '_m._t': 'tg.page' });

  const strings = [];

  function collect(m, startPath) {
    switch (m._t) {
      case 'tg.action.message':
      case 'tg.action.message.chat':
      case 'tg.action.question':
        strings.push(getString(m, 'text', startPath));
        if (m.rows) {
          m.rows.forEach((row, r) => {
            row.buttons.forEach((button, b) => {
              strings.push(getString(m, `rows.${r}.buttons.${b}.title`, startPath));
              if (button.action) {
                collect(button.action, `${startPath}.rows.${r}.buttons.${b}.action`);
              }
            });
          });
        }
        break;
      case 'tg.action.onError':
        if (m.action) collect(m.action, `${startPath}.action`);
        break;
    }
  }

  pages.forEach(p => {
    if (p.name[0] === '_') return;

    p._m.forEach(m => collect(m, `${p._id}.${m._id}`));
  });

  return strings;
}
