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
			{/* <Button title="Details" onClick={() => onOutput("Redraw")} align="center" /> */}
		</div>
	);
};

export default CanvasWithRedraw;

export type OnOutputType = Pick<CanvasWithRedrawProps, "onOutput">;
export type OnLoadType = CanvasWithRedrawProps["onLoad"];

export type CanvasParamType = Parameters<typeof CanvasWithRedraw>;
export type CanvasReturnType = ReturnType<typeof CanvasWithRedraw>;