import { entity, writeMethod } from '@treenity/entity';
import { SeedToken } from 'antd/es/theme/interface';

@entity('webeditor.seed-theme')
export class SeedThemeEntity {
  seed!: Partial<SeedToken>;

  @writeMethod
  updateConfig(config: Partial<SeedToken>) {
    Object.assign(this.seed, config);
  }
}
