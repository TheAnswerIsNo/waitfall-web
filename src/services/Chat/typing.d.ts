declare namespace Chat {
  interface ConversationListVO {
    id?: string;
    title?: string;
  }

  interface MessageSendDTO {
    conversationId?: string;
    message?: string;
    think?: boolean;
    maxMessages?: number;
  }

  interface MessageSendVO {
    content?: string;
    conversationId?: string;
  }

  interface MessageListVO {
    id?: string;
    content?: string;
    type?: string;
  }
}
