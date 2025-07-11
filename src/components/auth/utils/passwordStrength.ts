export interface PasswordStrength {
  score: number;
  message: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  
  let message = '';
  let color = '';

  switch (score) {
    case 0:
    case 1:
      message = 'Very weak';
      color = 'text-red-600';
      break;
    case 2:
      message = 'Weak';
      color = 'text-orange-600';
      break;
    case 3:
      message = 'Fair';
      color = 'text-yellow-600';
      break;
    case 4:
      message = 'Good';
      color = 'text-blue-600';
      break;
    case 5:
      message = 'Strong';
      color = 'text-green-600';
      break;
    default:
      message = 'Very weak';
      color = 'text-red-600';
  }

  return { score, message, color, requirements };
};

export const getPasswordStrengthBar = (score: number): string => {
  const percentage = (score / 5) * 100;
  let bgColor = '';

  if (percentage <= 20) bgColor = 'bg-red-500';
  else if (percentage <= 40) bgColor = 'bg-orange-500';
  else if (percentage <= 60) bgColor = 'bg-yellow-500';
  else if (percentage <= 80) bgColor = 'bg-blue-500';
  else bgColor = 'bg-green-500';

  return `${bgColor} transition-all duration-300`;
};