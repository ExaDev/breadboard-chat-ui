import { useBreadboard } from "../breadboard/context/useBreadboard";
import TextInput from "./input/TextInput";

const BreadboardQuery: React.FC = () => {
	const breadboard = useBreadboard();
	return (
		<TextInput
			value={breadboard.query || ""}
			onChange={breadboard.setQuery}
			label="Breadboard query"
			name="query"
			placeholder="Add breadboard query"
			disabled={!breadboard.url}
		/>
	);
};

export default BreadboardQuery;
