import Switch, { type SwitchStyledProps } from '@/components/switch';
import { EditorProps } from '../EditorProps';

const SwitchTFC: EditorProps<SwitchStyledProps> = ({ mergedMeta }) => {
  return <Switch {...mergedMeta} />;
};

export default SwitchTFC;
