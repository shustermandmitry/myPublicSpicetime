import styled from '@emotion/styled';
import { FC } from 'react';
import type {
  ArrayField,
  CustomField,
  Field as IField,
  ObjectField,
} from '../../../../types/fields';

interface FieldProps {
  baseKey: string;
  field: IField;
  showLabel?: boolean;
}

export const isArrayField = (field: FieldProps['field']): field is ArrayField =>
  field.type === 'array' && 'arrayFields' in field;
export const isObjectField = (field: FieldProps['field']): field is ObjectField =>
  field.type === 'object' && 'objectFields' in field;
const isCustomField = (field: FieldProps['field']): field is CustomField => field.type === 'custom';
const Title = styled.div`
  margin-top: 0.5rem;
  font-size: 12px;
  font-weight: 800;
  line-height: 12px;
  letter-spacing: -0.48px;
`;
const RootField = styled.div`
  & > *:not(:first-of-type) {
    margin-top: 0.375rem;
  }
`;
const ObjectContainer = styled.div`
  padding-left: 4px;
`;
export const Field: FC<FieldProps> = ({ baseKey, field, showLabel = true }) => {
  if (isObjectField(field)) {
    return (
      <RootField>
        {showLabel ? <Title>{field?.label}</Title> : null}
        {Object.entries(field.objectFields).map(([key, subField]) => {
          if (subField.type === 'custom' && subField.render) {
            // @ts-expect-error
            return <subField.render key={key} name={`${baseKey}.${key}`} field={subField} />;
          }
          if (subField.type === 'array' && subField.render) {
            // @ts-expect-error
            return <subField.render key={key} name={`${baseKey}.${key}`} field={subField} />;
          }
          if (subField.type === 'object') {
            return (
              <ObjectContainer>
                <Field key={key} baseKey={`${baseKey}.${key}`} field={subField} />
              </ObjectContainer>
            );
          }
        })}
      </RootField>
    );
  }

  if (isCustomField(field) || isArrayField(field)) {
    // @ts-ignore
    return <field.render key={baseKey} field={field} name={baseKey} />;
  }

  return null;
};
