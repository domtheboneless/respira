import React, { useState, useEffect } from "react";
import { Language } from "../types";

interface Props {
	language: Language;
}

const BreathingGame: React.FC<Props> = ({ language }) => {
	const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">(
		"inhale",
	);
	const [breathCount, setBreathCount] = useState(0);

	useEffect(() => {
		const phases: Array<"inhale" | "hold" | "exhale"> = [
			"inhale",
			"hold",
			"exhale",
		];
		const durations = [4000, 4000, 6000]; // Inhale 4s, Hold 4s, Exhale 6s
		let phaseIndex = 0;
		let timeout: NodeJS.Timeout;

		const cycle = () => {
			setBreathPhase(phases[phaseIndex]);
			timeout = setTimeout(() => {
				phaseIndex = (phaseIndex + 1) % 3;
				if (phaseIndex === 0) setBreathCount(c => c + 1);
				cycle();
			}, durations[phaseIndex]);
		};

		cycle();

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, []);

	return (
		<div className="text-center animate-fadeIn">
			<h4 className="text-lg font-bold text-gray-700 mb-3">
				{language === "en"
					? "🫁 Breathing Exercise"
					: "🫁 Esercizio di Respirazione"}
			</h4>
			<div className="relative w-32 h-32 mx-auto mb-4">
				<div
					className={`absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full transition-all duration-1000 ${
						breathPhase === "inhale"
							? "scale-100"
							: breathPhase === "hold"
								? "scale-100"
								: "scale-75"
					}`}
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-white font-bold text-sm">
						{breathPhase === "inhale"
							? language === "en"
								? "🌬️ Inhale"
								: "🌬️ Inspira"
							: breathPhase === "hold"
								? language === "en"
									? "⏸️ Hold"
									: "⏸️ Trattieni"
								: language === "en"
									? "💨 Exhale"
									: "💨 Espira"}
					</span>
				</div>
			</div>
			<p className="text-sm text-gray-500">
				{language === "en"
					? `Breaths completed: ${breathCount}`
					: `Respiri completati: ${breathCount}`}
			</p>
		</div>
	);
};

export default BreathingGame;
