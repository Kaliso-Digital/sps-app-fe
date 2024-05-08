// Button.js
import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
  buttonType: 'button' | 'submit'; // Define the allowed values for buttonType
  disabled?: boolean;
}

const PrimaryButtonOutlined: React.FC<ButtonProps> = ({ onClick, text, buttonType, disabled }) => {
  return (
    <button onClick={onClick}
            className="w-full text-base  tracking-wide  text-[#0D8FFD] border border-[#0D8FFD]  font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type={buttonType}
            disabled={disabled}
    >
      {text}
    </button>
  );
};

export default PrimaryButtonOutlined;