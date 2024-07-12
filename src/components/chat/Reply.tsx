import { PropsWithChildren } from "react";

type ReplyProps = PropsWithChildren;
const Reply: React.FC<ReplyProps> = ({ children }: ReplyProps) => {
	return <div>{children}</div>;
};

export default Reply;
