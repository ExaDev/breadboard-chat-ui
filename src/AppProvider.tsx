import React, { PropsWithChildren } from "react";
import { BreadboardProvider } from "./breadboard/context/BreadboardContext";

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<React.StrictMode>
			<BreadboardProvider>{children}</BreadboardProvider>
		</React.StrictMode>
	);
};
