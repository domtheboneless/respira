import React, { useState, useEffect } from "react";
import { Language } from "../types";
import BreathingGame from "./BreathingGame";
import TapGame from "./TapGame";
import QuizGame from "./QuizGame";
import QuickTapTapGame from "./QuickTapGame";

interface Props {
	language: Language;
}

type GameType = "breathing" | "tap" | "quiz" | "quicktap";

const MiniGames: React.FC<Props> = ({ language }) => {
	const [currentGame, setCurrentGame] = useState<GameType>("breathing");

	// Game rotation every 90 seconds

	// Funzione per cambiare gioco (usata sia dall'auto-rotate che dal pulsante)
	const changeGame = () => {
		const games: GameType[] = ["breathing", "tap", "quiz", "quicktap"];
		const currentIndex = games.indexOf(currentGame);
		const nextGame = games[(currentIndex + 1) % games.length];
		setCurrentGame(nextGame);
	};

	return (
		<>
			{/* Container del gioco */}
			<div className="flex-1 flex flex-col justify-center mb-3">
				{currentGame === "breathing" && <BreathingGame language={language} />}
				{currentGame === "tap" && <TapGame language={language} />}
				{currentGame === "quiz" && <QuizGame language={language} />}
				{currentGame === "quicktap" && <QuickTapTapGame language={language} />}
			</div>

			{/* Pulsante per cambiare gioco - più piccolo */}
			<button
				onClick={changeGame}
				className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center gap-1.5 group mx-auto mb-4 py-1.5 px-3 rounded-lg hover:bg-indigo-50 transition-all">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
				<span>{language === "en" ? "Change Activity" : "Cambia Attività"}</span>
			</button>
		</>
	);
};

export default MiniGames;
