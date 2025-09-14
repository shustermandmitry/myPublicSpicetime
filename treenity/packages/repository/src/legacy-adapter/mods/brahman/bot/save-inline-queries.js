import { Meteor } from '../../../utils/meteor';

const Queries = new Meteor.Collection('tgcache');

const createCollectionProxy = col =>
  new Proxy(
    {},
    {
      set(t, prop, value) {
        if (value == undefined) col.remove(prop);
        else col.upsert({ _id: prop }, { v: value, d: new Date() });
      },
      get(t, prop, recv) {
        const data = col.findOne(prop);
        return data && data.v;
      },
      deleteProperty(t, prop) {
        col.remove(prop);
      },
    },
  );
const queries = createCollectionProxy(Queries);

const saveInlineQueries = (ctx, next) => {
  ctx.queries = queries;
  return next();
};

export default saveInlineQueries;
