import getBackgroundImageUrl from '@/utils/uploader/get-image-type';
import styled from '@emotion/styled';
import { Link } from '@remix-run/react';
import type { FC } from 'react';
import React from 'react';

/**
 * @title Social
 * @default { "logo": "/svg/logo.svg", "link": "https://treenity.pro" }
 * */
export interface ISocialList {
  /**
   *  @title Logo
   * @widget treenity.imageUploadInput
   * */
  logo: string;
  /** @title Link */
  link: string;
}

interface SocialListProps {
  /** @title Social list */
  list: ISocialList[];
}

const SocialList: FC<SocialListProps> = ({ list, ...restProps }) => {
  return (
    <Root {...restProps}>
      {list.map((socialItem, index) => (
        <Link to={socialItem.link} key={`SocialList-${index}`}>
          <img src={getBackgroundImageUrl(socialItem.logo)} alt={socialItem.logo} />
        </Link>
      ))}
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  gap: 12px;

  & > a > img {
    width: 16px;
    height: 16px;
  }
`;

export default SocialList;
