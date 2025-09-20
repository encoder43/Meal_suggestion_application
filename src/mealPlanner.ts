import { UserProfile, DailyMealPlan, Recipe, Meal } from './types';
import { NutritionCalculator } from './nutritionCalculator';

export class MealPlanner {
    private nutritionCalculator: NutritionCalculator;

    constructor() {
        this.nutritionCalculator = new NutritionCalculator();
    }

    generateMealPlan(profile: UserProfile): DailyMealPlan {
        const dailyNeeds = this.nutritionCalculator.calculateDailyNeeds(profile);
        
        // Distribution: 30% breakfast, 35% lunch, 35% dinner
        const breakfastCals = dailyNeeds.calories * 0.3;
        const lunchCals = dailyNeeds.calories * 0.35;
        const dinnerCals = dailyNeeds.calories * 0.35;

        const plan: DailyMealPlan = {
            total_calories: dailyNeeds.calories,
            macro_breakdown: dailyNeeds.macros,
            breakfast: this.generateMeal(profile, 'breakfast', breakfastCals),
            lunch: this.generateMeal(profile, 'lunch', lunchCals),
            dinner: this.generateMeal(profile, 'dinner', dinnerCals)
        };

        return plan;
    }

    private generateMeal(profile: UserProfile, mealType: string, targetCalories: number): Meal {
        const meal: Meal = {
            name: "Placeholder Meal",
            portion_size: "1 serving",
            calories: targetCalories,
            macros: {
                protein: 20,
                carbs: 40,
                fat: 10
            },
            reason: "Balanced meal matching your preferences"
        };

        if (profile.output_wants.includes('recipes')) {
            meal.recipe = this.generateRecipe(meal.name);
        }

        return meal;
    }

    private generateRecipe(mealName: string): Recipe {
        return {
            ingredients: ["placeholder ingredients"],
            instructions: ["placeholder instructions"],
            prep_time: 15,
            cook_time: 30
        };
    }
}
