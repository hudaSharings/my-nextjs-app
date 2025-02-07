import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/","/dashboard"];
const publicRoutes = ["/login"];

async function authMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const _cookies = await cookies();
  const cookie = _cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// function composeMiddleware(...middlewares: Function[]) {
//   return (req: NextRequest) => {
//     for (const middleware of middlewares) {
//       const response = middleware(req);
//       if (response && response.status !== 200) return response;
//     }
//     return NextResponse.next();
//   };
// }

// export const middleware = composeMiddleware(authMiddleware);
export default async function middleware(req: NextRequest) {
  const middlewares = [authMiddleware];
  let response: NextResponse | undefined;

  for (const middleware of middlewares) {
    response = await middleware(req);
    if (response) {
      return response;
    }
  }

  return NextResponse.next();
}
