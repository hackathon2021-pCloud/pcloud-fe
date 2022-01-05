// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import {
  ClusterInfoOperator,
  getAuthKeyOfRegisterToken,
  removeRegisterToken,
} from "../../lib/db";
import {
  invalidRequest,
  getRequestBody,
  dbError,
  forbiddenRequest,
  getRequestQuery,
  removeCredentialsFromCluster,
} from "../../lib/apiUtil";
import {
  ClusterPostRequestBody,
  ClusterPostResponse,
  ClusterSetupStatus,
  ClusterGetRequestQuery,
  ClusterGetResponse,
  ClusterDeleteRequestBody,
  ClusterDeleteResponse,
} from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = getRequestBody(req, [
      "registerToken",
      "name",
      "storageProvider",
      "owner",
    ]) as ClusterPostRequestBody;
    if (!body) {
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
    const cluster = clusterResult.payload;
    removeCredentialsFromCluster(cluster);
    await removeRegisterToken(registerToken);
    return res.status(200).json({ cluster } as ClusterPostResponse);
  }
  if (req.method === "DELETE") {
    const body = getRequestBody(req, ["clusterId"]) as ClusterDeleteRequestBody;
    if (!body || (!body.authKey && !body.owner)) {
      return invalidRequest(res);
    }
    const { clusterId: id, authKey, owner } = body;
    const clusterResult = await ClusterInfoOperator.getJson({ id });
    if ("errorCode" in clusterResult) {
      return dbError(res, clusterResult);
    }
    const {payload: cluster} = clusterResult
    if (cluster.authKey !== authKey && cluster.owner !== owner) {
      return forbiddenRequest(res);
    }
    const deletedItemCount = await ClusterInfoOperator.deleteJson({ id });
    return res.status(200).json({ deletedItemCount } as ClusterDeleteResponse);
  }
  if (req.method === "GET") {
    const query = getRequestQuery(req, ["clusterId"]) as ClusterGetRequestQuery;
    console.log({ query });
    if (!query || (!query.authKey && !query.userId)) {
      return invalidRequest(res);
    }
    const { clusterId, authKey, userId } = query;
    const clusterInfoResult = await ClusterInfoOperator.getJson({
      id: clusterId,
    });
    if ("errorCode" in clusterInfoResult) {
      return dbError(res, clusterInfoResult);
    }
    const { payload: clusterInfo } = clusterInfoResult;
    if (clusterInfo.authKey !== authKey && clusterInfo.owner !== userId) {
      return forbiddenRequest(res);
    }
    removeCredentialsFromCluster(clusterInfo);
    return res.status(200).json({ cluster: clusterInfo } as ClusterGetResponse);
  }
  return invalidRequest(res);
}
