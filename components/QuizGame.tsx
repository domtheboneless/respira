import React, { useState, useEffect } from "react";
import { Language } from "../types";

interface Props {
	language: Language;
}

interface Question {
	q: string;
	opts: string[];
	correct: number;
}

const QUIZ_QUESTIONS: Record<Language, Question[]> = {
	en: [
		// Geografia
		{
			q: "What is the capital of France?",
			opts: ["London", "Berlin", "Paris", "Madrid"],
			correct: 2,
		},
		{
			q: "What is the largest ocean?",
			opts: ["Atlantic", "Indian", "Arctic", "Pacific"],
			correct: 3,
		},
		{
			q: "What is the capital of Japan?",
			opts: ["Seoul", "Tokyo", "Beijing", "Bangkok"],
			correct: 1,
		},
		{
			q: "Which country has the most population?",
			opts: ["USA", "India", "China", "Indonesia"],
			correct: 2,
		},
		{
			q: "What is the longest river in the world?",
			opts: ["Amazon", "Nile", "Yangtze", "Mississippi"],
			correct: 1,
		},
		{
			q: "What is the smallest country?",
			opts: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
			correct: 1,
		},
		{
			q: "Which continent is the Sahara Desert in?",
			opts: ["Asia", "Africa", "Australia", "South America"],
			correct: 1,
		},
		{
			q: "What is the capital of Australia?",
			opts: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
			correct: 2,
		},
		{
			q: "How many continents are there?",
			opts: ["5", "6", "7", "8"],
			correct: 2,
		},
		{
			q: "Which is the tallest mountain?",
			opts: ["K2", "Everest", "Kilimanjaro", "Denali"],
			correct: 1,
		},

		// Storia
		{
			q: "What year did World War II end?",
			opts: ["1943", "1944", "1945", "1946"],
			correct: 2,
		},
		{
			q: "Who was the first US President?",
			opts: ["Jefferson", "Washington", "Lincoln", "Adams"],
			correct: 1,
		},
		{
			q: "When did the Titanic sink?",
			opts: ["1910", "1912", "1914", "1916"],
			correct: 1,
		},
		{
			q: "Who discovered America?",
			opts: ["Magellan", "Columbus", "Vespucci", "Cortez"],
			correct: 1,
		},
		{
			q: "What year did WWI start?",
			opts: ["1912", "1914", "1916", "1918"],
			correct: 1,
		},
		{
			q: "Who built the Great Wall of China?",
			opts: ["Ming Dynasty", "Qin Dynasty", "Han Dynasty", "Tang Dynasty"],
			correct: 1,
		},
		{
			q: "When did the Berlin Wall fall?",
			opts: ["1987", "1989", "1991", "1993"],
			correct: 1,
		},
		{
			q: "Who was the first man on the moon?",
			opts: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"],
			correct: 1,
		},
		{
			q: "What year was the French Revolution?",
			opts: ["1789", "1799", "1809", "1819"],
			correct: 0,
		},
		{
			q: "Who was Julius Caesar?",
			opts: ["Greek King", "Roman Emperor", "Egyptian Pharaoh", "Persian Shah"],
			correct: 1,
		},

		// Scienza
		{
			q: "What is H2O commonly known as?",
			opts: ["Oxygen", "Water", "Hydrogen", "Air"],
			correct: 1,
		},
		{
			q: "What is the smallest planet?",
			opts: ["Mars", "Mercury", "Venus", "Pluto"],
			correct: 1,
		},
		{
			q: "What is the speed of light?",
			opts: ["299,792 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"],
			correct: 0,
		},
		{
			q: "How many bones in the human body?",
			opts: ["196", "206", "216", "226"],
			correct: 1,
		},
		{
			q: "What is the largest planet?",
			opts: ["Saturn", "Jupiter", "Neptune", "Uranus"],
			correct: 1,
		},
		{
			q: "What gas do plants absorb?",
			opts: ["Oxygen", "Nitrogen", "CO2", "Helium"],
			correct: 2,
		},
		{
			q: "What is DNA?",
			opts: ["Protein", "Enzyme", "Genetic code", "Hormone"],
			correct: 2,
		},
		{
			q: "What is the hardest natural substance?",
			opts: ["Gold", "Iron", "Diamond", "Titanium"],
			correct: 2,
		},
		{
			q: "What is the chemical symbol for gold?",
			opts: ["Go", "Gd", "Au", "Ag"],
			correct: 2,
		},
		{
			q: "How many teeth does an adult have?",
			opts: ["28", "30", "32", "34"],
			correct: 2,
		},

		// Matematica
		{
			q: "How many sides does a hexagon have?",
			opts: ["5", "6", "7", "8"],
			correct: 1,
		},
		{ q: "What is 15% of 200?", opts: ["25", "30", "35", "40"], correct: 1 },
		{
			q: "What is π (pi) approximately?",
			opts: ["3.14", "2.71", "1.41", "1.61"],
			correct: 0,
		},
		{ q: "What is 12 × 12?", opts: ["124", "134", "144", "154"], correct: 2 },
		{
			q: "What is the square root of 81?",
			opts: ["7", "8", "9", "10"],
			correct: 2,
		},
		{ q: "What is 50% of 80?", opts: ["30", "35", "40", "45"], correct: 2 },
		{
			q: "What comes after million?",
			opts: ["Trillion", "Billion", "Quadrillion", "Quintillion"],
			correct: 1,
		},
		{ q: "What is 7 × 8?", opts: ["54", "56", "58", "60"], correct: 1 },
		{
			q: "What is a right angle?",
			opts: ["45°", "60°", "90°", "180°"],
			correct: 2,
		},
		{
			q: "How many degrees in a circle?",
			opts: ["180", "270", "360", "450"],
			correct: 2,
		},

		// Arte e Cultura
		{
			q: "Who painted the Mona Lisa?",
			opts: ["Van Gogh", "Da Vinci", "Picasso", "Monet"],
			correct: 1,
		},
		{
			q: "Who wrote Romeo and Juliet?",
			opts: ["Dickens", "Shakespeare", "Austen", "Hemingway"],
			correct: 1,
		},
		{
			q: "Who composed the Ninth Symphony?",
			opts: ["Mozart", "Beethoven", "Bach", "Chopin"],
			correct: 1,
		},
		{
			q: "Who painted Starry Night?",
			opts: ["Van Gogh", "Monet", "Picasso", "Dalí"],
			correct: 0,
		},
		{
			q: "Who wrote 1984?",
			opts: ["Huxley", "Orwell", "Bradbury", "Vonnegut"],
			correct: 1,
		},
		{
			q: "Who sculpted David?",
			opts: ["Rodin", "Michelangelo", "Donatello", "Bernini"],
			correct: 1,
		},
		{
			q: "Who painted The Scream?",
			opts: ["Munch", "Klimt", "Kandinsky", "Miró"],
			correct: 0,
		},
		{
			q: "Who wrote Harry Potter?",
			opts: ["Tolkien", "Rowling", "Lewis", "Martin"],
			correct: 1,
		},
		{
			q: "Who directed Titanic?",
			opts: ["Spielberg", "Cameron", "Nolan", "Scorsese"],
			correct: 1,
		},
		{
			q: "Who wrote The Odyssey?",
			opts: ["Virgil", "Homer", "Sophocles", "Euripides"],
			correct: 1,
		},

		// Sport
		{
			q: "How many players in a soccer team?",
			opts: ["9", "10", "11", "12"],
			correct: 2,
		},
		{
			q: "Where were the first Olympics?",
			opts: ["Rome", "Greece", "Egypt", "Turkey"],
			correct: 1,
		},
		{
			q: "How many rings in Olympic logo?",
			opts: ["4", "5", "6", "7"],
			correct: 1,
		},
		{
			q: "What sport is Wimbledon?",
			opts: ["Golf", "Tennis", "Cricket", "Rugby"],
			correct: 1,
		},
		{
			q: "How many points for a basketball 3-pointer?",
			opts: ["2", "3", "4", "5"],
			correct: 1,
		},
		{
			q: "What sport uses a puck?",
			opts: ["Rugby", "Hockey", "Lacrosse", "Polo"],
			correct: 1,
		},
		{
			q: "How long is a marathon?",
			opts: ["26 miles", "30 miles", "42 km", "50 km"],
			correct: 2,
		},
		{
			q: "What is the diameter of a basketball hoop?",
			opts: ["16 inches", "18 inches", "20 inches", "22 inches"],
			correct: 1,
		},
		{
			q: "How many Grand Slams in tennis?",
			opts: ["3", "4", "5", "6"],
			correct: 1,
		},
		{
			q: "What color is the top belt in karate?",
			opts: ["Red", "Black", "White", "Brown"],
			correct: 1,
		},

		// Tecnologia
		{
			q: "Who founded Apple?",
			opts: ["Gates", "Jobs", "Zuckerberg", "Bezos"],
			correct: 1,
		},
		{
			q: "What does CPU stand for?",
			opts: [
				"Central Process Unit",
				"Central Processing Unit",
				"Computer Personal Unit",
				"Core Processing Unit",
			],
			correct: 1,
		},
		{
			q: "What year was Facebook founded?",
			opts: ["2002", "2004", "2006", "2008"],
			correct: 1,
		},
		{
			q: "What does WWW stand for?",
			opts: [
				"World Wide Web",
				"World Wide Wait",
				"Web World Wide",
				"Wide World Web",
			],
			correct: 0,
		},
		{
			q: "Who invented the telephone?",
			opts: ["Edison", "Bell", "Tesla", "Marconi"],
			correct: 1,
		},
		{
			q: "What does USB stand for?",
			opts: [
				"Universal Serial Bus",
				"United Serial Bus",
				"Universal System Bus",
				"United System Bus",
			],
			correct: 0,
		},
		{
			q: "What company makes the iPhone?",
			opts: ["Samsung", "Apple", "Google", "Microsoft"],
			correct: 1,
		},
		{
			q: "What does AI stand for?",
			opts: [
				"Artificial Intelligence",
				"Advanced Intelligence",
				"Automatic Intelligence",
				"Applied Intelligence",
			],
			correct: 0,
		},
		{
			q: "What year was Google founded?",
			opts: ["1996", "1998", "2000", "2002"],
			correct: 1,
		},
		{
			q: "What is the most used programming language?",
			opts: ["Java", "Python", "C++", "JavaScript"],
			correct: 1,
		},

		// Natura e Animali
		{
			q: "What is the largest land animal?",
			opts: ["Rhino", "Elephant", "Hippo", "Giraffe"],
			correct: 1,
		},
		{
			q: "How many legs does a spider have?",
			opts: ["6", "8", "10", "12"],
			correct: 1,
		},
		{
			q: "What is the fastest land animal?",
			opts: ["Lion", "Cheetah", "Leopard", "Tiger"],
			correct: 1,
		},
		{
			q: "What do bees produce?",
			opts: ["Milk", "Honey", "Silk", "Wax"],
			correct: 1,
		},
		{
			q: "What is a baby kangaroo called?",
			opts: ["Cub", "Joey", "Kit", "Pup"],
			correct: 1,
		},
		{
			q: "How many hearts does an octopus have?",
			opts: ["1", "2", "3", "4"],
			correct: 2,
		},
		{
			q: "What is the largest bird?",
			opts: ["Eagle", "Ostrich", "Albatross", "Condor"],
			correct: 1,
		},
		{
			q: "What animal is known as 'King of the Jungle'?",
			opts: ["Tiger", "Lion", "Bear", "Elephant"],
			correct: 1,
		},
		{
			q: "How many humps does a dromedary have?",
			opts: ["1", "2", "3", "4"],
			correct: 0,
		},
		{
			q: "What is the slowest animal?",
			opts: ["Turtle", "Sloth", "Snail", "Koala"],
			correct: 1,
		},

		// Cibo e Bevande
		{
			q: "What country is sushi from?",
			opts: ["China", "Japan", "Korea", "Thailand"],
			correct: 1,
		},
		{
			q: "What is the main ingredient in guacamole?",
			opts: ["Tomato", "Avocado", "Pepper", "Onion"],
			correct: 1,
		},
		{
			q: "What is the most consumed beverage?",
			opts: ["Coffee", "Water", "Tea", "Soda"],
			correct: 1,
		},
		{
			q: "What country invented pizza?",
			opts: ["France", "Italy", "Greece", "Spain"],
			correct: 1,
		},
		{
			q: "What is the spiciest pepper?",
			opts: ["Jalapeño", "Habanero", "Carolina Reaper", "Ghost Pepper"],
			correct: 2,
		},
		{
			q: "What is tofu made from?",
			opts: ["Rice", "Soy", "Wheat", "Corn"],
			correct: 1,
		},
		{
			q: "What fruit is wine made from?",
			opts: ["Apple", "Grapes", "Berries", "Plums"],
			correct: 1,
		},
		{
			q: "What is the main ingredient in bread?",
			opts: ["Rice", "Flour", "Corn", "Oats"],
			correct: 1,
		},
		{
			q: "What country is champagne from?",
			opts: ["Italy", "France", "Spain", "Germany"],
			correct: 1,
		},
		{
			q: "What is the most expensive spice?",
			opts: ["Vanilla", "Saffron", "Cardamom", "Cinnamon"],
			correct: 1,
		},

		// Miscellanea
		{
			q: "How many colors in a rainbow?",
			opts: ["5", "6", "7", "8"],
			correct: 2,
		},
		{
			q: "What is the largest organ?",
			opts: ["Liver", "Skin", "Brain", "Heart"],
			correct: 1,
		},
		{
			q: "How many hours in a day?",
			opts: ["12", "20", "24", "36"],
			correct: 2,
		},
		{
			q: "What is the opposite of hot?",
			opts: ["Warm", "Cool", "Cold", "Freezing"],
			correct: 2,
		},
		{
			q: "How many days in a leap year?",
			opts: ["364", "365", "366", "367"],
			correct: 2,
		},
		{
			q: "What is the currency of Japan?",
			opts: ["Yuan", "Yen", "Won", "Baht"],
			correct: 1,
		},
		{
			q: "What does GPS stand for?",
			opts: [
				"Global Position System",
				"Global Positioning System",
				"General Position System",
				"General Positioning System",
			],
			correct: 1,
		},
		{
			q: "How many zodiac signs are there?",
			opts: ["10", "11", "12", "13"],
			correct: 2,
		},
		{
			q: "What is the freezing point of water?",
			opts: ["-10°C", "0°C", "10°C", "32°C"],
			correct: 1,
		},
		{
			q: "How many minutes in an hour?",
			opts: ["50", "60", "70", "80"],
			correct: 1,
		},
	],
	it: [
		// Geografia
		{
			q: "Qual è la capitale della Francia?",
			opts: ["Londra", "Berlino", "Parigi", "Madrid"],
			correct: 2,
		},
		{
			q: "Qual è l'oceano più grande?",
			opts: ["Atlantico", "Indiano", "Artico", "Pacifico"],
			correct: 3,
		},
		{
			q: "Qual è la capitale del Giappone?",
			opts: ["Seoul", "Tokyo", "Pechino", "Bangkok"],
			correct: 1,
		},
		{
			q: "Quale paese ha più abitanti?",
			opts: ["USA", "India", "Cina", "Indonesia"],
			correct: 2,
		},
		{
			q: "Qual è il fiume più lungo?",
			opts: ["Rio delle Amazzoni", "Nilo", "Yangtze", "Mississippi"],
			correct: 1,
		},
		{
			q: "Qual è il paese più piccolo?",
			opts: ["Monaco", "Città del Vaticano", "San Marino", "Liechtenstein"],
			correct: 1,
		},
		{
			q: "In che continente si trova il Sahara?",
			opts: ["Asia", "Africa", "Australia", "Sud America"],
			correct: 1,
		},
		{
			q: "Qual è la capitale dell'Australia?",
			opts: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
			correct: 2,
		},
		{ q: "Quanti continenti ci sono?", opts: ["5", "6", "7", "8"], correct: 2 },
		{
			q: "Qual è la montagna più alta?",
			opts: ["K2", "Everest", "Kilimangiaro", "Denali"],
			correct: 1,
		},

		// Storia
		{
			q: "In che anno è finita la Seconda Guerra Mondiale?",
			opts: ["1943", "1944", "1945", "1946"],
			correct: 2,
		},
		{
			q: "Chi fu il primo presidente USA?",
			opts: ["Jefferson", "Washington", "Lincoln", "Adams"],
			correct: 1,
		},
		{
			q: "Quando affondò il Titanic?",
			opts: ["1910", "1912", "1914", "1916"],
			correct: 1,
		},
		{
			q: "Chi scoprì l'America?",
			opts: ["Magellano", "Colombo", "Vespucci", "Cortez"],
			correct: 1,
		},
		{
			q: "In che anno iniziò la Prima Guerra Mondiale?",
			opts: ["1912", "1914", "1916", "1918"],
			correct: 1,
		},
		{
			q: "Chi costruì la Grande Muraglia?",
			opts: ["Dinastia Ming", "Dinastia Qin", "Dinastia Han", "Dinastia Tang"],
			correct: 1,
		},
		{
			q: "Quando cadde il Muro di Berlino?",
			opts: ["1987", "1989", "1991", "1993"],
			correct: 1,
		},
		{
			q: "Chi fu il primo uomo sulla Luna?",
			opts: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"],
			correct: 1,
		},
		{
			q: "In che anno fu la Rivoluzione Francese?",
			opts: ["1789", "1799", "1809", "1819"],
			correct: 0,
		},
		{
			q: "Chi era Giulio Cesare?",
			opts: [
				"Re greco",
				"Imperatore romano",
				"Faraone egizio",
				"Shah persiano",
			],
			correct: 1,
		},

		// Scienza
		{
			q: "Come si chiama comunemente l'H2O?",
			opts: ["Ossigeno", "Acqua", "Idrogeno", "Aria"],
			correct: 1,
		},
		{
			q: "Qual è il pianeta più piccolo?",
			opts: ["Marte", "Mercurio", "Venere", "Plutone"],
			correct: 1,
		},
		{
			q: "Qual è la velocità della luce?",
			opts: ["299.792 km/s", "150.000 km/s", "500.000 km/s", "1.000.000 km/s"],
			correct: 0,
		},
		{
			q: "Quante ossa ha il corpo umano?",
			opts: ["196", "206", "216", "226"],
			correct: 1,
		},
		{
			q: "Qual è il pianeta più grande?",
			opts: ["Saturno", "Giove", "Nettuno", "Urano"],
			correct: 1,
		},
		{
			q: "Che gas assorbono le piante?",
			opts: ["Ossigeno", "Azoto", "CO2", "Elio"],
			correct: 2,
		},
		{
			q: "Cos'è il DNA?",
			opts: ["Proteina", "Enzima", "Codice genetico", "Ormone"],
			correct: 2,
		},
		{
			q: "Qual è la sostanza naturale più dura?",
			opts: ["Oro", "Ferro", "Diamante", "Titanio"],
			correct: 2,
		},
		{
			q: "Qual è il simbolo chimico dell'oro?",
			opts: ["Go", "Gd", "Au", "Ag"],
			correct: 2,
		},
		{
			q: "Quanti denti ha un adulto?",
			opts: ["28", "30", "32", "34"],
			correct: 2,
		},

		// Matematica
		{ q: "Quanti lati ha un esagono?", opts: ["5", "6", "7", "8"], correct: 1 },
		{
			q: "Quanto è il 15% di 200?",
			opts: ["25", "30", "35", "40"],
			correct: 1,
		},
		{
			q: "Quanto vale π (pi greco) circa?",
			opts: ["3,14", "2,71", "1,41", "1,61"],
			correct: 0,
		},
		{ q: "Quanto fa 12 × 12?", opts: ["124", "134", "144", "154"], correct: 2 },
		{
			q: "Qual è la radice quadrata di 81?",
			opts: ["7", "8", "9", "10"],
			correct: 2,
		},
		{ q: "Quanto è il 50% di 80?", opts: ["30", "35", "40", "45"], correct: 2 },
		{
			q: "Cosa viene dopo il milione?",
			opts: ["Trilione", "Miliardo", "Quadrilione", "Quintilione"],
			correct: 1,
		},
		{ q: "Quanto fa 7 × 8?", opts: ["54", "56", "58", "60"], correct: 1 },
		{
			q: "Quanto misura un angolo retto?",
			opts: ["45°", "60°", "90°", "180°"],
			correct: 2,
		},
		{
			q: "Quanti gradi ha un cerchio?",
			opts: ["180", "270", "360", "450"],
			correct: 2,
		},

		// Arte e Cultura
		{
			q: "Chi ha dipinto la Gioconda?",
			opts: ["Van Gogh", "Da Vinci", "Picasso", "Monet"],
			correct: 1,
		},
		{
			q: "Chi ha scritto Romeo e Giulietta?",
			opts: ["Dickens", "Shakespeare", "Austen", "Hemingway"],
			correct: 1,
		},
		{
			q: "Chi ha composto la Nona Sinfonia?",
			opts: ["Mozart", "Beethoven", "Bach", "Chopin"],
			correct: 1,
		},
		{
			q: "Chi ha dipinto la Notte Stellata?",
			opts: ["Van Gogh", "Monet", "Picasso", "Dalí"],
			correct: 0,
		},
		{
			q: "Chi ha scritto 1984?",
			opts: ["Huxley", "Orwell", "Bradbury", "Vonnegut"],
			correct: 1,
		},
		{
			q: "Chi ha scolpito il David?",
			opts: ["Rodin", "Michelangelo", "Donatello", "Bernini"],
			correct: 1,
		},
		{
			q: "Chi ha dipinto L'Urlo?",
			opts: ["Munch", "Klimt", "Kandinsky", "Miró"],
			correct: 0,
		},
		{
			q: "Chi ha scritto Harry Potter?",
			opts: ["Tolkien", "Rowling", "Lewis", "Martin"],
			correct: 1,
		},
		{
			q: "Chi ha diretto Titanic?",
			opts: ["Spielberg", "Cameron", "Nolan", "Scorsese"],
			correct: 1,
		},
		{
			q: "Chi ha scritto l'Odissea?",
			opts: ["Virgilio", "Omero", "Sofocle", "Euripide"],
			correct: 1,
		},

		// Sport
		{
			q: "Quanti giocatori in una squadra di calcio?",
			opts: ["9", "10", "11", "12"],
			correct: 2,
		},
		{
			q: "Dove furono le prime Olimpiadi?",
			opts: ["Roma", "Grecia", "Egitto", "Turchia"],
			correct: 1,
		},
		{
			q: "Quanti anelli nel logo olimpico?",
			opts: ["4", "5", "6", "7"],
			correct: 1,
		},
		{
			q: "Che sport si gioca a Wimbledon?",
			opts: ["Golf", "Tennis", "Cricket", "Rugby"],
			correct: 1,
		},
		{
			q: "Quanti punti vale un tiro da 3 nel basket?",
			opts: ["2", "3", "4", "5"],
			correct: 1,
		},
		{
			q: "Che sport usa un disco (puck)?",
			opts: ["Rugby", "Hockey", "Lacrosse", "Polo"],
			correct: 1,
		},
		{
			q: "Quanto è lunga una maratona?",
			opts: ["26 miglia", "30 miglia", "42 km", "50 km"],
			correct: 2,
		},
		{
			q: "Qual è il diametro del canestro?",
			opts: ["40 cm", "45 cm", "50 cm", "55 cm"],
			correct: 1,
		},
		{
			q: "Quanti tornei del Grande Slam nel tennis?",
			opts: ["3", "4", "5", "6"],
			correct: 1,
		},
		{
			q: "Che colore è la cintura più alta nel karate?",
			opts: ["Rossa", "Nera", "Bianca", "Marrone"],
			correct: 1,
		},

		// Tecnologia
		{
			q: "Chi ha fondato Apple?",
			opts: ["Gates", "Jobs", "Zuckerberg", "Bezos"],
			correct: 1,
		},
		{
			q: "Cosa significa CPU?",
			opts: [
				"Central Process Unit",
				"Central Processing Unit",
				"Computer Personal Unit",
				"Core Processing Unit",
			],
			correct: 1,
		},
		{
			q: "In che anno è stato fondato Facebook?",
			opts: ["2002", "2004", "2006", "2008"],
			correct: 1,
		},
		{
			q: "Cosa significa WWW?",
			opts: [
				"World Wide Web",
				"World Wide Wait",
				"Web World Wide",
				"Wide World Web",
			],
			correct: 0,
		},
		{
			q: "Chi ha inventato il telefono?",
			opts: ["Edison", "Bell", "Tesla", "Marconi"],
			correct: 1,
		},
		{
			q: "Cosa significa USB?",
			opts: [
				"Universal Serial Bus",
				"United Serial Bus",
				"Universal System Bus",
				"United System Bus",
			],
			correct: 0,
		},
		{
			q: "Che azienda produce l'iPhone?",
			opts: ["Samsung", "Apple", "Google", "Microsoft"],
			correct: 1,
		},
		{
			q: "Cosa significa AI?",
			opts: [
				"Intelligenza Artificiale",
				"Intelligenza Avanzata",
				"Intelligenza Automatica",
				"Intelligenza Applicata",
			],
			correct: 0,
		},
		{
			q: "In che anno è stato fondato Google?",
			opts: ["1996", "1998", "2000", "2002"],
			correct: 1,
		},
		{
			q: "Qual è il linguaggio di programmazione più usato?",
			opts: ["Java", "Python", "C++", "JavaScript"],
			correct: 1,
		},

		// Natura e Animali
		{
			q: "Qual è l'animale terrestre più grande?",
			opts: ["Rinoceronte", "Elefante", "Ippopotamo", "Giraffa"],
			correct: 1,
		},
		{
			q: "Quante zampe ha un ragno?",
			opts: ["6", "8", "10", "12"],
			correct: 1,
		},
		{
			q: "Qual è l'animale terrestre più veloce?",
			opts: ["Leone", "Ghepardo", "Leopardo", "Tigre"],
			correct: 1,
		},
		{
			q: "Cosa producono le api?",
			opts: ["Latte", "Miele", "Seta", "Cera"],
			correct: 1,
		},
		{
			q: "Come si chiama un cucciolo di canguro?",
			opts: ["Cucciolo", "Joey", "Kit", "Pup"],
			correct: 1,
		},
		{ q: "Quanti cuori ha un polpo?", opts: ["1", "2", "3", "4"], correct: 2 },
		{
			q: "Qual è l'uccello più grande?",
			opts: ["Aquila", "Struzzo", "Albatro", "Condor"],
			correct: 1,
		},
		{
			q: "Quale animale è il 'Re della Giungla'?",
			opts: ["Tigre", "Leone", "Orso", "Elefante"],
			correct: 1,
		},
		{
			q: "Quante gobbe ha un dromedario?",
			opts: ["1", "2", "3", "4"],
			correct: 0,
		},
		{
			q: "Qual è l'animale più lento?",
			opts: ["Tartaruga", "Bradipo", "Lumaca", "Koala"],
			correct: 1,
		},

		// Cibo e Bevande
		{
			q: "Da quale paese viene il sushi?",
			opts: ["Cina", "Giappone", "Corea", "Thailandia"],
			correct: 1,
		},
		{
			q: "Qual è l'ingrediente principale del guacamole?",
			opts: ["Pomodoro", "Avocado", "Peperone", "Cipolla"],
			correct: 1,
		},
		{
			q: "Qual è la bevanda più consumata?",
			opts: ["Caffè", "Acqua", "Tè", "Bibita"],
			correct: 1,
		},
		{
			q: "Quale paese ha inventato la pizza?",
			opts: ["Francia", "Italia", "Grecia", "Spagna"],
			correct: 1,
		},
		{
			q: "Qual è il peperoncino più piccante?",
			opts: ["Jalapeño", "Habanero", "Carolina Reaper", "Ghost Pepper"],
			correct: 2,
		},
		{
			q: "Da cosa è fatto il tofu?",
			opts: ["Riso", "Soia", "Grano", "Mais"],
			correct: 1,
		},
		{
			q: "Da quale frutto si fa il vino?",
			opts: ["Mela", "Uva", "Frutti di bosco", "Prugna"],
			correct: 1,
		},
		{
			q: "Qual è l'ingrediente principale del pane?",
			opts: ["Riso", "Farina", "Mais", "Avena"],
			correct: 1,
		},
		{
			q: "Da quale paese viene lo champagne?",
			opts: ["Italia", "Francia", "Spagna", "Germania"],
			correct: 1,
		},
		{
			q: "Qual è la spezia più costosa?",
			opts: ["Vaniglia", "Zafferano", "Cardamomo", "Cannella"],
			correct: 1,
		},

		// Miscellanea
		{
			q: "Quanti colori ha l'arcobaleno?",
			opts: ["5", "6", "7", "8"],
			correct: 2,
		},
		{
			q: "Qual è l'organo più grande?",
			opts: ["Fegato", "Pelle", "Cervello", "Cuore"],
			correct: 1,
		},
		{
			q: "Quante ore ha un giorno?",
			opts: ["12", "20", "24", "36"],
			correct: 2,
		},
		{
			q: "Qual è il contrario di caldo?",
			opts: ["Tiepido", "Fresco", "Freddo", "Gelido"],
			correct: 2,
		},
		{
			q: "Quanti giorni ha un anno bisestile?",
			opts: ["364", "365", "366", "367"],
			correct: 2,
		},
		{
			q: "Qual è la valuta del Giappone?",
			opts: ["Yuan", "Yen", "Won", "Baht"],
			correct: 1,
		},
		{
			q: "Cosa significa GPS?",
			opts: [
				"Global Position System",
				"Global Positioning System",
				"General Position System",
				"General Positioning System",
			],
			correct: 1,
		},
		{
			q: "Quanti segni zodiacali ci sono?",
			opts: ["10", "11", "12", "13"],
			correct: 2,
		},
		{
			q: "A che temperatura congela l'acqua?",
			opts: ["-10°C", "0°C", "10°C", "32°C"],
			correct: 1,
		},
		{
			q: "Quanti minuti ha un'ora?",
			opts: ["50", "60", "70", "80"],
			correct: 1,
		},
	],
};

// ✅ Funzione per mescolare array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

const QuizGame: React.FC<Props> = ({ language }) => {
	// ✅ Mescola le domande all'inizio
	const [shuffledQuestions] = useState(() =>
		shuffleArray(QUIZ_QUESTIONS[language]),
	);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [answered, setAnswered] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);

	const question = shuffledQuestions[currentQuestionIndex];

	// Reset quando cambia lingua
	useEffect(() => {
		const newShuffled = shuffleArray(QUIZ_QUESTIONS[language]);
		setCurrentQuestionIndex(0);
		setScore(0);
		setAnswered(false);
		setSelectedAnswer(null);
		setShowResult(false);
	}, [language]);

	const handleAnswer = (index: number) => {
		if (answered) return;

		setSelectedAnswer(index);
		setAnswered(true);

		if (index === question.correct) {
			setScore(s => s + 1);
		}

		setShowResult(true);
		setTimeout(() => {
			nextQuestion();
		}, 1500);
	};

	const nextQuestion = () => {
		setCurrentQuestionIndex(prev => (prev + 1) % shuffledQuestions.length);
		setAnswered(false);
		setSelectedAnswer(null);
		setShowResult(false);
	};

	const getButtonClass = (index: number) => {
		const baseClass =
			"py-3 px-4 rounded-xl font-medium text-sm transition-all border-2";

		if (!answered) {
			return `${baseClass} bg-white border-indigo-100 hover:bg-indigo-50 hover:border-indigo-300 active:scale-95`;
		}

		if (index === question.correct) {
			return `${baseClass} bg-green-100 border-green-400 text-green-800`;
		}

		if (index === selectedAnswer && index !== question.correct) {
			return `${baseClass} bg-red-100 border-red-400 text-red-800`;
		}

		return `${baseClass} bg-gray-100 border-gray-200 text-gray-500`;
	};

	return (
		<div className="animate-fadeIn">
			<div className="bg-gradient-to-b from-purple-50 to-indigo-50 p-4 md:p-6 rounded-2xl">
				{" "}
				{/* ✅ Padding ridotto */}
				<div className="flex justify-between items-center mb-3 md:mb-4">
					<h4 className="text-base md:text-lg font-bold text-indigo-900">
						{" "}
						{/* ✅ Testo più piccolo */}
						🧠 {language === "en" ? "Quiz Challenge" : "Quiz Challenge"}
					</h4>
					<div className="bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm">
						<span className="text-xs md:text-sm font-bold text-indigo-600">
							{language === "en" ? `Score: ${score}` : `Punteggio: ${score}`}
						</span>
					</div>
				</div>
				<div className="bg-white p-3 md:p-4 rounded-xl mb-3 md:mb-4 shadow-sm">
					<p className="font-bold text-gray-800 text-center text-sm md:text-base">
						{" "}
						{/* ✅ Testo più piccolo */}
						{question.q}
					</p>
				</div>
				<div className="grid grid-cols-2 gap-2 md:gap-3">
					{question.opts.map((opt, i) => (
						<button
							key={i}
							onClick={() => handleAnswer(i)}
							disabled={answered}
							className={`${getButtonClass(i)} py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm`}>
							{" "}
							{/* ✅ Padding e testo ridotti */}
							<span className="font-bold text-indigo-600 mr-1 md:mr-2">
								{String.fromCharCode(65 + i)}:
							</span>
							{opt}
						</button>
					))}
				</div>
				{showResult && (
					<div
						className={`mt-3 md:mt-4 p-2 md:p-3 rounded-xl text-center font-bold animate-fadeIn text-sm md:text-base ${
							selectedAnswer === question.correct
								? "bg-green-100 text-green-700"
								: "bg-red-100 text-red-700"
						}`}>
						{selectedAnswer === question.correct
							? language === "en"
								? "✓ Correct!"
								: "✓ Corretto!"
							: language === "en"
								? "✗ Wrong answer"
								: "✗ Risposta sbagliata"}
					</div>
				)}
			</div>
		</div>
	);
};

export default QuizGame;
