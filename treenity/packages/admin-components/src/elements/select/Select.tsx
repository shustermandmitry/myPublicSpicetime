import Select, { type SelectStyledProps } from '@/components/select';
import { EditorProps } from '../EditorProps';
import { DEFAULT_OPTIONS_SELECT } from './default-data';

const SelectTFC: EditorProps<SelectStyledProps> = ({
  mergedMeta: { options = DEFAULT_OPTIONS_SELECT, ...restProps },
}) => {
  const _options = options.filter(selectItem => selectItem?.value && selectItem?.label);
  
  return <Select options={_options} {...restProps} />;
};

export default SelectTFC;
