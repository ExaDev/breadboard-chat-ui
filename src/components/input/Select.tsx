import { ChangeEvent } from "react";
import styles from "./input.module.scss";

export type selectOption = {
	value: string;
	label: string;
};


type SelectProps = {
	value?: string;
	onChange?: (value: string) => void;
	label?: string;
	name: string;
	type?: "text" | "password" | "email" | "number";
	placeholder?: string;
	disabled?: boolean;
	options: selectOption[];
};
const Select = ({
	value,
	onChange,
	label,
	name,
	disabled,
	options,
}: SelectProps): React.JSX.Element => {
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		if (onChange) {
			onChange(e.target.value);
		}
	};
	return (
		<div className={styles.inputContainer}>
			<label htmlFor={name}>{label}</label>
			<div className={styles.Select}>
			<select
				name={name}
				value={value}
				onChange={handleChange}
				disabled={disabled}
			>
				{options.map((option) => (
					
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
				</select>
			</div>
		</div>
	);
};

export default Select;
