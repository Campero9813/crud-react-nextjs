import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest){
    const token = req.cookies.get("token")?.value || req.headers.get("authorization");

    //Si no hay token volver al login
    if (!token) {
        return NextResponse.redirect(new URL ("/", req.url));
    }

    //Opcional: Aqui manejar el token con el back

    return NextResponse.next();
}


export const config = {
    matcher: ["/dashboards/:path*", "/users/:path*"]
}