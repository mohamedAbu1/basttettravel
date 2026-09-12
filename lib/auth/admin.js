import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * Reads and verifies the server-side access token.
 * Authorization must always be performed on the server; client-side JWT
 * decoding is only suitable for display purposes and must never protect an API.
 */
export function getAuthenticatedUser(request) {
  const token = request.cookies.get("access-token")?.value;

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Returns a standard response when the request is not from an administrator.
 * Returns null when the request is authorized so route handlers can continue.
 */
export function requireAdmin(request) {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 },
    );
  }

  if (String(user.role).toUpperCase() !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Administrator access required" },
      { status: 403 },
    );
  }

  return null;
}

/** Returns the authenticated user or a standard 401 response. */
export function requireUser(request) {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      ),
    };
  }

  return { user, response: null };
}

/**
 * Adds the authentication cookies to a response without exposing them to
 * client-side JavaScript.
 */
export function setAuthCookies(response, accessToken, refreshToken) {
  const secure = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  };

  response.cookies.set("access-token", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });

  if (refreshToken) {
    response.cookies.set("refresh-token", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
