import { NodeEngineTypeContext, NodeEngineTypeContextImpl } from './contexts/node-engine';
import { ObjectTypeContext, ObjectTypeContextImpl } from './contexts/object';
import { ProtoTypeContext, ProtoTypeContextImpl } from './contexts/proto';
import { ReactTypeContext, ReactTypeContextImpl } from './contexts/react-context';
import { ServiceTypeContext, ServiceTypeContextImpl } from './contexts/service';
import { getTypeCache } from './get-type-cache';

export interface ContextTypes {
  react: ReactTypeContext;
  jsSrv: ServiceTypeContext;
  proto: ProtoTypeContext;
  noflo: NodeEngineTypeContext;
  entity: ObjectTypeContext;
}

export const types: ContextTypes = getTypeCache() as ContextTypes;

new ReactTypeContextImpl('react');
new ProtoTypeContextImpl('proto');
new ServiceTypeContextImpl('jsSrv');
new NodeEngineTypeContextImpl('noflo');
new ObjectTypeContextImpl('entity');
