import { KJUR } from "jsrsasign";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { meetingNumber } = await req.json();

  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    appKey: process.env.ZOOM_CLIENT_ID,
    sdkKey: process.env.ZOOM_CLIENT_ID,
    mn: +meetingNumber,
    role: 0,
    iat,
    exp,
  };

  const meetingSignature = KJUR.jws.JWS.sign(
    "HS256",
    JSON.stringify(header),
    JSON.stringify(payload),
    process.env.ZOOM_CLIENT_SECRET
  );

  return NextResponse.json({
    signature: meetingSignature,
    sdkKey: process.env.ZOOM_CLIENT_ID,
  });
};
