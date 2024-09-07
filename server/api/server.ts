require("dotenv").config();
import http from "http"; // node.js has a built-in module called http.
import url from "url";
import { Client } from "@notionhq/client";

// The dotenv library will read from your .env file into these values on `process.env`
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

// Will provide an error to users who forget to create the .env file
// with their Notion data in it
if (!notionDatabaseId || !notionSecret) {
  throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
}

// Initializing the Notion client with your secret
const notion = new Client({
  auth: notionSecret,
});

// Require an async function here to support await with the DB query
const requestListener = async (req:http.IncomingMessage, res:http.ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const parsedUrl = url.parse(req.url ?? "", true)
  switch (parsedUrl.pathname) {
    case "/":
      const params = parsedUrl.query;
      console.log(params);
      // Query the database and wait for the result
      if (Object.keys(params).length === 0){
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end("Welcome to nexus server!");
        break;
      }
      const query = await notion.databases.query({
        database_id: notionDatabaseId,
        filter:{
          and:[{
            property: "items",
            rich_text: {
              contains: typeof(params.name) == "string" ? params.name : "INVALID"
            }
          },{
            property: "location",
            rich_text: {
              contains: typeof(params.loc) == "string" ? params.loc : "INVALID"
            }
          },{
            property: "date",
            date:{
              on_or_after: typeof(params.date1) == "string" ? (new Date(params.date1)).toJSON() : "INVALID"
            }
          },{
            property: "date",
            date:{
              on_or_before: typeof(params.date2) == "string" ? (new Date((new Date(params.date2)).getTime() + 8.64e+7)).toJSON() : "INVALID"
            }
          }]
        }
      });

      // console.log(params);
      // if (typeof (params.date1) == "string") console.log(new Date(params.date1));

      // const list = query.results[1].properties.color
      const list = await query.results.reduce<Promise<{}[]>>(async (accPromise, row) => {
        const id = row.properties.number;
        const name = row.properties.items;
        const colors = row.properties.color;
        const straits = row.properties.feature;
        const loc = row.properties.location;
        const time = row.properties.date;
        const owner_name = row.properties.name;
        const owner_phone = row.properties.phone;
        const owner_ID = row.properties.ID_number;
        const page_id = row.id;
        const block = await notion.blocks.children.list({
            block_id: page_id,
            page_size: 2,
          })

        const acc = await accPromise;

        // data type check
        if (
          id.type == "title" &&
          name.type == "rich_text" &&
          colors.type == "multi_select" &&
          straits.type == "multi_select" &&
          loc.type == "rich_text" &&
          time.type == "date" &&
          owner_name.type == "rich_text" &&
          owner_phone.type == "rich_text" &&
          owner_ID.type == "rich_text" &&
          typeof (params.name) == "string" &&
          typeof (params.loc) == "string" &&
          typeof (params.date1) == "string" &&
          typeof (params.date2) == "string" &&
          block.results[0].type == "image" &&
          block.results[0].image.type=="external"
        ) {

          // filtering without using notion
          // if (
          //   name.rich_text?.[0]?.plain_text.includes(params.name) &&
          //   loc.rich_text?.[0]?.plain_text.includes(params.loc) &&
          //   (new Date(params.date1)).getTime()           <= (new Date(time.date?.start ?? 0)).getTime() &&
          //   (new Date(params.date2)).getTime() + 8.64e+7 >= (new Date(time.date?.start ?? 0)).getTime()
          // )

            acc.push({
              id: id.title?.[0]?.plain_text ?? "INVALID",
              name: name.rich_text?.[0]?.plain_text ?? "INVALID",
              loc: loc.rich_text?.[0]?.plain_text ?? "INVALID",
              time: new Date(time.date?.start ?? 0),
              colors: colors.multi_select?.map(obj => obj.name),
              straits: straits.multi_select?.map(obj => obj.name),
              owner: {
                name: owner_name.rich_text?.[0]?.plain_text,
                phone: owner_phone.rich_text?.[0]?.plain_text,
                ID: owner_ID.rich_text?.[0]?.plain_text,
              },
              page_id,
              image_url: block.results[0].image.external.url
            });
            return acc;
        }
        else return acc;
      }, Promise.resolve([]))

      console.log(list);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(list));
      break;

    case "/name":
      // console.log("/name called");
      // Query the database and wait for the result
      const query_name = await notion.databases.query({
        database_id: notionDatabaseId,
      });

      const list_name = query_name.results.reduce<string[]>((acc, row) => {
        const name = row.properties.items;
        if (name.type == "rich_text" &&
          name.rich_text?.[0]?.plain_text &&
          !acc.includes(name.rich_text?.[0]?.plain_text))
          acc.push(name.rich_text?.[0]?.plain_text ?? "INVALID")
        return acc;
      }, [])

      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(list_name));
      break;

    case "/loc":
      // console.log("/loc called");
      // Query the database and wait for the result
      const query_loc = await notion.databases.query({
        database_id: notionDatabaseId,
      });

      const list_loc = query_loc.results.reduce<string[]>((acc, row) => {
        const loc = row.properties.location;
        if (loc.type == "rich_text" &&
          loc.rich_text?.[0]?.plain_text &&
          !acc.includes(loc.rich_text?.[0]?.plain_text))
          acc.push(loc.rich_text?.[0]?.plain_text ?? "INVALID")
        return acc;
      }, [])

      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(list_loc));
      break;

    case "/post":
      // console.log("/post called") 
      let body = "";

      // collect data chunks
      req.on("data", chunk => {body += chunk.toString()});

      // end of request body
      req.on("end", () => {
        async function updateNotion(){
          const parsedBody = JSON.parse(body);
          const response = await notion.pages.update({
            page_id: parsedBody.page_id,
            properties: {
              "name": {
                rich_text: [{
                  type: "text",
                  text: {
                    content: parsedBody.name
                  }
                }]
              } as any, // I don't know why but "any" works... 
              "ID_number": {
                rich_text: [{
                  type: "text",
                  text: {
                    content: parsedBody.ID_number
                  }
                }]
              } as any,
            }
          })
          console.log(response);
          console.log("id/name edited. Edit information:" + body);
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(JSON.stringify({message: "200 OK"}));
        }
        updateNotion();
      })
      break;


    default:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
  }
}

// if running at local, uncomment these two lines:
const server = http.createServer(requestListener);
const host = "localhost";
const port = 8000;
server.listen(port, host, () => { console.log(`Server is running on http://${host}:${port}`); });

export default (req:http.IncomingMessage, res:http.ServerResponse) => {
  requestListener(req, res);
};