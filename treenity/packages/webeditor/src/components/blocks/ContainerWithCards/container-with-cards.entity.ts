import {
  type ContainerWithCardsTFCProps,
  DEFAULT_CONTAINER_WITH_CARDS_LIST,
  DEFAULT_CONTAINER_WITH_CARDS_TEXT,
  DEFAULT_CONTAINER_WITH_CARDS_TITLE,
  DEFAULT_CONTAINER_WITH_CARDS_TYPE,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const ContainerWithCardsType = metaType<ContainerWithCardsEntity>(
  'layout.containerWithCards',
);

@entity(ContainerWithCardsType)
export class ContainerWithCardsEntity {
  /** @title Title */
  title: ContainerWithCardsTFCProps['title'] = DEFAULT_CONTAINER_WITH_CARDS_TITLE;
  /** @title Text*/
  text: ContainerWithCardsTFCProps['text'] = DEFAULT_CONTAINER_WITH_CARDS_TEXT;
  /** @title Cards */
  list: ContainerWithCardsTFCProps['list'] = DEFAULT_CONTAINER_WITH_CARDS_LIST;
  /** @title Type */
  type: ContainerWithCardsTFCProps['type'] = DEFAULT_CONTAINER_WITH_CARDS_TYPE;
}
