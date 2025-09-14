import { TextContent } from '@/components/typography';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { IHeaderHeaderContactsList } from '../types';

interface ContactsHeaderProps {
  contacts: IHeaderHeaderContactsList;
}

const ContactsHeader: FC<ContactsHeaderProps> = ({ contacts, ...restProps }) => {
  return (
    <div {...restProps}>
      <TextContent size={8} fontWeight={600} color="gray700">
        {contacts.address}
      </TextContent>
      <LinkStyled href={`tel:${contacts.phoneNumber}`}>
        <TextContent size={12} fontWeight={700} color="colorTextBase">
          {contacts.phoneNumber}
        </TextContent>
      </LinkStyled>
    </div>
  );
};

const LinkStyled = styled.a`
  text-decoration: none;
`;

export default ContactsHeader;
