import { motion } from 'motion/react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <motion.div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                  : isCurrent
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: isCurrent ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {isCompleted ? (
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                <span className="text-sm">{stepNumber}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Step Text */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}