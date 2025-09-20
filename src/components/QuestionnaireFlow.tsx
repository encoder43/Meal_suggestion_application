import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, QuestionData } from './Question';
import { ProgressIndicator } from './ProgressIndicator';

const questions: QuestionData[] = [
  {
    id: 'name',
    title: "What's your name?",
    subtitle: "Let's personalize your experience",
    type: 'text',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    id: 'age',
    title: "How old are you?",
    subtitle: "This helps us calculate your nutritional needs",
    type: 'number',
    placeholder: 'Enter your age',
    required: true,
  },
  {
    id: 'gender',
    title: "What's your gender?",
    subtitle: "Nutritional requirements vary by gender",
    type: 'select',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    required: true,
  },
  {
    id: 'height',
    title: "What's your height?",
    subtitle: "Please enter in centimeters (e.g., 175)",
    type: 'number',
    placeholder: 'Height in cm',
    required: true,
  },
  {
    id: 'weight',
    title: "What's your current weight?",
    subtitle: "Please enter in kilograms (e.g., 70)",
    type: 'number',
    placeholder: 'Weight in kg',
    required: true,
  },
  {
    id: 'activity',
    title: "How active are you?",
    subtitle: "This affects your caloric needs",
    type: 'select',
    options: [
      'Sedentary (little to no exercise)',
      'Lightly active (light exercise 1-3 days/week)',
      'Moderately active (moderate exercise 3-5 days/week)',
      'Very active (hard exercise 6-7 days/week)',
      'Extremely active (very hard exercise, physical job)'
    ],
    required: true,
  },
  {
    id: 'goals',
    title: "What are your health goals?",
    subtitle: "Select all that apply or add your own",
    type: 'multiselect_with_custom',
    options: [
      'Weight loss',
      'Weight gain',
      'Muscle building',
      'Maintain current weight',
      'Improve energy levels',
      'Better digestion',
      'Heart health',
      'General wellness'
    ],
    customPlaceholder: 'e.g., Manage diabetes, Reduce inflammation, Improve sleep...',
    required: true,
  },
  {
    id: 'dietary_preferences',
    title: "Any dietary preferences?",
    subtitle: "Select all that apply or add your own",
    type: 'multiselect_with_custom',
    options: [
      'Vegetarian',
      'Vegan',
      'Pescatarian',
      'Keto',
      'Paleo',
      'Mediterranean',
      'Low-carb',
      'Gluten-free',
      'Dairy-free',
      'No restrictions'
    ],
    customPlaceholder: 'e.g., Raw food, Intermittent fasting, Specific allergies...',
    required: true,
  },
  {
    id: 'allergies',
    title: "Do you have any food allergies?",
    subtitle: "Please list any foods you're allergic to or leave blank if none",
    type: 'textarea',
    placeholder: 'e.g., nuts, shellfish, eggs...',
    required: false,
  },
  {
    id: 'medical_conditions',
    title: "Any medical conditions we should know about?",
    subtitle: "This helps us provide safer recommendations",
    type: 'textarea',
    placeholder: 'e.g., diabetes, hypertension, heart disease...',
    required: false,
  },
  {
    id: 'medications',
    title: "Are you taking any medications?",
    subtitle: "List any medications that might affect your nutrition",
    type: 'textarea',
    placeholder: 'e.g., metformin, thyroxine, blood pressure medication...',
    required: false,
  },
  {
    id: 'dislikes',
    title: "What foods do you dislike?",
    subtitle: "Help us avoid foods you don't enjoy",
    type: 'textarea',
    placeholder: 'e.g., broccoli, mushrooms, spicy food...',
    required: false,
  },
  {
    id: 'likes',
    title: "What are your favorite foods?",
    subtitle: "We'll try to include foods you love",
    type: 'textarea',
    placeholder: 'e.g., chicken, fish, vegetables, fruits...',
    required: false,
  },
  {
    id: 'religious_restrictions',
    title: "Any religious dietary restrictions?",
    subtitle: "This helps us respect your beliefs",
    type: 'textarea',
    placeholder: 'e.g., halal, kosher, vegetarian for religious reasons...',
    required: false,
  },
  {
    id: 'meals_per_day',
    title: "How many meals do you prefer per day?",
    subtitle: "This affects meal planning and portion sizes",
    type: 'select',
    options: ['2', '3', '4', '5', '6'],
    required: true,
  },
  {
    id: 'budget',
    title: "What's your food budget?",
    subtitle: "This helps us suggest appropriate meal options",
    type: 'select',
    options: ['Low budget', 'Medium budget', 'High budget'],
    required: true,
  },
  {
    id: 'cooking_skill',
    title: "What's your cooking skill level?",
    subtitle: "This helps us suggest appropriate recipes",
    type: 'select',
    options: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  {
    id: 'dietary_pattern',
    title: "What's your dietary pattern?",
    subtitle: "Select your primary eating style or specify your own",
    type: 'select_with_custom',
    options: ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Eggetarian'],
    customPlaceholder: 'e.g., Flexitarian, Raw vegan, Specific cultural diet...',
    required: true,
  },
  {
    id: 'cuisine_preferences',
    title: "What cuisines do you enjoy?",
    subtitle: "Select your favorite cuisines or add your own",
    type: 'multiselect_with_custom',
    options: [
      'Italian',
      'Chinese',
      'Indian',
      'Mexican',
      'Japanese',
      'Thai',
      'Mediterranean',
      'French',
      'American',
      'Korean',
      'Middle Eastern',
      'Spanish',
      'Greek',
      'Vietnamese',
      'Lebanese',
      'Turkish',
      'Moroccan',
      'Brazilian',
      'Peruvian',
      'Ethiopian'
    ],
    customPlaceholder: 'e.g., Caribbean, Filipino, German, Russian...',
    required: true,
  },
  {
    id: 'medical_conditions_old',
    title: "Any medical conditions we should know about?",
    subtitle: "This helps us provide safer recommendations",
    type: 'multiselect',
    options: [
      'Diabetes',
      'High blood pressure',
      'High cholesterol',
      'Thyroid issues',
      'PCOS',
      'Heart disease',
      'Kidney disease',
      'None of the above'
    ],
    required: true,
  },
];

interface QuestionnaireFlowProps {
  onComplete: (answers: Record<string, any>) => void;
  onBack: () => void;
}

export function QuestionnaireFlow({ onComplete, onBack }: QuestionnaireFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentQuestion = questions[currentStep - 1];

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  // Get question-specific background and theme
  const getQuestionTheme = (questionId: string) => {
    const themes = {
      name: { 
        bgImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGhlYWx0aCUyMHByb2ZpbGV8ZW58MXx8fHwxNzU4MTI1ODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['emerald', 'blue']
      },
      age: { 
        bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBhZ2luZyUyMGhlYWx0aHxlbnwxfHx8fDE3NTgxMjU4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['blue', 'purple']
      },
      gender: { 
        bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNpdHklMjBpbmNsdXNpb258ZW58MXx8fHwxNzU4MTI1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['purple', 'pink']
      },
      height: { 
        bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5JTIwbWVhc3VyZW1lbnQlMjBoZWlnaHQlMjBmaXRuZXNz8ZW58MXx8fHwxNzU4MTI1ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['green', 'emerald']
      },
      weight: { 
        bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5JTIwd2VpZ2h0JTIwaGVhbHRoeWV8ZW58MXx8fHwxNzU4MTI1ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['emerald', 'green']
      },
      activity: { 
        bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVyY2lzZSUyMHdvcmtvdXR8ZW58MXx8fHwxNzU4MTI1ODUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['orange', 'red']
      },
      goals: { 
        bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBnb2Fsc3xlbnwxfHx8fDE3NTgxMjU4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['green', 'blue']
      },
      dietary_preferences: { 
        bgImage: 'https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZnJlc2glMjB2ZWdldGFibGVzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU4MTI1ODQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['green', 'emerald']
      },
      allergies: { 
        bgImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxlcmdpZXMlMjBmb29kJTIwc2FmZXR5fGVufDF8fHwxNzU4MTI1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['red', 'orange']
      },
      medical_conditions: { 
        bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoJTIwY2FyZXxlbnwxfHx8fDE3NTgxMjU4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['blue', 'purple']
      },
      medications: { 
        bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZXMlMjBoZWFsdGhjYXJlfGVufDF8fHwxNzU4MTI1ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['purple', 'blue']
      },
      dislikes: { 
        bgImage: 'https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzbGlrZXN8ZW58MXx8fHwxNzU4MTI1ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['red', 'pink']
      },
      likes: { 
        bgImage: 'https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXZvcml0ZSUyMGZvb2R8ZW58MXx8fHwxNzU4MTI1ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['green', 'emerald']
      },
      religious_restrictions: { 
        bgImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWxpZ2lvdXMlMjBjdWx0dXJlJTIwZm9vZHxlbnwxfHx8fDE3NTgxMjU4NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['purple', 'indigo']
      },
      meals_per_day: { 
        bgImage: 'https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWFsJTIwcGxhbm5pbmclMjBzY2hlZHVsZXxlbnwxfHx8fDE3NTgxMjU4NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['orange', 'yellow']
      },
      budget: { 
        bgImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRnZXQlMjBtb25leSUyMGZvb2R8ZW58MXx8fHwxNzU4MTI1ODYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['yellow', 'orange']
      },
      cooking_skill: { 
        bgImage: 'https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwc2tpbGwlMjByZWNpcGV8ZW58MXx8fHwxNzU4MTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['red', 'orange']
      },
      dietary_pattern: { 
        bgImage: 'https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWV0YXJ5JTIwcGF0dGVybiUyMHZlZ2V0YXJpYW58ZW58MXx8fHwxNzU4MTI1ODYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['green', 'emerald']
      },
      cuisine_preferences: { 
        bgImage: 'https://images.unsplash.com/photo-1638328740227-1c4b1627614d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWlzaW5lJTIwd29ybGR3aWRlJTIwZm9vZHxlbnwxfHx8fDE3NTgxMjU4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['orange', 'red']
      },
      medical_conditions_old: { 
        bgImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoJTIwY2FyZXxlbnwxfHx8fDE3NTgxMjU4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        colors: ['blue', 'purple']
      }
    };
    return themes[questionId as keyof typeof themes] || themes.name;
  };

  const currentTheme = getQuestionTheme(currentQuestion.id);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50 py-8 px-4">
      {/* Animated Background Image */}
      <motion.div
        key={currentQuestion.id} // Re-animate when question changes
        className="absolute inset-0 opacity-15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `url(${currentTheme.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Floating Elements */}
      <motion.div
        className={`absolute top-20 left-20 w-20 h-20 bg-${currentTheme.colors[0]}-200 rounded-full opacity-60`}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute top-40 right-32 w-16 h-16 bg-${currentTheme.colors[1]}-200 rounded-full opacity-50`}
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute bottom-32 left-40 w-12 h-12 bg-${currentTheme.colors[0]}-300 rounded-full opacity-40`}
        animate={{
          y: [0, -15, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl text-gray-800 mb-2">
            Health Assessment
          </h1>
          <p className="text-gray-600">
            Help us create your personalized meal plan
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={questions.length}
        />

        {/* Question Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-[500px] flex items-center">
          <AnimatePresence mode="wait">
            <Question
              key={currentQuestion.id}
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentStep === 1}
              isLast={currentStep === questions.length}
            />
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          🔒 Your information is secure and will only be used to create your personalized meal plan
        </motion.div>
      </div>
    </div>
  );
}