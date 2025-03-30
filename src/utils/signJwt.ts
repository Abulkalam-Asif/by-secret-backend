import * as jose from "jose";

export const signJwt = async (email: string) => {
  const token = new jose.SignJWT({
    email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret is not defined");
  return token.sign(new TextEncoder().encode(secret));
};
