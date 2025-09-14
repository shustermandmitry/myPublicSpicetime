'use server';

import { entity, method, writeMethod } from '../../decorators';
import { MyIdeal } from './ideal.entity';
import { MailService } from './mail-service.entity';

@entity(MyIdeal, 'server')
export class MyIdealEntityServer extends MyIdeal {
  mailService!: MailService;

  @writeMethod
  async changeAge(newAge: number) {
    this.age = newAge;
  }

  @method
  async sendEmail({ text }: { text: string }) {
    await this.mailService.sendEmail({ name: this.name, text });
    // server-code here
    console.log('sending email', text);

    return true;
  }
}
