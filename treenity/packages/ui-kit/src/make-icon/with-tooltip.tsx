import { Tooltip } from 'antd';
import { FC, ReactNode } from 'react';
import Icon from './Icon';
import { IIcon } from './types';

export function makeIconWithTooltip<T extends string[]>(iconsNames: T): FC<IIcon<T>> {
  const iconNamesHash: Record<string, boolean> = {};
  iconsNames.forEach(name => {
    iconNamesHash[name] = true;
  });

  return function IconWithTooltip<T extends string[]>(props: IIcon<T>) {
    const error = !props.name ? (
      'icon not found, name is not correct'
    ) : !iconNamesHash[props.name] ? (
      <>
        Type for icon <b>{props.name}</b> not found
      </>
    ) : undefined;

    if (error) return <ErrorTooltip error={error} />;

    return <Icon {...props} />;
  };
}

const DefaultIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
    <path
      fill="#fa6900"
      d="M60 256v512c0 108 88 196 196 196h512c108 0 196-88 196-196V256c0-108-88-196-196-196H256C148 60 60 148 60 256zm452 9c24 0 43 19 43 42v205a43 43 0 1 1-86 0V307c0-23 19-42 43-42zm0 356c24 0 43 19 43 43v2a43 43 0 1 1-86 0v-2c0-24 19-43 43-43z"
    />
  </svg>
);

const ErrorTooltip: FC<{ error: ReactNode }> = ({ error }) => (
  <Tooltip title={error} getPopupContainer={() => document.body}>
    <div style={{ width: 24 }}>
      <DefaultIcon />
    </div>
  </Tooltip>
);
