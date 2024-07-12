import { openDB } from "idb";
import { useEffect, useState } from "react";

export function useIndexedDB<T>({
	dbName = "settings",
	objectStoreName = "Secrets",
	name,
	initialValue,
}: {
	dbName: string;
	objectStoreName: string;
	name: string;
	initialValue: T;
}): [T, (value: T) => void] {
	const [value, setValue] = useState<T>(initialValue);

	useEffect(() => {
		(async () => {
			const storedValue = await getValue();
			setValue(storedValue);
		})();
	}, []);

	const openDatabase = async () => {
		return openDB(dbName, 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(objectStoreName)) {
					db.createObjectStore(objectStoreName, {
						keyPath: "id",
						autoIncrement: true,
					});
				}
			},
		});
	};

	const getValue = async (): Promise<T> => {
		try {
			const db = await openDatabase();
			const tx = db.transaction(objectStoreName, "readonly");
			const store = tx.objectStore(objectStoreName);
			const allItems = await store.getAll();
			const item = allItems.find((item) => item.name === name);
			return item ? item.value : initialValue;
		} catch (error) {
			console.error("Error getting value from IndexedDB:", error);
			return initialValue;
		}
	};

	const setValueInDB = async (value: T) => {
		try {
			const db = await openDatabase();
			const tx = db.transaction(objectStoreName, "readwrite");
			const store = tx.objectStore(objectStoreName);
			const allItems = await store.getAll();
			const item = allItems.find((item) => item.name === name);

			if (item) {
				item.value = value;
				await store.put(item);
			} else {
				await store.add({ name, value });
			}
			await tx.done;
		} catch (error) {
			console.error("Error setting value in IndexedDB:", error);
		}
	};

	const setStoredValue = (value: T) => {
		setValue(value);
		setValueInDB(value);
	};

	return [value, setStoredValue];
}
