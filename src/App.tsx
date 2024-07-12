import "./App.css";
import BreadboardForm from "./components/BreadboardForm";
import ChatComponent from "./components/chat/ChatComponent";
import layoutStyles from "./styles/layout.module.scss";

function App() {
	return (
		<div className={layoutStyles.flexVertical}>
			<BreadboardForm />
      <ChatComponent />
		</div>
	);
}

export default App;
