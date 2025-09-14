import type AggregationService from '@/mods/aggregation/aggregation.service';
import { metaType } from '@treenity/core';

/**
 * Some aggregation service type
 * @constructor
 */
export const AggregationServiceMetaType = <T, A, F extends string>() =>
  metaType<AggregationService<T, A, F>>('sys.aggregation');
