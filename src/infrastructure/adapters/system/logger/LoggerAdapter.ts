import { injectable } from "tsyringe";
import { ILoggerPort } from "@/domain/ports/ILoggerPort";

/**
 * Adapter: logger
 *
 * Responsibilities:
 * - Implement `ILoggerPort` using `console` outputs
 * - Provide consistent prefixes for different log levels
 */
@injectable()
export class Logger implements ILoggerPort {
	/**
	 * Log debug information
	 */
    debug(message: string, data?: unknown): void {
        if (data !== undefined) {
            console.debug(`[DEBUG] ${message}`, data);
        } else {
            console.debug(`[DEBUG] ${message}`);
        }
    }

	/**
	 * Log info
	 */
    info(message: string, data?: unknown): void {
        if (data !== undefined) {
            console.debug(`[INFO] ${message}`, data);
        } else {
            console.debug(`[INFO] ${message}`);
        }
    }

	/**
	 * Log warning
	 */
    warn(message: string, data?: unknown): void {
        if (data !== undefined) {
            console.warn(`[WARN] ${message}`, data);
        } else {
            console.warn(`[WARN] ${message}`);
        }
    }

	/**
	 * Log error
	 */
        error(message: string, error?: Error): void {
            const logData: unknown[] = [`[ERROR] ${message}`];
            if (error) logData.push(error);
            console.error(...logData as [unknown, ...unknown[]]);
        }
	}
