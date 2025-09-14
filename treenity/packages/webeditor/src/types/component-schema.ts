export interface ComponentSchema {
  $type: string;
  children?: ComponentSchema | ComponentSchema[] | string;
  [key: string]: unknown;
}
