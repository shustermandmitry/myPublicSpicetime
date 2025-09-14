export interface PortsDescription {
  in: Record<string, Omit<ISocket, 'name'> | string>;
  out: Record<string, Omit<ISocket, 'name'> | string>;
}

export interface ISocket<D extends any = {}> {
  id?: string;
  name: string;
  label?: string;
  type: string;
  required?: boolean;
  dynamic?: boolean;
  value?: D;
  isComplex?: boolean;
}

export interface ISocketType {
  name?: string;
  label: string;
  type: string;
}
