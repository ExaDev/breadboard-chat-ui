import clsx from "clsx";
import { PropsWithChildren } from "react";

type LayoutProps = {
	className?: string;
	gap?: number;
	flexDirection?: "row" | "column";
	alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline',
	justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly',
} & PropsWithChildren;
const Layout: React.FC<LayoutProps> = ({
	className = "Layout",
	gap,
	flexDirection = "column",
	alignItems,
	justifyContent,
	children,
}) => {
	const styles = {
		display: "flex",
		flexDirection: flexDirection,
		gap: `${gap}px`,
		alignItems,
		justifyContent,
	};
	return (
		<div style={styles} className={clsx(className)} data-cy="Layout">
			{children}
		</div>
	);
};

export default Layout;
