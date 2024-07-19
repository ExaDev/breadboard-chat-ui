import clsx from "clsx";
import styles from "./input.module.scss";
import Spinner from "../Spinner";

type ButtonProps = {
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	title: string;
	loading?: boolean;
	align?: "flex-start" | "center" | "flex-end";
};
const Button: React.FC<ButtonProps> = ({
	title,
	onClick,
	type = "button",
	loading,
	align = "flex-end"
}: ButtonProps) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};
	const alignStyle = {
		alignSelf: align
	};
	return (
		<button type={type} onClick={handleClick} style={alignStyle} className={clsx(styles.button, loading ? styles.loading : undefined)}>
			{title}
			{loading && <Spinner />}
		</button>
	);
};

export default Button;
