import { PropsWithChildren } from "react";
import colorStyles from "../../styles/color.module.scss";
import layoutStyles from "../../styles/layout.module.scss";
import clsx from "clsx";

type FormProps = PropsWithChildren;
const Form = ({ children}: FormProps): React.JSX.Element => {
	return (
		<form className={clsx(colorStyles.lightBg, layoutStyles.padding, layoutStyles.rounded)}>
			{children}
		</form>
	);
};

export default Form;
