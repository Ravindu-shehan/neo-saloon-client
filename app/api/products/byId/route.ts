import prisma from "@/lib/prisma";
import { NextRequest, NextResponse  } from "next/server";
import { ProductStatus } from "@/app/generated/prisma/browser";
import { isPrivileged } from "@/lib/privilege";

export async function GET(request: NextRequest){

    const id = request.nextUrl.searchParams.get("id");

    if(id == null){
        return NextResponse.json({message: "Product id is required"}, {status: 400});
    }
    try{
    const product = await prisma.product.findUnique({
        where:{
            id : id
        }
    })

    if(product == null){
        return NextResponse.json({message: "Product not found"}, {status: 404})
    }

    if(product.status == ProductStatus.discontinued){
        return NextResponse.json({message: "Product not found"}, {status: 404})

}

    if(product.status == ProductStatus.inactive){

        const hasPrivilege = await isPrivileged(request, "products:read")

        if(!hasPrivilege){
            return NextResponse.json({message: "You do not have the  required privilege to view this product"}, {status: 403})
        }
    }

    return NextResponse.json(product, {status : 200})

}catch(error){
    return NextResponse.json({message: "Internal server error"}, {status: 500})
}

}