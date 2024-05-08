export interface CustomizationQuote {
    customization: string | null;
    price: number | null;
    notPossible?: boolean | true;
    reason?: string | null;
}