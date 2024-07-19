import { LlmRole } from "../../breadboard/types";
import Layout from "../Layout";
import Loader from "../Loader";
import Reply from "./Reply";

type MessageBeingPreparedProps = {
	owner: LlmRole;
};
const MessageBeingPrepared: React.FC<MessageBeingPreparedProps> = ({ owner }) => {
	return (
		<Reply owner={owner}>
			<Layout alignItems="flex-end">
				<Loader />
			</Layout>
		</Reply>
	);
}; 

export default MessageBeingPrepared;
