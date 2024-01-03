import { broadcastMsg } from "$lib/server/connectionController";
import type { RequestEvent } from './$types';

export async function POST(req: RequestEvent) {
  const id =  req.url.searchParams.get('id');
  if (!id) {
    return new Response('Needs Id', {
      status: 400
    });
  }

  let body: any;
  try {
    body = await req.request.json();  
  } catch (err) {
    return new Response('Needs time', {
      status: 400
    });
  }
  
  if (!body.hasOwnProperty('time')) {
    return new Response('Needs time', {
      status: 400
    });
  }
  
  broadcastMsg(id, {
    flag: 'TIMER',
    data: {
      action: 'START',
      time: body.time
    }
  });

  return new Response('OK');
}