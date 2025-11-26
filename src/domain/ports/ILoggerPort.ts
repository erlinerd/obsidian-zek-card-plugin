/**
 * Logger port interface providing common log levels.
 */
export interface ILoggerPort {
	/**
	 * Log debug information
	 * @param message Message text
	 * @param data Optional extra data
	 */
    debug(message: string, data?: unknown): void;

	/**
	 * Log informational message
	 * @param message Message text
	 * @param data Optional extra data
	 */
    info(message: string, data?: unknown): void;

	/**
	 * Log warning message
	 * @param message Message text
	 * @param data Optional extra data
	 */
    warn(message: string, data?: unknown): void;

	/**
	 * Log error
	 * @param message Message text
	 * @param error Optional error instance
	 */
    error(message: string, error?: Error): void;
}
