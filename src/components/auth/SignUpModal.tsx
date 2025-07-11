
// This component is now integrated into SignInModal
// Kept for backwards compatibility

import React from 'react';
import { SignInModal } from './SignInModal';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToSignIn }) => {
  return (
    <SignInModal 
      isOpen={isOpen} 
      onClose={onClose} 
      onSwitchToSignUp={onSwitchToSignIn} 
    />
  );
};
