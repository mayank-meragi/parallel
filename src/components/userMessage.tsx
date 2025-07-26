import { Card, CardContent } from "./ui/card";

const UserMessage = (props: { message?: string }) => {
    return (<Card className="py-3 rounded-sm">
        <CardContent>{props.message ?? ''}</CardContent>
    </Card>);
};

export default UserMessage;