import { useLayout } from '@/context/LayoutContext';
import findClosestSize from '@/utils/find-closest-size';

export default function useCurrentScreenSize() {
  const { layout } = useLayout();
  return findClosestSize(layout.panelWidth);
}
