import { Application } from '@/declarations';
import {
  NotificationTemplateService,
  NotificationTemplateServiceType,
} from '@/mods/notification/template.meta';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { awaitService, feathersContext, TreenityService } from '@treenity/feathers-service';
import { IMailData, MailServiceMeta } from './mail.meta';

export * from './mail.meta';

class MailService extends TreenityService {
  private notifyService: NotificationTemplateService = null!;
  company: string = null!;
  handler: string = null!;
  defaultLang: string = null!;

  constructor({ meta }: ServiceConstructorParams<MailServiceMeta>) {
    super();
    this.company = meta.company;
    this.handler = meta.handler;
    this.defaultLang = meta.defaultLang;
  }

  async _setup(app: Application, path: string) {
    this.notifyService = await awaitService(
      app,
      '/sys/notification/template',
      NotificationTemplateServiceType,
    );
  }

  async create(data: IMailData): Promise<void> {
    const { title, slug, receiver, ...otherData } = data;
    const mailParams = {
      title,
      handler: this.handler,
      slug,
      data: {
        receiver,
        params: {
          ...otherData,
          lang: this.defaultLang,
          year: String(new Date().getFullYear()),
          company: this.company,
        },
      },
    };

    try {
      await this.notifyService.send(mailParams);
    } catch (e) {
      console.warn('Failed to send mail', e);
    }
  }
}

feathersContext.add('sys.mail', MailService);

export default MailService;
