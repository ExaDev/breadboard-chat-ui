import { Route, Routes } from "react-router-dom";
import "./App.css";
import BreadboardForm from "./components/BreadboardForm";
import ChatComponent from "./components/chat/ChatComponent";
import layoutStyles from "./styles/layout.module.scss";
import Testing from "./components/Testing";

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<div className={layoutStyles.flexVertical}>
						<BreadboardForm />
						<ChatComponent />
					</div>
				}
			/>
			<Route path="/testing" element={<Testing />} />
		</Routes>
	);
}

export default App;
