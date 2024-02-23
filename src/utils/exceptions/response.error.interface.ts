// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IResponseError {
	statusCode: number;
	message: string;
	error: string;
	timestamp: string;
	path: string;
}
