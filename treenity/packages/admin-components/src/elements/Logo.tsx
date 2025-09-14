import getBackgroundImageUrl from '@/utils/uploader/get-image-type';
import styled from '@emotion/styled';
import { Link } from '@remix-run/react';
import { useCurrentTheme } from '@treenity/ui-kit/theme';
import type { FC } from 'react';
import React from 'react';

/** @title Logo */
export interface ILogoProps {
  /** @title Image URL */
  image: {
    /**
     * @widget treenity.imageUploadInput
     * */
    light: string;
    /**
     * @widget treenity.imageUploadInput
     * */
    dark: string;
  };
  /**
   * @title Link
   * @widget treenity.selectLink
   * */
  link: string;
}

interface FooterLogoProps {
  logo: ILogoProps;
}

const Logo: FC<FooterLogoProps> = ({ logo }) => {
  const { themeName } = useCurrentTheme();
  const _logo = themeName === 'light' ? logo.image.light : logo.image.dark;

  return (
    <Link to={logo.link}>
      <Img src={getBackgroundImageUrl(_logo)} alt="logo" />
    </Link>
  );
};

const Img = styled.img`
  width: 100%;
  height: 32px;
  object-fit: contain;
  object-position: left;
`;

export default Logo;
