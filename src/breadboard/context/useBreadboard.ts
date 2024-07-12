import React from "react";
import { BreadboardContext } from "./BreadboardContext";

export const useBreadboard = () => {
	const context = React.useContext(BreadboardContext);
	if (!context) {
		throw new Error("useBreadboard must be used within a BreadboardProvider");
	}
	return context;
};
