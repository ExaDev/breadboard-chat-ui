import clsx from "clsx";
import { PropsWithChildren } from "react";

type LayoutProps = {
	className?: string;
	gap: number;
	flexDirection?: "row" | "column";
} & PropsWithChildren;
const Layout: React.FC<LayoutProps> = ({
	className = "Layout",
	gap,
	flexDirection = "column",
	children,
}) => {
	const styles = {
		display: "flex",
		flexDirection: flexDirection,
		gap: `${gap}px`,
	};
	return (
		<div style={styles} className={clsx(className)} data-cy="Layout">
			{children}
		</div>
	);
};

export default Layout;
