export function getToolbarRootElement(id: string) {
  const iframe = document.querySelector('iframe[data-rfd-iframe=true]') as
    | HTMLIFrameElement
    | undefined;
  if (!iframe) {
    return document.querySelector(`[data-rfd-draggable-id="draggable-${id}"]`);
  }

  return iframe?.contentWindow?.document.querySelector(`[data-rfd-draggable-id="draggable-${id}"]`);
}
