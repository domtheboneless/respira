
import { supabase } from '../supabaseClient';
import { UserStats } from '../types';

export const profileService = {
  async getProfile(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      // If RLS denies access (403/42501), we should throw to alert the app that setup is needed.
      // 406 is handled by maybeSingle() internally (returns null if no rows), but if it persists we might see it here.
      if (error.code === '42501' || error.message.includes('403')) {
        throw error;
      }
      console.warn("Error loading profile:", error.message);
      return null;
    }

    if (!data) return null;

    return {
      quitDate: data.quit_date,
      cigarettesPerDay: data.cigarettes_per_day,
      pricePerPack: data.price_per_pack,
      packSize: data.pack_size,
      dreamGoal: data.dream_goal,
      dreamCost: data.dream_cost,
      currency: data.currency,
    };
  },

  async upsertProfile(userId: string, stats: UserStats) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
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
  }
};
