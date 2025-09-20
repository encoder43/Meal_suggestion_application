import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- PLACEHOLDER UI COMPONENTS ---
// We only need a simple button now for the "Start Over" functionality.
const Button = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
    <button onClick={onClick} className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}>
        {children}
    </button>
);

interface ResultsScreenProps {
    answers: Record<string, any>;
    onRestart: () => void;
}

export function ResultsScreen({ answers, onRestart }: ResultsScreenProps) {
    // State is now much simpler: we just need to store the HTML string.
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // This function remains essential for sending clean data to the backend.
    const convertAnswersToAPIFormat = (answers: Record<string, any>) => {
        const getSafeString = (value: any): string => {
            if (typeof value === 'string') return value;
            if (typeof value === 'object' && value !== null && typeof value.selected === 'string') return value.selected;
            return '';
        };
        const activityMapping: Record<string, string> = {
            'Sedentary (little to no exercise)': 'sedentary',
            'Lightly active (light exercise 1-3 days/week)': 'light',
            'Moderately active (moderate exercise 3-5 days/week)': 'moderate',
            'Very active (hard exercise 6-7 days/week)': 'very_active',
        };
        const goals = getSafeString(answers.goals).split(',').map(g => g.trim().toLowerCase()).filter(Boolean);

        return {
            age: parseInt(answers.age) || 25,
            gender: getSafeString(answers.gender).toLowerCase() || 'male',
            height_cm: parseFloat(answers.height) || 175,
            weight_kg: parseFloat(answers.weight) || 70,
            activity_level: activityMapping[getSafeString(answers.activity)] || 'moderate',
            sleep_hours: 7.0,
            medical_conditions: getSafeString(answers.medical_conditions).split(',').map(c => c.trim()).filter(Boolean),
            medications: getSafeString(answers.medications).split(',').map(m => m.trim()).filter(Boolean),
            allergies: getSafeString(answers.allergies).split(',').map(a => a.trim()).filter(Boolean),
            dietary_pattern: getSafeString(answers.dietary_pattern).toLowerCase() || 'omnivore',
            dislikes: getSafeString(answers.dislikes).split(',').map(d => d.trim()).filter(Boolean),
            likes: getSafeString(answers.likes).split(',').map(l => l.trim()).filter(Boolean),
            meals_per_day: parseInt(getSafeString(answers.meals_per_day)) || 3,
            budget: getSafeString(answers.budget).split(' ')[0].toLowerCase() || 'medium',
            cooking_skill: getSafeString(answers.cooking_skill).toLowerCase() || 'intermediate',
            goals: goals.length > 0 ? goals : ['wellness'],
             // These can be kept or removed depending on whether your prompt uses them
            output_wants: ["calories", "macros", "recipes"],
            dietary_preferences: [],
            cuisine_preferences: [],
        };
    };

    useEffect(() => {
        const fetchMealPlan = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiPayload = convertAnswersToAPIFormat(answers);
                console.log('Sending to API:', apiPayload);

                const response = await fetch('http://127.0.0.1:8000/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiPayload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // The key change is here: we just grab the 'html_content' string.
                if (data.html_content) {
                    setHtmlContent(data.html_content);
                } else {
                    throw new Error("The server's response was empty.");
                }

            } catch (err) {
                console.error('Error fetching meal plan:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching the plan.');
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlan();
    }, [answers]);

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 text-center p-4">
                <div>
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center animate-spin">
                        <span className="text-2xl">🤖</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700">AI Nutritionist is preparing your plan...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-red-50 text-center p-4">
                 <div>
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">An Error Occurred</h2>
                    <p className="text-gray-600 mb-6 max-w-md">{error}</p>
                    <Button onClick={onRestart} className="bg-red-500 hover:bg-red-600">Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* The key change: We render the AI-generated HTML directly. */}
                {htmlContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                )}

                {/* The restart button is placed outside the AI-generated content for consistency. */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mt-8"
                >
                    <Button onClick={onRestart} className="bg-gray-700 hover:bg-gray-800">
                        Start Over
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

