import BreadboardQuery from "./BreadboardQuery";
import BreadboardUrl from "./BreadboardUrl";
import Frame from "./Frame";
import layoutStyles from '../styles/layout.module.scss'
import clsx from "clsx";
import Button from "./input/Button";

const BreadboardForm: React.FC = () => {
	return (
		<Frame label="Breadboard">
			<div className={clsx(layoutStyles.flexVertical)}>
				<BreadboardUrl />
				<BreadboardQuery />
				<Button title="Run" />
			</div>
		</Frame>
	);
};

export default BreadboardForm;
