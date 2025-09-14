import { Meta } from '../../../../tree';

const TimersServiceMeta = Meta.inherit({
  name: 'timers.service',
  fields: {},
});
export default TimersServiceMeta;

export const Timer = Meta.inherit({
  name: 'timers.timer',
  fields: {
    metaId: {
      type: String,
    },
    method: {
      type: String,
    },
    params: {
      type: Object,
    },
    duration: {
      type: Number,
    },
    fireAt: {
      type: Date,
    },
  },
});
