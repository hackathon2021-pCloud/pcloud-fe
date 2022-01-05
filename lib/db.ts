import redis from "./redis";
import createUniqueID from "./uniqueID";
import {
  RedisKeyPrefix,
  ClusterInfo,
  ClusterCheckPoint,
  BasicJsonModel,
  TemporaryCheckpointToken,
  DBError,
} from "../types";
import uniqueID from "./uniqueID";

export const MAX_CLUSTER_PER_USER = 100;
const toRedisKey = (prefix: RedisKeyPrefix, id: string) => `${prefix}:${id}`;
const generateError = (code: number) => (msg: string) =>
  ({
    errorCode: code,
    errorMsg: msg,
  } as DBError);
const errorNotFound = generateError(404);
const errorForbidden = generateError(403);
const successResponse = <T extends unknown>(payload: T) => {
  return {
    payload,
  };
};

export const checkAuthKey = async ({
  id,
  authKey,
}: {
  id: string;
  authKey: string;
}) => {
  const actualAuthKey = await redis.get(toRedisKey(RedisKeyPrefix.authKey, id));
  if (!actualAuthKey || authKey !== actualAuthKey) {
    return errorForbidden("forbidden");
  }
  return successResponse("pass");
};

/**
 * register token
 *
 * > set registerToken:<id> <authKey>
 */
export const createRegisterToken = async (authKey: string) => {
  const id = await createUniqueID();
  await redis.set(toRedisKey(RedisKeyPrefix.registerToken, id), authKey);
  return { registerToken: id };
};
export const removeRegisterToken = async (registerToken: string) => {
  await redis.del(toRedisKey(RedisKeyPrefix.registerToken, registerToken));
};
export const getAuthKeyOfRegisterToken = async (registerToken: string) => {
  const authKey = (await redis.get(
    toRedisKey(RedisKeyPrefix.registerToken, registerToken)
  )) as string;
  if (!authKey) {
    return errorNotFound("no such register token");
  }
  return successResponse({ authKey });
};

type Hooks<T> = {
  onInsert?: (json: T) => void;
  onGet?: (json: T) => void;
  onUpdate?: (previous: T, updated: T) => void;
};
class HashMapOperator<T extends BasicJsonModel> {
  private name: RedisKeyPrefix;
  private transformHgetallResult: (result: Record<string, string>) => T;
  private hooks: Hooks<T>;

  constructor(
    name: RedisKeyPrefix,
    transformHgetallResult: (result: Record<string, string>) => T,
    hooks: Hooks<T>
  ) {
    this.name = name;
    this.transformHgetallResult = transformHgetallResult;
    this.hooks = hooks;
  }

  insertJson = async (initialInfo: Omit<Omit<T, "id">, "createTime">) => {
    const id = await createUniqueID();
    // @ts-ignore
    const json: T = {
      ...initialInfo,
      id,
      createTime: Date.now(),
    };
    await redis.hmset(toRedisKey(this.name, id), json);
    if (this.hooks.onInsert) {
      await this.hooks.onInsert(json);
    }
    return successResponse(json);
  };

  getJson = async ({ id }: { id: string }) => {
    const jsonRecord = await redis.hgetall(toRedisKey(this.name, id));
    if (!jsonRecord || !jsonRecord.id) {
      return errorNotFound(`no such ${this.name}`);
    }
    const result = this.transformHgetallResult(jsonRecord);
    if (this.hooks.onGet) {
      await this.hooks.onGet(result);
    }
    return successResponse(result);
  };

  updateJson = async ({
    id,
    updateInfo,
  }: {
    id: string;
    updateInfo: Partial<T>;
  }) => {
    const current = await this.getJson({ id });
    if ("errorCode" in current) {
      return current;
    }
    const updated = {
      ...current.payload,
      ...updateInfo,
      id,
    };
    const res = await redis.hmset(toRedisKey(this.name, id), updated);
    if (this.hooks.onUpdate) {
      await this.hooks.onUpdate(current.payload, updated);
    }
    return successResponse(res);
  };

  deleteJson = async ({id}: {id: string}) => {
    const deletedCount = await redis.del(toRedisKey(this.name, id));
    return deletedCount
  }
}
export const ClusterInfoOperator = new HashMapOperator<ClusterInfo>(
  RedisKeyPrefix.clusterInfo,
  (record: any) => {
    return {
      ...record,
      laskCheckpointTime: Number(record.laskCheckpointTime),
      backupSize: Number(record.backupSize),
    };
  },
  {
    onInsert: async (cluster) => {
      await redis.set(
        toRedisKey(RedisKeyPrefix.clusterToUser, cluster.id),
        cluster.owner
      );
      await redis.zadd(
        toRedisKey(RedisKeyPrefix.userClusterSortedSet, cluster.owner),
        Date.now(),
        cluster.id
      );
      await redis.set(
        toRedisKey(RedisKeyPrefix.authKey, cluster.id),
        cluster.authKey
      );
    },
  }
);

export const getUserClusterList = async ({
  userid,
  from = 0,
  limit = 3,
}: {
  userid: string;
  from: number;
  limit: number;
}) => {
  const clusterIds = await redis.zrevrange(
    toRedisKey(RedisKeyPrefix.userClusterSortedSet, userid),
    from,
    from + limit
  );
  const result: ClusterInfo[] = [];
  for (let id of clusterIds) {
    const clusterInfo = await ClusterInfoOperator.getJson({ id });
    if ("payload" in clusterInfo) {
      result.push(clusterInfo.payload);
    }
  }
  return result;
};
export const getUserClusterListLength = async ({
  userid,
}: {
  userid: string;
}) => {
  const res = await redis.zcard(
    toRedisKey(RedisKeyPrefix.userClusterSortedSet, userid)
  );
  return res;
};

const recordToCheckpoint = (record: Record<string, string>) => {
  return {
    ...record,
    checkpointTime: Number(record.checkpointTime),
  } as ClusterCheckPoint;
};
export const ClusterCheckpointOperator = new HashMapOperator<ClusterCheckPoint>(
  RedisKeyPrefix.checkpoint,
  recordToCheckpoint,
  {
    onInsert: async (cp) => {
      // checkpoint of a cluster is stored as a sorted set
      const checkpointCount = await redis.incr(
        toRedisKey(RedisKeyPrefix.clusterCheckpointCount, cp.clusterId)
      );
      await redis.zadd(
        toRedisKey(RedisKeyPrefix.clusterCheckpointList, cp.clusterId),
        [checkpointCount, cp.id]
      );
      // update cluster last checkpoint time
      await ClusterInfoOperator.updateJson({
        id: cp.clusterId,
        updateInfo: { laskCheckpointTime: cp.checkpointTime },
      });

      // await redis.incrby(`backupSize:${cp.clusterId}`, cp.backupSize);
      // const owner = await redis.get(
      //   toRedisKey(RedisKeyPrefix.clusterToUser, cp.clusterId)
      // );
      // const streamKey = toRedisKey(
      //   RedisKeyPrefix.userTotalStorageStream,
      //   owner
      // );
      // const currentSizeKey = toRedisKey(
      //   RedisKeyPrefix.userTotalStorageCurrent,
      //   owner
      // );
      // await redis.incrby(currentSizeKey, cp.backupSize);
      // await redis.xadd(streamKey, currentSizeKey + cp.backupSize);
      // if (cp.uploadStatus !== "finished") {
      //   await redis.incr(
      //     toRedisKey(RedisKeyPrefix.userCurrentSyncingCheckpointCount, owner)
      //   );
      // }
    },
    onUpdate: async (cp) => {
      // if (cp.uploadStatus === 'finished') {
      //   const owner = await redis.get(
      //     toRedisKey(RedisKeyPrefix.clusterToUser, cp.clusterId)
      //   );
      //   await redis.decr(toRedisKey(RedisKeyPrefix.userCurrentSyncingCheckpointCount, owner))
      // }
    },
  }
);

export const getUserTotalStorageInfo = async ({
  userId,
  startTime,
  endTime,
}: {
  userId: string;
  startTime: number;
  endTime: number;
}) => {
  const total = redis.get(
    toRedisKey(RedisKeyPrefix.userTotalStorageCurrent, userId)
  );
  const entries = redis.xrange(
    toRedisKey(RedisKeyPrefix.userTotalStorageStream, userId),
    startTime,
    endTime
  );
  return {
    total,
    entries,
  };
};

export const getCheckpointsOfCluster = async ({
  clusterId,
  from = 0,
  limit = 5,
}: {
  clusterId: string;
  from: number;
  limit: number;
}) => {
  const checkpointIds = await redis.zrevrange(
    toRedisKey(RedisKeyPrefix.clusterCheckpointList, clusterId),
    from,
    from + limit
  );
  const result: ClusterCheckPoint[] = [];
  for (let id of checkpointIds) {
    // const cp = await redis.hgetall(toRedisKey(RedisKeyPrefix.checkpoint, id));
    const cp = await ClusterCheckpointOperator.getJson({ id });
    if ("payload" in cp) {
      result.push(cp.payload);
    }
  }
  return result;
};

export const createTemporaryToken = async ({ info }: { info: string }) => {
  const token = await uniqueID();
  await redis.set(toRedisKey(RedisKeyPrefix.temporaryToken, token), info);
  return token;
};
export const getInfoFromTemporaryToken = async ({
  token,
}: {
  token: string;
}) => {
  return await redis.get(toRedisKey(RedisKeyPrefix.temporaryToken, token));
};
export const removeTemporaryToken = async ({ token }) => {
  return await redis.del(toRedisKey(RedisKeyPrefix.temporaryToken, token));
};

export const getClusterSetupProgress = async ({
  clusterId,
}: {
  clusterId: string;
}) => {
  const res = await redis.get(
    toRedisKey(RedisKeyPrefix.clusterSetupProgress, clusterId)
  );
  return res ? parseInt(res) : -1;
};
export const setClusterSetupProgress = async ({
  clusterId,
  progress,
}: {
  clusterId: string;
  progress: number;
}) => {
  const res = await redis.set(
    toRedisKey(RedisKeyPrefix.clusterSetupProgress, clusterId),
    progress
  );
  return res;
};
