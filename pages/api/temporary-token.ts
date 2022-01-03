// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import {
  ClusterCheckpointOperator,
  ClusterInfoOperator,
  createTemporaryToken,
  getInfoFromTemporaryToken,
  removeTemporaryToken,
} from "../../lib/db";
import {
  invalidRequest,
  getRequestBody,
  dbError,
  getRequestQuery,
  forbiddenRequest,
  removeCredentialsFromCluster,
} from "../../lib/apiUtil";
import {
  TemporaryTokenGetRequestQuery,
  TemporaryTokenGetResponse,
  TemporaryTokenPostRequestBody,
  TemporaryTokenPostResponse,
} from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = getRequestBody(req, [
      "type",
      "checkpointId",
      "userId",
    ]) as TemporaryTokenPostRequestBody;
    if (!body) {
      return invalidRequest(res);
    }
    const { type, checkpointId, userId } = body;
    const checkpointResult = await ClusterCheckpointOperator.getJson({
      id: checkpointId,
    });
    if ("errorCode" in checkpointResult) {
      return dbError(res, checkpointResult);
    }
    const checkpoint = checkpointResult.payload;
    const clusterResult = await ClusterInfoOperator.getJson({
      id: checkpoint.clusterId,
    });
    if ("errorCode" in clusterResult) {
      return dbError(res, clusterResult);
    }
    const cluster = clusterResult.payload;
    if (cluster.owner !== userId) {
      return forbiddenRequest(res)
    }
    removeCredentialsFromCluster(cluster)
    const info: any = {
      checkpoint,
    };
    if (type === "replication") {
      info.cluster = cluster;
    }
    const token = await createTemporaryToken({ info: JSON.stringify(info) });

    return res.status(200).json({ token } as TemporaryTokenPostResponse);
  }
  // get
  if (req.method === "GET") {
    const query = getRequestQuery(req, [
      "token",
    ]) as TemporaryTokenGetRequestQuery;
    if (!query) {
      return invalidRequest(res);
    }
    const { token } = query;
    const info = await getInfoFromTemporaryToken({ token });
    await removeTemporaryToken({ token });
    return res.status(200).json({ result: info } as TemporaryTokenGetResponse);
  }
  return invalidRequest(res);
}
