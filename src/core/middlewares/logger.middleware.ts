import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const status = res.statusCode;

      if (status >= 500) {
        this.logger.error(
          `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
        );
      } else if (status >= 400) {
        this.logger.warn(
          `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
        );
      } else {
        this.logger.log(
          `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
        );
      }
    });
    next();
  }
}
