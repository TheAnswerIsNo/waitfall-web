import { request } from "@umijs/max";

export async function queryConversationList() {
    return request<Result>('/ai/conversation/list', {
        method: 'GET'
    });
}

export async function createConversation() {
    return request<Result>('/ai/conversation/add', {
        method: 'POST',
    });
}

export async function sendMessageByStream(params: Chat.MessageSendDTO) {
    const response = await fetch('/api/ai/message/send/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: localStorage.getItem('token') || '',
        },
        body: JSON.stringify(params),
        keepalive: true,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body;
}

export async function deleteConversation(id: string) {
    return request<Result>('/ai/conversation/delete', {
        method: 'DELETE',
        params: {
            id,
        }
    });
}

export async function queryMessageList(conversationId: string) {
    return request<Result>(`/ai/message/list/${conversationId}`, {
        method: 'GET'
    });
}