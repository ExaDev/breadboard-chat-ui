import { useState } from "react";

export const useLocalStorage = <T>(
	key: string,
	initialValue: T
): [T, (value: T) => void] => {
	const getValue = () => {
		const value = localStorage.getItem(key);
		if (value) {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		}
		return initialValue;
	};

	const [storedValue, setStoredValue] = useState<T>(getValue);

	const setValue = (value: T) => {
		setStoredValue(value);
		if (typeof value != "string") {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.setItem(key, value);
		}
	};

	return [storedValue, setValue];
};
