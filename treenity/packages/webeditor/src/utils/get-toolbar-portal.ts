import { getToolbarRootElement } from '@/utils/get-toolbar-root-element';

export default function getToolbarPortal(id: string) {
  const root = getToolbarRootElement(id);
  return root?.querySelector('button')?.parentElement;
}
