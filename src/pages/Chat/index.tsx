import UserMenu from '@/components/UserMenu';
import { AVATAR_DEFAULT_URL, LOGO_URL } from '@/constants';
import {
  AppstoreAddOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  FileSearchOutlined,
  HeartOutlined,
  LikeOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ProductOutlined,
  ReloadOutlined,
  RollbackOutlined,
  ScheduleOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Bubble, Conversations, Prompts, Sender, Welcome } from '@ant-design/x';
import { history, useModel } from '@umijs/max';
import {
  Button,
  Flex,
  type GetProp,
  Image,
  Space,
  Spin,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import RenameForm from './components/RenameForm';

type BubbleDataType = {
  role: string;
  content: string;
};

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: 'What is Ant Design X?',
    group: 'Today',
  },
  {
    key: 'default-1',
    label: 'How to quickly install and import components?',
    group: 'Today',
  },
  {
    key: 'default-2',
    label: 'New AGI Hybrid Interface',
    group: 'Yesterday',
  },
];

const HOT_TOPICS = {
  key: '1',
  label: 'Hot Topics',
  children: [
    {
      key: '1-1',
      description: 'What has Ant Design X upgraded?',
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: 'New AGI Hybrid Interface',
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: 'What components are in Ant Design X?',
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: 'Come and discover the new design paradigm of the AI era.',
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: 'How to quickly install and import components?',
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: 'Design Guide',
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: 'Intention',
      description: 'AI understands user needs and provides solutions.',
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: 'Role',
      description: "AI's public persona and image",
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: 'Chat',
      description: 'How AI Can Express Itself in a Way Users Understand',
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: 'Interface',
      description: 'AI balances "chat" & "do" behaviors.',
    },
  ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: 'Upgrades',
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: 'Components',
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: 'RICH Guide',
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: 'Installation Introduction',
    icon: <AppstoreAddOutlined />,
  },
];

const Independent: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const abortController = useRef<AbortController>(null);
  const [messageHistory, setMessageHistory] = useState<Record<string, any>>({});

  const [conversations, setConversations] = useState(
    DEFAULT_CONVERSATIONS_ITEMS,
  );
  const [curConversation, setCurConversation] = useState(
    DEFAULT_CONVERSATIONS_ITEMS[0].key,
  );

  const [inputValue, setInputValue] = useState('');
  const [renameFormOpen, setRenameFormOpen] = useState(false);
  const [renameFormValue, setRenameFormValue] = useState({ id: '', value: '' });

  /**
   * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
   */

  // ==================== Runtime ====================
  // const [agent] = useXAgent<BubbleDataType>({
  //   baseURL: 'http://localhost:8080/ai/chat/send/stream',
  //   model: 'qwen3:8b',
  // });
  // const loading = agent.isRequesting();

  // const { onRequest, messages, setMessages } = useXChat({
  //   agent,
  //   requestFallback: (_, { error }) => {
  //     if (error.name === 'AbortError') {
  //       return {
  //         content: 'Request is aborted',
  //         role: 'assistant',
  //       };
  //     }
  //     return {
  //       content: 'Request failed, please try again!',
  //       role: 'assistant',
  //     };
  //   },
  //   transformMessage: (info) => {
  //     const { originMessage, chunk } = info || {};
  //     let currentContent = '';
  //     let currentThink = '';
  //     try {
  //       if (chunk?.data && !chunk?.data.includes('DONE')) {
  //         const message = JSON.parse(chunk?.data);
  //         currentThink = message?.choices?.[0]?.delta?.reasoning_content || '';
  //         currentContent = message?.choices?.[0]?.delta?.content || '';
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }

  //     let content = '';

  //     if (!originMessage?.content && currentThink) {
  //       content = `<think>${currentThink}`;
  //     } else if (
  //       originMessage?.content?.includes('<think>') &&
  //       !originMessage?.content.includes('</think>') &&
  //       currentContent
  //     ) {
  //       content = `${originMessage?.content}</think>${currentContent}`;
  //     } else {
  //       content = `${originMessage?.content || ''
  //         }${currentThink}${currentContent}`;
  //     }
  //     return {
  //       content: content,
  //       role: 'assistant',
  //     };
  //   },
  //   resolveAbortController: (controller) => {
  //     abortController.current = controller;
  //   },
  // });

  const [messages, setMessages] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (val: string) => {
    if (!val) return;

    if (loading) {
      message.open({
        type: 'error',
        content:
          'Request is in progress, please wait for the request to complete.',
      });
      return;
    }
  };

  //   onRequest({
  //     stream: true,
  //     message: { role: 'user', content: val },
  //   });
  // };

  // useEffect(() => {
  //   // history mock
  //   if (messages?.length) {
  //     setMessageHistory((prev) => ({
  //       ...prev,
  //       [curConversation]: messages,
  //     }));
  //   }
  // }, [messages]);

  return (
    <ProLayout
      title="小秋"
      logo={LOGO_URL}
      logoStyle={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10px',
        borderBottom: 'none',
      }}
      layout="side"
      onMenuHeaderClick={() => {
        history.back();
      }}
      avatarProps={{
        src: initialState?.avatar || AVATAR_DEFAULT_URL,
        title: initialState?.nickname,
        render: (_, defaultDom) => {
          return <UserMenu defaultDom={defaultDom} />;
        },
      }}
      actionsRender={() => (
        <Button
          size="large"
          type="text"
          icon={<RollbackOutlined />}
          onClick={() => history.back()}
          className="!bg-transparent !caret-inherit"
        />
      )}
      collapsedButtonRender={false}
      contentStyle={{ height: '100vh', backgroundColor: 'white' }}
      menuExtraRender={() => {
        return (
          <Flex className="mt-4 justify-between">
            <Tag
              color="gold"
              icon={<CommentOutlined />}
              className="h-[32px] w-[120px] text-center flex items-center justify-center"
            >
              历史对话
            </Tag>
            <Button
              onClick={() => {
                const now = dayjs().valueOf().toString();
                setConversations([
                  {
                    key: now,
                    label: `New Conversation ${conversations.length + 1}`,
                    group: 'Today',
                  },
                  ...conversations,
                ]);
                // setCurConversation(now);
                // setMessages([]);
              }}
              type="link"
              className="bg-[#1677ff0f] h-[32px] w-[120px] border-solid border-[#1677ff34] border-[1px]"
              icon={<PlusOutlined />}
            ></Button>
          </Flex>
        );
      }}
      menuContentRender={() => {
        return (
          <>
            {/* 🌟 会话管理 */}
            <Conversations
              items={conversations}
              className="flex-1 overflow-y-auto mt-[12px] p-0 "
              activeKey={curConversation}
              onActiveChange={async (val) => {
                // 终止请求
                abortController.current?.abort();
                // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
                // In future versions, the sessionId capability will be added to resolve this problem.
                setTimeout(() => {
                  // setCurConversation(val);
                  // setMessages(messageHistory?.[val] || []);
                }, 100);
              }}
              groupable
              styles={{ item: { padding: '0 8px' } }}
              menu={(conversation) => ({
                items: [
                  {
                    label: '重命名',
                    key: 'rename',
                    icon: <EditOutlined />,
                    onClick: () => {
                      setRenameFormValue({
                        id: conversation.key,
                        value: conversation.label?.valueOf() as string,
                      });
                      setRenameFormOpen(true);
                    },
                  },
                  {
                    label: '删除',
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => {
                      const newList = conversations.filter(
                        (item) => item.key !== conversation.key,
                      );
                      const newKey = newList?.[0]?.key;
                      setConversations(newList);
                      setTimeout(() => {
                        if (conversation.key === curConversation) {
                          setCurConversation(newKey);
                          // setMessages(messageHistory?.[newKey] || []);
                        }
                      }, 200);
                    },
                  },
                ],
              })}
            />
          </>
        );
      }}
    >
      <Flex className="flex-col" style={{ height: '100vh' }}>
        <div className="flex-1 overflow-auto">
          {messages?.length ? (
            /* 🌟 消息列表 */
            <Bubble.List
              items={messages?.map((i) => ({
                ...i.message,
                classNames: {
                  content:
                    i.status === 'loading'
                      ? 'bg-size-[100%_2px] bg-no-repeat bg-bottom'
                      : '',
                },
                typing:
                  i.status === 'loading'
                    ? { step: 5, interval: 20, suffix: <>💗</> }
                    : false,
              }))}
              style={{
                height: '100%',
                paddingInline: 'calc(calc(100% - 700px) /2)',
              }}
              autoScroll={true}
              roles={{
                assistant: {
                  placement: 'start',
                  footer: (
                    <div style={{ display: 'flex' }}>
                      <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<LikeOutlined />}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<DislikeOutlined />}
                      />
                    </div>
                  ),
                  loadingRender: () => <Spin size="small" />,
                },
                user: { placement: 'end' },
              }}
            />
          ) : (
            <Space
              direction="vertical"
              size="large"
              style={{ paddingInline: 'calc(calc(100% - 700px) /2)' }}
              className="pt-[32px]"
            >
              <Welcome
                variant="borderless"
                icon={<Image src={require('@/assets/bubble.jpg')} />}
                title={`你好，${initialState?.nickname}`}
                description="我是小秋，有什么可以帮助您吗？"
              />
              <Flex gap={16}>
                <Prompts
                  items={[HOT_TOPICS]}
                  styles={{
                    list: { height: '100%' },
                    item: {
                      flex: 1,
                      backgroundImage:
                        'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                      borderRadius: 12,
                      border: 'none',
                    },
                    subItem: { padding: 0, background: 'transparent' },
                  }}
                  onItemClick={(info) => {
                    onSubmit(info.data.description as string);
                  }}
                />
                <Prompts
                  items={[DESIGN_GUIDE]}
                  styles={{
                    item: {
                      flex: 1,
                      backgroundImage:
                        'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                      borderRadius: 12,
                      border: 'none',
                    },
                    subItem: { background: '#ffffffa6' },
                  }}
                  onItemClick={(info) => {
                    onSubmit(info.data.description as string);
                  }}
                />
              </Flex>
            </Space>
          )}
        </div>
        <div className=" flex-col align-center p-[16px] items-center">
          {/* 🌟 提示词 */}
          <Prompts
            items={SENDER_PROMPTS}
            onItemClick={(info) => {
              onSubmit(info.data.description as string);
            }}
            styles={{
              item: { padding: '6px 12px' },
              list: { justifyContent: 'center' },
            }}
            className="w-[100%] max-w-[700px] mx-auto my-5"
          />
          {/* 🌟 输入框 */}
          <Sender
            value={inputValue}
            onSubmit={() => {
              onSubmit(inputValue);
              setInputValue('');
            }}
            onChange={setInputValue}
            onCancel={() => {
              abortController.current?.abort();
            }}
            loading={loading}
            className="w-[100%] max-w-[700px] mx-auto"
            allowSpeech
            actions={(_, info) => {
              const { SendButton, LoadingButton, SpeechButton } =
                info.components;
              return (
                <Flex gap={4}>
                  <SpeechButton className="text-[18px]" />
                  {loading ? (
                    <LoadingButton type="default" />
                  ) : (
                    <SendButton type="primary" />
                  )}
                </Flex>
              );
            }}
            placeholder="Ask or input / use skills"
          />
        </div>
      </Flex>
      <RenameForm
        open={renameFormOpen}
        onCancel={() => {
          setRenameFormOpen(false);
        }}
        values={renameFormValue}
      />
    </ProLayout>
  );
};

export default Independent;
