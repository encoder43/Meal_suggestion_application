import { UserProfile } from './types';

export class NutritionCalculator {
    private calculateBMR(profile: UserProfile): number {
        const { gender, weight, height, age } = profile;
        if (gender.toLowerCase() === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        }
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    private getActivityMultiplier(activity: string): number {
        type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
        
        const multipliers: Record<ActivityLevel, number> = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };

        const normalizedActivity = activity.toLowerCase() as ActivityLevel;
        return multipliers[normalizedActivity] || multipliers.sedentary;
    }

    calculateDailyNeeds(profile: UserProfile) {
        const bmr = this.calculateBMR(profile);
        const tdee = bmr * this.getActivityMultiplier(profile.activity_level);
        
        let targetCalories = tdee;
        if (profile.goals.includes('weight_loss')) {
            targetCalories *= 0.8; // 20% deficit
        } else if (profile.goals.includes('weight_gain')) {
            targetCalories *= 1.2; // 20% surplus
        }

        return {
            calories: Math.round(targetCalories),
            macros: {
                protein: Math.round((targetCalories * 0.25) / 4), // 25% protein
                carbs: Math.round((targetCalories * 0.45) / 4),   // 45% carbs
                fat: Math.round((targetCalories * 0.30) / 9)      // 30% fat
            }
        };
    }
}
