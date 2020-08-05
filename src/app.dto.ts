
export class ResponseBody {
    success: boolean;
    data?: any;
}
export class RegisterRequest {
    username: string;
}
export class SubmitContractRequest {
    public carId: number;
    public renterId: number;
    public ownerId: number;
    public fromDate: Date;
    public toDate: Date;
    public carPrice: number;
    public totalPrice: number;
    public location: string;
    public destination: string;
    public criteria: Criteria[];
}
export class Criteria {
    public name: string;
    public value: string;
}