## Main points about deploying this server
1. checkout this [important reference: node.js at runtime](https://vercel.com/docs/functions/runtimes/node-js).  
  You merely have to create a folder named "api" and put your .js/.ts there.  
  Never try to configure with vercel.json. It takes a lot of time and you may still fail at the end.
2. vercel is serverless, which means it doesn't allow codes to run forever, so deploying server.listening will cause some error.  
  One must pack it as function and export default it. 