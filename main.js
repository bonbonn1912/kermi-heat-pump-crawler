import "dotenv/config";
import { insertNewDatapoint, insertNewDevice } from "./helper/insert.js";
import {  parseFavDp } from "./helper/parse.js";

async function Login(ip, password) {
    try{
        const res = await fetch(`http://${ip}/api/Security/Login`, {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
              "content-type": "application/json;charset=UTF-8",
              Referer: `http://${ip}/`,
              "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: JSON.stringify({ Password: password }),
            method: "POST",
            credentials: "same-origin",
          });
        
          const header = res.headers.get("set-cookie"); // Session cookie, idk how long this is valid in node :^)
          return header;
    }catch(e){
        console.log("Couldnt log in. try again in next intervall")
        return;
    }
 
}

async function getData(header, ip) {
    try{
        const res = await fetch(
            `http://${ip}/api/Favorite/GetFavorites/00000000-0000-0000-0000-000000000000`,
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json;charset=UTF-8",
                cookie: header,
                Referer: `http://${ip}/`,
                "Referrer-Policy": "strict-origin-when-cross-origin",
              },
              body: '{"WithDetails":true,"OnlyHomeScreen":true}',
              method: "POST",
            }
          );
          const data = await res.json();
          return data;
    }catch{
        console.log("coulnt get data. try again in next intervall")
        return;
    }
  
}

async function parse(type) {
    try{
        const cookie = await Login(
            process.env.HEATPUMP_IP,
            process.env.HEATPUMP_PASSWORD
          );
          const data = await getData(cookie, process.env.HEATPUMP_IP);
          const resObjects = data["ResponseData"];
          const values = [];
          for (const index in resObjects) {
            let item = resObjects[index];
            const type = item["$type"];
            if (type == "BMS.Shared.Model.System.FavoriteDatapoint, BMS.Shared") {
               const dpValue = item
               values.push(parseFavDp(item,dpValue["DatapointValue"]));
            }
            if (type == "BMS.Shared.Model.System.FavoriteDevice, BMS.Shared") {
              const dpValue =
                item["VisualizationDatapoints"]["$values"][0]["DatapointValue"];
              values.push(parseFavDp(item, dpValue));
            }
          }
          for(let device in values){
                if(type == "init"){
                    insertNewDevice(values[device].sensorName, values[device].deviceId, "")
                }
                if(type == "value"){
                    insertNewDatapoint(values[device].sensorName, values[device].sensorValue)
                }    
          }        
    }catch(e){
        console.log("Could not parse. Try again in next intervall")
        return;
    }
 
 // console.log(values)
}
function logEveryXSeconds(i, intervall) {
    setTimeout(() => {
        console.log("Fetching data nr: " + i)
        parse("value")
        logEveryXSeconds(++i);
    }, 60000)
}

logEveryXSeconds(0, 1);
// parse("value");
//Login()
//getData()
