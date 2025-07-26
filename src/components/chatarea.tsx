
import UserMessage from "./userMessage";
import AIMessage from "./aiMessage";
import { Message, MessageRole } from "@src/types";
import { Content, GenerateContentResponse } from "@google/genai";

interface ChatAreaProps {
    messages: Content[];
    isStreaming: boolean;
    streamingChunk: Content | null;
}


const History = (props: { messages: Content[] }) => {
    return (< >

        {props.messages.map(message => {
            if (message.role === MessageRole.USER && message.parts?.[0]?.text) {
                return <UserMessage message={message.parts?.[0]?.text} />;
            } else if (message.role === MessageRole.AI && message.parts?.[0]?.text) {
                return <AIMessage message={message.parts?.[0]?.text} />;
            }
        })}

    </>);
};


const ChatArea = (props: ChatAreaProps) => {
    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <History messages={props.messages} />
            {props.isStreaming && <AIMessage message={props.streamingChunk?.parts?.[0]?.text} />}
        </div>
    );
};


export default ChatArea;