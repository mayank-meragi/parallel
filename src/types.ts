export enum MessageRole {
    USER = 'user',
    AI = 'model',
    TOOL_CALL = 'tool_call',
    TOOL_RESULT = 'tool_result'
}

export type Message = {
    id: string;
    content: string;
    role: MessageRole;
};