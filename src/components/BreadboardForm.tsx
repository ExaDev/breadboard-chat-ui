
import BreadboardUrl from "./BreadboardUrl";
import Frame from "./Frame";
import layoutStyles from '../styles/layout.module.scss'
import clsx from "clsx";
import BreadboardKey from "./BreadboardKey";
const BreadboardForm: React.FC = () => {
	return (
		<Frame label="Breadboard">
			<div className={clsx(layoutStyles.flexVertical)}>
				<BreadboardUrl />
				<BreadboardKey />
			</div>
		</Frame>
	);
};

export default BreadboardForm;
