import React, { useEffect } from "react";

export type CanvasProps = {
	width?: number;
	height?: number;
	onLoad?: (canvas2DContext: CanvasRenderingContext2D) => void;
};
const Canvas: React.FC<CanvasProps> = ({
	width,
	height,
	onLoad,
}) => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const context = canvas.getContext("2d");
			if (context && onLoad) {
				try {
					onLoad(context);
				} catch (error) {
					console.error(error);
				}
			}
		}
	}, [canvasRef, onLoad]);
	return (
		<canvas
			width={width}
			height={height}
			ref={canvasRef}
		/>
	);
};

export default Canvas;
