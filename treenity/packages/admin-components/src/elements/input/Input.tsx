import Input, { InputStyledProps } from '@/components/input';
import { EditorProps } from '../EditorProps';

const InputTFC: EditorProps<InputStyledProps> = ({ mergedMeta }) => {
  return <Input {...mergedMeta} />;
};

export default InputTFC;
