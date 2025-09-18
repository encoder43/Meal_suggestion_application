import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MealPlanCard, MealData } from './MealPlanCard';

// Convert AI meal data to our MealData format
function convertAIMealToMealData(aiMeal: any, mealType: string): MealData {
  if (!aiMeal || !aiMeal.items || !aiMeal.items[0]) {
    // Return a default meal if AI data is incomplete
    return {
      id: `${mealType.toLowerCase()}_default`,
      name: `${mealType} - AI Generated`,
      description: 'AI-generated meal based on your preferences',
      calories: aiMeal?.calories || 0,
      protein: aiMeal?.macros?.protein || 0,
      carbs: aiMeal?.macros?.carbs || 0,
      fat: aiMeal?.macros?.fat || 0,
      cookingTime: 15,
      difficulty: 'Easy',
      ingredients: [],
      instructions: [],
      image: 'https://images.unsplash.com/photo-1642339800099-921df1a0a958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb3VzJTIwYnJlYWtmYXN0JTIwYm93bCUyMGhlYWx0aHl8ZW58MXx8fHwxNzU4MTI1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      tags: ['AI Generated', 'Personalized']
    };
  }

  const meal = aiMeal.items[0];
  const ingredients = meal.ingredients?.map((ing: any) => ing.name) || [];
  
  return {
    id: `${mealType.toLowerCase()}_ai`,
    name: meal.dish || `${mealType} - AI Generated`,
    description: `${mealType.toLowerCase()} with ${ingredients.slice(0, 3).join(', ')}${ingredients.length > 3 ? ' and more' : ''}`,
    calories: aiMeal.calories || 0,
    protein: aiMeal.macros?.protein || 0,
    carbs: aiMeal.macros?.carbs || 0,
    fat: aiMeal.macros?.fat || 0,
    cookingTime: Math.max(5, Math.min(60, ingredients.length * 3)), // Estimate based on ingredients
    difficulty: ingredients.length > 8 ? 'Advanced' : ingredients.length > 5 ? 'Medium' : 'Easy',
    ingredients: ingredients,
    instructions: meal.substitutions || [],
    image: 'https://images.unsplash.com/photo-1642339800099-921df1a0a958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb3VzJTIwYnJlYWtmYXN0JTIwYm93bCUyMGhlYWx0aHl8ZW58MXx8fHwxNzU4MTI1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['AI Generated', 'Personalized', mealType]
  };
}

// Generate personalized meal plan based on user answers
function generateMealPlan(answers: Record<string, any>): { 
  breakfast: MealData; 
  lunch: MealData; 
  dinner: MealData; 
  snack: MealData;
  dailyCalories: number;
  dailyProtein: number;
} {
  // Calculate BMR and daily calories (simplified calculation)
  const age = parseInt(answers.age) || 25;
  const weight = parseInt(answers.weight) || 70;
  const height = parseInt(answers.height) || 175;
  const gender = answers.gender || 'Male';
  
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'Male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multiplier
  const activityMultipliers = {
    'Sedentary (little to no exercise)': 1.2,
    'Lightly active (light exercise 1-3 days/week)': 1.375,
    'Moderately active (moderate exercise 3-5 days/week)': 1.55,
    'Very active (hard exercise 6-7 days/week)': 1.725,
    'Extremely active (very hard exercise, physical job)': 1.9
  };
  
  const activityLevel = answers.activity || 'Moderately active (moderate exercise 3-5 days/week)';
  const dailyCalories = Math.round(bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55));
  
  // Adjust for goals
  const goals = Array.isArray(answers.goals) ? answers.goals : [];
  let calorieAdjustment = 0;
  if (goals.includes('Weight loss')) calorieAdjustment = -300;
  if (goals.includes('Weight gain')) calorieAdjustment = +300;
  if (goals.includes('Muscle building')) calorieAdjustment = +200;
  
  const adjustedCalories = dailyCalories + calorieAdjustment;
  const dailyProtein = Math.round(weight * (goals.includes('Muscle building') ? 2 : 1.6));

  // Sample meal data (in a real app, this would come from a database)
  const breakfastOptions: MealData[] = [
    {
      id: 'bf1',
      name: 'Overnight Oats with Berries',
      description: 'Creamy oats soaked overnight with fresh berries, nuts, and a drizzle of honey',
      calories: Math.round(adjustedCalories * 0.25),
      protein: Math.round(dailyProtein * 0.2),
      carbs: 45,
      fat: 12,
      cookingTime: 5,
      difficulty: 'Easy',
      ingredients: ['Oats', 'Almond milk', 'Berries', 'Chia seeds', 'Honey'],
      instructions: [],
      image: 'https://images.unsplash.com/photo-1642339800099-921df1a0a958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb3VzJTIwYnJlYWtmYXN0JTIwYm93bCUyMGhlYWx0aHl8ZW58MXx8fHwxNzU4MTI1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      tags: ['High Fiber', 'Antioxidants', 'Quick']
    }
  ];

  const lunchOptions: MealData[] = [
    {
      id: 'l1',
      name: 'Mediterranean Quinoa Bowl',
      description: 'Protein-packed quinoa with fresh vegetables, feta cheese, and tahini dressing',
      calories: Math.round(adjustedCalories * 0.35),
      protein: Math.round(dailyProtein * 0.35),
      carbs: 55,
      fat: 18,
      cookingTime: 25,
      difficulty: 'Easy',
      ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Tomatoes', 'Feta', 'Olive oil'],
      instructions: [],
      image: 'https://images.unsplash.com/photo-1712746785169-6acf56045b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbHVuY2glMjBzYWxhZHxlbnwxfHx8fDE3NTgxMjU4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      tags: ['Plant-based', 'Mediterranean', 'Complete Protein']
    }
  ];

  const dinnerOptions: MealData[] = [
    {
      id: 'd1',
      name: 'Grilled Salmon with Vegetables',
      description: 'Omega-3 rich salmon with roasted seasonal vegetables and sweet potato',
      calories: Math.round(adjustedCalories * 0.3),
      protein: Math.round(dailyProtein * 0.4),
      carbs: 35,
      fat: 20,
      cookingTime: 30,
      difficulty: 'Medium',
      ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Asparagus', 'Lemon'],
      instructions: [],
      image: 'https://images.unsplash.com/photo-1564947310108-cdfbe8834f0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZGlubmVyJTIwcHJvdGVpbiUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzU4MTI1ODU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      tags: ['Omega-3', 'Low Carb', 'Heart Healthy']
    }
  ];

  const snackOptions: MealData[] = [
    {
      id: 's1',
      name: 'Greek Yogurt with Nuts',
      description: 'Protein-rich Greek yogurt topped with mixed nuts and a touch of honey',
      calories: Math.round(adjustedCalories * 0.1),
      protein: Math.round(dailyProtein * 0.15),
      carbs: 15,
      fat: 8,
      cookingTime: 2,
      difficulty: 'Easy',
      ingredients: ['Greek yogurt', 'Mixed nuts', 'Honey', 'Cinnamon'],
      instructions: [],
      image: 'https://images.unsplash.com/photo-1642339800099-921df1a0a958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb3VzJTIwYnJlYWtmYXN0JTIwYm93bCUyMGhlYWx0aHl8ZW58MXx8fHwxNzU4MTI1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      tags: ['High Protein', 'Probiotics', 'Quick']
    }
  ];

  return {
    breakfast: breakfastOptions[0],
    lunch: lunchOptions[0],
    dinner: dinnerOptions[0],
    snack: snackOptions[0],
    dailyCalories: adjustedCalories,
    dailyProtein
  };
}

interface ResultsScreenProps {
  answers: Record<string, any>;
  onRestart: () => void;
}

export function ResultsScreen({ answers, onRestart }: ResultsScreenProps) {
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userName = answers.name || 'there';
  const goals = Array.isArray(answers.goals) ? answers.goals : [];

  // Convert frontend answers to backend API format
  const convertAnswersToAPIFormat = (answers: Record<string, any>) => {
    // Map frontend answers to backend expected format
    const activityMapping: Record<string, string> = {
      'Sedentary (little to no exercise)': 'sedentary',
      'Lightly active (light exercise 1-3 days/week)': 'light',
      'Moderately active (moderate exercise 3-5 days/week)': 'moderate',
      'Very active (hard exercise 6-7 days/week)': 'very_active',
      'Extremely active (very hard exercise, physical job)': 'very_active'
    };

    const genderMapping: Record<string, string> = {
      'Male': 'male',
      'Female': 'female',
      'Non-binary': 'other',
      'Prefer not to say': 'other'
    };

    const budgetMapping: Record<string, string> = {
      'Low budget': 'low',
      'Medium budget': 'medium', 
      'High budget': 'high'
    };

    const cookingSkillMapping: Record<string, string> = {
      'Beginner': 'beginner',
      'Intermediate': 'intermediate',
      'Advanced': 'advanced'
    };

    const dietaryPatternMapping: Record<string, string> = {
      'Omnivore': 'omnivore',
      'Vegetarian': 'vegetarian',
      'Vegan': 'vegan',
      'Pescatarian': 'pescatarian',
      'Eggetarian': 'eggetarian'
    };

    // Helper function to process custom input values
    const processCustomValue = (value: any, mapping?: Record<string, string>) => {
      if (typeof value === 'object' && value !== null) {
        // Handle custom input format { selected: string/array, custom: string }
        let processedValue = '';
        
        if (value.selected) {
          if (Array.isArray(value.selected)) {
            // Multiselect with custom
            processedValue = value.selected.join(', ');
          } else {
            // Select with custom
            processedValue = value.selected;
          }
        }
        
        if (value.custom && value.custom.trim()) {
          if (processedValue) {
            processedValue += ', ' + value.custom.trim();
          } else {
            processedValue = value.custom.trim();
          }
        }
        
        return processedValue;
      }
      return value;
    };

    // Process dietary pattern (select with custom)
    const dietaryPatternValue = processCustomValue(answers.dietary_pattern, dietaryPatternMapping);
    const finalDietaryPattern = dietaryPatternMapping[dietaryPatternValue] || dietaryPatternValue.toLowerCase() || 'omnivore';

    // Process goals (multiselect with custom)
    const goalsValue = processCustomValue(answers.goals);
    const goalsArray = goalsValue ? goalsValue.split(',').map((g: string) => g.trim().toLowerCase().replace(' ', '_')).filter(g => g) : ['wellness'];

    // Process dietary preferences (multiselect with custom)
    const dietaryPreferencesValue = processCustomValue(answers.dietary_preferences);
    const dietaryPreferencesArray = dietaryPreferencesValue ? dietaryPreferencesValue.split(',').map((p: string) => p.trim()).filter(p => p) : [];

    // Process cuisine preferences (multiselect with custom)
    const cuisinePreferencesValue = processCustomValue(answers.cuisine_preferences);
    const cuisinePreferencesArray = cuisinePreferencesValue ? cuisinePreferencesValue.split(',').map((c: string) => c.trim()).filter(c => c) : [];

    return {
      age: parseInt(answers.age) || 25,
      gender: genderMapping[answers.gender] || 'male',
      height_cm: parseFloat(answers.height) || 175,
      weight_kg: parseFloat(answers.weight) || 70,
      activity_level: activityMapping[answers.activity] || 'moderate',
      sleep_hours: 7.0, // Default value
      medical_conditions: answers.medical_conditions ? answers.medical_conditions.split(',').map((c: string) => c.trim()).filter(c => c) : [],
      medications: answers.medications ? answers.medications.split(',').map((m: string) => m.trim()).filter(m => m) : [],
      allergies: answers.allergies ? answers.allergies.split(',').map((a: string) => a.trim()).filter(a => a) : [],
      dietary_pattern: finalDietaryPattern,
      dislikes: answers.dislikes ? answers.dislikes.split(',').map((d: string) => d.trim()).filter(d => d) : [],
      likes: answers.likes ? answers.likes.split(',').map((l: string) => l.trim()).filter(l => l) : [],
      religious_restrictions: answers.religious_restrictions ? answers.religious_restrictions.split(',').map((r: string) => r.trim()).filter(r => r) : [],
      meals_per_day: parseInt(answers.meals_per_day) || 3,
      budget: budgetMapping[answers.budget] || 'medium',
      cooking_skill: cookingSkillMapping[answers.cooking_skill] || 'intermediate',
      output_wants: ['calories', 'macros', 'recipes'],
      goals: goalsArray,
      dietary_preferences: dietaryPreferencesArray,
      cuisine_preferences: cuisinePreferencesArray
    };
  };

  // Call the backend API to get personalized meal plan
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiPayload = convertAnswersToAPIFormat(answers);
        console.log('Sending to API:', apiPayload);
        
        const response = await fetch('http://localhost:8000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiPayload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Parse the AI response and create meal plan structure
        const aiResponse = data.answer;
        
        // Try to parse the AI response as JSON to extract structured meal data
        let parsedMealPlan = null;
        try {
          // Look for JSON in the response (it might be wrapped in markdown or other text)
          const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/```\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            parsedMealPlan = JSON.parse(jsonMatch[1]);
          } else {
            // Try to parse the entire response as JSON
            parsedMealPlan = JSON.parse(aiResponse);
          }
        } catch (parseError) {
          console.log('Could not parse AI response as JSON, using text response:', parseError);
        }
        
        if (parsedMealPlan && parsedMealPlan.meal_plan && parsedMealPlan.meal_plan[0]) {
          // Convert AI meal plan to our format
          const aiMealData = parsedMealPlan.meal_plan[0];
          const dailySummary = aiMealData.daily_summary;
          
          const aiMealPlan = {
            breakfast: convertAIMealToMealData(aiMealData.meals.breakfast, 'Breakfast'),
            lunch: convertAIMealToMealData(aiMealData.meals.lunch, 'Lunch'),
            dinner: convertAIMealToMealData(aiMealData.meals.dinner, 'Dinner'),
            snack: convertAIMealToMealData(aiMealData.meals.snack_1 || aiMealData.meals.snack, 'Snack'),
            dailyCalories: dailySummary?.total_calories || 0,
            dailyProtein: dailySummary?.macros?.protein || 0,
            aiResponse: aiResponse,
            aiMealPlan: parsedMealPlan,
            hydrationTips: dailySummary?.hydration_tips,
            lifestyleTips: dailySummary?.lifestyle_tips,
            notes: parsedMealPlan.notes
          };
          
          setMealPlan(aiMealPlan);
        } else {
          // Fallback to static meal plan if parsing fails
          const fallbackMealPlan = generateMealPlan(answers);
          setMealPlan({
            ...fallbackMealPlan,
            aiResponse: aiResponse
          });
        }
        
      } catch (err) {
        console.error('Error fetching meal plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch meal plan');
        // Fallback to static meal plan if API fails
        setMealPlan(generateMealPlan(answers));
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [answers]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center animate-spin">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-2xl mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            AI Nutritionist is analyzing your profile...
          </h2>
          <p className="text-gray-600">Creating your personalized meal plan</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl mb-4 text-red-600">Connection Error</h2>
          <p className="text-gray-600 mb-6">
            Could not connect to the AI nutritionist. Please make sure the backend server is running on port 8000.
          </p>
          <Button onClick={onRestart} className="bg-gradient-to-r from-emerald-500 to-blue-500">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center"
          >
            <span className="text-2xl">🎉</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
          >
            Your Personalized Meal Plan is Ready, {userName}!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-gray-600 mb-6"
          >
            Based on your goals and preferences, here's your customized nutrition plan
          </motion.p>

          {/* Daily Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <Badge variant="outline" className="px-4 py-2 bg-white border-emerald-200 text-emerald-700">
              Daily Target: {mealPlan.dailyCalories} calories
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-white border-blue-200 text-blue-700">
              Protein Goal: {mealPlan.dailyProtein}g
            </Badge>
            {goals.length > 0 && (
              <Badge variant="outline" className="px-4 py-2 bg-white border-purple-200 text-purple-700">
                Focus: {goals[0]}
              </Badge>
            )}
          </motion.div>
        </motion.div>

        {/* AI Response Section - show only when structured AI meal plan parsed */}
        {mealPlan.aiMealPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12 bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 mr-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Nutritionist's Personalized Plan</h3>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {mealPlan.aiResponse}
              </div>
            </div>
          </motion.div>
        )}

        {/* Meal Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MealPlanCard 
            meal={mealPlan.breakfast} 
            mealType="Breakfast" 
            delay={0.1} 
          />
          <MealPlanCard 
            meal={mealPlan.lunch} 
            mealType="Lunch" 
            delay={0.2} 
          />
          <MealPlanCard 
            meal={mealPlan.dinner} 
            mealType="Dinner" 
            delay={0.3} 
          />
          <MealPlanCard 
            meal={mealPlan.snack} 
            mealType="Snack" 
            delay={0.4} 
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Meal Plan
          </Button>
          
          <Button 
            variant="outline" 
            className="px-8 py-3 rounded-xl border-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
            </svg>
            Generate Shopping List
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onRestart}
            className="px-8 py-3 rounded-xl"
          >
            Start Over
          </Button>
        </motion.div>

        {/* AI-Generated Tips Section */}
        {(mealPlan.hydrationTips || mealPlan.lifestyleTips || mealPlan.notes) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 mr-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Nutritionist's Recommendations</h3>
            </div>
            
            <div className="space-y-6">
              {mealPlan.hydrationTips && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">Hydration Tips</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{mealPlan.hydrationTips}</p>
                </div>
              )}
              
              {mealPlan.lifestyleTips && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 mr-3 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">Lifestyle Tips</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{mealPlan.lifestyleTips}</p>
                </div>
              )}
              
              {mealPlan.notes && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 mr-3 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">Additional Notes</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{mealPlan.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Default Tips Section (fallback) */}
        {!mealPlan.hydrationTips && !mealPlan.lifestyleTips && !mealPlan.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-xl mb-4 text-center text-gray-800">
              💡 Tips for Success
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-lg mb-2">Stay Hydrated</h4>
                <p className="text-gray-600 text-sm">Drink 8-10 glasses of water daily for optimal health and metabolism</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg mb-2">Regular Meals</h4>
                <p className="text-gray-600 text-sm">Eat at consistent times to maintain stable energy levels throughout the day</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-lg mb-2">Listen to Your Body</h4>
                <p className="text-gray-600 text-sm">Adjust portions based on hunger cues and energy levels</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}