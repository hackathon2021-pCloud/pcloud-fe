// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import {
  ClusterCheckpointOperator,
  ClusterInfoOperator,
  getCheckpointsOfCluster,
} from "../../lib/db";
import {
  invalidRequest,
  getRequestBody,
  dbError,
  forbiddenRequest,
  getRequestQuery,
} from "../../lib/apiUtil";
import {
  CheckpointGetRequestQuery,
  CheckpointGetResponse,
  CheckpointPostRequestBody,
  CheckpointPostResponse,
  CheckpointPutRequestBody,
  CheckpointPutResponse,
} from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const body = getRequestBody(req, [
      "id",
      "clusterId",
      "uploadProgress",
      "authKey",
    ]) as CheckpointPutRequestBody;
    if (!body) {
      return invalidRequest(res);
    }
    const { clusterId, authKey, uploadProgress, id } = body;
    const clusterResult = await ClusterInfoOperator.getJson({
      id: clusterId,
    });
    if ("errorCode" in clusterResult) {
      return dbError(res, clusterResult);
    }
    const { payload: cluster } = clusterResult;
    if (cluster.authKey !== authKey) {
      return forbiddenRequest(res);
    }
    await ClusterCheckpointOperator.updateJson({id, updateInfo: {uploadProgress}})
    return res.status(200).json({} as CheckpointPutResponse)
  }
  // add new Checkpoints to cluster
  if (req.method === "POST") {
    const body = getRequestBody(req, [
      "clusterId",
      "uploadStatus",
      "checkpointTime",
      "url",
      "backupSize",
      "authKey",
    ]) as CheckpointPostRequestBody;
    if (!body) {
      return invalidRequest(res);
    }
    const {
      clusterId,
      authKey,
      uploadProgress,
      uploadStatus,
      url,
      backupSize,
      checkpointTime,
    } = body;
    const clusterResult = await ClusterInfoOperator.getJson({ id: clusterId });
    if ("errorCode" in clusterResult) {
      return dbError(res, clusterResult);
    }
    const { payload: cluster } = clusterResult;
    if (cluster.authKey !== authKey) {
      return forbiddenRequest(res);
    }
    const checkpoint = await ClusterCheckpointOperator.insertJson({
      clusterId,
      uploadProgress,
      uploadStatus,
      url,
      backupSize,
      checkpointTime,
    });

    return res
      .status(200)
      .json({ id: checkpoint.payload.id } as CheckpointPostResponse);
  }
  // get checkpoints of cluster
  if (req.method === "GET") {
    const query = getRequestQuery(req, [
      "clusterId",
      "userId",
    ]) as CheckpointGetRequestQuery;
    if (!query) {
      return invalidRequest(res);
    }
    const { clusterId, userId } = query;
    const clusterResult = await ClusterInfoOperator.getJson({ id: clusterId });
    if ("errorCode" in clusterResult) {
      return dbError(res, clusterResult);
    }
    const { payload: cluster } = clusterResult;
    if (cluster.owner !== userId) {
      return forbiddenRequest(res);
    }
    const result = await getCheckpointsOfCluster({
      clusterId: cluster.id,
      from: 0,
      limit: 50,
    });
    return res
      .status(200)
      .json({ checkpoints: result } as CheckpointGetResponse);
  }
  return invalidRequest(res);
}
