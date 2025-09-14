import { Checkbox } from 'antd';
import { EditorProps } from '../EditorProps';
import { DEFAULT_OPTIONS_CHECKBOX } from './default-data';
import { AntdCheckboxProps } from './types';

const CheckboxTFC: EditorProps<AntdCheckboxProps> = ({ mergedMeta }) => {
  return (
    <Checkbox.Group {...mergedMeta} options={mergedMeta.options ?? DEFAULT_OPTIONS_CHECKBOX} />
  );
};

export default CheckboxTFC;
