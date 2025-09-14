import { metaType } from '@treenity/core';

import { entity } from '../../entity-decorator';

export const MailServiceType = metaType<MailService>('mail.service');

@entity(MailServiceType)
export class MailService {
  server!: string;

  /**
   * @TJS-ignore
   */
  async sendEmail(params: { name: string; text: string }): Promise<void> {}
}
