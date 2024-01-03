import { pinger } from "$lib/server/connectionController";
setInterval(pinger, 1000*3);