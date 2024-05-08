import { MouseEventHandler } from "react";
import Inquiry from "./Inquiry";

interface Popup {
    onClose: () => void;
    handleNext?: (() => void) | MouseEventHandler<HTMLButtonElement>;
    handleBack?: (() => void) | MouseEventHandler<HTMLButtonElement>;
    handleAction?: ((data: string | any) => void) | ((data: number | any) => void);
    data?: null | any;
    title?: null | any;
};

export default Popup;