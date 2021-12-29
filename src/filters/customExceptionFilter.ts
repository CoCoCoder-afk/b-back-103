import {ArgumentsHost, Catch, ExceptionFilter, ForbiddenException} from "@nestjs/common";

@Catch()
export default class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const info = {
      status: 502,
      message: exception.message,
    };

    console.warn(info);
    return response.status(502).json(info);
  }
}