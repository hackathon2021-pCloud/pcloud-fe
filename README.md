<a href="https://pcloud-fe.vercel.app/"><img src="./public/welcome.png" style="display: block; margin: auto; width: 80%"></a>

## basic info

- [Home Page](https://pcloud-fe.vercel.app/)
- [RFC: pCloud User flow](https://docs.google.com/document/d/1adgqQrHebADybfvWuWP-lF5dywtSPAaNBcpyeTXAq5w/edit#)
- [Deployment History](https://vercel.com/pcloud-fe/pcloud-fe/deployments)
- [API Logs](https://vercel.com/pcloud-fe/pcloud-fe/DLjxmfREGcDWfHs2d3qs9gSpVcPJ/functions?name=api%2Fdate.go)

frontend resrouces are built and delivered by Vercel.

APIs are severless functions deployed on AWS ap-east-1

using redis as database, hosted by [upstash](https://console.upstash.com/redis/d67541bf-3904-488d-a612-6ecf5393891e), max 10K commands per day

logo:

<img src="./public/logo-v1-bg.svg" width="200" />

## development

1. to add new APIs, create file under `./api` folder. for example, `./api/date.js` will be handling request to `https://pcloud-fe.vercel.app/api/date`; if need to use other languages (Go, Python and Ruby), see [pcloud-be](https://github.com/wanghaoPolar/pcloud-be/tree/main)
2. to deploy new changes, push the commit to `main` branch, the deployment will start automatically and finish in minutes
