import { NextApiRequest, NextApiResponse } from "next";
import { DBError } from "../types";

export const getRequestBody = (req: NextApiRequest) => {
	try {
		return JSON.parse(req.body);
	} catch {
		return req.body
	}
}
export const invalidRequest = (res: NextApiResponse) => res.status(400).json({msg: 'invalid request'})
export const forbiddenRequest = (res: NextApiResponse) => res.status(403).json({msg: 'forbidden'});
export const dbError = (res: NextApiResponse, error: DBError) => res.status(error.errorCode).json(error)
