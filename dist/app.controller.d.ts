import { AppService } from './app.service';
import { RegisterRequest, ResponseBody, SubmitContractRequest, QueryContractRequest, SiginingContractRequest } from './app.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    registerUser(request: RegisterRequest): Promise<ResponseBody>;
    submitContract(request: SubmitContractRequest): Promise<ResponseBody>;
    queryContract(request: QueryContractRequest): Promise<ResponseBody>;
    signContract(request: SiginingContractRequest): Promise<ResponseBody>;
}
