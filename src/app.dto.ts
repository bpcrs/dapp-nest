
export class ResponseBody {
    success: boolean;
    data?: any;
}
export class RegisterRequest {
    username: string;
}
export class SubmitContractRequest {
    public bookingId: number;
    public carId: number;
    public renter: string;
    public owner: string;
    public fromDate: Date;
    public toDate: Date;
    public carPrice: number;
    public totalPrice: number;
    public location: string;
    public destination: string;
    public criteria: Criteria[];
}

export class QueryContractRequest {
    public bookingId: number;
    public carId: number;
    public renter: string;
    public owner: string;
    public copyType: string;
}
export class SiginingContractRequest {
    public bookingId: number;
    public carId: number;
    public renter: string;
    public owner: string;
    public isOwner: boolean;
    public data: string;
}
export class Criteria {
    public name: string;
    public value: string;
}
