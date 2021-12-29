import {ArgumentsHost, Catch, ExceptionFilter, ForbiddenException} from "@nestjs/common";

@Catch()
export default class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(502).send({
      status: 502,
      message: exception.message,
    });
  }
}