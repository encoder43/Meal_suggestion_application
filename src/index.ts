import { UserProfile, DailyMealPlan } from './types';
import { MealPlanner } from './mealPlanner';

export class NutritionAdvisor {
    private mealPlanner: MealPlanner;

    constructor() {
        this.mealPlanner = new MealPlanner();
    }

    generateAdvice(userProfile: UserProfile): DailyMealPlan {
        try {
            this.validateUserProfile(userProfile);
            return this.mealPlanner.generateMealPlan(userProfile);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to generate nutrition advice: ${error.message}`);
            } else {
                throw new Error('Failed to generate nutrition advice: Unknown error');
            }
        }
    }

    private validateUserProfile(profile: UserProfile): void {
        if (profile.age == null) {
            throw new Error('Missing required field: age');
        }
        if (profile.gender == null) {
            throw new Error('Missing required field: gender');
        }
        if (profile.height == null) {
            throw new Error('Missing required field: height');
        }
        if (profile.weight == null) {
            throw new Error('Missing required field: weight');
        }
        if (profile.activity_level == null) {
            throw new Error('Missing required field: activity_level');
        }
    }
}
