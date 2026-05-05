import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

interface ErrorBody {
  status: 'error';
  message: string;
  errors?: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: ErrorBody = { status: 'error', message: 'Error interno del servidor' };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        body = { status: 'error', message: res };
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        const message = (r.message ?? exception.message) as string | string[];

        if (Array.isArray(message)) {
          body = {
            status: 'error',
            message: 'Datos inválidos',
            errors: message,
          };
        } else {
          body = {
            status: 'error',
            message,
          };
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        body = {
          status: 'error',
          message: 'El email ya está registrado',
        };
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        body = {
          status: 'error',
          message: 'Recurso no encontrado',
        };
      } else {
        status = HttpStatus.BAD_REQUEST;
        body = {
          status: 'error',
          message: 'Error de base de datos',
        };
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      body = { status: 'error', message: exception.message };
    }

    response.status(status).json(body);
  }
}
