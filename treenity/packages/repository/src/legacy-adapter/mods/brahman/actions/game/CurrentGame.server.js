import { CurrentGame } from './CurrentGame.meta';

CurrentGame.extend({
  helpers: {
    run(ctx) {
      const gameNode = ctx.botNode.findChildDeep({ '_m._id': `${this.menuId}` });
      const gameMeta = gameNode.getMetaByField({ _id: this.menuId });
      gameMeta.currentRound(ctx);
      console.log(this.menuId);
    },
  },
});
