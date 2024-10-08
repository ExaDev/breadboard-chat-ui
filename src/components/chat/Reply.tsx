import { PropsWithChildren } from "react";
import layoutStyles from "../../styles/layout.module.scss";
import { LlmRole } from "../../breadboard/types";
import chatStyles from "./chat.module.scss";
import clsx from "clsx";

type ReplyProps = { owner?: LlmRole } & PropsWithChildren;
const Reply: React.FC<ReplyProps> = ({ children, owner }: ReplyProps) => {
	return (
		<div className={chatStyles.replyContainer}>
			<h1
				className={
					owner === LlmRole.model
						? layoutStyles.alignLeft
						: layoutStyles.alignRight
				}
			>
				{owner === LlmRole.model ? "Model" : "You"}
			</h1>
			<div
				className={clsx(
					chatStyles.reply,
					owner ? chatStyles[owner] : chatStyles.model,
					owner === LlmRole.model
						? layoutStyles.alignLeft
						: layoutStyles.alignRight
				)}
			>
				{children}
			</div>
		</div>
	);
};

export default Reply;
