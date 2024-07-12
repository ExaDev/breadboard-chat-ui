import styles from "./Spinner.module.scss";

const Spinner = (): React.JSX.Element => {
	return (
		<div className={styles['lds-ring']}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

export default Spinner;
