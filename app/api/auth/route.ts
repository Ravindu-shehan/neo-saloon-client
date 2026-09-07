import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {compare} from "bcryptjs";
import * as jose from "jose";

export async function POST(request: NextRequest) {

  const body = await request.json();

  console.log(body);

  if(body.email == null) {

    return NextResponse.json(
      {
        message: "Email is required",
      }
    )
  }

  const user = await prisma.user.findFirst(
    {
    where: {
      email: body.email,
    },
  });
  

  console.log(user);

  if(user == null) {

    return NextResponse.json(
      {
        message: "User not found",
      }
    )
  }

  const isPasswordValid = await compare(body.password, user.password);

  if(isPasswordValid) {

    return NextResponse.json(
      {
        message: "Login successful",
      }
    )

}else {

    return NextResponse.json(
      {
        message: "Invalid password",
      }
    )
  }


}