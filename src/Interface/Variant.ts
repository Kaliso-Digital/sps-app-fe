export interface Variant {
    description: string | null;
    id: number;
    image: string | Blob | null;
    type: {
      id: number;
      name: string;
    };
}

export interface VariantQuote {
  description: string | null;
  id: number;
  image: string | Blob | null;
  type: {
    id: number;
    name: string;
  }
  price: number | null;
  notPossible?: boolean | true;
  reason?: string | null;
}