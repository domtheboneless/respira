import React from "react";
import { Language } from "../types";

interface Props {
	countdown: number;
	language: Language;
}

const Milestones: React.FC<Props> = ({ countdown, language }) => {
	const milestones = [
		{
			time: 120,
			text:
				language === "en"
					? "2 min - Heart rate normalizes"
					: "2 min - Il battito cardiaco si normalizza",
		},
		{
			time: 300,
			text:
				language === "en"
					? "5 min - Improved oxygenation"
					: "5 min - Ossigenazione migliorata",
		},
		{
			time: 480,
			text:
				language === "en"
					? "8 min - Nicotine levels halved"
					: "8 min - Livelli di nicotina dimezzati",
		},
		{
			time: 570,
			text:
				language === "en"
					? "9.5 min - Almost there!"
					: "9.5 min - Quasi fatto!",
		},
	];

	return (
		<div className="mb-4 space-y-2 max-h-24 overflow-y-auto">
			{milestones.map(
				(m, i) =>
					countdown <= 600 - m.time && (
						<div key={i} className="bg-green-50 p-2 rounded-xl animate-fadeIn">
							<p className="text-green-700 text-xs font-medium">✅ {m.text}</p>
						</div>
					),
			)}
		</div>
	);
};

export default Milestones;
