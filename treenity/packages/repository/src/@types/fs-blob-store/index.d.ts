declare module 'fs-blob-store' {
  import type { AbstractBlobStore } from 'abstract-blob-store';

  function fsBlobStore(directory: string): AbstractBlobStore;

  export = fsBlobStore; // Use `export =` syntax to specify what the module exports
}
