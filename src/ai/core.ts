import { Chat, Content, GoogleGenAI } from '@google/genai';
import { getFunctionDeclarations } from './tool_handler';
import { useRef, useEffect, useState } from 'react';
const GEMINI_API_KEY = "AIzaSyCb14ttOf1c9-hOBaqOKOw4GiFg6wyUt5w"

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const useChat = (initialMessages: Content[]) => {
    const [chat, setChat] = useState<Chat | null>(null);

    useEffect(() => {
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: initialMessages,
            config: {
                tools: [{
                    functionDeclarations: getFunctionDeclarations()
                }]
            }
        });

        setChat(newChat);
    }, []);

    return { chat };
};