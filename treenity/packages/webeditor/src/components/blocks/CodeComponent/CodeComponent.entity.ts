/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { ChatMessage } from '@/utils/openai';
import { types } from '@treenity/core';
import { entity, writeMethod } from '@treenity/entity';

@entity('basic.codeComponent')
export class CodeComponentEntity {
  typeId?: string;
  ready: boolean = false;
  prompt: string = '';
  code: string =
    'add(() => <div style={{ margin: 16, fontWeight: 600 }}>You can start generating the component by going to the AI Gen. tab or just start typing here.</div>)';
  expert: boolean = false;
  ai: {
    messages: (ChatMessage & { code?: string })[] | [];
  } = {
    /**
     * @widget treenity.empty
     */
    messages: [],
  };
  appliedCode: string = '';
  gen: any = {}; // ai-generated props

  @writeMethod
  changeCode(code: string) {
    this.code = code;
  }

  @writeMethod
  update(data: Partial<CodeComponentEntity>) {
    Object.assign(this, data);
  }
}

const getCodeComponentSchema = ({ $id }: { $id: string }) => types.schema.getSync($id)?.component;
types.schema.add('dynamic', CodeComponentEntity, getCodeComponentSchema as any, {});
