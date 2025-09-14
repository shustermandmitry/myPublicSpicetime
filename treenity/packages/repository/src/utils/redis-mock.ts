import { MemoryService, MemoryServiceOptions } from '@feathersjs/memory';

export default class RedisMock extends MemoryService {
  key: string | undefined;
  useData: boolean = false;
  useDataField!: string;

  constructor(options: MemoryServiceOptions & { useData?: boolean, useDataField?: string }) {
    const { id, startId } = options;
    super({ ...options, startId: startId || 1 });
    this.key = id;
    this.useData = options.useData ?? this.useData;
    this.useDataField = options.useDataField ?? this.useDataField;
  }

  async get(key: string) {
    if (this.useData) {
      const data = await super._get(key);
      if (this.useDataField) {
        return { data: data[this.useDataField] };
      }
      return { data };
    }
    return await super._get(key);
  }

  async create(data: any) {
    const result = await super._create(data);
    return this.get(result[this.key || 'id'].toString());
  }
}
