import Input from '@/components/input';
import Switch from '@/components/switch';
import { minLength } from '@/utils/validation-rules';
import FormItem from '@/widgets/form-item';
import PanelItem from '@/widgets/panel-item';
import SelectIcon from '@/widgets/SelectIcon';

export const InputFormItems = () => {
  return (
    <>
      <PanelItem label="Icon">
        <FormItem name={['params', 'icon']}>
          <SelectIcon size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="Value">
        <FormItem name={['params', 'value']}>
          <Input placeholder="value" size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem align="center" label="Required">
        <FormItem name={['params', 'required']} valuePropName="checked">
          <Switch size="small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="maxLength">
        <FormItem name={['params', 'maxLength']} rules={[minLength()]}>
          <Input type="number" placeholder="100" size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="minLength">
        <FormItem name={['params', 'minLength']} rules={[minLength()]}>
          <Input type="number" placeholder="1" size="x-small" />
        </FormItem>
      </PanelItem>
    </>
  );
};

export const TextareaFormItems = () => {
  return (
    <>
      <PanelItem label="Icon">
        <FormItem name={['params', 'icon']}>
          <SelectIcon size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="Value">
        <FormItem name={['params', 'value']}>
          <Input placeholder="value" size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem align="center" label="Required">
        <FormItem name={['params', 'required']} valuePropName="checked">
          <Switch size="small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="minRows">
        <FormItem name={['params', 'minRows']}>
          <Input type="number" placeholder="1" size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="maxRows">
        <FormItem name={['params', 'maxRows']}>
          <Input type="number" placeholder="10" size="x-small" />
        </FormItem>
      </PanelItem>
    </>
  );
};

export const InputNumberFormItems = () => {
  return (
    <>
      <PanelItem label="Icon">
        <FormItem name={['params', 'icon']}>
          <SelectIcon size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="Value">
        <FormItem name={['params', 'value']}>
          <Input placeholder="value" size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem align="center" label="Required">
        <FormItem name={['params', 'required']} valuePropName="checked">
          <Switch size="small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="Max">
        <FormItem name={['params', 'max']} rules={[minLength()]}>
          <Input type="number" placeholder="100" size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="Min">
        <FormItem name={['params', 'min']} rules={[minLength()]}>
          <Input type="number" placeholder="1" size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="Step">
        <FormItem name={['params', 'step']} rules={[minLength(0.001)]}>
          <Input type="number" placeholder="1" size="x-small" />
        </FormItem>
      </PanelItem>
    </>
  );
};

export const CheckboxFormItems = () => {
  return (
    <>
      <PanelItem align="center" label="Checked">
        <FormItem name={['params', 'checked']} valuePropName="checked">
          <Switch size="small" />
        </FormItem>
      </PanelItem>
      <PanelItem align="center" label="Required">
        <FormItem name={['params', 'required']} valuePropName="checked">
          <Switch size="small" />
        </FormItem>
      </PanelItem>
    </>
  );
};

export const SelectFormItems = () => {
  return (
    <>
      <PanelItem label="Icon">
        <FormItem name={['params', 'icon']}>
          <SelectIcon size="x-small" />
        </FormItem>
      </PanelItem>
      <PanelItem label="Value">
        <FormItem name={['params', 'value']}>
          <Input placeholder="value" />
        </FormItem>
      </PanelItem>
    </>
  );
};
