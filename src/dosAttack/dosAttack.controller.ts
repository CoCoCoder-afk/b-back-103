import {Body, Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import { DosAttackService } from "./dosAttack.service";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";

interface SendRequestsToBuyBody {
  url: string;
  params: {
    amountOfRequests: number;
    productId: string;
    number: number;
  }
  requestHeaders: any;
}

@Controller('')
export class DosAttackController {
  constructor(private readonly dosAttackService: DosAttackService) {
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('/sendRequestsToBuy')
  async sendRequestsToBuy(@Body() requestBody: SendRequestsToBuyBody) {
    const {url, params, requestHeaders} = requestBody;
    const startTime = new Date().getTime();
    await this.dosAttackService.makeAnAttack(url, params, requestHeaders);
    const endTime = new Date().getTime();
    return {
      code: 200,
      message: `${endTime - startTime} ms was wasted for the DOS attack`
    }
  }
}
