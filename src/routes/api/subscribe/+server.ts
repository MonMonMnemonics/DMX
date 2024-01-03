import { addListener } from "$lib/server/connectionController";

import type { RequestEvent } from "./$types";

export function GET(req: RequestEvent) {
  const id =  req.url.searchParams.get('id');
  if (!id) {
    return new Response('Needs Id', {
        status: 400
    });
  }

  return addListener(id);
}