import UserMenu from '@/components/UserMenu';
import { AVATAR_DEFAULT_URL, LOGO_URL } from '@/constants';
import { deleteConversation, queryConversationList, queryMessageList, sendMessageByStream } from '@/services/Chat/api';
import {
  AppstoreAddOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  HeartOutlined,
  MessageOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ProductOutlined,
  RollbackOutlined,
  ScheduleOutlined,
  SmileOutlined
} from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Bubble, Conversations, Prompts, Sender, useXAgent, useXChat, Welcome, XStream } from '@ant-design/x';
import { SSEFields } from '@ant-design/x/es/x-stream';
import { history, useModel } from '@umijs/max';
import {
  Button,
  Divider,
  Flex,
  type GetProp,
  Image,
  message,
  Modal,
  Space,
  Spin
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import RenameForm from './RenameForm';

type BubbleDataType = {
  role: string;
  content: string;
};

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

const AiChat: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const abortController = useRef<AbortController>();

  const [conversations, setConversations] = useState([]);
  const [curConversation, setCurConversation] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [renameFormOpen, setRenameFormOpen] = useState(false);
  const [renameFormValue, setRenameFormValue] = useState({ id: '', value: '' });


  // 构建agent
  const [agent] = useXAgent<BubbleDataType, { message: BubbleDataType }>({
    request: async ({ message }, { onSuccess, onUpdate },) => {
      const res = await sendMessageByStream({
        conversationId: curConversation,
        message: message?.content,
        think: false,
        maxMessages: 20
      })

      const chunks: Partial<Record<SSEFields, any>>[] = []; // 用于收集所有数据块

      // 使用xStream处理流
      for await (const chunk of XStream({
        readableStream: res as ReadableStream,
      })) {
        const { data } = JSON.parse(chunk?.data)
        onUpdate({
          data: {
            content: data?.content,
            conversationId: data?.conversationId
          }
        });
        chunks.push(data);
      }
      onSuccess(chunks);

    },
  });

  const loading = agent.isRequesting();

  // 构建xChat
  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestPlaceholder: {
      content: (
        <>
          <Spin size="small" className='pr-3' />
          <span>思考中......</span>
        </>
      ) as any,
      role: 'assistant'
    },
    transformMessage(info) {
      // 数据转换
      const { originMessage, chunk, status } = info || {};
      let content = '';
      if (!originMessage?.content) {
        return {
          content: chunk?.data?.content,
          role: 'assistant',
        }
      }
      if (status === 'loading') {
        if (!curConversation) {
          setCurConversation(chunk?.data?.conversationId);
        }
        content = originMessage?.content + chunk?.data?.content;

      } else if (status === 'success') {
        content = originMessage?.content;
      }

      return {
        content: content,
        role: 'assistant',
      };
    },
    resolveAbortController: (controller) => {
      abortController.current = controller;
    },
  });

  const onSubmit = async (val: string) => {
    if (!val) return;

    if (loading) {
      message.open({
        type: 'error',
        content:
          'Request is in progress, please wait for the request to complete.',
      });
      return;
    }
    onRequest({
      stream: true,
      message: { content: val, role: 'user' },
    })
  };

  useEffect(() => {
    getConversationList();
    if (!curConversation) {
      setMessages([]);
    } else {
      getHistoryMessageList(curConversation);
    }
  }, [curConversation]);

  const getConversationList = async () => {
    const { data } = await queryConversationList();
    // 转换对象
    const newData = data?.map((item: Chat.ConversationListVO) => ({
      key: item.id,
      label: item.title,
      icon: <MessageOutlined className='mr-1' />,
    }));
    setConversations(newData);
  };

  const getHistoryMessageList = async (conversationId: string) => {
    const { data } = await queryMessageList(conversationId);
    const historyMessageList: any = []
    data.map((item: Chat.MessageListVO) => {
      historyMessageList.push({
        id: item.id,
        message: {
          content: item.content,
          role: item.type,
        },
        status: 'success',
      })
    })
    setMessages(historyMessageList);
  }

  const removeConversation = async (conversationId: string) => {
    await deleteConversation(conversationId);
    if (curConversation === conversationId) {
      setCurConversation('');
    }
    getConversationList();
  }

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
          <Button
            type="link"
            className="bg-[#1677ff0f] w-[100%] border-solid border-[#1677ff34] border-[1px] font-bold text-left"
            icon={<PlusOutlined className='font-bold mr-[8px]' />}
            onClick={() => {
              setMessages([]);
              setCurConversation('');
            }}
          >
            新对话
          </Button>
        );
      }}
      menuContentRender={() => {
        return (
          <>
            <Divider />
            <span className="text-[12px] text-[#999] select-none ml-1">历史对话</span>
            {/* 🌟 会话管理 */}
            <Conversations
              items={conversations}
              className="flex-1 overflow-y-auto mt-[12px] p-0 "
              activeKey={curConversation}
              onActiveChange={(val) => {
                setCurConversation(val);
              }}
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
                    onClick: async () => {
                      Modal.confirm({
                        title: '确定删除对话？',
                        content: '删除后，聊天记录将不可恢复。',
                        okText: '删除',
                        okType: 'danger',
                        centered: true,
                        closable: true,
                        onOk: () => {
                          removeConversation(conversation.key);
                        },
                      });
                    },
                  },
                ],
              })}
            />
          </>
        );
      }}
    >
      <Flex className="flex-col h-[100%]">
        <div className="flex-1 overflow-auto">
          {messages?.length ? (
            /* 🌟 消息列表 */
            <Bubble.List
              items={messages?.map((i) => ({
                ...i?.message,
                className: 'mt-5',
              }))}
              style={{ height: '100%', paddingInline: 'calc(calc(100% - 800px) /2)' }}
              autoScroll={true}
              roles={{
                assistant: {
                  placement: 'start',
                  footer: (content) => (
                    <div style={{ display: 'flex' }}>
                      <Button type="text" size="small" icon={<CopyOutlined />}
                        onClick={() => {
                          navigator.clipboard.writeText(content);
                          message.success('复制成功');
                        }} />
                    </div>
                  ),
                  // messageRender: (content) => {
                  //   return <ReactMarkdown>{content}</ReactMarkdown>;
                  // },
                  avatar: {
                    src: require('@/assets/bubble.jpg')
                  },
                },
                user: {
                  placement: 'end',
                  avatar: {
                    src: initialState?.avatar || AVATAR_DEFAULT_URL,
                  },
                  footer: (content) => (
                    <div style={{ display: 'flex' }}>
                      <Button type="text" size="small" icon={<CopyOutlined />}
                        onClick={() => {
                          navigator.clipboard.writeText(content);
                          message.success('复制成功');
                        }} />
                    </div>
                  ),
                },
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
        close={() => {
          setRenameFormOpen(false);
        }}
        values={renameFormValue}
      />
    </ProLayout>
  );
};

export default AiChat;

