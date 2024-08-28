require("dotenv").config();
import http from "http";
import url from "url";
import { Client } from "@notionhq/client";

  // export type typeItem = {
  //   name: string,
  //   loc?: string,
  //   time?: string,
  //   colors?: string,
  //   straits?: string[],
  //   owner?: {
  //     name?: string,
  //     tel?: string,
  //     ID?: string,
  //   }
  // };

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

const host = "localhost";
const port = 8000;

// Require an async function here to support await with the DB query
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const parsedUrl = url.parse(req.url??"", true)
  // switch (req.url) {
  switch (parsedUrl.pathname) {
    case "/":
      // Query the database and wait for the result
      const query = await notion.databases.query({
        database_id: notionDatabaseId,
      });
     
      const params = parsedUrl.query;

      // const list = query.results[1].properties.color
      const list = query.results.map(row => {
        const id = row.properties.number;
        const name = row.properties.items;
        const colors = row.properties.color;
        const straits = row.properties.feature;
        const loc = row.properties.location;
        const date = row.properties.date;
        const owner_name = row.properties.name;
        const owner_phone = row.properties.phone;
        const owner_ID = row.properties.ID_number;

        if(
          id.type == "title" && 
          name.type == "rich_text" && 
          colors.type == "multi_select" && 
          straits.type == "multi_select" && 
          loc.type == "rich_text" && 
          date.type == "date" && 
          owner_name.type == "rich_text" && 
          owner_phone.type == "rich_text" && 
          owner_ID.type == "rich_text" 
        )

        // if(some filtering situations)
        return {
          id: id.title?.[0]?.plain_text,
          name: name.rich_text?.[0]?.plain_text,
          colors: colors.multi_select?.map(obj => obj.name),
          straits: straits.multi_select?.map(obj => obj.name),
          loc: loc.rich_text?.[0]?.plain_text,
          date: new Date(date.date?.start ?? ""), 
          owner: {
            name: owner_name.rich_text?.[0]?.plain_text,
            phone: owner_phone.rich_text?.[0]?.plain_text,
            ID: owner_ID.rich_text?.[0]?.plain_text,
          }
        }
        else return { }
      })

      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(list));
      break;

    default:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});