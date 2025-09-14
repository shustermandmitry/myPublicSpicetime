import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import type { IframeHTMLAttributes, ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ReactIframeProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  children: ReactNode;
  title: string;
  blockLinks?: boolean;
}

const CACHE_KEY = 'edtr';

function cloneStyle(style: HTMLStyleElement, parent: HTMLElement) {
  const newSheet = style.cloneNode(true) as HTMLStyleElement;

  parent.appendChild(newSheet);

  Array.from(style.sheet?.cssRules || []).forEach(rule => {
    newSheet.sheet?.insertRule(rule.cssText, newSheet.sheet.cssRules.length);
  });

  return newSheet;
}

function observeStyleSheet(sheet: CSSStyleSheet, callback: (rule: string) => void) {
  const originalInsertRule = sheet.insertRule.bind(sheet);
  sheet.insertRule = (rule, index) => {
    callback(rule);
    return originalInsertRule(rule, index);
  };

  return () => {
    sheet.insertRule = originalInsertRule;
  };
}

function syncEmotionCache(cacheKey: string, iframeDoc: Document) {
  const emotionStyle = document.querySelector(
    `style[data-emotion=${cacheKey}]`,
  ) as HTMLStyleElement;

  if (!emotionStyle?.sheet) {
    console.warn('emotionStyle or iframe is not found, skipping cache sync');
    return;
  }

  const iframeStyle = cloneStyle(emotionStyle, iframeDoc.head);

  const iframeSheet = iframeStyle.sheet;
  if (!iframeSheet) {
    console.warn('iframeStyle is not found, skipping cache sync');
    return;
  }

  const cleanup = observeStyleSheet(emotionStyle.sheet, rule => {
    iframeSheet.insertRule(rule, iframeSheet.cssRules.length);
  });

  // Might need cleanup functions, not used atm
  return () => {
    cleanup();
    iframeStyle.remove();
  };
}

export const ReactIframe = ({
  children,
  title,
  blockLinks = false,
  ...props
}: ReactIframeProps) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const [cache, setCache] = useState<EmotionCache | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const iframeDoc = contentRef?.contentWindow?.document;

  useEffect(() => {
    if (!iframeDoc || !blockLinks) return;

    const controller = new AbortController();

    iframeDoc.addEventListener(
      'click',
      e => {
        const target = e.target as HTMLElement;
        const closestAnchor = target.closest('a');

        if (closestAnchor || target instanceof HTMLAnchorElement) {
          e.preventDefault();
          e.stopPropagation();
          console.warn('Link interaction is blocked in edit mode', target);
        }
      },
      { capture: true, signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, [iframeDoc, blockLinks]);

  const syncStyles = useCallback(() => {
    if (!iframeDoc) return;

    const existingStyles = new Set(
      Array.from(iframeDoc.head.querySelectorAll('style')).map(style => style.innerHTML),
    );

    document.head.querySelectorAll('style').forEach(style => {
      if (!existingStyles.has(style.innerHTML)) {
        const frameStyles = style.cloneNode(true);
        iframeDoc.head.appendChild(frameStyles);
      }
    });
  }, [iframeDoc]);

  useEffect(() => {
    if (!iframeDoc) return;

    setCache(
      createCache({
        key: CACHE_KEY,
        container: document.head,
      }),
    );
  }, [iframeDoc]);

  useLayoutEffect(() => {
    if (!iframeDoc) return;

    const headStyleObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        Array.from(mutation.addedNodes).forEach(node => {
          if (node instanceof HTMLStyleElement && node.getAttribute('data-emotion') === CACHE_KEY) {
            syncEmotionCache(CACHE_KEY, iframeDoc);
          }
        });
      });

      syncStyles();
    });

    headStyleObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    document.head.querySelectorAll('meta').forEach(meta => {
      const frameMeta = meta.cloneNode(true);
      iframeDoc.head.appendChild(frameMeta);
    });

    // Removes scrollbar from iframe
    iframeDoc.documentElement.style.scrollbarWidth = 'none';

    document.head.querySelectorAll('link[rel="stylesheet"]').forEach(stylesheet => {
      const frameStylesheet = stylesheet.cloneNode(true);
      iframeDoc.head.appendChild(frameStylesheet);
    });

    syncStyles();

    iframeDoc.body.classList.add('overflow-hidden');

    return () => {
      headStyleObserver.disconnect();
    };
  }, [iframeDoc, syncStyles]);

  const mountRef = useCallback((node: HTMLIFrameElement | null) => {
    setContentRef(node);
  }, []);

  return (
    <iframe title={title} id="canvas-iframe" {...props} ref={mountRef}>
      {cache ? (
        <CacheProvider value={cache}>
          {mountNode && createPortal(children, mountNode)}
        </CacheProvider>
      ) : (
        mountNode && createPortal(children, mountNode)
      )}
    </iframe>
  );
};
