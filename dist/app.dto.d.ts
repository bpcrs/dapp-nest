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
    renter: string;
    owner: string;
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
    renter: string;
    owner: string;
    copyType: string;
}
export declare class SiginingContractRequest {
    bookingId: number;
    carId: number;
    renter: string;
    owner: string;
    isOwner: boolean;
    data: string;
}
export declare class Criteria {
    name: string;
    value: string;
}
