import React, { useState } from "react";
import { Language } from "../types";

interface Props {
	language: Language;
}

const QuickTapTapGame: React.FC<Props> = ({ language }) => {
	const [tapCount, setTapCount] = useState(0);

	return (
		<div className="flex flex-col items-center py-4 animate-fadeIn">
			<p className="text-indigo-700 mb-3 text-center">
				{language === "en"
					? "Tap the button as fast as you can!"
					: "Tocca il pulsante più veloce che puoi!"}
			</p>
			<button
				onClick={() => setTapCount(c => c + 1)}
				className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white font-bold text-3xl shadow-xl active:scale-90 transition-transform">
				{tapCount}
			</button>
		</div>
	);
};

export default QuickTapTapGame;
