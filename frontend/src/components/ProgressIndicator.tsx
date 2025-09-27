import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        
        return (
          <motion.div
            key={step}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isCompleted || isActive 
                ? 'bg-cyber-green' 
                : 'bg-gray-600'
            } ${isActive ? 'animate-pulse-glow scale-125' : ''}`}
            initial={{ scale: 0 }}
            animate={{ scale: isActive ? 1.25 : 1 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
};

export default ProgressIndicator;