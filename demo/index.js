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

const API_PREFIX = "http://localhost:3000/api/";
const AUTH_KEY = "authKeyExample";
const STEPS = [
  {
    id: 0,
    name: "get register token",
    url: `${API_PREFIX}register-token`,
    fetchConfig: {
      method: "POST",
      body: JSON.stringify({ authKey: "authKeyExample" }),
    },
  },
  {
    id: 1,
    name: "get cluster info",
    url: (self, currentState) =>
      `${API_PREFIX}cluster-info?register_token=${currentState[0].res.registerToken}&auth_key=${AUTH_KEY}`,
    fetchConfig: (self, currentState) => {
      return {
        method: "GET",
      };
    },
  },
];

const currentStep = 0;
const demo = async () => {
  const currentState = readFile();
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
  const res = await fetch(url, fetchConfig).then(r => r.text());
  console.log(`Response: ${res}`);
  currentState[step.id] = {res};
  writeFile(currentState);
  if (STEPS[currentStep + 1]) {
    const nextStep = currentStep + 1;
    console.log(`Next: ${nextStep.name}`);
  }
};

demo();
