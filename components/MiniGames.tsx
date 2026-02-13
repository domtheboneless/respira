import React, { useState, useEffect } from "react";
import { Language } from "../types";
import BreathingGame from "./BreathingGame";
import TapGame from "./TapGame";
import QuizGame from "./QuizGame";

interface Props {
	language: Language;
}

type GameType = "breathing" | "tap" | "quiz";

const MiniGames: React.FC<Props> = ({ language }) => {
	const [currentGame, setCurrentGame] = useState<GameType>("breathing");

	// Game rotation every 90 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			const games: GameType[] = ["breathing", "tap", "quiz"];
			const currentIndex = games.indexOf(currentGame);
			const nextGame = games[(currentIndex + 1) % games.length];
			setCurrentGame(nextGame);
		}, 90000); // 90 seconds

		return () => clearInterval(interval);
	}, [currentGame]);

	return (
		<div className="flex-1 flex flex-col justify-center mb-4">
			{currentGame === "breathing" && <BreathingGame language={language} />}
			{currentGame === "tap" && <TapGame language={language} />}
			{currentGame === "quiz" && <QuizGame language={language} />}
		</div>
	);
};

export default MiniGames;
