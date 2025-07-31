import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookingStep } from '@/types/booking';

interface BookingStepIndicatorProps {
  steps: BookingStep[];
}

export const BookingStepIndicator: React.FC<BookingStepIndicatorProps> = ({ steps }) => {
  const { t } = useTranslation(['booking']);
  
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted"></div>
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${((steps.filter(s => s.completed).length) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-200
                ${step.completed 
                  ? 'bg-primary text-primary-foreground' 
                  : step.current 
                    ? 'bg-primary/10 text-primary ring-2 ring-primary' 
                    : 'bg-muted text-muted-foreground'
                }
              `}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="text-center">
                <div className={`
                  text-sm font-medium mb-1
                  ${step.current ? 'text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Progress Bar */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{t('booking:stepIndicator.stepXOfY', { current: steps.find(s => s.current)?.id || 1, total: steps.length })}</span>
          <span>{t('booking:stepIndicator.percentComplete', { percent: Math.round(((steps.filter(s => s.completed).length) / steps.length) * 100) })}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((steps.filter(s => s.completed).length) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};