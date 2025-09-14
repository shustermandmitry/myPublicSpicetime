import { types } from '@treenity/core';
import { loadScript } from '@treenity/render-react';
import { Render, RenderURLProps } from '@treenity/ui-kit';
import * as React from 'react';
import { mutate } from 'swr';
import { RENDER_CONTEXT } from '@treenity/ui-kit';

export async function codeComponentLoader({ url, code }: RenderURLProps) {
  await loadScript(url, code, {
    Render,
    React,
    jtd(jtd: any) {
      const schema = {
        $id: url,
        type: 'object',
        ...jtd,
      }

      types.schema.add(url, schema, { replace: true });
    },
    add(component: any) {
      types.react.add(url, component, { replace: true });
      mutate(`render_${RENDER_CONTEXT.EDIT}_${url}`);
    },
    onError(err: any) {
      console.error('Cant load component', url, err);
    },
  });

  return await types.react.getInfo(url);
}
