import { Context, ContextImpl, TypeContextInfo } from '../context';
import { PortsDescription } from './noflo/types';

export type ScriptNode = (...params: any[]) => any;

export interface NodeEngineContextOptions {
  ports: PortsDescription;
}

export type NodeEngineTypeContextInfo = TypeContextInfo<ScriptNode, NodeEngineContextOptions>;

export interface NodeEngineTypeContext extends Context<ScriptNode, NodeEngineContextOptions> {}

export class NodeEngineTypeContextImpl
  extends ContextImpl<ScriptNode, NodeEngineContextOptions>
  implements NodeEngineTypeContext {}
