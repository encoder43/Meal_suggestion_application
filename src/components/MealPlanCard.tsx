import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export interface MealData {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  image: string;
  tags: string[];
}

interface MealPlanCardProps {
  meal: MealData;
  mealType: string;
  delay?: number;
}

export function MealPlanCard({ meal, mealType, delay = 0 }: MealPlanCardProps) {
  const [showRecipe, setShowRecipe] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
              {mealType}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {meal.cookingTime} min
            </div>
          </div>
          <CardTitle className="text-xl">{meal.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Image */}
          <div className="relative h-48 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={meal.image}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge 
                variant="outline" 
                className={`bg-white/90 border-0 ${
                  meal.difficulty === 'Easy' ? 'text-green-600' :
                  meal.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}
              >
                {meal.difficulty}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm">{meal.description}</p>

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-2 py-3 border rounded-lg bg-gray-50">
            <div className="text-center">
              <p className="text-lg font-semibold text-emerald-600">{meal.calories}</p>
              <p className="text-xs text-gray-600">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600">{meal.protein}g</p>
              <p className="text-xs text-gray-600">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-orange-600">{meal.carbs}g</p>
              <p className="text-xs text-gray-600">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-purple-600">{meal.fat}g</p>
              <p className="text-xs text-gray-600">Fat</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {meal.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowRecipe(!showRecipe)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              {showRecipe ? 'Hide Recipe' : 'Recipe'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              Shop
            </Button>
          </div>

          {/* Recipe Details */}
          <AnimatePresence>
            {showRecipe && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-4 mt-4"
              >
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Recipe Details
                </h4>
                
                {/* Ingredients */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Ingredients:</h5>
                  <ul className="space-y-1">
                    {meal.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Instructions:</h5>
                  <ol className="space-y-2">
                    {meal.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="bg-emerald-100 text-emerald-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Nutrition Summary */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-700 mb-2">Nutrition Summary:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calories:</span>
                      <span className="font-medium text-emerald-600">{meal.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protein:</span>
                      <span className="font-medium text-blue-600">{meal.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carbs:</span>
                      <span className="font-medium text-orange-600">{meal.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fat:</span>
                      <span className="font-medium text-purple-600">{meal.fat}g</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}