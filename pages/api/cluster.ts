// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import {
  ClusterInfoOperator,
  getAuthKeyOfRegisterToken,
  removeRegisterToken,
} from "../../lib/db";
import { invalidRequest, getRequestBody, dbError, forbiddenRequest } from "../../lib/apiUtil";
import {
  ClusterPostRequestBody,
  ClusterPostResponse,
  ClusterSetupStatus,
  ClusterGetRequestQuery,
  ClusterGetResponse,
} from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = getRequestBody(req) as ClusterPostRequestBody;
    const required = ["registerToken", "name", "storageProvider", "owner"];
    if (!body || required.some((key) => !body[key])) {
      return invalidRequest(res);
    }
    const registerToken = body.registerToken;
    delete body.registerToken;
    // 1. get authkey
    const authkeyResult = await getAuthKeyOfRegisterToken(registerToken);
    if ("errorCode" in authkeyResult) {
      return dbError(res, authkeyResult);
    }
    const {
      payload: { authKey },
    } = authkeyResult;
    // 1. create cluster
    const clusterResult = await ClusterInfoOperator.insertJson({
      ...body,
      authKey,
      setupStatus: ClusterSetupStatus.registered,
    });
    // 2.
    await removeRegisterToken(registerToken);
    return res
      .status(200)
      .json({ cluster: clusterResult.payload } as ClusterPostResponse);
  }
  if (req.method === 'GET') {
	const {clusterId, authToken} = req.query as ClusterGetRequestQuery;
	const clusterInfoResult = await ClusterInfoOperator.getJson({id: clusterId});
	if ('errorCode' in clusterInfoResult) {
		return dbError(res, clusterInfoResult)
	}
	const {payload: clusterInfo} = clusterInfoResult
	if (clusterInfo.authKey !== authToken) {
		return forbiddenRequest(res)
	}
	return res.status(200).json({cluster: clusterInfo} as ClusterGetResponse)
  }
  return invalidRequest(res);
}
