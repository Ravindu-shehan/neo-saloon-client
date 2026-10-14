import prisma from "@/lib/prisma";
import { NextRequest, NextResponse  } from "next/server";
import { ProductStatus } from "@/app/generated/prisma/browser";

export async function GET(request: NextRequest){

    const id = request.nextUrl.searchParams.get("id");

    if(id == null){
        return NextResponse.json({message: "Product id is required"}, {status: 400});
    }

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

}