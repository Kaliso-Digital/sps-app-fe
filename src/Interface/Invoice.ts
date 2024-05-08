interface Invoice {
    id: number;
    inquiryId: number;
    quoteId: number;
    file: string;
    channel: number;
    user: {
        email: string;
        id: number;
        name: string;
        phone: string;
    };
    status: {
        id: number;
        name: string;
        time: string;
    };
    payment: {
        id: number;
        name: string;
        description: string;
        channel: {
            id: number;
            name: string;
        };
        time: string;
    };
    quote?: {
        id: number;
        name: string;
        description: string;
        price: number;
    };
    customer?: {
        id: number;
        name: string;
        email: string;
        phone: string;
        address?: {
            address: string;
            city: string;
            country: string;
            zipcode: string;
            province: string;
        }
    }
}
  
export default Invoice;