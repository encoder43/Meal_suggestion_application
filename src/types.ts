export interface UserProfile {
    age: number;
    gender: string;
    height: number;
    weight: number;
    activity_level: string;
    sleep: number;
    medical_conditions: string[];
    medications: string[];
    allergies: string[];
    dietary_pattern: string;
    dislikes: string[];
    likes: string[];
    religious_restrictions: string[];
    meals_per_day: number;
    eating_window: string;
    budget: string;
    cooking_skill: string;
    goals: string[];
    dietary_preferences: string[];
    cuisine_preferences: string[];
    output_wants: string[];
}

export interface Meal {
    name: string;
    portion_size: string;
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    reason: string;
    recipe?: Recipe;
}

export interface Recipe {
    ingredients: string[];
    instructions: string[];
    prep_time: number;
    cook_time: number;
}

export interface DailyMealPlan {
    total_calories: number;
    macro_breakdown: {
        protein: number;
        carbs: number;
        fat: number;
    };
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
}
