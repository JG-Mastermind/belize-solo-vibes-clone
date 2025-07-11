import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { BookingStep } from '@/types/booking';

interface BookingStepIndicatorProps {
  steps: BookingStep[];
}

export const BookingStepIndicator: React.FC<BookingStepIndicatorProps> = ({ steps }) => {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${((steps.filter(s => s.completed).length) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-200
                ${step.completed 
                  ? 'bg-blue-600 text-white' 
                  : step.current 
                    ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600' 
                    : 'bg-gray-200 text-gray-500'
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
                  ${step.current ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Progress Bar */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step {steps.find(s => s.current)?.id || 1} of {steps.length}</span>
          <span>{Math.round(((steps.filter(s => s.completed).length) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((steps.filter(s => s.completed).length) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};