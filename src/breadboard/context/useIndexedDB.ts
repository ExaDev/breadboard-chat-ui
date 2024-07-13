import { useEffect, useState } from "react";
export function useIndexedDB<
	T,
	O extends {
		name: string;
		value: T;
	} = {
		name: string;
		value: T;
	}
>({
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

	const openDatabase = (): Promise<IDBDatabase> => {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, 1);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(objectStoreName)) {
					db.createObjectStore(objectStoreName, {
						keyPath: "id",
						autoIncrement: true,
					});
				}
			};

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = () => {
				reject(request.error);
			};
		});
	};

	const getValue = async (): Promise<T> => {
		try {
			const db = await openDatabase();
			return new Promise((resolve) => {
				const transaction = db.transaction(objectStoreName, "readonly");
				const store = transaction.objectStore(objectStoreName);
				const request = store.getAll();

				request.onsuccess = () => {
					const allItems = request.result;
					const item = allItems.find((item: O) => item.name === name);
					resolve(item ? item.value : initialValue);
				};

				request.onerror = () => {
					console.error("Error getting value from IndexedDB:", request.error);
					resolve(initialValue);
				};
			});
		} catch (error) {
			console.error("Error getting value from IndexedDB:", error);
			return initialValue;
		}
	};

	const setValueInDB = async (value: T) => {
		try {
			const db = await openDatabase();
			return new Promise((resolve, reject) => {
				const transaction = db.transaction(objectStoreName, "readwrite");
				const store = transaction.objectStore(objectStoreName);
				const request = store.getAll();

				request.onsuccess = () => {
					const allItems = request.result;
					const item = allItems.find((item: O) => item.name === name);

					if (item) {
						item.value = value;
						const updateRequest = store.put(item);

						updateRequest.onsuccess = () => {
							resolve(undefined);
						};

						updateRequest.onerror = () => {
							console.error(
								"Error updating value in IndexedDB:",
								updateRequest.error
							);
							reject(updateRequest.error);
						};
					} else {
						const addRequest = store.add({ name, value });

						addRequest.onsuccess = () => {
							resolve(undefined);
						};

						addRequest.onerror = () => {
							console.error(
								"Error adding value to IndexedDB:",
								addRequest.error
							);
							reject(addRequest.error);
						};
					}
				};

				request.onerror = () => {
					console.error("Error getting items from IndexedDB:", request.error);
					reject(request.error);
				};
			});
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
