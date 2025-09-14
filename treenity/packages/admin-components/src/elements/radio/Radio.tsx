import { Radio } from 'antd';
import { EditorProps } from '../EditorProps';
import { DEFAULT_OPTIONS_RADIO } from './default-data';
import { AntdRadioGroupProps } from './types';

const RadioTFC: EditorProps<AntdRadioGroupProps> = ({ mergedMeta }) => {
  return <Radio.Group {...mergedMeta} options={mergedMeta.options ?? DEFAULT_OPTIONS_RADIO} />;
};

export default RadioTFC;
