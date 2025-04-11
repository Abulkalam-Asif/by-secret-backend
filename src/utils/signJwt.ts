import * as jose from "jose";

export const signJwt = async (email: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret is not defined");

  const token = new jose.SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h");

  return await token.sign(new TextEncoder().encode(secret));
};
