import { env } from "cloudflare:workers";
import core from "../../../../runtime/engine.mjs";
import { handler,d1Store } from "../../../../runtime/api.mjs";
export const dynamic="force-dynamic";
export async function GET(request:Request){return handler(core,d1Store(env.DB))(request);}
export const POST=GET;
