// Button.js
import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  text: string;
  buttonType: 'button' | 'submit'; // Define the allowed values for buttonType
  disabled?: boolean;
  fullWidth?: boolean | false;
}

const PrimaryButton: React.FC<ButtonProps> = ({ onClick, text, buttonType, disabled, fullWidth }) => {
  return (
    <button onClick={onClick}
            className={`${fullWidth ? 'w-full' : 'w-max'} text-white text-base font-semibold bg-[#0D8FFD] hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type={buttonType}
            disabled={disabled}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;