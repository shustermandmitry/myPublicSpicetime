export interface CarouselProps {
  list: string[];
  widthImage: number;
  heightImage: number;
  navType: 'bullets' | 'fraction';
  direction: 'horizontal' | 'vertical';
  hideNavigate: boolean;
  hidePagination: boolean;
  autoplay: boolean;
  loop: boolean;
  swipeGestures: boolean;
  delay: number;
}
