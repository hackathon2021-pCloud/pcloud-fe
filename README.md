<img src="https://i.imgur.com/eBbvYH8.png" style="display: block; margin: auto; width: 20%;" />

# Welcome to <span><span style="color: #00aeef;">p</span><span style="background-image: -moz-linear-gradient(45deg, #00aeef, #061b51);background-image: linear-gradient(45deg, #00aeef, #061b51);background-size: 100%;background-repeat: repeat;-webkit-background-clip: text;-webkit-text-fill-color: transparent;-moz-background-clip: text;-moz-text-fill-color: transparent;">Cloud</span></span>

## basic info

* [Home Page](https://pcloud-fe.vercel.app/)
* [Deployment History](https://vercel.com/pcloud-fe/pcloud-fe/deployments)
* [API Logs](https://vercel.com/pcloud-fe/pcloud-fe/DLjxmfREGcDWfHs2d3qs9gSpVcPJ/functions?name=api%2Fdate.go)

frontend resrouces are built and delivered by Vercel.

APIs are severless functions deployed on AWS ap-east-1

using redis as data base, hosted by [upstash](https://console.upstash.com/redis/d67541bf-3904-488d-a612-6ecf5393891e), max 10K commands per day

## development

1. to add new APIs, create file under `./api` folder. for example, `./api/date.js` will be handling request to `https://pcloud-fe.vercel.app/api/date`; if need to use other languages (Go, Python and Ruby), see [pcloud-be](https://github.com/wanghaoPolar/pcloud-be/tree/main)
2. to deploy your code, push the commit to `main` branch, the deployment will start automatically and finish in minutes
