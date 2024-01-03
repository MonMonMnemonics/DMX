import { broadcastMsg } from "$lib/server/connectionController";
import type { RequestEvent } from './$types';

export async function POST(req: RequestEvent) {
  const id =  req.url.searchParams.get('id');
  if (!id) {
    return new Response('Needs Id', {
      status: 400
    });
  }

  let dt: Record<string, string> = {
    action: 'RESTART',
  }

  let body: any;
  try {
    body = await req.request.json();  
  } catch (err) {
    body = {}
  }
  
  if (body.hasOwnProperty('time')) {
    dt['time'] = body.time;
  }

  broadcastMsg(id, {
    flag: 'TIMER',
    data: dt
  });

  return new Response('OK');
}