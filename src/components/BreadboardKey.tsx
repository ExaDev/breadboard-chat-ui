import { useBreadboard } from "../breadboard/context/useBreadboard";
import TextInput from "./input/TextInput";

const BreadboardKey: React.FC = () => {
	const breadboard = useBreadboard();
	return (
		<TextInput
			value={breadboard.key || ""}
			onChange={breadboard.setApiKey}
			label="Model API Key"
			name="key"
			type="password"
		/>
	);
};

export default BreadboardKey;
