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
  clusterSetupProgress = "clstpg",
  temporaryToken = "temporaryToken",
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
  backupUrl?: string;
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
  operator?: string;
}
export interface TemporaryCheckpointToken extends BasicJsonModel {
  checkpointId: string;
}
export type User = {
	name: string,
	picture: string,
}

export type UserClusterRequestQuery = {
  userId: string;
  from?: number;
  limit?: number;
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
  authKey?: string,
  userId?: string,
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
  backupUrl: string,
  authKey: string,
  progress: number,
}
export type ClusterSetupProgressPostResponse = {}
export type ClusterSetupProgressGetRequestQuery = {
  clusterId: string,
  userId: string,
};
export type ClusterSetupProgressGetResponse = {
  clusterId: string;
  progress: number;
};

export type CheckpointPostRequestBody = ClusterCheckPoint & {authKey: string};
export type CheckpointPostResponse = {id: string};
export type CheckpointPutRequestBody = {
  clusterId: string;
  id: string;
  uploadStatus: "ongoing" | "finished";
  uploadProgress: number;
  authKey: string;
};
export type CheckpointPutResponse = {  };

export type CheckpointGetRequestQuery = {
  clusterId: string,
  userId: string,
}
export type CheckpointGetResponse = {
  checkpoints: ClusterCheckPoint[];
}

export type TemporaryTokenPostRequestBody = {
  type: 'checkpoint' | 'replication',
  checkpointId: string,
  userId: string,
}
export type TemporaryTokenPostResponse = {
  token: string,
}
export type TemporaryTokenGetRequestQuery = {
  token: string,
}
export type TemporaryTokenGetResponse = {
  result: any
}
