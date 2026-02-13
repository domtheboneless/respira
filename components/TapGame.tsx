import React, { useState, useEffect } from "react";
import { Language } from "../types";

interface Props {
	language: Language;
}

const TapGame: React.FC<Props> = ({ language }) => {
	const [cigarettes, setCigarettes] = useState<
		{ id: number; x: number; y: number }[]
	>([]);
	const [tapScore, setTapScore] = useState(0);

	useEffect(() => {
		const spawnInterval = setInterval(() => {
			setCigarettes(prev => [
				...prev,
				{
					id: Date.now(),
					x: Math.random() * 70 + 10, // 10-80%
					y: Math.random() * 50 + 20, // 20-70%
				},
			]);
		}, 1500);

		// Auto-remove after 3 seconds
		const cleanupInterval = setInterval(() => {
			setCigarettes(prev => prev.filter(c => Date.now() - c.id < 3000));
		}, 500);

		return () => {
			clearInterval(spawnInterval);
			clearInterval(cleanupInterval);
		};
	}, []);

	const handleCigaretteTap = (id: number) => {
		setTapScore(s => s + 1);
		setCigarettes(prev => prev.filter(c => c.id !== id));
	};

	return (
		<div className="animate-fadeIn">
			<h4 className="text-lg font-bold text-gray-700 mb-3 text-center">
				{language === "en"
					? "🎯 Crush the Cigarettes!"
					: "🎯 Schiaccia le Sigarette!"}
			</h4>
			<div className="relative w-full h-48 bg-gradient-to-b from-indigo-50 to-purple-50 rounded-2xl overflow-hidden">
				{cigarettes.map(cig => (
					<button
						key={cig.id}
						onClick={() => handleCigaretteTap(cig.id)}
						className="absolute w-10 h-10 text-3xl animate-bounce hover:scale-125 transition-transform"
						style={{ left: `${cig.x}%`, top: `${cig.y}%` }}>
						🚬
					</button>
				))}
				<div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full font-bold text-indigo-600 shadow-md">
					💪 {tapScore}
				</div>
			</div>
		</div>
	);
};

export default TapGame;
