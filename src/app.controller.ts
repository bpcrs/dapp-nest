import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterRequest, ResponseBody, SubmitContractRequest } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/register')
   async registerUser(@Body() request: RegisterRequest): Promise<ResponseBody> {
    const result = await this.appService.registerUser(request.username);
    const response: ResponseBody = {
      success : result,
    };
    return response;
  }

  @Post('submit-contract')
  async submitContract(@Body() request: SubmitContractRequest): Promise<ResponseBody> {
    const response: ResponseBody = {
      success : false,
    };
    return response;
  }

  @Post('sign-contract')
  async signContract(@Body() request: RegisterRequest): Promise<ResponseBody> {
    const response: ResponseBody = {
      success : false,
    };
    return response;
  }
}
