import React, { useState, useEffect, useRef, useCallback } from "react";
import { Language, UserStats } from "./types";
import LanguageSelector from "./components/LanguageSelector";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import { TRANSLATIONS } from "./constants";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { profileService } from "./services/profileService";
import { Toaster } from "react-hot-toast";
import ActiveTimerBanner from "./components/ActiveTimerBanner";

const App: React.FC = () => {
	const [activeCountdown, setActiveCountdown] = useState<number | null>(null);
	const [shouldOpenTimerModal, setShouldOpenTimerModal] = useState(false);

	const isInitializing = useRef(false);

	// Stati Dati
	const [language, setLanguage] = useState<Language>("en");
	const [userId, setUserId] = useState<string | null>(null);
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [pendingStats, setPendingStats] = useState<UserStats | null>(null);

	// Stati UI
	const [initialized, setInitialized] = useState(false);
	const [view, setView] = useState<
		"landing" | "onboarding" | "auth" | "dashboard"
	>("landing");

	// Ref per evitare aggiornamenti su componenti smontati (fix crash F5)
	const isMounted = useRef(true);

	// --- LOGICA COUNTDOWN ---
	useEffect(() => {
		let timer: any;
		if (activeCountdown !== null && activeCountdown > 0) {
			timer = setInterval(() => {
				setActiveCountdown(c => {
					if (c === null || c <= 1) return null;
					return c - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [activeCountdown]);

	const handleStartTimer = useCallback(
		(seconds: number) => setActiveCountdown(seconds),
		[],
	);
	const handleStopTimer = useCallback(() => {
		setActiveCountdown(null);
		setShouldOpenTimerModal(false);
	}, []);
	const handleOpenTimerModal = useCallback(
		() => setShouldOpenTimerModal(true),
		[],
	);
	const handleTimerModalOpened = useCallback(
		() => setShouldOpenTimerModal(false),
		[],
	);

	// --- FUNZIONE DI CARICAMENTO DATI (Isolata per stabilità) ---
	const fetchUserProfile = useCallback(async (uid: string) => {
		try {
			const stats = await profileService.getProfile(uid);

			if (!isMounted.current) return; // Se l'utente ha cambiato pagina, fermati.

			if (stats) {
				setUserStats(stats);
				setView("dashboard");
			} else {
				// Utente loggato ma senza profilo -> Onboarding
				setUserStats(null);
				setView("onboarding");
			}
		} catch (error) {
			console.error("Errore fetch profilo:", error);
			if (isMounted.current) setView("onboarding");
		}
	}, []);

	// --- INIZIALIZZAZIONE DELL'APP ---
	useEffect(() => {
		isMounted.current = true;
		isInitializing.current = true; // <- AGGIUNGI
		// 1. Lingua
		const savedLang = localStorage.getItem("respira_lang");
		if (savedLang) setLanguage(savedLang as Language);

		if (!isSupabaseConfigured) {
			setInitialized(true);
			return;
		}

		// 2. Logica di Avvio (Eseguita una volta sola al reload)
		const initializeSession = async () => {
			console.log("🔄 Init session starting...");
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();
				console.log("📝 Session result:", { hasSession: !!session, error });

				if (error) throw error;

				if (session?.user) {
					console.log("✅ User found:", session.user.id);
					setUserId(session.user.id);
					console.log("📊 Fetching profile...");
					await fetchUserProfile(session.user.id);
					console.log("✅ Profile loaded");
				}
			} catch (error) {
				console.error("❌ Init error:", error);
				await supabase.auth.signOut();
				setUserId(null);
				setView("landing");
			} finally {
				console.log("🏁 Setting initialized");
				if (isMounted.current) {
					setInitialized(true);
					isInitializing.current = false; // <- AGGIUNGI
				}
			}
		};
		initializeSession();

		// 3. Ascoltatore Eventi
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (!isMounted.current) return;
			console.log("Auth Event:", event);

			// IGNORA SIGNED_IN durante l'inizializzazione
			if (event === "SIGNED_IN" && isInitializing.current) {
				console.log("⏭️ Ignoring SIGNED_IN during init");
				return;
			}

			if (event === "SIGNED_IN" && session?.user) {
				setUserId(session.user.id);
				await fetchUserProfile(session.user.id);
				setInitialized(true);
			} else if (event === "SIGNED_OUT") {
				setUserId(null);
				setUserStats(null);
				setView("landing");
				setInitialized(true);
			}
		});

		return () => {
			isMounted.current = false;
			subscription.unsubscribe();
		};
	}, [fetchUserProfile]);

	// --- HANDLERS UI ---
	const handleLanguageSelect = (lang: Language) => {
		setLanguage(lang);
		localStorage.setItem("respira_lang", lang);
	};

	const handleOnboardingComplete = async (stats: UserStats) => {
		if (userId) {
			try {
				await profileService.upsertProfile(userId, stats);
				setUserStats(stats);
				setView("dashboard");
			} catch (e) {
				console.error("Errore salvataggio onboarding:", e);
			}
		} else {
			setPendingStats(stats);
			setView("auth");
		}
	};

	const handleAuthComplete = (uid: string, stats: UserStats) => {
		setUserId(uid);
		setUserStats(stats);
		setView("dashboard");
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setView("landing");
		setUserStats(null);
		setUserId(null);
	};

	const handleUpdateStats = async (newStats: UserStats) => {
		if (!userId) return;
		try {
			await profileService.upsertProfile(userId, newStats);
			setUserStats(newStats);
		} catch (e) {
			console.error(e);
		}
	};

	if (!initialized)
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="flex flex-col items-center gap-4">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Toaster position="top-center" />

			{/* HEADER */}
			<header className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-white/80">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
					</div>
					<span className="text-xl font-extrabold text-gray-800 tracking-tight">
						Respira
					</span>
				</div>

				{view === "landing" && (
					<LanguageSelector
						current={language}
						onSelect={handleLanguageSelect}
					/>
				)}

				{userId && (
					<button
						onClick={handleLogout}
						className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
						<span className="text-xs font-bold uppercase tracking-wider">
							{TRANSLATIONS[language].logout}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
					</button>
				)}
			</header>

			<main className="flex-1 pb-10">
				{view === "landing" && (
					<div className="px-4 text-center py-20 animate-fadeIn">
						<h1 className="text-5xl font-extrabold text-gray-900 mb-4">
							{language === "en"
								? "Take your life back"
								: "Riprenditi la tua vita"}
						</h1>
						<p className="text-gray-500 text-xl max-w-lg mx-auto mb-10">
							{language === "en"
								? "Turn your smoking habit into your biggest dream. Join thousands who already quit."
								: "Trasforma il vizio del fumo nel tuo sogno più grande. Unisciti a migliaia di persone."}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={() => setView("onboarding")}
								className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
								{TRANSLATIONS[language].cta_start}
							</button>
							<button
								onClick={() => setView("auth")}
								className="bg-white text-indigo-600 border-2 border-indigo-50 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all">
								{TRANSLATIONS[language].auth_login_btn}
							</button>
						</div>
					</div>
				)}

				{view === "onboarding" && (
					<div className="px-4 mt-10">
						<Onboarding
							language={language}
							onComplete={handleOnboardingComplete}
						/>
					</div>
				)}

				{view === "auth" && (
					<Auth
						language={language}
						onAuthComplete={handleAuthComplete}
						pendingStats={pendingStats || undefined}
						onSwitchToOnboarding={() => setView("onboarding")}
					/>
				)}

				{view === "dashboard" && userStats && (
					<Dashboard
						stats={userStats}
						language={language}
						onUpdateStats={handleUpdateStats}
						activeCountdown={activeCountdown}
						onStartTimer={handleStartTimer}
						onStopTimer={handleStopTimer}
						shouldOpenTimerModal={shouldOpenTimerModal}
						onTimerModalOpened={handleTimerModalOpened}
					/>
				)}
			</main>

			{/* Banner timer attivo */}
			{view === "dashboard" &&
				activeCountdown !== null &&
				activeCountdown > 0 && (
					<ActiveTimerBanner
						countdown={activeCountdown}
						language={language}
						onReopen={handleOpenTimerModal}
						onCancel={handleStopTimer}
					/>
				)}

			<footer className="py-6 text-center text-gray-400 text-sm">
				Respiraxxx &copy; {new Date().getFullYear()}
			</footer>
		</div>
	);
};

export default App;
