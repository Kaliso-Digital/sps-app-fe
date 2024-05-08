interface Quote {
    id: number;
    inquiryId: number;
    productName: string;
    productDesc: string;
    foundPrice: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    notes: string;
    image: string;
    video: string;
    certification: string;
    isBattery: number;
    isLiquid: number;
    isFoodPlant: number;
    inStock: number;
    orderArrival: number;
    noOfBoxes: number;
    user: {
        email: string;
        id: number;
        name: string;
        phone: string;
    };
    customization: {
        description: string;
    };
    status: {
        id: number;
        name: string;
        time: string;
    };
}

export default Quote;