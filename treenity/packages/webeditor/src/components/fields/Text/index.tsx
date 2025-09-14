import { useCustomField } from '@/components/fields/shared/hooks/use-custom-field';
import type { CustomField as ICustomField } from '@/types/fields';

import { Input } from '@treenity/admin-components/components';
import { observer } from 'mobx-react-lite';

import { FieldWrapper } from '../shared/wrapper';

const TextField: ICustomField['render'] = observer(({ name, field }) => {
  const { localValue, handleChange } = useCustomField<string>({
    name,
  });

  return (
    <FieldWrapper label={field.label || name}>
      <Input
        value={localValue}
        placeholder={field.label || name}
        onChange={e => handleChange(e.target.value)}
      />
    </FieldWrapper>
  );
});

export default TextField;
