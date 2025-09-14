import { serviceManager } from '../../../../tree/services/server';
import { warn } from '../../../../utils/log';
import { inlineKeyboard } from '../../../brahman/keyboard';
import { createUserContext } from '../../utils/create-update';
import TimersServiceMeta from '../timers/timers.service.meta';
import TelegramActionCoursesOrders, {
  TelegramActionSupplyCourses,
} from './TelegramActionSupplyCourses.meta';
import { TelegramCoursesOperator } from './TelegramCoursesOperator.meta';

function diffDatesMin(end, start) {
  return Math.trunc((end - start) / (60 * 1000));
}

function getOperatorMetaFromNodes(nodes) {
  return nodes.map(node => node.getMeta(TelegramCoursesOperator));
}

function getTimersService(node) {
  const timersServiceNode = node.findAllParents({ '_m._t': 'timers.service' })[0];
  const timersMeta = timersServiceNode.getMeta(TimersServiceMeta);
  const timersService = serviceManager.services[timersMeta._id];

  if (!timersService) {
    warn('TG-SET-TIMER', 'timers service not started');
    return;
  }

  return timersService;
}

TelegramActionSupplyCourses.extend({
  helpers: {
    setTimer(ctx, cmd, client) {
      const timersService = getTimersService(this.node());
      const fireAt = new Date(Date.now() + this.timeForAccept * 1000); // get msec

      timersService.setTimer(
        client._id,
        this._id,
        'fireTimer',
        {
          cmd,
          client,
        },
        fireAt,
      );
    },

    async fireTimer({ cmd, client }) {
      const botNode = this.node().findAllParents({ '_m._t': 'tg.telegram' })[0];
      const ctx = createUserContext(botNode, client.operatorId);
      return this.menu(ctx, cmd, client, client.operatorId).then(() => client.save());
    },

    stopTimer(client) {
      const timersService = getTimersService(this.node());
      timersService.cancelTimer(client._id);
    },

    async menu(ctx, cmd, client, operatorId) {
      const btn = (text, cmd, operator_id) => ({
        text,
        callback_data: `${client._id},${cmd},${operator_id}`,
      });

      const sendOperator = (msg, ...rows) => {
        return ctx.telegram.sendMessage(client.operatorId, msg, {
          ...inlineKeyboard(rows),
          parse_mode: 'HTML',
        });
      };

      const sendToOperatorChat = (msg, ...rows) => {
        return ctx.telegram.sendMessage(this.chatId, msg, {
          ...inlineKeyboard(rows),
          parse_mode: 'HTML',
        });
      };

      const replyUser = (msg, ...rows) => {
        return ctx.telegram.sendMessage(client.chatId, msg);
      };

      const updateOperatorOrder = (msg, ...rows) => {
        return ctx.telegram.editMessageText(
          client.operatorId,
          client.operatorFirstMessageId,
          undefined,
          msg,
          {
            ...inlineKeyboard(rows),
            parse_mode: 'HTML',
          },
        );
      };

      const updateOperatorOrderInOperatorsChat = (msg, ...rows) => {
        return ctx.telegram.editMessageText(
          this.chatId,
          client.operatorsChatFirstMessageId,
          undefined,
          msg,
          {
            ...inlineKeyboard(rows),
            parse_mode: 'HTML',
          },
        );
      };

      const operatorsNode = this.node().findAllChildren({ '_m._t': 'tg.academy.operator' });

      if (operatorsNode.length === 0) return replyUser('Не найдено доступных операторов');

      const operatorsMeta = getOperatorMetaFromNodes(operatorsNode);
      const operatorsNumber = operatorsMeta.length;
      switch (cmd) {
        case 'ac_end':
          if (operatorId !== client.operatorId) {
            return;
          }
          const operatorContext = createUserContext(ctx.botNode, client.operatorId);
          if (this.actionOperatorEnd) {
            this.actionOperatorEnd.run(operatorContext);
          }
          const userContext = createUserContext(ctx.botNode, client.chatId);
          if (this.actionUserEnd) {
            this.actionUserEnd.run(userContext);
          }
          client.state = 'end';
          client.duration = diffDatesMin(new Date(), client.startedAt);
          const completedOperatorMeta = operatorsMeta[client.operatorNumber];
          completedOperatorMeta.duration += client.duration;
          completedOperatorMeta.completed += 1;
          completedOperatorMeta.node().save();
          await replyUser(`Продолжительность консультации : ${client.duration} мин.`);
          await sendOperator(`Продолжительность консультации : ${client.duration} мин.`);
          const operatorInformation = await ctx.telegram.getChatMember(
            this.chatId,
            client.operatorId,
          );
          await updateOperatorOrder(`Вы закончили консультацию для @${client.alias}`);
          await ctx.telegram.deleteMessage(client.operatorId, client.forwardMessageId);
          await updateOperatorOrderInOperatorsChat(
            `@${operatorInformation.user.username} закончил консультацию.`,
          );
          return;
        case 'ac_deny':
        case 'ac_deny_by_time':
          this.stopTimer(client);
          await ctx.telegram.deleteMessage(client.operatorId, client.operatorFirstMessageId);
          client.wasSkipped += 1;
          client.save();
          const newOperatorNodeId = (client.number + client.wasSkipped) % operatorsNumber;
          const newOperator = operatorsMeta[newOperatorNodeId];
          const newOperatorInfo = await ctx.telegram.getChatMember(this.chatId, newOperator.userId);
          client.operatorId = newOperatorInfo.user.id;
          await updateOperatorOrderInOperatorsChat(
            `Получена новая заявка на консультацию для @${newOperatorInfo.user.username}`,
          );
          const newOpMsg = await sendOperator(`Вы получили новую заявку на консультацию!`, [
            btn('Принять', 'ac_accept', newOperatorInfo.user.id),
            btn('Отклонить', 'ac_deny'),
          ]);
          client.operatorFirstMessageId = `${newOpMsg.message_id}`;
          client.operatorNumber = newOperatorNodeId;
          client.save();
          this.setTimer(ctx, 'ac_deny_by_time', client);
          return;
        case 'ac_accept':
          this.stopTimer(client);
          await replyUser(
            `Оператор @${ctx.callbackQuery.from.username} принял вашу заявку, в ближайшее время он с вами свяжется.`,
          );
          const forwardMessage = await ctx.telegram.forwardMessage(
            client.operatorId,
            client.chatId,
            client.firstMessageId,
          );
          client.forwardMessageId = forwardMessage.message_id;
          await updateOperatorOrder(
            `Вы приняли зявку от @${client.alias}. Приступайте к консультации.`,
            [btn('Закончить консультацию', 'ac_end')],
          );
          client.startedAt = new Date();
          return;
        case 'start':
          await replyUser(`Номер вашего заказа - ${client.number}`);
          await replyUser('Ожидайте принятия заявки оператором.');
          const operatorNodeId = client.number % operatorsNumber;
          const operator = operatorsMeta[operatorNodeId];
          const operatorInfo = await ctx.telegram.getChatMember(this.chatId, operator.userId);
          const operatorChatMessage = await sendToOperatorChat(
            `Получена новая заявка на консультацию для @${operatorInfo.user.username}`,
          );
          client.operatorId = operatorInfo.user.id;
          const opMsg = await sendOperator(`Вы получили новую заявку на консультацию!`, [
            btn('Принять', 'ac_accept', operatorInfo.user.id),
            btn('Отклонить', 'ac_deny'),
          ]);
          client.operatorFirstMessageId = `${opMsg.message_id}`;
          client.operatorNumber = operatorNodeId;
          client.operatorsChatFirstMessageId = `${operatorChatMessage.message_id}`;
          if (operatorsNumber > 1) {
            this.setTimer(ctx, 'ac_deny_by_time', client);
          }
          return;
      }
    },

    async run(ctx) {
      const clientOrder = TelegramActionCoursesOrders.findOne({
        chatId: `${ctx.chat.id}`,
        state: 'started',
      });
      if (clientOrder) {
        return ctx.reply('Ожидайте, ваша заявка уже обрабатывается.');
      }
      let client = new TelegramActionCoursesOrders({
        chatId: `${ctx.chat.id}`,
        alias: `${ctx.from.username}`,
        state: 'started',
        firstMessageId: `${ctx.session.lastMessageId}`,
        number: TelegramActionCoursesOrders.find().count() + 1,
      });
      client.save();

      ctx.queries[client._id] = {
        action: this._id,
      };

      await this.menu(ctx, 'start', client);
      client.save();
    },

    callback(ctx) {
      if (!ctx.callbackQuery) {
        return;
      }

      const [clientId, cmd] = ctx.callbackQuery.data.split(',');
      const client = TelegramActionCoursesOrders.findOne({ _id: clientId });
      if (!client) {
        warn('CREATE-ORDER', 'client not found', clientId, cmd);
        return;
      }
      const operatorId = ctx.callbackQuery.from.id;
      return this.menu(ctx, cmd, client, operatorId).then(() => client.save());
    },
  },
});
