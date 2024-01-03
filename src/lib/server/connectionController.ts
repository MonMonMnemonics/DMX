import type { RequestEvent } from "../../routes/api/subscribe/$types";

const contHead = {
  "Content-Type": "text/event-stream",
  "Connection": "keep-alive",
  "Cache-Control": "no-cache",
  //"Access-Control-Allow-Origin": "https://app.mchatx.org",
  "X-Accel-Buffering": "no"
}   

type listener = {
  boolPool: number, //number of pooling to decide when connection shutdow
  connLists: Record<string, ReadableStreamDefaultController>
}
var listenerPacks: Record<string, listener> = {};

export function addListener(id : string) {
  const connId = id + "_" + Date.now().toString();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue("data: { \"flag\":\"Connect\", \"content\":\"CONNECTED TO SERVER\"}\n\n")
      
      if (listenerPacks.hasOwnProperty(id)){
        listenerPacks[id].connLists[connId] = controller;
      } else {
        const newConn: any = {};
        newConn[connId] = controller;
        listenerPacks[id] = {
          boolPool: 0,
          connLists: newConn
        }
      }
    },
    cancel() {
      if (listenerPacks.hasOwnProperty(id)) {
        delete listenerPacks[id].connLists[connId];
        if (Object.keys(listenerPacks[id].connLists).length == 0) {
          delete listenerPacks[id];
        }
      }
    }
  });

  return new Response(stream, {
    headers: contHead
  })
}

export function broadcastMsg(id: string, data: any) {
  if (listenerPacks.hasOwnProperty(id)){
    listenerPacks[id].boolPool = 0;
    Object.values(listenerPacks[id].connLists).forEach(e => e.enqueue("data:" + JSON.stringify(data) + "\n\n"));
  }    
}

export function flushAllConnections(id: string) {
  Object.values(listenerPacks[id].connLists).forEach(e => {
    e.enqueue("data: { \"flag\":\"MSG Fetch Stop\", \"content\":\"MSG Fetch Stop\" }\n\n");
    e.close();
  });

  delete listenerPacks[id];
}

export function pinger() {
  Object.keys(listenerPacks).forEach(key => {
    listenerPacks[key].boolPool++;
    if (listenerPacks[key].boolPool == 100) {
      Object.values(listenerPacks[key].connLists).forEach(e => {
        e.enqueue("data: { \"flag\":\"timeout\", \"content\":\"Timeout\" }\n\n");
        e.close();
      });
      delete listenerPacks[key];
    } else {
      Object.values(listenerPacks[key].connLists).forEach(e => e.enqueue("data:{}\n\n"));
    }
  });
}
