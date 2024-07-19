import Button from "../../input/Button";
import Canvas, { CanvasProps } from "./Canvas";
import layoutStyles from "../../../styles/layout.module.scss";
import clsx from "clsx";

type CanvasWithRedrawProps = {
	onOutput: <T>(output: T) => void;
} & CanvasProps;
const CanvasWithRedraw: React.FC<CanvasWithRedrawProps> = ({ onOutput, ...canvasProps }) => {
	return (
		<div className={clsx(layoutStyles.flexVertical, layoutStyles.alignItemsCenter, layoutStyles.justifyCenter)}>
			<Canvas {...canvasProps} />
			<Button title="Redraw" onClick={() => onOutput("Redraw")} align="center" />
		</div>
	);
};

export default CanvasWithRedraw;
