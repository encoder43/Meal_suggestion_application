import { useState } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { QuestionnaireFlow } from './components/QuestionnaireFlow';
import { ResultsScreen } from './components/ResultsScreen';

type AppState = 'landing' | 'questionnaire' | 'results';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});

  const handleStart = () => {
    setCurrentState('questionnaire');
  };

  const handleQuestionnaireComplete = (answers: Record<string, any>) => {
    setUserAnswers(answers);
    setCurrentState('results');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentState('landing');
  };

  switch (currentState) {
    case 'landing':
      return <LandingScreen onStart={handleStart} />;
    
    case 'questionnaire':
      return (
        <QuestionnaireFlow 
          onComplete={handleQuestionnaireComplete}
          onBack={handleBackToLanding}
        />
      );
    
    case 'results':
      return (
        <ResultsScreen 
          answers={userAnswers}
          onRestart={handleRestart}
        />
      );
    
    default:
      return <LandingScreen onStart={handleStart} />;
  }
}