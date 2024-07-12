import { useBreadboard } from "../../breadboard/context/useBreadboard";
import Frame from "../Frame";
import Button from "../input/Button";
import Reply from "./Reply";
import layoutStyles from "../../styles/layout.module.scss";
import React from "react";
import TextInput from "../input/TextInput";
import { chatResponseMap } from "./chatResponseMap";

const ChatComponent: React.FC = () => {
	const breadboard = useBreadboard();
	const [newQuery, setNewQuery] = React.useState("");
	const handleQueryChange = (value: string) => {
		setNewQuery(value);
	};

	const sendQuery = () => {
		breadboard.setQuery(newQuery);
		setNewQuery("");
	}
	return (
		<Frame label="Chat">
			<div className={layoutStyles.flexVertical}>
				{breadboard.llmContext.map((query) => {
					if (query.role === "user" && query.parts[0].text) {
						return (
							<Reply owner={"user"}>
								{query.parts[0].text}
							</Reply>
						)
					}
					const Component =
						chatResponseMap[query.parts[0].text as "cat" | "helloWorld"];
				return <>{!!query.parts[0] && <Reply owner={query.role}><Component /></Reply>}</>
			})}
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
