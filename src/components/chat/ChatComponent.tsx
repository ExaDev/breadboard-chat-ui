import clsx from "clsx";
import React, { useEffect } from "react";
import { useBreadboard } from "../../breadboard/context/useBreadboard";
import layoutStyles from "../../styles/layout.module.scss";
import Frame from "../Frame";
import Button from "../input/Button";
import TextInput from "../input/TextInput";
import chatStyles from "./chat.module.scss";
import Reply from "./Reply";
import { componentMap } from "./chatResponseMap";

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

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			sendQuery();
		}
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
				{breadboard.llmContext.map((item, itemIndex) => {
					// if (item.role === "user" && item.parts[0].text) {
					// 	return (
					// 		<Reply key={index} owner={"user"}>
					// 			{item.parts[0].text}
					// 		</Reply>
					// 	);
					// } else if (item.role === "model" && item.parts[0].text) {
					// 	return (
					// 		<Reply key={index} owner={"model"}>
					// 			{item.parts[0].text}
					// 		</Reply>
					// 	);
					// }

					// const Component = componentMap.getRandomComponent();
					// return <>{!!query.parts[0] && <Component key={index} />}</>;

					// return (
					// 	<Reply key={index} owner={item.role}>
					// 		{item.parts[0].text}
					// 	</Reply>
					// );

					return item.parts.map((part, partIndex) => {
						// if (item.role === "user" && part.text) {
						// }
						// <Reply key={`${itemIndex}.${partIndex}`} owner={item.role}>
						// 	{part.text}
						// </Reply>
						// <div
						// 	key={`${itemIndex}.${partIndex}`}
						// 	dangerouslySetInnerHTML={{ __html: part.text }}
						// />
						//
						// if it's a user message render as a reply, otherwise render using dangerouslySetInnerHTML
						if (item.role === "user" && part.text) {
							return (
								<Reply key={`${itemIndex}.${partIndex}`} owner={item.role}>
									{part.text}
								</Reply>
							);
						} else if (item.role === "model" && part.text) {
							const repsonse = JSON.parse(part.text);
							if (
								repsonse.hasOwnProperty("component") &&
								repsonse.hasOwnProperty("rationale")
							) {
								const SelectedComponent = componentMap.getByName(
									JSON.parse(part.text).component
								).component;
								return (
									<>
										<Reply
											key={`${itemIndex}.${partIndex}.text`}
											owner={item.role}
										>
											{JSON.parse(part.text).rationale}
										</Reply>

										<SelectedComponent />
									</>
								);
							}
							return (
								<Reply owner="model" key={`${itemIndex}.${partIndex}`}>
									{part.text}
								</Reply>
							);
						}
					});
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
					onKeyPress={handleKeyPress}
				/>
				<Button title="Send" onClick={sendQuery} loading={breadboard.loading} />
			</div>
		</Frame>
	);
};

export default ChatComponent;
