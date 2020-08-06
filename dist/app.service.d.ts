import { SubmitContractRequest, ResponseBody, QueryContractRequest } from './app.dto';
export declare class AppService {
    CCP_PATH: string;
    CONTRACT_ID: string;
    CHANNEL_ID: string;
    FUNCTION_NAME: {
        SUBMIT_CONTRACT: string;
        QUERY_CONTRACT: string;
    };
    getHello(): string;
    registerUser(name: string): Promise<boolean>;
    submitContract(contract: SubmitContractRequest): Promise<ResponseBody>;
    queryContract(contract: QueryContractRequest): Promise<ResponseBody>;
    query(fnName: string, ...args: string[]): Promise<ResponseBody>;
    invoke(fnName: string, ...args: string[]): Promise<ResponseBody>;
}
