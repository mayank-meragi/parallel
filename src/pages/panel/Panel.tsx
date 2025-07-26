import { useState } from 'react';
import '@pages/panel/Panel.css';
import InputArea from '@src/components/inputarea';
import ChatArea from '@src/components/chatarea';
import { MessageRole } from '@src/types';
import { Content, GenerateContentResponse, GoogleGenAI, Part } from '@google/genai';
import { getFunctionDeclarations, handleFunctionCall } from '@src/ai/tool_handler';

const GEMINI_API_KEY = "AIzaSyCb14ttOf1c9-hOBaqOKOw4GiFg6wyUt5w"

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


const rawMessages: Content[] = [
  {
    parts: [{
      text: 'Hello, how are you? my name is John Doe'
    }],
    role: MessageRole.USER
  },
  {
    parts: [{
      text: 'I\'m fine, thank you!'
    }],
    role: MessageRole.AI
  }
];


export default function Panel() {

  const [messages, setMessages] = useState<Content[]>(rawMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingChunk, setStreamingChunk] = useState<Content | null>(null);

  const [chat] = useState(() => ai.chats.create({
    model: 'gemini-2.5-flash',
    history: messages,
    config: {
      tools: [{
        functionDeclarations: getFunctionDeclarations()
      }]
    }
  }));

  const handleSend = async (message: Part) => {
    let input: Part | Part[] = message;

    setIsStreaming(true);
    while (true) {

      setMessages(prev => [...prev, {
        parts: Array.isArray(input) ? input : [input],
        role: MessageRole.USER
      }]);

      const response = await chat.sendMessageStream({ message: input });

      let gatheredText = '';
      let lastChunk: GenerateContentResponse | null = null;

      for await (const chunk of response) {
        gatheredText += chunk.text;

        setStreamingChunk({
          parts: [{
            text: gatheredText
          }],
          role: MessageRole.AI
        });

        lastChunk = chunk;
      }

      const parts = [];

      if (lastChunk?.text) {
        parts.push({
          text: gatheredText
        });
      }

      if (lastChunk?.functionCalls) {
        parts.push(...lastChunk.functionCalls.map(fc => ({
          functionCall: fc
        })));
      }

      const aiResponse: Content = {
        parts: parts,
        role: MessageRole.AI
      }

      setMessages(prev => [...prev, aiResponse]);

      setStreamingChunk(null);

      if (lastChunk?.functionCalls) {
        const toolResponses = await handleFunctionCall(lastChunk.functionCalls);

        input = toolResponses.map(r => ({ functionResponse: r }));

        continue;
      } else {
        break;
      }
    }

    setIsStreaming(false);
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <ChatArea
        messages={messages}
        isStreaming={isStreaming}
        streamingChunk={streamingChunk}
      />
      <InputArea onSend={handleSend} isStreaming={isStreaming} />
    </div>
  );
}
