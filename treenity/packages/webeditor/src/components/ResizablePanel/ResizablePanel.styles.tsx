import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';

export const DragOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
`;

export const PreviewWrapper = styled('section', omitProps('value', 'width'))<{
  width?: string | number;
}>`
  display: flex;
  position: relative;
  // width: ${p => (typeof p.width === 'string' ? p.width : `${p.width}px`)};
  border: 1px solid ${p => p.theme.colorPrimary};
  transition: filter 0.15s ease-out;
`;

export const ViewPortSizeDisplay = styled.div`
  color: ${p => p.theme.colorPrimary};
  font-weight: 600;
  font-size: 12px;
  margin: 13px 0 5px;
  line-height: 1;
`;

export const CustomHandle = styled.div<{ position?: 'right' | 'left' }>`
  position: absolute;
  ${p => (p.position === 'right' ? 'left: -4px;' : 'right: -4px;')}
  top: 50%;
  background: ${p => p.theme.colorPrimary};
  border-radius: 40px;
  width: 8px;
  height: 60px;
  z-index: 10;

  &:hover {
    scale: 1.5 1;
  }
`;

export const SizesPanelWrapper = styled('div')`
  display: flex;
  gap: 1rem;
`;
export const Container = styled('div', omitProps('width', 'height'))<{ width?: number }>`
  border: 1px solid ${p => p.theme.colorPrimary};
  width: ${props => props.width + 'px' || '100%'};
  /* overflow-y: clip; */
  position: absolute;
  top: 0;
  min-height: 400px;
  z-index: 10;
  bottom: 0;
`;

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
  overflow: hidden;
`;
