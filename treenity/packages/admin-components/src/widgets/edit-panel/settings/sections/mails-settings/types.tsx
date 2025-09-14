/*
 * Copyright (c) 2024. Treenity Inc.
 */

export interface MailsSettingsProps {
  onChange?(value: IMailsSettingsValues): void;
  value?: IMailsSettingsValues;
}

export interface IMailsSettingsValues {
  acceptingApplications: boolean;
  email: string;
}
