import prisma from "@/lib/prisma";
import { getUser, isPrivileged } from "@/utils/authentication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const havePrivilegedUser = await isPrivileged(request, "users:read");

    if(!havePrivilegedUser){
        return NextResponse.json(
            {
                message: "you do not have the privilege to view users"
            },
            {status: 403}
        )
    }
      
    

    const users = await prisma.user.findMany();

    return NextResponse.json(
        {
            message: "Users fetched successfully",
            users: users
        },
        {status: 200}
    )

}