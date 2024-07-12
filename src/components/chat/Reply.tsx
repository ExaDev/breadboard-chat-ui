import { PropsWithChildren } from "react";
import layoutStyles from "../../styles/layout.module.scss";
import { LlmRole } from "../../breadboard/context/types";

type ReplyProps = { owner?: LlmRole } & PropsWithChildren;
const Reply: React.FC<ReplyProps> = ({ children, owner }: ReplyProps) => {
	return (
		<div
			className={
				owner === LlmRole.model ? layoutStyles.alignLeft : layoutStyles.alignRight
			}
		>
			{children}
		</div>
	);
};

export default Reply;
