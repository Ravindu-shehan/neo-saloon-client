import prisma from "@/lib/prisma";
import { getUser, isPrivileged } from "@/utils/authentication";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";

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
      
    const pageNumberInString = request.nextUrl.searchParams.get("pageNumber") || "1"

    const pageSizeInString = request.nextUrl.searchParams.get("pageSize")|| "10"

    const pageNumber = parseInt(pageNumberInString)
    const pageSize = parseInt(pageSizeInString)

    const userCount = await prisma.user.count()

    const totalPages = Math.ceil( userCount / pageSize)

    if(pageNumber > totalPages){
        return NextResponse.json(
            {
                message : "Page number exceeds total pages",
                totalPages : totalPages
            },
            {
                status : 400
            }
        )
    }

    const users = await prisma.user.findMany({
        skip : (pageNumber - 1) * pageSize,
        take : pageSize,
        select : {
            id : true,
            email : true,
            phone : true,
            firstName : true,
            lastName : true,
            password : false,
            role : true,
            status : true,
            createdAt : true,
            lastLogin : true,
            privileges : true
        }
    })
    return NextResponse.json(
        {
            message : "Users fetched successfully",
            users : users,
            pagination : {
                pageNumber : pageNumber,
                pageSize : pageSize,
                totalPage : totalPages,
                totalCount : userCount
            }
        }
    )

   

    return NextResponse.json(
        {
            message: "Users fetched successfully",
            users: users
        },
        {status: 200}
    )

}

export async function POST(request: NextRequest) {

    //email. firstName, lastName, password, phone(optional)

    const body = await request.json();

    if(body.email==null){
        return NextResponse.json(
            {
                message: "Email is required"
            },
            {status: 400}
        )
    }

    if(body.firstName==null){
        return NextResponse.json(
            {
                message: "First name is required"
            },
            {status: 400}
        )
    }

    if(body.lastName==null){
        return NextResponse.json(
            {
                message: "Last name is required"
            },
            {status: 400}
        )
    }

    if(body.password==null){
        return NextResponse.json(
            {
                message: "Password is required"
            },
            {status: 400}
        )
    }

    const existingUser = await prisma.user.findUnique(
        {
        where: {
            email: body.email
        }
    }
)
if(existingUser!=null){
    return NextResponse.json(
        {
            message : "User with this email already exists"
        },
        {
            status : 409
        }
    )
}

const passwordHash = await bcrypt.hash(body.password, 12) // 12 mean is salting rounds

await prisma.user.create({
    data :{
        email : body.email,
        firstName : body.firstName,
        lastName : body.lastName,
        password : passwordHash,
        phone: body.phone,

    }
})

return NextResponse.json(
    {
        message : "User created successfully"
    },
    {
        status : 201
    }
)

}

export async function PUT(request : NextRequest){

    const id = request.nextUrl.searchParams.get("id")

    const requestedUser = await getUser(request)

    if(requestedUser==null){
        return NextResponse.json({
            message : "You are not logged in"
        },
        {status: 401}
    )
    }

    if(requestedUser.id != id){
        //user is trying to update their own account, allow it

    }else{
        //trying to update another user's details
    }



    }
