import { useState } from "react";
import TextInput from "../input/TextInput";
import Form from "./Form";
import Select from "../input/Select";
import Button from "../input/Button";
import layoutStyles from "../../styles/layout.module.scss";


const PetFinderForm: React.FC = () => {
	const [petName, setPetName] = useState("");
	const [petType, setPetType] = useState("cat");
	const handlePetNameChange = (value: string) => {
		setPetName(value);
	}
	return (
		<Form>
			<div className={layoutStyles.flexVertical}>
			<h3>Find a pet</h3>
			<TextInput
				label="Pet Name"
				name="petName"
				value={petName}
				onChange={handlePetNameChange}
			/>
			<Select
				label="Pet Type"
				name="petType"
				value={petType}
				onChange={setPetType}
				options={[
					{ value: "cat", label: "Cat" },
					{ value: "dog", label: "Dog" },
				]} />
				<Button title="Find" />
				</div>
		</Form>
	);
};

export default PetFinderForm;
