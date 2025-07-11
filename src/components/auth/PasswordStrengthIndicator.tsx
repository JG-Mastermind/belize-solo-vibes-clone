import React from 'react';
import { checkPasswordStrength, getPasswordStrengthBar } from './utils/passwordStrength';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  showRequirements = true 
}) => {
  const strength = checkPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Password strength</span>
        <span className={`text-sm font-medium ${strength.color}`}>
          {strength.message}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getPasswordStrengthBar(strength.score)}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>

      {showRequirements && (
        <div className="space-y-1">
          <div className="text-xs text-gray-600">Password requirements:</div>
          <div className="grid grid-cols-1 gap-1">
            <RequirementItem 
              met={strength.requirements.length} 
              text="At least 8 characters" 
            />
            <RequirementItem 
              met={strength.requirements.uppercase} 
              text="One uppercase letter" 
            />
            <RequirementItem 
              met={strength.requirements.lowercase} 
              text="One lowercase letter" 
            />
            <RequirementItem 
              met={strength.requirements.number} 
              text="One number" 
            />
            <RequirementItem 
              met={strength.requirements.special} 
              text="One special character" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const RequirementItem: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <Check className="h-3 w-3 text-green-500" />
    ) : (
      <X className="h-3 w-3 text-red-500" />
    )}
    <span className={`text-xs ${met ? 'text-green-600' : 'text-red-600'}`}>
      {text}
    </span>
  </div>
);