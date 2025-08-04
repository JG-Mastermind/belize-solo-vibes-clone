import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranslationButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  targetLanguage: 'en' | 'fr';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const TranslationButton: React.FC<TranslationButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  targetLanguage,
  size = 'sm',
  variant = 'outline',
  className
}) => {
  const buttonText = targetLanguage === 'fr' ? 'Translate to French' : 'Translate to English';
  const flag = targetLanguage === 'fr' ? '🇫🇷' : '🇺🇸';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={cn(
        'flex items-center gap-2 transition-all duration-200',
        sizeClasses[size],
        isLoading && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Languages className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">{flag} {buttonText}</span>
      <span className="sm:hidden">{flag}</span>
    </Button>
  );
};

interface TranslationStatusProps {
  isTranslating: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export const TranslationStatus: React.FC<TranslationStatusProps> = ({
  isTranslating,
  error,
  onRetry,
  className
}) => {
  if (!isTranslating && !error) return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {isTranslating && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Translating...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-red-600">
          <span>Translation failed: {error}</span>
          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="ghost"
              className="h-auto p-1 text-red-600 hover:text-red-700"
            >
              Retry
            </Button>
          )}
        </div>
      )}
    </div>
  );
};