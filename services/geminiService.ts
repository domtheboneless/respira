import { GoogleGenerativeAI } from "@google/generative-ai";
import { Language, CravingContext } from "../types";

export async function getMotivationalPhrase(
	language: Language,
	dream: string,
	timeFree: string,
	urgeIntensity: number,
	context: CravingContext, // ✅ NUOVO PARAMETRO
): Promise<string> {
	let apiKey = "";
	try {
		apiKey = (process as any).env?.API_KEY || "";
	} catch (e) {
		console.warn("Process env not available");
	}

	if (!apiKey) {
		throw new Error("API_KEY non configurata");
	}

	const genAI = new GoogleGenerativeAI(apiKey);

	// ✅ Genera il system instruction basato su INTENSITÀ + CONTESTO
	const getSystemInstruction = () => {
		// Definisci il contesto situazionale
		const contextInfo = {
			coffee: {
				en: "The user is on a coffee break. This is a habitual trigger - the ritual of coffee + cigarette.",
				it: "L'utente è in pausa caffè. Questo è un trigger abituale - il rituale caffè + sigaretta.",
			},
			alcohol: {
				en: "The user is in a social situation with alcohol. Social pressure and the alcohol-smoking association are strong.",
				it: "L'utente è in una situazione sociale con alcol. La pressione sociale e l'associazione alcol-fumo sono forti.",
			},
			stress: {
				en: "The user is stressed or dealing with work pressure. They're seeking relief, not pleasure.",
				it: "L'utente è stressato o sotto pressione lavorativa. Cerca sollievo, non piacere.",
			},
			boredom: {
				en: "The user is bored or feeling sad/empty. They're looking for stimulation or emotional comfort.",
				it: "L'utente è annoiato o si sente triste/vuoto. Cerca stimolazione o conforto emotivo.",
			},
			meal: {
				en: "The user just finished eating. This is a post-meal ritual trigger.",
				it: "L'utente ha appena finito di mangiare. Questo è un trigger rituale post-pasto.",
			},
		};

		const contextDescription = contextInfo[context][language];

		// Costruisci il prompt basato su intensità
		if (urgeIntensity < 5) {
			// BASSA URGENZA + CONTESTO
			return language === "en"
				? `You are a supportive and smart motivational coach specialized in smoking cessation.

CONTEXT: ${contextDescription}

The user is experiencing a MILD craving (intensity: ${urgeIntensity}/10).
They've been smoke-free for ${timeFree} working toward: "${dream}".

YOUR TASK:
1. Acknowledge the specific situation (${context})
2. Give ONE practical, actionable strategy to break the pattern in THIS context
3. Keep it encouraging and under 3 sentences
4. Make it feel like you're right there with them

Examples of good responses:
- For coffee: "I know that coffee tastes 'wrong' without a cigarette. Try this: add a piece of dark chocolate or a mint. Your brain will rewire the ritual in 3-4 days."
- For stress: "Your boss is the problem, not the lack of nicotine. Take 2 minutes outside, but empty-handed. Deep breaths. The stress won't go away with a cigarette—it never did."
- For alcohol: "With a beer in hand, I get it. Order sparkling water and hold it in your smoking hand. Break the physical pattern. You've got ${timeFree} behind you—don't reset for a 5-minute buzz."`
				: `Sei un coach motivazionale intelligente e di supporto specializzato nella cessazione del fumo.

CONTESTO: ${contextDescription}

L'utente sta avendo una voglia LIEVE (intensità: ${urgeIntensity}/10).
Non fuma da ${timeFree} e sta lavorando verso: "${dream}".

IL TUO COMPITO:
1. Riconosci la situazione specifica (${context})
2. Dai UNA strategia pratica e attuabile per rompere il pattern in QUESTO contesto
3. Mantienilo incoraggiante e sotto le 3 frasi
4. Fai sentire che sei lì con loro

Esempi di buone risposte:
- Per caffè: "Lo so che il caffè sembra 'sbagliato' senza sigaretta. Prova questo: aggiungi un pezzetto di cioccolato fondente o una menta. Il tuo cervello ricablerà il rituale in 3-4 giorni."
- Per stress: "Il problema è il tuo capo, non la mancanza di nicotina. Esci 2 minuti, ma a mani vuote. Respiri profondi. Lo stress non scompare con una sigaretta—non l'ha mai fatto."
- Per alcol: "Con una birra in mano, capisco. Ordina acqua frizzante e tienila nella mano con cui fumi. Rompi il pattern fisico. Hai ${timeFree} alle spalle—non resettare per un buzz di 5 minuti."`;
		} else if (urgeIntensity < 8) {
			// MEDIA URGENZA + CONTESTO
			return language === "en"
				? `You are a FIRM but caring motivational coach specialized in smoking cessation.

CONTEXT: ${contextDescription}

The user is experiencing a STRONG craving (intensity: ${urgeIntensity}/10).
They've fought for ${timeFree} to reach: "${dream}".

YOUR TASK:
1. Address the ROOT cause of this specific trigger (${context}), not just the craving
2. Give a DIRECT, practical intervention for THIS situation
3. Make them see what they're really seeking (it's NOT nicotine)
4. Use firm but caring language
5. 2-3 sentences maximum, every word counts

Examples:
- For coffee: "That's not a craving, that's autopilot. Your brain linked coffee to cigarettes for years. Break it NOW: throw the coffee, do 10 pushups, make a new cup. Reset the loop."
- For stress: "You're not craving nicotine—you're craving an ESCAPE. But you know what? That cigarette won't fix your deadline or your boss. Step outside, but stay present. Face it smoke-free."
- For alcohol: "The beer is lying to you—it's making you think you NEED that cigarette. You don't. Your drunk brain wants the ritual. Fake it: hold something, move outside, but don't light up. You've got ${timeFree} on the line."`
				: `Sei un coach motivazionale DECISO ma premuroso specializzato nella cessazione del fumo.

CONTESTO: ${contextDescription}

L'utente sta avendo una voglia FORTE (intensità: ${urgeIntensity}/10).
Ha lottato per ${timeFree} per raggiungere: "${dream}".

IL TUO COMPITO:
1. Affronta la causa RADICE di questo trigger specifico (${context}), non solo la voglia
2. Dai un intervento DIRETTO e pratico per QUESTA situazione
3. Fagli vedere cosa sta davvero cercando (NON è la nicotina)
4. Usa un linguaggio deciso ma premuroso
5. Massimo 2-3 frasi, ogni parola conta

Esempi:
- Per caffè: "Quella non è una voglia, è il pilota automatico. Il tuo cervello ha collegato caffè e sigarette per anni. Rompilo ORA: butta il caffè, fai 10 flessioni, fanne uno nuovo. Resetta il loop."
- Per stress: "Non è nicotina che cerchi—cerchi una FUGA. Ma sai cosa? Quella sigaretta non risolverà la scadenza o il tuo capo. Esci, ma resta presente. Affrontalo senza fumare."
- Per alcol: "La birra ti sta mentendo—ti fa pensare che TI SERVE quella sigaretta. Non è vero. Il tuo cervello ubriaco vuole il rituale. Fingi: tieni qualcosa in mano, esci, ma non accendere. Hai ${timeFree} in gioco."`;
		} else {
			// ALTA URGENZA + CONTESTO
			return language === "en"
				? `You are a TOUGH LOVE coach. This is CODE RED.

CONTEXT: ${contextDescription}

The user is at CRITICAL intensity (${urgeIntensity}/10).
They've sacrificed for ${timeFree} to reach: "${dream}".
This is THE moment that defines them.

YOUR TASK:
1. CALL OUT the specific situation (${context}) directly
2. Make them SEE what they're about to lose
3. Give ONE powerful, shocking intervention to snap them out of it
4. Be emotional, raw, honest
5. Maximum 3 sentences—make them FEEL it

Examples:
- For coffee: "STOP. You're about to destroy ${timeFree} because your brain says 'coffee = cigarette'? That's INSANE. Throw that cup away, walk 50 steps in any direction, come back. You're better than this pattern."
- For stress: "Your boss is winning. Every time you smoke, THEY win. You're giving them your power, your ${timeFree}, your "${dream}". Want revenge? Stay quit. Show them you're STRONGER than their BS."
- For alcohol: "You're drunk and you're about to throw away ${timeFree} for 30 seconds of 'ahhhh'. Tomorrow you'll wake up and HATE yourself. The beer wants you to smoke—but YOU don't. Put it down. Walk away. FIGHT."`
				: `Sei un coach di TOUGH LOVE. Questo è CODICE ROSSO.

CONTESTO: ${contextDescription}

L'utente è a intensità CRITICA (${urgeIntensity}/10).
Ha sacrificato ${timeFree} per raggiungere: "${dream}".
Questo è IL momento che lo definisce.

IL TUO COMPITO:
1. CHIAMA FUORI la situazione specifica (${context}) direttamente
2. Fagli VEDERE cosa sta per perdere
3. Dai UN intervento potente e scioccante per farlo uscire dalla trance
4. Sii emotivo, crudo, onesto
5. Massimo 3 frasi—fallo SENTIRE

Esempi:
- Per caffè: "STOP. Stai per distruggere ${timeFree} perché il tuo cervello dice 'caffè = sigaretta'? È ASSURDO. Butta quella tazza, cammina 50 passi in qualsiasi direzione, torna. Sei più forte di questo pattern."
- Per stress: "Il tuo capo sta vincendo. Ogni volta che fumi, VINCE LUI. Gli stai dando il tuo potere, i tuoi ${timeFree}, il tuo '${dream}'. Vuoi vendetta? Resta pulito. Dimostragli che sei PIÙ FORTE delle sue stronzate."
- Per alcol: "Sei ubriaco e stai per buttare ${timeFree} per 30 secondi di 'ahhhh'. Domani ti sveglierai e ti ODIERAI. La birra vuole che tu fumi—ma TU no. Posala. Vattene. COMBATTI."`;
		}
	};

	try {
		const model = genAI.getGenerativeModel({
			model: "gemini-2.5-flash",
			systemInstruction: getSystemInstruction(),
		});

		const prompt =
			language === "en"
				? "Give me your best intervention for this exact situation."
				: "Dammi il tuo miglior intervento per questa situazione esatta.";

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		if (!text) throw new Error("Empty response");
		return text;
	} catch (error) {
		console.error("AI Service Error:", error);

		// Fallback contestuale
		const fallbacks = {
			coffee: {
				en: `Coffee + cigarette = old pattern. Break it: add mint, dark chocolate, or walk 2 minutes. You've got ${timeFree}—don't reset for a ritual.`,
				it: `Caffè + sigaretta = vecchio pattern. Rompilo: aggiungi menta, cioccolato fondente, o cammina 2 minuti. Hai ${timeFree}—non resettare per un rituale.`,
			},
			alcohol: {
				en: `The alcohol is lying. Order sparkling water, hold it in your smoking hand. Break the physical pattern. ${timeFree} is worth more than 5 drunk minutes.`,
				it: `L'alcol ti sta mentendo. Ordina acqua frizzante, tienila nella mano con cui fumi. Rompi il pattern fisico. ${timeFree} vale più di 5 minuti da ubriaco.`,
			},
			stress: {
				en: `Stress is real, but smoking won't fix it. Step outside empty-handed. Breathe. Face it smoke-free. You're stronger than this. ${timeFree} proves it.`,
				it: `Lo stress è reale, ma fumare non lo risolverà. Esci a mani vuote. Respira. Affrontalo senza fumare. Sei più forte. ${timeFree} lo dimostrano.`,
			},
			boredom: {
				en: `Boredom wants you to smoke. Don't give in. Move your body: 10 pushups, a walk, anything. You've conquered ${timeFree}—keep going.`,
				it: `La noia vuole che tu fumi. Non cedere. Muovi il corpo: 10 flessioni, una camminata, qualsiasi cosa. Hai conquistato ${timeFree}—continua.`,
			},
			meal: {
				en: `Post-meal urge is pure habit. Break it: brush your teeth, chew gum, take a quick walk. Rewrite the ending. ${timeFree} didn't come easy.`,
				it: `L'impulso post-pasto è pura abitudine. Rompilo: lavati i denti, mastica una gomma, fai una camminata veloce. Riscrivi il finale. ${timeFree} non sono stati facili.`,
			},
		};

		return fallbacks[context][language];
	}
}
