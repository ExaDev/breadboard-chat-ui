import React, { useState } from 'react';
import { colors } from '../constants/colors';
import CanvasWithRedraw from './chat/Canvas/CanvasWithRedraw';
import Frame from './Frame';
import Layout from './Layout';

const CanvasDrawExample: React.FC = () => {
	const width = 150;
	const height = 150;

	const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
	const [triangleColor, setTriangleColor] = useState(randomColor());
	const [squareColor, setSquareColor] = useState(randomColor());
	const draw2DTriangle = (context: CanvasRenderingContext2D) => {
		context.beginPath();
		context.moveTo(width / 2, 0);
		context.lineTo(width, height);
		context.lineTo(0, height);
		context.closePath();
		context.fillStyle = triangleColor;
		context.fill();
	};
	const redrawTriangle = () => {
		setTriangleColor(randomColor());
	};
	const draw2DSquare = (context: CanvasRenderingContext2D) => {
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(width, 0);
		context.lineTo(width, height);
		context.lineTo(0, height);
		context.closePath();
		context.fillStyle = squareColor;
		context.fill();
	};
	const redrawSquare = () => {
		setSquareColor(randomColor());
	};

	return (
		<Layout gap={32}>
			<Frame label="Triangle">
				<CanvasWithRedraw
					width={width}
					height={height}
					onLoad={draw2DTriangle}
					onOutput={redrawTriangle}
				/>
			</Frame>
			<Frame label="Square">
				<CanvasWithRedraw
					width={width}
					height={height}
					onLoad={draw2DSquare}
					onOutput={redrawSquare}
				/>
			</Frame>
		</Layout>
	);
};

export default CanvasDrawExample;
