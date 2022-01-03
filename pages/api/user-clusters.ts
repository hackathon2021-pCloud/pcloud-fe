// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { getUserClusterList, MAX_CLUSTER_PER_USER } from "../../lib/db";
import { invalidRequest, getRequestBody, getRequestQuery } from "../../lib/apiUtil";
import {UserClusterRequestQuery, UserClusterResponse} from '../../types'

type RequestQuery = {
  'user_id': string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = getRequestQuery<UserClusterRequestQuery>(req, ['userid'])
    if (!query) {
      return invalidRequest(res)
    }
    const clusterInfos = await getUserClusterList({userid: query.userid, from: 0, limit: MAX_CLUSTER_PER_USER})
	  return res.status(200).json({ clusterInfos } as UserClusterResponse);
  }
  return invalidRequest(res);
}
