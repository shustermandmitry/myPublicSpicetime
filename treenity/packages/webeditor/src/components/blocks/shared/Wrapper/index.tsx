import { useLayout } from '@/context/LayoutContext';
import { useEntity } from '@/hooks/use-entity';
import type { RenderItemFunction, SharedProps } from '@/types';
import cssToReactStyles from '@/utils/css-to-react-styles';
import generateStyles from '@/utils/generate-styles';
import { useNode } from '@craftjs/core';
import { Render } from '@treenity/ui-kit';
import { observer } from 'mobx-react-lite';
import { type FC, PropsWithChildren } from 'react';

const WebEditorCell: FC<
  PropsWithChildren<
    {
      typeId?: string;
      id?: string;
      renderItem?: RenderItemFunction;
      initialState?: Record<string, unknown>;
    } & SharedProps
  >
> = observer(({ children, initialState, typeId, id: idProp, ...props }) => {
  const { id, type } = useNode(node => ({ type: node.data.name }));
  const { mergedMeta, entity } = useEntity(idProp ?? id, typeId ?? type, initialState);
  const { config, convertUrl } = useLayout();

  const style = mergedMeta?.styles ? cssToReactStyles(generateStyles(mergedMeta?.styles)) : null;
  if (!config || !mergedMeta) return <div>Loading..</div>;

  if (mergedMeta.hidden) return null;

  return (
    <Render
      value={entity}
      style={style}
      mergedMeta={mergedMeta}
      convertUrl={convertUrl}
      id={idProp ?? id}
      url={typeId ?? type}
    >
      {children}
    </Render>
  );
});

export default WebEditorCell;
