import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import { getImageUrl, omitProps } from '@treenity/ui-kit/utils';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import './styles/styles.css';
import { type Swiper as SwiperClass } from 'swiper/types';
import { EditorProps } from '../EditorProps';
import { CarouselProps } from './types';

const modules = [Autoplay, Navigation, Pagination, Mousewheel, Keyboard];

const CarouselTFC: EditorProps<CarouselProps> = ({
  mergedMeta: {
    list,
    widthImage,
    heightImage,
    navType,
    direction,
    hideNavigate,
    hidePagination,
    autoplay,
    loop,
    delay,
  },
}) => {
  const swiperRef = useRef<SwiperRef>(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    const swiper: SwiperClass = swiperRef.current.swiper;

    if (autoplay) {
      swiper.autoplay.start();
      if (typeof swiper.params.autoplay === 'object') {
        swiper.params.autoplay.delay = delay;
      }
    } else {
      swiper.autoplay.stop();
    }

    if (swiper.params.direction !== direction) {
      swiper.changeDirection(direction);
    }

    if (swiper.params.loop !== loop) {
      swiper.params.loop = loop;
      swiper.update();
    }

    if (swiper.params.pagination && typeof swiper.params.pagination === 'object') {
      const needUpdate =
        swiper.params.pagination.enabled === !hidePagination ||
        swiper.params.pagination.type !== navType;

      swiper.params.pagination = {
        ...swiper.params.pagination,
        enabled: !hidePagination,
        type: navType,
      };

      if (needUpdate) {
        swiper.pagination.destroy();
        swiper.pagination.init();
        swiper.pagination.update();
      }
    }

    swiper.update();
  }, [autoplay, delay, direction, loop, hideNavigate, hidePagination, navType]);

  const handlePrev = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
  }, []);

  const _navigation = useMemo(
    () => ({
      prevEl: navigationPrevRef.current,
      nextEl: navigationNextRef.current,
    }),
    [navigationPrevRef, navigationNextRef],
  );

  const _pagination = useMemo(
    () => ({
      enabled: !hidePagination,
      type: navType,
    }),
    [hidePagination, navType],
  );

  const _autoplay = useMemo(
    () =>
      autoplay
        ? {
            delay,
            disableOnInteraction: false,
          }
        : false,
    [autoplay, delay],
  );

  return (
    <SwiperStyled
      ref={swiperRef}
      direction={direction}
      cssMode={true}
      loop={loop}
      autoplay={_autoplay}
      grabCursor={true}
      navigation={_navigation}
      pagination={_pagination}
      modules={modules}
      keyboard={true}
      className="mySwiper"
    >
      {list.map((src, index) => {
        const _src = src.match(/https?:\/\//i) ? src : getImageUrl(heightImage, widthImage, src);

        return (
          <SwiperSlide key={`${index}-${src}`}>
            <ImageStyled heightImage={heightImage} src={_src} alt={src} />
          </SwiperSlide>
        );
      })}
      {!hideNavigate && (
        <>
          <ButtonWithIcon
            onClick={handlePrev}
            className="swiper-button-prev"
            type="secondary-filled"
            ref={navigationPrevRef}
            icon={<Icon name="arrow-top_outlined" rotate={-90} />}
          />
          <ButtonWithIcon
            onClick={handleNext}
            className="swiper-button-next"
            type="secondary-filled"
            ref={navigationNextRef}
            icon={<Icon name="arrow-top_outlined" rotate={90} />}
          />
        </>
      )}
    </SwiperStyled>
  );
};

const SwiperStyled = styled(Swiper)`
  .swiper-pagination-bullet-active,
  .swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
    background: ${p => p.theme.colorPrimary};
  }

  .swiper-lazy-preloader {
    border: 4px solid ${p => p.theme.colorPrimary};
  }

  .swiper-pagination-fraction {
    color: ${p => p.theme.contrastingColorText};
  }
`;

const ImageStyled = styled('img', omitProps('heightImage'))<{ heightImage: number }>`
  height: 100%;
  user-select: none;
`;

export default CarouselTFC;
