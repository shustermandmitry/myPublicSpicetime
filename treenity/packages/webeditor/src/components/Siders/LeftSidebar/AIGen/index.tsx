import { codeComponentLoader } from '@/components/blocks/CodeComponent/loader';
import { useEntity } from '@/hooks/use-entity';
import { aiChatStore } from '@/store/ai-chat';
import { generateCodeFromPrompt } from '@/utils/openai';
import { useEditor } from '@craftjs/core';
import styled from '@emotion/styled';
import {
  Button as AdminButton,
  Button,
  EmptyState,
  Icon,
} from '@treenity/admin-components/components';
import { Render } from '@treenity/ui-kit';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  code?: string;
  isLoading?: boolean;
}

function AIGen() {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const editTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const { selectedItemId } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').first();
    return {
      selectedItemId: currentlySelectedNodeId,
    };
  });

  const { entity, mergedMeta, addOverride } = useEntity(selectedItemId);
  const messages = (mergedMeta?.ai?.messages || []) as ChatMessage[];
  const isLoading = aiChatStore.isLoading(selectedItemId);

  useLayoutEffect(() => {
    if (!chatAreaRef.current) return;

    function scrollToBottom(smooth = true) {
      const lastNode = chatAreaRef.current?.lastElementChild;
      if (lastNode) {
        setTimeout(() => {
          lastNode.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'end',
          });
        }, 100);
      }
    }

    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    observer.observe(chatAreaRef.current, {
      childList: true,
    });

    scrollToBottom(false);
    return () => observer.disconnect();
  }, [chatAreaRef.current]);

  const handleSend = async () => {
    const content = textAreaRef.current?.value.trim();
    if (!content || !entity || !selectedItemId) return;

    const userMessage: ChatMessage = { role: 'user', content };

    addOverride({
      'ai.messages': [...messages, userMessage],
    });

    if (textAreaRef.current) {
      textAreaRef.current.value = '';
    }

    aiChatStore.setLoading(selectedItemId, true);

    try {
      const isInitialPrompt = messages.length === 0;

      const response = await generateCodeFromPrompt(
        content,
        isInitialPrompt ? undefined : messages.at(-1)?.code,
      );

      addOverride({
        'ai.messages': [
          ...messages,
          userMessage,
          { role: 'assistant', content: response.explanation, code: response.code },
        ],
      });
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      aiChatStore.setLoading(selectedItemId, false);
    }
  };

  const handleApplyCode = (code: string) => {
    if (!entity) return;
    entity.update({
      code,
      ready: true,
    });
  };

  const handleEdit = (index: number, msg: ChatMessage) => {
    if (msg.role !== 'user') return;
    setEditingIndex(index);
    if (editTextAreaRef.current) {
      editTextAreaRef.current.focus();
    }
  };

  const handleEditSubmit = async () => {
    const content = editTextAreaRef.current?.value.trim();
    if (editingIndex === null || !content || !entity || !selectedItemId) return;

    const truncatedMessages = messages.slice(0, editingIndex);
    const userMessage: ChatMessage = { role: 'user', content };

    addOverride({
      'ai.messages': [...truncatedMessages, userMessage],
    });

    setEditingIndex(null);
    aiChatStore.setLoading(selectedItemId, true);

    try {
      const isInitialPrompt = truncatedMessages.length === 0;
      const lastAssistantMessage = truncatedMessages
        .reverse()
        .find(msg => msg.role === 'assistant' && msg.code);

      const response = await generateCodeFromPrompt(
        content,
        isInitialPrompt ? undefined : lastAssistantMessage?.code,
      );

      addOverride({
        'ai.messages': [
          ...truncatedMessages,
          userMessage,
          { role: 'assistant', content: response.explanation, code: response.code },
        ],
      });
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      aiChatStore.setLoading(selectedItemId, false);
    }
  };

  return (
    <Container>
      <ChatArea ref={chatAreaRef}>
        {messages.length === 0 ? (
          <StyledEmptyState
            title="No messages yet"
            subtitle="Start a conversation by typing a message below"
          />
        ) : (
          <>
            {messages.map((msg: ChatMessage, index: number) => {
              const isEditing = editingIndex === index;
              return (
                <>
                  <Message key={`${index}-content`} isUser={msg.role === 'user'}>
                    {isEditing ? (
                      <>
                        <EditTextArea
                          ref={editTextAreaRef}
                          onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleEditSubmit();
                            }
                          }}
                          defaultValue={msg.content}
                          autoFocus
                        />
                        <EditActions>
                          <EditButton type="text" onClick={() => setEditingIndex(null)}>
                            Cancel
                          </EditButton>
                          <EditButton type="primary" onClick={handleEditSubmit}>
                            Save
                          </EditButton>
                        </EditActions>
                      </>
                    ) : (
                      <MessageText isUser={msg.role === 'user'}>{msg.content}</MessageText>
                    )}
                    {msg.role === 'user' && !isEditing && (
                      <EditIcon className="edit-icon" onClick={() => handleEdit(index, msg)}>
                        <Icon name="edit_outlined" />
                      </EditIcon>
                    )}
                  </Message>
                  {msg.role === 'assistant' && msg.code && (
                    <Message key={`${index}-code`}>
                      <CodeMessageWrapper>
                        <Render
                          value="DONT_REMOVE"
                          key={msg.code}
                          url={`${selectedItemId}:${index}`}
                          code={msg.code}
                          id={selectedItemId}
                          loader={codeComponentLoader}
                        />
                        <CodeOverlay className="code-overlay">
                          <ApplyButton type="primary" onClick={() => handleApplyCode(msg.code!)}>
                            Use this
                          </ApplyButton>
                        </CodeOverlay>
                      </CodeMessageWrapper>
                    </Message>
                  )}
                </>
              );
            })}
            {isLoading && (
              <Message isUser={false}>
                <MessageText>
                  Generating response
                  <LoadingDots />
                </MessageText>
              </Message>
            )}
          </>
        )}
      </ChatArea>

      <InputArea>
        <ActionsContainer>
          <Button block type="secondary-outlined" disabled>
            Generate more
          </Button>
          <Button block type="secondary-outlined" disabled>
            Gen. by example
          </Button>
        </ActionsContainer>
        <InputWrapper>
          <TextArea
            ref={textAreaRef}
            placeholder={
              editingIndex !== null ? 'Edit message...' : 'A beautiful block "About the company"'
            }
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (editingIndex !== null) {
                  handleEditSubmit();
                } else {
                  handleSend();
                }
              }
            }}
            rows={3}
            disabled={isLoading}
          />

          <SendButton
            aria-label="Send message"
            onClick={editingIndex !== null ? handleEditSubmit : handleSend}
            disabled={isLoading}
          >
            <Icon name={'publish_outlined'} />
          </SendButton>
        </InputWrapper>
      </InputArea>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Manrope;
  height: 100%;
  overflow: hidden;
  padding-inline: 0.5rem;
  gap: 16px;
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MessageText = styled.div<{ isUser?: boolean; isCode?: boolean }>`
  font-family: ${props => (props.isCode ? 'JetBrains Mono' : 'Manrope')};
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  letter-spacing: -2%;
  color: ${props => (props.isUser ? 'white' : 'inherit')};
  white-space: ${props => (props.isCode ? 'pre-wrap' : 'normal')};
`;

const EditIcon = styled.div`
  position: absolute;
  bottom: -20px;
  right: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  z-index: 1;
`;

const CodeOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #26262626;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 8px;
  pointer-events: none;
  z-index: 1;
`;

const Message = styled.div<{ isUser?: boolean; isCode?: boolean }>`
  width: ${props => (props.isCode ? '100%' : '256px')};
  padding: 8px 10px;
  border-radius: 8px;
  gap: 10px;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  background: ${props => {
    if (props.isUser) return '#27AE60';
    return '#FFFFFF';
  }};
  border: ${props => (!props.isUser && !props.isCode ? '1px solid #E9E8EE' : 'none')};
  position: relative;
  z-index: ${props => (props.isCode ? 1 : 'auto')};

  &:hover .edit-icon {
    opacity: 0.8;
  }

  &:hover .code-overlay {
    opacity: 1;
    pointer-events: all;
  }
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 0.25rem;
`;

const EditTextArea = styled.textarea`
  width: 100%;
  background: transparent;
  border: none;
  font-family: Manrope;
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  color: white;
  resize: none;
  padding: 0;

  &:focus {
    outline: none;
  }
`;
const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const SendButton = styled('button')`
  all: unset;
  color: ${props => props.theme.colorPrimary};
  position: absolute;
  top: 6px;
  right: 10px;

  &:disabled {
    opacity: 0.5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const StyledEmptyState = styled(EmptyState)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingDots = styled.span`
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

const CodeMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ApplyButton = styled(AdminButton)`
  font-size: 12px;
  z-index: 1;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 6px 10px;
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

  &:disabled {
    background: #f5f5f5;
  }

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

const EditActions = styled.div`
  position: absolute;
  bottom: -24px;
  right: 0;
  display: flex;
  gap: 8px;
  z-index: 2;
`;

const EditButton = styled(AdminButton)`
  padding: 2px 8px;
  font-size: 12px;
  height: 20px;
  min-width: auto;
`;

export default observer(AIGen);
