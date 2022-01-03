// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import {
  ClusterInfoOperator,
  getClusterSetupProgress,
  getUserClusterList,
  MAX_CLUSTER_PER_USER,
  setClusterSetupProgress,
} from "../../lib/db";
import {
  invalidRequest,
  getRequestBody,
  dbError,
  forbiddenRequest,
  getRequestQuery,
} from "../../lib/apiUtil";
import {
  ClusterSetupProgressGetRequestQuery,
  ClusterSetupProgressGetResponse,
  ClusterSetupProgressPostRequestBody,
  ClusterSetupProgressPostResponse,
  ClusterSetupStatus,
} from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = getRequestQuery(req, [
      "userId",
      "clusterId",
    ]) as ClusterSetupProgressGetRequestQuery;
    console.log(req.query);
    if (!query) {
      return invalidRequest(res);
    }
    const { userId, clusterId } = query;
    console.log({userId, clusterId})
    const clusterInfoResult = await ClusterInfoOperator.getJson({
      id: clusterId,
    });
    if ("errorCode" in clusterInfoResult) {
      return dbError(res, clusterInfoResult);
    }
    const { payload: cluster } = clusterInfoResult;
    if (cluster.owner !== userId) {
      return forbiddenRequest(res);
    }
    const progress = await getClusterSetupProgress({ clusterId: cluster.id });
    return res
      .status(200)
      .json({ clusterId, progress } as ClusterSetupProgressGetResponse);
  }
  if (req.method === "POST") {
    const body = getRequestBody(req, [
      "clusterId",
      "authKey",
      "progress",
      "backupUrl"
    ]) as ClusterSetupProgressPostRequestBody;
    if (
      !body
    ) {
      return invalidRequest(res);
    }
    const { clusterId, authKey, progress, backupUrl } = body;
    if (progress < 0 || progress > 100) {
      return invalidRequest(res);
    }
    const clusterInfoResult = await ClusterInfoOperator.getJson({
      id: clusterId,
    });
    if ("errorCode" in clusterInfoResult) {
      return dbError(res, clusterInfoResult);
    }
    const { payload: cluster } = clusterInfoResult;
    if (cluster.authKey !== authKey) {
      return forbiddenRequest(res);
    }
    await setClusterSetupProgress({ clusterId, progress });
    if (progress === 100) {
      await ClusterInfoOperator.updateJson({id: clusterId, updateInfo: {setupStatus: ClusterSetupStatus.finish, backupUrl}})
    }
    return res.status(200).json({});
  }
  return invalidRequest(res);
}
