import { SubmitContractRequest, ResponseBody, QueryContractRequest, SiginingContractRequest } from './app.dto';
export declare class AppService {
    CCP_PATH: string;
    CONTRACT_ID: string;
    CHANNEL_ID: string;
    FUNCTION_NAME: {
        SUBMIT_CONTRACT: string;
        QUERY_CONTRACT: string;
        SIGN_CONTRACT: string;
    };
    COPY_TYPE: {
        OWNER: string;
        RENTER: string;
    };
    AS_LOCALHOST: boolean;
    getHello(): string;
    registerUser(name: string): Promise<boolean>;
    submitContract(contract: SubmitContractRequest): Promise<ResponseBody>;
    signingContract(request: SiginingContractRequest): Promise<ResponseBody>;
    computeMD5Data(src: any): string;
    queryContract(contract: QueryContractRequest): Promise<ResponseBody>;
    query(fnName: string, ...args: string[]): Promise<ResponseBody>;
    invoke(fnName: string, ...args: string[]): Promise<ResponseBody>;
}
