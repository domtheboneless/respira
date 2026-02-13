
export type Language = 'en' | 'it';

export interface UserStats {
  quitDate: string; // ISO string
  cigarettesPerDay: number;
  pricePerPack: number;
  packSize: number;
  dreamGoal: string;
  dreamCost: number;
  currency: string;
}

export interface UserAccount {
  email: string;
  password?: string; // In a real app, this would be hashed
  stats: UserStats;
}

export interface Translation {
  welcome: string;
  onboarding_q1: string;
  onboarding_q2: string;
  onboarding_q3: string;
  onboarding_q4: string;
  onboarding_q5: string;
  onboarding_dream_placeholder: string;
  onboarding_dream_cost_placeholder: string;
  cta_start: string;
  cta_next: string;
  dashboard_title: string;
  money_saved: string;
  cigs_not_smoked: string;
  time_passed: string;
  dream_progress: string;
  craving_button: string;
  craving_loading: string;
  craving_modal_title: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  congrats: string;
  history_chart: string;
  lapsed_button: string;
  lapse_modal_title: string;
  lapse_modal_text: string;
  lapse_confirm: string;
  lapse_cancel: string;
  auth_register_title: string;
  auth_login_title: string;
  auth_email: string;
  auth_password: string;
  auth_have_account: string;
  auth_no_account: string;
  auth_login_btn: string;
  auth_register_btn: string;
  auth_error_not_found: string;
  auth_error_exists: string;
  auth_save_progress: string;
  logout: string;
  // New keys
  urge_modal_title: string;
  urge_rating_label: string;
  urge_low_title: string;
  urge_low_text: string;
  urge_high_title: string;
  urge_high_text: string;
  urge_btn_analyze: string;
  urge_btn_resisted: string;
  urge_btn_smoked: string;
  // New error
  auth_error_no_profile: string;
}
