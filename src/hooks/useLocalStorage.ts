import { useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
	const getValue = () => {
		const value = localStorage.getItem(key);
		if (value) {
			return JSON.parse(value);
		}
		return initialValue;
	};

	const [storedValue, setStoredValue] = useState<T>(getValue);

	const setValue = (value: T) => {
		setStoredValue(value);
		localStorage.setItem(key, JSON.stringify(value));
	};

	return [storedValue, setValue];
};