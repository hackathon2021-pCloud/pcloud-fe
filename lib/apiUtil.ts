import { NextApiRequest, NextApiResponse } from "next";
import { ClusterInfo, DBError } from "../types";

export const getRequestBody = (
  req: NextApiRequest,
  requiredKeys: string[] = []
) => {
  try {
    const result = JSON.parse(req.body);
    if (requiredKeys.some((k) => !result[k])) {
      return null;
    }
    return result;
  } catch {
    return null;
  }
};
export const getRequestQuery = <T>(
  req: NextApiRequest,
  requiredKeys: string[]
): T | null => {
  const query = req.query;
  if (!query || requiredKeys.some((k) => !query[k])) {
    return null;
  }
  const result = {};
  for (let k of Object.keys(query)) {
    result[k] = decodeURIComponent(query[k] as string);
  }
  return result as T;
};
export const invalidRequest = (res: NextApiResponse) =>
  res.status(400).json({ msg: "invalid request" });
export const forbiddenRequest = (res: NextApiResponse) =>
  res.status(403).json({ msg: "forbidden" });
export const dbError = (res: NextApiResponse, error: DBError) =>
  res.status(error.errorCode).json(error);
export const removeCredentialsFromCluster = (cluster: ClusterInfo) => {
  delete cluster.authKey;
  delete cluster.owner;
}
