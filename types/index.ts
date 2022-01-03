export enum RedisKeyPrefix {
  authKey = "authKey",
  registerToken = "rt",
  checkpoint = "cp",
  clusterInfo = "cl",
  userTotalStorageStream = "usrs",
  userTotalStorageCurrent = "usrc",
  clusterCheckpointList = "clcpls",
  clusterCheckpointCount = "clcpcn",
  userCurrentSyncingCheckpointCount = "ucscp",
  clusterToUser = "cltousr",
  userClusterSortedSet = "userClusterSortedSet",
  temporaryCheckpointToken = "temporaryCheckpointToken",
}

export enum StorageProvider {
  aws = "aws",
  kingsoft = "kingsoft",
}
export enum ClusterSetupStatus {
  registered = "registered",
  finish = "finish",
}
export interface ClusterInfo extends BasicJsonModel {
  name: string;
  setupStatus: ClusterSetupStatus;
  laskCheckpointTime?: number;
  storageProvider: StorageProvider;
  authKey: string;
  backupSize?: number;
  owner: string;
}
export type BasicJsonModel = {
  id: string;
  createTime: number;
};
export interface ClusterCheckPoint extends BasicJsonModel {
  clusterId: string;
  uploadStatus: "ongoing" | "finished";
  uploadProgress: number;
  checkpointTime: number;
  url: string;
  backupSize: number;
  operator: string;
  operatorAvatar: string;
}
export interface TemporaryCheckpointToken extends BasicJsonModel {
  checkpointId: string;
}
export type User = {
	name: string,
	picture: string,
}

export type UserClusterRequestQuery = {
user_id: string;
};
export type UserClusterResponse = {
  clusterInfos: ClusterInfo[];
};
export type ClusterPostRequestBody = {
  registerToken: string;
  name: string;
  storageProvider: StorageProvider;
  owner: string;
};
export type ClusterPostResponse = {
  cluster: ClusterInfo;
}
export type ClusterGetRequestQuery = {
  clusterId: string,
  authToken: string,
};
export type ClusterGetResponse = {
  cluster: ClusterInfo;
};
export type DBError = {
  errorCode: number,
  errorMsg: string,
}
export type ClusterSetupProgressPostRequestBody = {
  clusterId: string,
  authToken: string,
  progress: number,
}
export type ClusterSetupProgressPostResponse = {}
export type ClusterSetupProgressGetRequestQuery = {
  clusterId: string,
  userid: string,
};
export type ClusterSetupProgressGetResponse = {
  clusterId: string;
  progress: number;
};