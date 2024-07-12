import clsx from "clsx";
import styles from "./input.module.scss";
import Spinner from "../Spinner";

type ButtonProps = {
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	title: string;
	loading?: boolean;
};
const Button: React.FC<ButtonProps> = ({
	title,
	onClick,
	type = "button",
	loading,
}: ButtonProps) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};
	return (
		<button type={type} onClick={handleClick} className={clsx(styles.button, loading ? styles.loading : undefined)}>
			{title}
			{loading && <Spinner />}
		</button>
	);
};

export default Button;
