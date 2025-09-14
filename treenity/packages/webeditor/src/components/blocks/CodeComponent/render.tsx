import { CodeComponentEntity } from '@/components/blocks/CodeComponent/CodeComponent.entity';
import { TFC, Render as TRender } from '@treenity/ui-kit';

import type { CodeComponentProps } from './types';

import { Entity } from '@treenity/entity';
import { codeComponentLoader } from './loader';

export const Render: TFC<
  Entity<CodeComponentEntity>,
  { mergedMeta: Partial<CodeComponentProps>; id: string }
> = ({ mergedMeta, value, id }) => {
  return (
    <TRender
      value="DONT_REMOVE"
      {...mergedMeta.gen}
      key={value.code}
      url={id}
      code={value.code}
      id={id}
      loader={codeComponentLoader}
    />
  );
};
