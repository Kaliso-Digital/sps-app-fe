// Button.js
import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
  buttonType: 'button' | 'submit'; // Define the allowed values for buttonType
  disabled?: boolean;
}

const HollowButton: React.FC<ButtonProps> = ({ onClick, text, buttonType, disabled }) => {
  return (
    <button onClick={onClick}
            className="flex items-center text-base font-medium  rounded-md p-2 hover:shadow-md border-none outline-none shadow-none"
            type={buttonType}
            disabled={disabled}
    >
      {text}
    </button>
  );
};

export default HollowButton;