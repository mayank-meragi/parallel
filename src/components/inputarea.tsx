import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@src/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { ArrowUpFromDot, ChevronRightIcon, LoaderCircle } from "lucide-react";
import { Part } from "@google/genai";

interface InputAreaProps {
    onSend: (message: Part) => void;
    isStreaming?: boolean;
}

const InputArea = (props: InputAreaProps) => {
    const [message, setMessage] = useState<string>('');

    return (<div id="input-area" className="flex-shrink-0 p-1">
        <div className="flex flex-col gap-2 border border-gray-200 rounded-lg p-1 bg-white">
            <Textarea
                placeholder="Type your message here..."
                className="h-full" value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between">
                <Select>
                    <SelectTrigger className="border-none" size="sm">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button onClick={() => {
                    console.log("on click was called");
                    props.onSend({ text: message });
                    setMessage('');
                }}
                    disabled={props.isStreaming}
                >{props.isStreaming ? <LoaderCircle className="animate-spin" /> : <ArrowUpFromDot />}</Button>
            </div>
        </div>
    </div>);
};



export default InputArea;