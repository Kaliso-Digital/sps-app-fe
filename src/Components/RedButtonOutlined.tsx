// Button.js
import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  text: string;
  buttonType: 'button' | 'submit'; // Define the allowed values for buttonType
  disabled?: boolean;
  fullWidth?: boolean | false;
}

const RedButtonOutlined: React.FC<ButtonProps> = ({ onClick, text, buttonType, disabled, fullWidth }) => {
  return (
    <button onClick={onClick}
            style={{
                borderColor: "#FF4949",
                borderWidth: 2,
                fontWeight: "500", // You can adjust the font weight as needed
                color: "#FF4949",
            }}
            className={`${fullWidth ? 'w-full' : 'w-max'} text-base tracking-wide font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type={buttonType}
            disabled={disabled}
    >
      {text}
    </button>
  );
};

export default RedButtonOutlined;