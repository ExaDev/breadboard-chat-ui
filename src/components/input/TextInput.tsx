import styles from "./input.module.scss";

type TextInputProps = {
	value?: string;
	onChange?: (value: string) => void;
	label?: string;
	name: string;
	type?: "text" | "password" | "email" | "number";
	placeholder?: string;
	disabled?: boolean;
	onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
const TextInput = ({
	value,
	onChange,
	label,
	name,
	type = "text",
	placeholder,
	disabled,
	onKeyPress,
}: TextInputProps): React.JSX.Element => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e.target.value);
		}
	};
	return (
		<div className={styles.inputContainer}>
			<label htmlFor={name}>{label}</label>
			<input
				className={styles.input}
				type={type}
				name={name}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
				onKeyUpCapture={onKeyPress}
			/>
		</div>
	);
};

export default TextInput;
