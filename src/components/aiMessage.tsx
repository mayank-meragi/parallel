import { Card, CardContent } from "./ui/card";

const AIMessage = (props: { message?: string }) => {
    return (
        <Card className="py-3 px-0 rounded-sm bg-transparent border-none shadow-none">
            <CardContent>
                <p>{props.message ?? ''}</p>
            </CardContent>
        </Card>
    );
};

export default AIMessage;