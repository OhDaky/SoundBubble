import React from "react";
import { notes } from "./helpers";
import Octave from "./Octave";

const Piano = ({ handleClick }): JSX.Element => {
	// const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
	// 	console.log(e.currentTarget.value);
	// 	const audio = new Audio(`sounds/piano_${e.currentTarget.value}.mp3`);
	// 	audio.play();
	// };

	return <Octave notes={notes} clickHandler={handleClick} />;
};

export default Piano;
