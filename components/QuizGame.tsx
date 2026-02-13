import React, { useState } from "react";
import { Language } from "../types";

interface Props {
	language: Language;
}

const QUIZ_QUESTIONS = {
	en: [
		{
			q: "What's your favorite movie genre?",
			opts: ["Action", "Comedy", "Drama", "Sci-Fi"],
		},
		{
			q: "Where would you like to travel?",
			opts: ["Beach", "Mountains", "City", "Desert"],
		},
		{
			q: "Your favorite season?",
			opts: ["Spring", "Summer", "Fall", "Winter"],
		},
		{ q: "Preferred pet?", opts: ["Dog", "Cat", "Bird", "Fish"] },
		{ q: "Favorite food?", opts: ["Italian", "Asian", "Mexican", "American"] },
		{ q: "Dream car?", opts: ["Sports", "SUV", "Electric", "Classic"] },
		{
			q: "Ideal vacation?",
			opts: ["Adventure", "Relaxing", "Cultural", "Party"],
		},
		{
			q: "Morning or night person?",
			opts: ["Early bird", "Night owl", "Depends", "Both"],
		},
	],
	it: [
		{
			q: "Qual è il tuo genere di film preferito?",
			opts: ["Azione", "Commedia", "Drammatico", "Sci-Fi"],
		},
		{
			q: "Dove vorresti viaggiare?",
			opts: ["Mare", "Montagna", "Città", "Deserto"],
		},
		{
			q: "La tua stagione preferita?",
			opts: ["Primavera", "Estate", "Autunno", "Inverno"],
		},
		{ q: "Animale preferito?", opts: ["Cane", "Gatto", "Uccello", "Pesce"] },
		{
			q: "Cibo preferito?",
			opts: ["Italiano", "Asiatico", "Messicano", "Americano"],
		},
		{
			q: "Auto dei sogni?",
			opts: ["Sportiva", "SUV", "Elettrica", "Classica"],
		},
		{
			q: "Vacanza ideale?",
			opts: ["Avventura", "Relax", "Culturale", "Festa"],
		},
		{
			q: "Mattiniero o nottambulo?",
			opts: ["Mattiniero", "Nottambulo", "Dipende", "Entrambi"],
		},
	],
};

const QuizGame: React.FC<Props> = ({ language }) => {
	const [currentQuestion, setCurrentQuestion] = useState(
		Math.floor(Math.random() * QUIZ_QUESTIONS[language].length),
	);
	const [quizScore, setQuizScore] = useState(0);

	const handleQuizAnswer = () => {
		setQuizScore(s => s + 1);
		const questions = QUIZ_QUESTIONS[language];
		setCurrentQuestion((currentQuestion + 1) % questions.length);
	};

	return (
		<div className="animate-fadeIn">
			<h4 className="text-lg font-bold text-gray-700 mb-3 text-center">
				{language === "en" ? "🧠 Quick Quiz" : "🧠 Quiz Veloce"}
			</h4>
			<div className="bg-gradient-to-b from-purple-50 to-indigo-50 p-4 rounded-2xl">
				<p className="font-medium text-gray-800 mb-4 text-center">
					{QUIZ_QUESTIONS[language][currentQuestion].q}
				</p>
				<div className="grid grid-cols-2 gap-2">
					{QUIZ_QUESTIONS[language][currentQuestion].opts.map((opt, i) => (
						<button
							key={i}
							onClick={handleQuizAnswer}
							className="py-3 bg-white border-2 border-indigo-100 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 transition-all font-medium text-sm">
							{opt}
						</button>
					))}
				</div>
				<p className="text-center text-sm text-gray-500 mt-3">
					{language === "en"
						? `Score: ${quizScore}`
						: `Punteggio: ${quizScore}`}
				</p>
			</div>
		</div>
	);
};

export default QuizGame;
