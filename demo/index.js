const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const STATE_FILE_PATH = path.join(__dirname, "./state.json");
const readFile = () => {
  const content = fs.readFileSync(STATE_FILE_PATH, "utf-8") || "{}";
  console.log(content);
  return JSON.parse(content);
};
const writeFile = (state) => {
  fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state));
};

const HOST = "https://pcloud-fe.vercel.app/";
// const HOST = "http://localhost:3000/";
const API_PREFIX = `${HOST}api/`;
const AUTH_KEY = "authKeyExample";
const STEPS = [
  {
    name: "STEP 1: get register token",
    url: `${API_PREFIX}register-token`,
    fetchConfig: {
      method: "POST",
      body: JSON.stringify({ authKey: "authKeyExample" }),
    },
    onFinish: (res, currentState) => {
      currentState.registerToken = res.registerToken;
      console.log(
        `open URL: ${HOST}register?register_token=${encodeURIComponent(
          res.registerToken
        )}`
      );
    },
  },
  {
    name: "STEP 2: get cluster info",
    url: (self, currentState) => {
      const clusterId = fs.readFileSync(
        path.join(__dirname, "./cluster-id.txt"),
        "utf-8"
      );
      console.log(clusterId);
      return `${API_PREFIX}cluster?authKey=${AUTH_KEY}&clusterId=${clusterId}`;
    },
    fetchConfig: (self, currentState) => {
      return {
        method: "GET",
      };
    },
    onFinish: (res, currentState) => {
      currentState.cluster = res.cluster;
    },
  },
  {
    name: "STEP 3: TiUP setup progress (10)",
    url: `${API_PREFIX}cluster-setup-progress`,
    fetchConfig: (self, currentState) => {
      return {
        method: "POST",
        body: JSON.stringify({
          clusterId: currentState.cluster.id,
          authKey: AUTH_KEY,
          progress: 10,
          backupUrl: "s3://backupUrl",
        }),
      };
    },
  },
  {
    name: "STEP 3: TiUP setup progress (50)",
    url: `${API_PREFIX}cluster-setup-progress`,
    fetchConfig: (self, currentState) => {
      return {
        method: "POST",
        body: JSON.stringify({
          clusterId: currentState.cluster.id,
          authKey: AUTH_KEY,
          progress: 50,
          backupUrl: "s3://backupUrl",
        }),
      };
    },
  },
  {
    name: "STEP 3: TiUP setup progress (100)",
    url: `${API_PREFIX}cluster-setup-progress`,
    fetchConfig: (self, currentState) => {
      return {
        method: "POST",
        body: JSON.stringify({
          clusterId: currentState.cluster.id,
          authKey: AUTH_KEY,
          progress: 100,
          backupUrl: "s3://backupUrl",
        }),
      };
    },
  },
  {
    name: "STEP 4: Append checkpoint to cluster",
    url: `${API_PREFIX}checkpoint`,
    fetchConfig: (self, currentState) => {
      return {
        method: "POST",
        body: JSON.stringify({
          authKey: AUTH_KEY,
          clusterId: currentState.cluster.id,
          uploadStatus: "ongoing",
          uploadProgress: 10,
          checkpointTime: Number(new Date("2022-01-03")),
          url: "s3://checkpoint-1",
          backupSize: 20,
          operator: "operator",
        }),
      };
    },
    onFinish: (res, currentState) => {
      currentState.checkpointId = res.id;
    },
  },
  {
    name: "STEP 5: Update checkpoint uploadProgress",
    url: `${API_PREFIX}checkpoint`,
    fetchConfig: (self, currentState) => {
      return {
        method: "PUT",
        body: JSON.stringify({
          clusterId: currentState.cluster.id,
          id: currentState.checkpointId,
          uploadStatus: "finish",
          uploadProgress: 100,
          authKey: AUTH_KEY,
        }),
      };
    },
  },
  {
    name: "Usage: Get info from temporary token",
    url: () => {
      const token = fs.readFileSync(
        path.join(__dirname, "./temporary-token.txt"),
        "utf-8"
      );
      return `${API_PREFIX}temporary-token?token=${token}`;
    },
    fetchConfig: (self, currentState) => {
      return {
        method: "GET",
      };
    },
  },
];

const demo = async () => {
  const currentState = readFile();
  const { currentStep = 0 } = currentState;
  const step = STEPS[currentStep];
  console.log(step.name);
  const url =
    typeof step.url === "function" ? step.url(step, currentState) : step.url;
  const fetchConfig =
    typeof step.fetchConfig === "function"
      ? step.fetchConfig(step, currentState)
      : step.fetchConfig;
  console.log(`Request URL: ${url}`);
  console.log(`Request config: ${JSON.stringify(fetchConfig)}`);
  const res = await fetch(url, fetchConfig).then((r) => r.json());
  console.log(`Response: ${JSON.stringify(res)}`);
  step.onFinish?.(res, currentState);
  if (STEPS[currentStep + 1]) {
    const nextStep = STEPS[currentStep + 1];
    currentState.currentStep = currentStep + 1;
    console.log(`Next: ${nextStep.name}`);
  }
  writeFile(currentState);
};

demo();
