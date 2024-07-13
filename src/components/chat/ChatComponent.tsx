import clsx from "clsx";
import React, { useEffect } from "react";
import { useBreadboard } from "../../breadboard/context/useBreadboard";
import layoutStyles from "../../styles/layout.module.scss";
import Frame from "../Frame";
import Button from "../input/Button";
import TextInput from "../input/TextInput";
import chatStyles from "./chat.module.scss";
import { componentMap } from "./chatResponseMap";
import Reply from "./Reply";

const ChatComponent: React.FC = () => {
	const breadboard = useBreadboard();
	const [newQuery, setNewQuery] = React.useState("");
	const messagesEndRef = React.useRef<HTMLDivElement>(null);
	const handleQueryChange = (value: string) => {
		setNewQuery(value);
	};

	const sendQuery = () => {
		breadboard.setQuery(newQuery);
		setNewQuery("");
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [breadboard.llmContext]);
	return (
		<Frame label="Chat">
			<div className={clsx(layoutStyles.flexVertical, chatStyles.chatWindow)}>
				{breadboard.llmContext.map((query, index) => {
					if (query.role === "user" && query.parts[0].text) {
						return (
							<Reply key={index} owner={"user"}>
								{query.parts[0].text}
							</Reply>
						);
					}

					const Component = componentMap.getRandomComponent();
					return <>{!!query.parts[0] && <Component key={index} />}</>;
				})}
				<div ref={messagesEndRef} />
			</div>
			<div className={layoutStyles.flexHorizontal}>
				<TextInput
					value={newQuery}
					onChange={handleQueryChange}
					label="Message"
					name="query"
					placeholder="Add breadboard query"
					disabled={!breadboard.url}
				/>
				<Button title="Send" onClick={sendQuery} loading={breadboard.loading} />
			</div>
		</Frame>
	);
};

export default ChatComponent;
