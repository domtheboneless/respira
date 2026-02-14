import { supabase } from "../supabaseClient";
import { UserStats } from "../types";

export const profileService = {
	// src/services/profileService.ts

	async getProfile(userId: string): Promise<UserStats | null> {
		try {
			// Usa .maybeSingle() invece di .single() o .select()
			// Questo evita l'errore "JSON object requested, multiple (or no) rows returned"
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			if (error) {
				console.error("Errore Database:", error.message);
				return null;
			}

			if (!data) return null; // Nessun profilo trovato -> Ritorna null pulito

			return {
				quitDate: data.quit_date, // Assicurati che i nomi corrispondano alle colonne DB
				cigarettesPerDay: data.cigarettes_per_day,
				pricePerPack: data.price_per_pack,
				packSize: data.pack_size,
				dreamGoal: data.dream_goal,
				dreamCost: data.dream_cost,
				currency: data.currency,
			};
		} catch (error) {
			console.error("Errore imprevisto:", error);
			return null;
		}
	},

	async upsertProfile(userId: string, stats: UserStats) {
		const { error } = await supabase.from("profiles").upsert({
			id: userId,
			quit_date: stats.quitDate,
			cigarettes_per_day: stats.cigarettesPerDay,
			price_per_pack: stats.pricePerPack,
			pack_size: stats.packSize,
			dream_goal: stats.dreamGoal,
			dream_cost: stats.dreamCost,
			currency: stats.currency,
		});

		if (error) throw error;
	},
};
