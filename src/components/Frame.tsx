import { PropsWithChildren } from "react";
import styles from "./Frame.module.scss";
import clsx from "clsx";

type FrameProps = {
	label?: string;
} & PropsWithChildren;
const Frame = ({ label, children }: FrameProps): React.JSX.Element => {
	return (
		<div className={clsx(styles.frame)} data-cy="Frame">
			{!!label && <span className={clsx(styles.label)}>{label}</span>}
			{children}
		</div>
	);
};

export default Frame;
