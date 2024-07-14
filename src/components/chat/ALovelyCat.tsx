import { LoremFlickr } from "./LoremFlickr";
import Reply from "./Reply";

const ALovelyCat: React.FC = () => {
	return (
		<Reply owner="model">
			<LoremFlickr width={300} height={300} keywords={["cat"]} />
		</Reply>
	);
};

export default ALovelyCat;
