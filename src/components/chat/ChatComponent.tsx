import { useBreadboard } from "../../breadboard/context/useBreadboard";
import Frame from "../Frame";
import Button from "../input/Button";
import Reply from "./Reply";
import layoutStyles from "../../styles/layout.module.scss";
import React from "react";
import TextInput from "../input/TextInput";

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
			{breadboard.queryHistory.map((query) => (
				<>{!!query.parts[0] && <Reply>{query.parts[0].text}</Reply>}</>
			))}
			<div className={layoutStyles.flexHorizontal}>
				<TextInput
					value={newQuery}
					onChange={handleQueryChange}
					label="Message"
					name="query"
					placeholder="Add breadboard query"
					disabled={!breadboard.url}
				/>
				<Button title="Send" onClick={sendQuery} />
			</div>
		</Frame>
	);
};

export default ChatComponent;
