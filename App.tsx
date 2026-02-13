import React, { useState, useEffect, useRef } from "react";
import { Language, UserStats } from "./types";
import LanguageSelector from "./components/LanguageSelector";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import { TRANSLATIONS } from "./constants";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { profileService } from "./services/profileService";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
	const [language, setLanguage] = useState<Language>("en");
	const [userId, setUserId] = useState<string | null>(null);
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [pendingStats, setPendingStats] = useState<UserStats | null>(null);
	const [view, setView] = useState<
		"landing" | "onboarding" | "auth" | "dashboard"
	>("landing");
	const [initialized, setInitialized] = useState(false);
	const [configError, setConfigError] = useState<string | null>(null);

	// Keep track of current view in a ref to access it inside the auth listener closure
	const viewRef = useRef(view);
	useEffect(() => {
		viewRef.current = view;
	}, [view]);

	useEffect(() => {
		// Initial lang check
		const savedLang = localStorage.getItem("respira_lang");
		if (savedLang) setLanguage(savedLang as Language);

		if (!isSupabaseConfigured) {
			setInitialized(true);
			return;
		}

		// Initial session check
		const initAuth = async () => {
			try {
				const { data } = await supabase.auth.getSession();
				const session = data?.session;

				if (session?.user) {
					setUserId(session.user.id);
					try {
						const stats = await profileService.getProfile(session.user.id);
						if (stats) {
							setUserStats(stats);
							setView("dashboard");
						}
						// NOTE: If stats are missing (null), we do NOT redirect to onboarding automatically
						// as per user request. The user will stay on 'landing' (but logged in)
						// or if they came via Auth component, Auth handles the error.
					} catch (e: any) {
						console.error("Profile load error", e);
						if (e.code === "42501" || e.message?.includes("403")) {
							setConfigError(
								"Database permission error. Please run the SQL setup commands.",
							);
						}
					}
				}
			} catch (e: any) {
				console.error("Auth initialization failed", e);
			}
			setInitialized(true);
		};

		initAuth();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth Event:", event);

			if (event === "SIGNED_IN" && session?.user) {
				setUserId(session.user.id);

				// Try to load profile
				try {
					const stats = await profileService.getProfile(session.user.id);
					if (stats) {
						setUserStats(stats);
						setView("dashboard");
					}
					// Similar to initAuth, we do NOT force onboarding redirect here.
				} catch (e: any) {
					console.error("Profile load failed", e);
					if (e.code === "42501" || e.message?.includes("403")) {
						setConfigError(
							"Database permission error. Please run the SQL setup commands.",
						);
					}
				}
			} else if (event === "SIGNED_OUT") {
				setUserId(null);
				setUserStats(null);

				// Only force redirect to landing if we were in the dashboard.
				if (viewRef.current === "dashboard") {
					setView("landing");
				}
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLanguageSelect = (lang: Language) => {
		setLanguage(lang);
		localStorage.setItem("respira_lang", lang);
	};

	const handleOnboardingComplete = async (stats: UserStats) => {
		console.log("Onboarding complete. UserId:", userId);
		if (userId) {
			try {
				await profileService.upsertProfile(userId, stats);
				setUserStats(stats);
				setView("dashboard");
			} catch (e: any) {
				console.error("Failed to save profile after onboarding", e);
				if (e.code === "42501" || e.message?.includes("403")) {
					setConfigError(
						"Database permission denied. Please ensure you have run the RLS policies in Supabase SQL Editor.",
					);
				}
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
		if (isSupabaseConfigured) {
			await supabase.auth.signOut();
			setView("landing");
		}
	};

	const handleUpdateStats = async (newStats: UserStats) => {
		if (!userId || !isSupabaseConfigured) return;
		try {
			await profileService.upsertProfile(userId, newStats);
			setUserStats(newStats);
		} catch (e: any) {
			console.error("Failed to update profile", e);
			if (e.code === "42501" || e.message?.includes("403")) {
				setConfigError("Database permission error. Check RLS policies.");
			}
		}
	};

	if (!initialized)
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
			</div>
		);

	// Show setup screen if Supabase is not configured OR if there was a DB permission error
	if (!isSupabaseConfigured || configError) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center animate-fadeIn">
				<div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-amber-100">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-10 w-10 text-amber-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h1 className="text-3xl font-bold text-gray-800 mb-2">
					{configError ? "Database Setup Issue" : "Setup Required"}
				</h1>

				{configError && (
					<div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 max-w-md">
						<p className="font-bold">Error: {configError}</p>
						<p className="text-sm mt-1">
							Row Level Security (RLS) is enabled but policies might be missing.
						</p>
					</div>
				)}

				{!configError && (
					<p className="text-gray-600 max-w-md mb-8 leading-relaxed">
						To enable cloud sync and persistence, please set the{" "}
						<code className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono text-sm border border-amber-100">
							SUPABASE_URL
						</code>{" "}
						and{" "}
						<code className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono text-sm border border-amber-100">
							SUPABASE_ANON_KEY
						</code>{" "}
						environment variables.
					</p>
				)}

				<div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 text-left w-full max-w-lg">
					<h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-indigo-500"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fillRule="evenodd"
								d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6z"
								clipRule="evenodd"
							/>
						</svg>
						Required SQL Schema & Policies
					</h2>
					<p className="text-sm text-gray-500 mb-4">
						Run this in your Supabase SQL Editor to fix permissions:
					</p>
					<pre className="text-xs bg-gray-900 p-6 rounded-2xl overflow-x-auto text-indigo-300 font-mono leading-loose shadow-inner select-all">
						{`-- 1. Create table if not exists
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  quit_date timestamptz,
  cigarettes_per_day integer,
  price_per_pack numeric,
  pack_size integer,
  dream_goal text,
  dream_cost numeric,
  currency text
);

-- 2. Enable RLS
alter table profiles enable row level security;

-- 3. Create Policies (Drop first to avoid conflicts if re-running)
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" 
  on profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" 
  on profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" 
  on profiles for update using (auth.uid() = id);`}
					</pre>
					{configError && (
						<button
							onClick={() => window.location.reload()}
							className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
							I've run the SQL, Retry
						</button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Toaster position="top-center" />
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
					/>
				)}
			</main>

			<footer className="py-6 text-center text-gray-400 text-sm">
				Respira &copy; {new Date().getFullYear()} -{" "}
				{language === "en"
					? "Breathe better, live more."
					: "Respira meglio, vivi di più."}
			</footer>
		</div>
	);
};

export default App;
