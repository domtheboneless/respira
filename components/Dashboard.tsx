import React, { useState, useEffect, useMemo, useRef } from "react";
import { UserStats, Language } from "../types";
import { TRANSLATIONS } from "../constants";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { getMotivationalPhrase } from "../services/geminiService";
import MiniGames from "./MiniGames";
import Milestones from "./Milestones";

interface Props {
	stats: UserStats;
	language: Language;
	onUpdateStats: (stats: UserStats) => void;
}

// Helper to calculate coordinates for radial slider
const polarToCartesian = (
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number,
) => {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
};

const Dashboard: React.FC<Props> = ({ stats, language, onUpdateStats }) => {
	const t = TRANSLATIONS[language];
	const [now, setNow] = useState(new Date());

	// Modals & Craving Flow
	const [showCravingModal, setShowCravingModal] = useState(false);
	const [cravingStep, setCravingStep] = useState<"rating" | "low" | "high">(
		"rating",
	);
	const [urgeRating, setUrgeRating] = useState(5);
	const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

	const [showLapseModal, setShowLapseModal] = useState(false);
	const [aiPhrase, setAiPhrase] = useState("");
	const [isLoadingAi, setIsLoadingAi] = useState(false);

	// Radial Slider Refs
	const svgRef = useRef<SVGSVGElement>(null);
	const isDragging = useRef(false);

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Countdown logic
	useEffect(() => {
		let timer: any;
		if (showCravingModal && cravingStep === "low" && countdown > 0) {
			timer = setInterval(() => setCountdown(c => c - 1), 1000);
		}
		return () => clearInterval(timer);
	}, [showCravingModal, cravingStep, countdown]);

	const timeDiff = useMemo(() => {
		const start = new Date(stats.quitDate);
		const diffMs = now.getTime() - start.getTime();

		const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
		const m = Math.floor((diffMs / 1000 / 60) % 60);
		const s = Math.floor((diffMs / 1000) % 60);

		return { d, h, m, s, totalDays: diffMs / (1000 * 60 * 60 * 24) };
	}, [now, stats.quitDate]);

	const costPerCig = stats.pricePerPack / stats.packSize;
	const moneySaved = timeDiff.totalDays * stats.cigarettesPerDay * costPerCig;
	const cigsSaved = Math.floor(timeDiff.totalDays * stats.cigarettesPerDay);
	const dreamProgress = Math.min(100, (moneySaved / stats.dreamCost) * 100);

	const chartData = useMemo(() => {
		return Array.from({ length: 30 }, (_, i) => ({
			day: i + 1,
			saved: (moneySaved + i * stats.cigarettesPerDay * costPerCig).toFixed(2),
		}));
	}, [moneySaved, stats, costPerCig]);

	// --- Logic for Urge Flow ---

	const startCravingFlow = () => {
		setCravingStep("rating");
		setUrgeRating(5);
		setCountdown(600);
		setShowCravingModal(true);
		setAiPhrase("");
	};

	const handleUrgeAnalysis = async () => {
		setIsLoadingAi(true);
		const timeStr = `${timeDiff.d}${t.days} ${timeDiff.h}${t.hours} ${timeDiff.m}${t.minutes}`;
		const phrase = await getMotivationalPhrase(
			language,
			stats.dreamGoal,
			timeStr,
		);
		setAiPhrase(phrase);
		setIsLoadingAi(false);

		if (urgeRating < 6) {
			setCravingStep("low");
		} else {
			setCravingStep("high");
		}
	};

	const handleLapseConfirm = () => {
		onUpdateStats({
			...stats,
			quitDate: new Date().toISOString(),
		});
		setShowLapseModal(false);
		setShowCravingModal(false);
	};

	// --- Radial Slider Interaction ---
	const updateAngle = (clientX: number, clientY: number) => {
		if (!svgRef.current) return;
		const rect = svgRef.current.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		let angle = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
		angle += 90;
		if (angle < 0) angle += 360;

		let val = Math.round((angle / 360) * 10) + 1;
		if (val > 10) val = 1;
		if (val < 1) val = 10;

		setUrgeRating(val);
	};

	const handlePointerDown = (e: React.PointerEvent) => {
		isDragging.current = true;
		updateAngle(e.clientX, e.clientY);
		(e.target as Element).setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		if (isDragging.current) {
			updateAngle(e.clientX, e.clientY);
		}
	};

	const handlePointerUp = (e: React.PointerEvent) => {
		isDragging.current = false;
	};

	const getRatingColor = (r: number) => {
		if (r < 4) return "#22c55e";
		if (r < 7) return "#eab308";
		return "#ef4444";
	};

	return (
		<div className="max-w-4xl mx-auto p-4 space-y-6">
			{/* Hero Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
					<span className="text-gray-500 font-medium mb-1">
						{t.money_saved}
					</span>
					<span className="text-4xl font-bold text-green-600">
						{stats.currency}
						{moneySaved.toFixed(2)}
					</span>
				</div>
				<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
					<span className="text-gray-500 font-medium mb-1">
						{t.cigs_not_smoked}
					</span>
					<span className="text-4xl font-bold text-indigo-600">
						{cigsSaved}
					</span>
				</div>
				<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
					<span className="text-gray-500 font-medium mb-1">
						{t.time_passed}
					</span>
					<div className="flex gap-1 text-2xl font-bold text-gray-800">
						<span>{timeDiff.d}d</span>
						<span>{timeDiff.h}h</span>
						<span>{timeDiff.m}m</span>
						<span className="text-indigo-400 w-12">{timeDiff.s}s</span>
					</div>
				</div>
			</div>

			{/* Dream Tracker */}
			<div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
				<div className="relative z-10">
					<h3 className="text-lg font-medium opacity-80 mb-2">
						{t.dream_progress}
					</h3>
					<p className="text-2xl font-bold mb-4">"{stats.dreamGoal}"</p>
					<div className="w-full bg-white/20 h-4 rounded-full mb-2 overflow-hidden">
						<div
							className="h-full bg-yellow-400 transition-all duration-1000"
							style={{ width: `${dreamProgress}%` }}></div>
					</div>
					<div className="flex justify-between text-sm">
						<span>{dreamProgress.toFixed(1)}%</span>
						<span>
							{stats.currency}
							{stats.dreamCost}
						</span>
					</div>
				</div>
				<div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
			</div>

			{/* Buttons Section */}
			<div className="flex flex-col items-center gap-4 pt-4">
				<button
					onClick={startCravingFlow}
					className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-full text-xl font-bold shadow-xl transform active:scale-95 transition-all flex items-center gap-3 w-full md:w-auto justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-7 w-7"
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
					{t.craving_button}
				</button>

				<button
					onClick={() => setShowLapseModal(true)}
					className="text-gray-400 hover:text-gray-600 font-medium text-lg underline underline-offset-4 decoration-gray-200 transition-all">
					{t.lapsed_button}
				</button>
			</div>

			{/* Chart Section */}
			<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80">
				<h4 className="text-gray-700 font-bold mb-4">{t.history_chart}</h4>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={chartData}>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#f1f5f9"
						/>
						<XAxis
							dataKey="day"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#94a3b8", fontSize: 12 }}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#94a3b8", fontSize: 12 }}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: "16px",
								border: "none",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
							}}
						/>
						<Line
							type="monotone"
							dataKey="saved"
							stroke="#4f46e5"
							strokeWidth={3}
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Enhanced Craving Modal */}
			{showCravingModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
					<div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
						<button
							onClick={() => setShowCravingModal(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						{/* STEP 1: RATING */}
						{cravingStep === "rating" && (
							<div className="flex flex-col items-center justify-center flex-1 animate-fadeIn">
								<h2 className="text-2xl font-bold text-gray-800 mb-6">
									{t.urge_modal_title}
								</h2>
								<div className="relative w-64 h-64 mb-6">
									<svg
										ref={svgRef}
										className="w-full h-full touch-none cursor-pointer"
										viewBox="0 0 200 200"
										onPointerDown={handlePointerDown}
										onPointerMove={handlePointerMove}
										onPointerUp={handlePointerUp}
										onPointerLeave={handlePointerUp}>
										<circle
											cx="100"
											cy="100"
											r="80"
											fill="none"
											stroke="#f1f5f9"
											strokeWidth="20"
										/>
										<circle
											cx="100"
											cy="100"
											r="80"
											fill="none"
											stroke={getRatingColor(urgeRating)}
											strokeWidth="20"
											strokeDasharray={`${(urgeRating / 10) * 502} 502`}
											strokeLinecap="round"
											transform="rotate(-90 100 100)"
											className="transition-all duration-100 ease-out"
										/>
										<text
											x="100"
											y="115"
											textAnchor="middle"
											fontSize="60"
											fontWeight="bold"
											fill={getRatingColor(urgeRating)}>
											{urgeRating}
										</text>
									</svg>
									<p className="text-center text-gray-400 text-sm mt-2">
										{t.urge_rating_label}
									</p>
								</div>
								<button
									onClick={handleUrgeAnalysis}
									disabled={isLoadingAi}
									className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-70">
									{isLoadingAi ? t.craving_loading : t.urge_btn_analyze}
								</button>
							</div>
						)}

						{/* STEP 2: LOW URGE with Mini-Games */}
						{cravingStep === "low" && (
							<div className="flex flex-col flex-1 animate-fadeIn">
								<div className="flex-shrink-0">
									<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-green-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
										{t.urge_low_title}
									</h3>
									<p className="text-gray-600 mb-4 text-center">
										{t.urge_low_text}
									</p>

									{/* Countdown Timer */}
									<div className="text-5xl font-mono font-bold text-indigo-600 mb-4 tracking-widest text-center">
										{Math.floor(countdown / 60)
											.toString()
											.padStart(2, "0")}
										:{(countdown % 60).toString().padStart(2, "0")}
									</div>
								</div>

								{/* Milestones Component */}
								<Milestones countdown={countdown} language={language} />

								{/* Mini-Games Component */}
								<MiniGames language={language} />

								{/* AI Phrase */}
								{!isLoadingAi && aiPhrase && (
									<div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mb-4">
										<p className="text-indigo-900 italic text-sm text-center">
											"{aiPhrase}"
										</p>
									</div>
								)}

								<button
									onClick={() => setShowCravingModal(false)}
									className="w-full px-8 py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50">
									{t.urge_btn_resisted}
								</button>
							</div>
						)}

						{/* STEP 3: HIGH URGE */}
						{cravingStep === "high" && (
							<div className="flex flex-col items-center justify-center flex-1 animate-fadeIn text-center">
								<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8 text-red-600"
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
								<h3 className="text-2xl font-bold text-gray-800 mb-2">
									{t.urge_high_title}
								</h3>
								<p className="text-gray-600 mb-6">
									{t.urge_high_text
										.replace(
											"{cost}",
											`${stats.currency}${costPerCig.toFixed(2)}`,
										)
										.replace("{dream}", stats.dreamGoal)}
								</p>

								<div className="w-full bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
									<p className="text-red-700 text-sm font-medium">
										-{stats.currency}
										{costPerCig.toFixed(2)}{" "}
										{language === "en"
											? "lost from savings"
											: "persi dai risparmi"}
									</p>
								</div>

								<div className="flex flex-col gap-3 w-full">
									<button
										onClick={() => setShowCravingModal(false)}
										className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg">
										{t.urge_btn_resisted}
									</button>
									<button
										onClick={handleLapseConfirm}
										className="w-full py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-medium text-lg hover:bg-gray-50 hover:text-red-500">
										{t.urge_btn_smoked}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Legacy Lapse Modal */}
			{showLapseModal && !showCravingModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
					<div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
						<div className="text-center">
							<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-yellow-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>

							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								{t.lapse_modal_title}
							</h2>
							<p className="text-gray-600 text-lg mb-8 leading-relaxed">
								{t.lapse_modal_text.replace("{dream}", stats.dreamGoal)}
							</p>

							<div className="flex flex-col gap-3">
								<button
									onClick={handleLapseConfirm}
									className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold text-lg hover:bg-gray-900 transition-colors shadow-lg">
									{t.lapse_confirm}
								</button>
								<button
									onClick={() => setShowLapseModal(false)}
									className="w-full py-4 bg-white text-gray-500 rounded-2xl font-medium text-lg hover:bg-gray-50 transition-colors">
									{t.lapse_cancel}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
