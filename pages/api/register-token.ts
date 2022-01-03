// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import {createRegisterToken} from "../../lib/db";
import {invalidRequest, getRequestBody} from '../../lib/apiUtil';

type RequestBody = {
	authKey: string,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const body = getRequestBody(req) as RequestBody;
		const {authKey} = body
		if (!authKey) {
			return invalidRequest(res);
		}
		const payload = await createRegisterToken(authKey);
		return res.status(200).json(payload);
	}
  return invalidRequest(res);
}
