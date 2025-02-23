import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload, UserInfo } from "./sessionPayload";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, userInfo: UserInfo) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionPayload: SessionPayload = {
    userId,    
    expiresAt,
    userInfo: { 
    ...userInfo
    },
  };
  const session = await encrypt(sessionPayload);
  const cookie = await cookies();
  cookie.set("session", session, {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
    const cookie = await cookies();
    cookie.delete("session");
}


export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = await cookies();
  const session = cookie.get("session")?.value;
  return decrypt(session);
}