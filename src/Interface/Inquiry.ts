interface Inquiry {
    createdBy: {
      email: string;
      id: number;
      name: string;
      phone: string;
    };
    customizations: string;
    description: string;
    id: number;
    image: string | Blob | null;
    link: string;
    name: string;
    notes: string;
    price: string;
    quantity: string;
    service: {
      id: number;
      name: string;
    };
    shipping: {
      id: number;
      name: string;
    };
    stage: {
      id: number;
      name: string;
    };
    variants: Array<{
      description: string | null;
      id: number;
      image: string | Blob | null;
      type: {
        id: number;
        name: string;
      };
    }>;
  }
  
  export default Inquiry;