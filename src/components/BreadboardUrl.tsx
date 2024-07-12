import { useBreadboard } from "../breadboard/context/useBreadboard";
import TextInput from "./input/TextInput";

const BreadboardUrl: React.FC = () => {
	const breadboard = useBreadboard();
	return (
		<TextInput value={breadboard.url || ""} onChange={breadboard.setUrl} label="Breadboard URL" name="url" placeholder="Add breadboard URL" />
	);
};

export default BreadboardUrl;
