import React, { PropsWithChildren } from "react";
import { BreadboardProvider } from "./breadboard/context/BreadboardContext";
import { BrowserRouter } from "react-router-dom";

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<React.StrictMode>
			<BrowserRouter basename="/breadboard-chat-ui/">
				<BreadboardProvider>{children}</BreadboardProvider>
			</BrowserRouter>
		</React.StrictMode>
	);
};
