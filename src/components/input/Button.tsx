import clsx from "clsx";
import styles from "./input.module.scss";
import Spinner from "../Spinner";

type ButtonProps = {
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	title: string;
	loading?: boolean;
	align?: "flex-start" | "center" | "flex-end";
	disabled?: boolean;
};
const Button: React.FC<ButtonProps> = ({
	title,
	onClick,
	type = "button",
	loading,
	align = "flex-end",
	disabled,
}: ButtonProps) => {
	const handleClick = () => {
		if (onClick && !disabled && !loading) {
			onClick();
		}
	};
	const alignStyle = {
		alignSelf: align
	};
	return (
		<button type={type} disabled={disabled} onClick={handleClick} style={alignStyle} className={clsx(styles.button, loading ? styles.loading : undefined)}>
			{title}
			{loading && <Spinner />}
		</button>
	);
};

export default Button;
