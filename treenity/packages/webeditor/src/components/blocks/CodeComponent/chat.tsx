import { CodeComponentEntity } from '@/components/blocks/CodeComponent/CodeComponent.entity';
import { Button } from '@treenity/admin-components/components';
import * as React from 'react';
import { useRef } from 'react';

import updateEntity from '@/utils/update-entity';
import styled from '@emotion/styled';
import { message as toast } from 'antd';

import useCurrentScreenSize from '@/hooks/use-current-screen-size';
import { aiChatStore } from '@/store/ai-chat';
import { ChatMessage, generateCodeFromPrompt } from '@/utils/openai';
import { Entity } from '@treenity/entity';
import { observer } from 'mobx-react-lite';

const LoadingDots = styled.span`
  position: absolute;
  top: 6px;
  left: 34px;
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;

const InputWrapper = styled.form`
  position: relative;
  width: 100%;
  margin-top: 0.25rem;
  position: relative;

  .ai-icon {
    position: absolute;
    top: 6px;
    left: 10px;
    color: ${props => props.theme.colorPrimary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding-inline: 34px 10px;
  padding-block: 6px;
  border-radius: 6px;
  border: 1px solid #e9e8ee;
  background: #ffffff;
  font-size: 14px;
  padding-right: 2rem;
  font-weight: 400;
  line-height: 19.6px;
  letter-spacing: -2%;
  font-family: Manrope;
  color: black;
  resize: none;

  &::placeholder {
    color: #d9d9d9;
  }

  &:focus {
    outline: none;
    border-color: #27ae60;
  }

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SendButton = styled(Button)`
  /* color: ${props => props.theme.colorPrimary}; */
  position: absolute;
  bottom: 4px;
  right: 4px;
`;

// TODO: Add icon to the list and replace it with Icon component
const AIIcon = () => {
  return (
    <svg
      className="ai-icon"
      width="16"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.41196 0.700195C7.62118 0.700195 7.80828 0.830459 7.88089 1.02668L8.71623 3.28416L10.9737 4.1195C11.1699 4.19211 11.3002 4.37921 11.3002 4.58843C11.3002 4.79765 11.1699 4.98475 10.9737 5.05736L8.71623 5.8927L7.88089 8.15018C7.80828 8.3464 7.62118 8.47667 7.41196 8.47667C7.20274 8.47667 7.01564 8.3464 6.94303 8.15018L6.10769 5.8927L3.85021 5.05736C3.65399 4.98475 3.52372 4.79765 3.52372 4.58843C3.52372 4.37921 3.65399 4.19211 3.85021 4.1195L6.10769 3.28416L6.94303 1.02668C7.01564 0.830459 7.20274 0.700195 7.41196 0.700195ZM7.41196 2.64097L6.96575 3.84682C6.91511 3.98368 6.80721 4.09158 6.67035 4.14223L5.4645 4.58843L6.67035 5.03464C6.80721 5.08528 6.91511 5.19318 6.96575 5.33004L7.41196 6.5359L7.85817 5.33004C7.90881 5.19318 8.01671 5.08528 8.15357 5.03464L9.35942 4.58843L8.15357 4.14223C8.01671 4.09158 7.90881 3.98368 7.85817 3.84682L7.41196 2.64097ZM3.17667 6.34725C3.34232 6.34725 3.49722 6.4293 3.59029 6.56634L4.33603 7.66436L5.43405 8.4101C5.57109 8.50317 5.65314 8.65807 5.65314 8.82372C5.65314 8.98938 5.57109 9.14428 5.43405 9.23735L4.33603 9.98309L3.59029 11.0811C3.49722 11.2182 3.34232 11.3002 3.17667 11.3002C3.01101 11.3002 2.85611 11.2182 2.76304 11.0811L2.0173 9.98309L0.919277 9.23735C0.78224 9.14428 0.700195 8.98938 0.700195 8.82372C0.700195 8.65807 0.78224 8.50317 0.919277 8.4101L2.0173 7.66436L2.76304 6.56634C2.85611 6.4293 3.01101 6.34725 3.17667 6.34725ZM3.17667 7.73719L2.79088 8.30523C2.75541 8.35744 2.71039 8.40247 2.65817 8.43794L2.09013 8.82372L2.65817 9.20951C2.71039 9.24498 2.75541 9.29001 2.79088 9.34222L3.17667 9.91026L3.56246 9.34222C3.59792 9.29001 3.64295 9.24498 3.69516 9.20951L4.2632 8.82372L3.69516 8.43794C3.64295 8.40247 3.59792 8.35744 3.56246 8.30523L3.17667 7.73719Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Chat = observer(
  ({
    entity,
    history,
  }: {
    entity: Entity<CodeComponentEntity>;
    history: CodeComponentEntity['ai']['messages'];
  }) => {
    const screenSize = useCurrentScreenSize();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const entityId = entity.$.raw.$name!;
    const isLoading = aiChatStore.isLoading(entityId);

    const handleSend = async () => {
      if (!entity) return;
      const message = textAreaRef.current?.value;
      if (!message) return;

      if (textAreaRef.current) {
        textAreaRef.current.value = '';
      }
      const content = message;
      const isInitialPrompt = history.length === 0;
      if (!content || !entity) return;

      const userMessage: ChatMessage = { role: 'user', content };

      entity.$.addVariantOverride(screenSize, {
        // @ts-ignore
        'ai.messages': [...history, userMessage],
      });

      aiChatStore.setLoading(entityId, true);

      try {
        const response = await generateCodeFromPrompt(
          content,
          isInitialPrompt ? undefined : history.at(-1)?.code,
        );

        toast.success('Code generated successfully!');

        if (isInitialPrompt) {
          entity.update({
            code: response.code,
            ready: true,
          });
        }

        entity.$.addVariantOverride(screenSize, {
          // @ts-ignore
          'ai.messages': [
            ...history,
            userMessage,
            { role: 'assistant', content: response.explanation, code: response.code },
          ],
        });
      } catch (error) {
        console.error('Error generating code:', error);
        toast.error('Something went wrong while generating code, please try again.');
      } finally {
        aiChatStore.setLoading(entityId, false);
      }
    };

    return (
      <InputWrapper
        onSubmit={async e => {
          e.preventDefault();
          await handleSend();
        }}
      >
        <AIIcon />
        {isLoading && <LoadingDots />}
        <TextArea
          ref={textAreaRef}
          name="message"
          onKeyDown={async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              await handleSend();
            }
          }}
          placeholder={
            isLoading
              ? ''
              : 'You can start generating the component by going to the AI Gen. tab or just start typing here.'
          }
          rows={3}
          disabled={isLoading}
        />

        <SendButton
          htmlType="submit"
          aria-label="Send message"
          disabled={isLoading}
          size="small"
          icon={
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.41196 0.700195C7.62118 0.700195 7.80828 0.830459 7.88089 1.02668L8.71623 3.28416L10.9737 4.1195C11.1699 4.19211 11.3002 4.37921 11.3002 4.58843C11.3002 4.79765 11.1699 4.98475 10.9737 5.05736L8.71623 5.8927L7.88089 8.15018C7.80828 8.3464 7.62118 8.47667 7.41196 8.47667C7.20274 8.47667 7.01564 8.3464 6.94303 8.15018L6.10769 5.8927L3.85021 5.05736C3.65399 4.98475 3.52372 4.79765 3.52372 4.58843C3.52372 4.37921 3.65399 4.19211 3.85021 4.1195L6.10769 3.28416L6.94303 1.02668C7.01564 0.830459 7.20274 0.700195 7.41196 0.700195ZM7.41196 2.64097L6.96575 3.84682C6.91511 3.98368 6.80721 4.09158 6.67035 4.14223L5.4645 4.58843L6.67035 5.03464C6.80721 5.08528 6.91511 5.19318 6.96575 5.33004L7.41196 6.5359L7.85817 5.33004C7.90881 5.19318 8.01671 5.08528 8.15357 5.03464L9.35942 4.58843L8.15357 4.14223C8.01671 4.09158 7.90881 3.98368 7.85817 3.84682L7.41196 2.64097ZM3.17667 6.34725C3.34232 6.34725 3.49722 6.4293 3.59029 6.56634L4.33603 7.66436L5.43405 8.4101C5.57109 8.50317 5.65314 8.65807 5.65314 8.82372C5.65314 8.98938 5.57109 9.14428 5.43405 9.23735L4.33603 9.98309L3.59029 11.0811C3.49722 11.2182 3.34232 11.3002 3.17667 11.3002C3.01101 11.3002 2.85611 11.2182 2.76304 11.0811L2.0173 9.98309L0.919277 9.23735C0.78224 9.14428 0.700195 8.98938 0.700195 8.82372C0.700195 8.65807 0.78224 8.50317 0.919277 8.4101L2.0173 7.66436L2.76304 6.56634C2.85611 6.4293 3.01101 6.34725 3.17667 6.34725ZM3.17667 7.73719L2.79088 8.30523C2.75541 8.35744 2.71039 8.40247 2.65817 8.43794L2.09013 8.82372L2.65817 9.20951C2.71039 9.24498 2.75541 9.29001 2.79088 9.34222L3.17667 9.91026L3.56246 9.34222C3.59792 9.29001 3.64295 9.24498 3.69516 9.20951L4.2632 8.82372L3.69516 8.43794C3.64295 8.40247 3.59792 8.35744 3.56246 8.30523L3.17667 7.73719Z"
                fill="white"
              />
            </svg>
          }
        >
          Generate
        </SendButton>
      </InputWrapper>
    );
  },
);

export default Chat;
