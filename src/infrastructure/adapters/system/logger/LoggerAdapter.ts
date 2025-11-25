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
	debug(message: string, data?: any): void {
		if (data) {
			console.debug(`[DEBUG] ${message}`, data);
		} else {
			console.debug(`[DEBUG] ${message}`);
		}
	}

	/**
	 * Log info
	 */
	info(message: string, data?: any): void {
		if (data) {
			console.info(`[INFO] ${message}`, data);
		} else {
			console.info(`[INFO] ${message}`);
		}
	}

	/**
	 * Log warning
	 */
	warn(message: string, data?: any): void {
		if (data) {
			console.warn(`[WARN] ${message}`, data);
		} else {
			console.warn(`[WARN] ${message}`);
		}
	}

	/**
	 * Log error
	 */
		error(message: string, error?: Error, data?: any): void {
			const logData: any[] = [`[ERROR] ${message}`];
			if (error) logData.push(error);
			if (data) logData.push(data);
			console.error(...logData);
		}
	}
