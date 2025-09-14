import { set } from '@s-libs/micro-dash';
import { Node } from '../../../tree';

import { notNull } from '../../../utils/assert';

import { BotTranslate } from './BotTranslate.meta';

BotTranslate.extend({
  metaMethods: {
    saveTranslation(id, lang, text) {
      const [nodeId, metaId, ...path] = id.split('.');
      const node = notNull(Node.findOne(nodeId), 'node not found');
      const meta = notNull(node.getMetaById(metaId));
      path.push(lang);
      set(meta, path, text);

      node.save();
    },
  },
});
