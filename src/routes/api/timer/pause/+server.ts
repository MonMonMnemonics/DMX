import { broadcastMsg } from "$lib/server/connectionController";
import type { RequestEvent } from './$types';

export async function POST(req: RequestEvent) {
  const id =  req.url.searchParams.get('id');
  if (!id) {
    return new Response('Needs Id', {
      status: 400
    });
  }

  broadcastMsg(id, {
    flag: 'TIMER',
    data: {
      action: 'PAUSE',
    }
  });

  return new Response('OK');
}