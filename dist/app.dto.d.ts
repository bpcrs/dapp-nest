export declare class ResponseBody {
    success: boolean;
    data?: any;
}
export declare class RegisterRequest {
    username: string;
}
export declare class SubmitContractRequest {
    bookingId: number;
    carId: number;
    renterId: number;
    ownerId: number;
    fromDate: Date;
    toDate: Date;
    carPrice: number;
    totalPrice: number;
    location: string;
    destination: string;
    criteria: Criteria[];
}
export declare class QueryContractRequest {
    bookingId: number;
    carId: number;
    renterId: number;
    ownerId: number;
}
export declare class Criteria {
    name: string;
    value: string;
}
