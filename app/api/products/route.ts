import {NextRequest, NextResponse} from 'next/server'
import { isPrivileged } from '@/utils/authentication';
import ProductCreationRequestSchema from '@/types/dto/ProductCreationRequest';
import z from 'zod';
import prisma from '@/lib/prisma';
import getPaginationInfo from '@/utils/pageInfoRetrieval';
import { ProductStatus } from '@/app/generated/prisma/browser';
import { MediaArraySchema } from '@/types/dto/ProductUpdateRequest';

export async function GET(request: NextRequest) {

   const params = getPaginationInfo(request)

   const hasPrivilege = await isPrivileged(request, "products:read")

   if(hasPrivilege){
   
    const totalProducts = await prisma.product.count(
        {
            where : {
                NOT : {
                    status : ProductStatus.discontinued
                }
            }
        }
    )

    const totalPages = Math.ceil(totalProducts / params.pageSize)

    const products = await prisma.product.findMany({
        skip : (params.pageNumber - 1)* params.pageSize,
        take : params.pageSize,
        include : {
            media : true
        },
        where : {
            NOT : {
                status : ProductStatus.discontinued
            }
        }
    })

    return NextResponse.json(
        {
            message : "products fetched successfully",
            products : products,
            pagination : {
                pageNumber : params.pageNumber,
                pageSize : params.pageSize,
                totalPages : totalPages,
                totalCount : totalProducts
            
        }
        }
    )
    
}else{

    const totalProducts = await prisma.product.count(
        {
            where : {
                status : ProductStatus.active
            }
        }
    )
    const totalPages = Math.ceil(totalProducts / params.pageSize)

    const products = await prisma.product.findMany({
        skip : (params.pageNumber - 1)* params.pageSize,
        take : params.pageSize,
        include : {
            media : true
        },
        where : {
            status : ProductStatus.active
        }
    })

    return NextResponse.json(
        {
            message : "products fetched successfully",
            products : products,
            pagination : {
                pageNumber : params.pageNumber,
                pageSize : params.pageSize,
                totalPages : totalPages,
                totalCount : totalProducts
            }
        }
    )
}
   

    

   // console.log("GET request received at /api /products");
}

export async function POST(request: NextRequest) {

    const hashPrivilege = await isPrivileged(request,  "products:add")

    if(hashPrivilege){
        try{
            
        const body = await request.json()

        const parseBody = ProductCreationRequestSchema.parse(body)

        

        await prisma.product.create(
            {
            data : {
                sku : parseBody.sku,  
                name : parseBody.name,
                altNames : parseBody.altNames,
                description : parseBody.description,
                stock : parseBody.stock,
                status : parseBody.status,
                price : parseBody.price,
                compareAt : parseBody.compareAt,
                brand : parseBody.brand,
                model : parseBody.model,
                media: {
                 create : parseBody.media 
               }
                
            }
        }
    )    
    
    return NextResponse.json(
        {
            message : "Product created successfully",
        },
        {
            status : 201
        }
    )
        
    }catch(error){

        if(error instanceof z.ZodError){

            return NextResponse.json(
                {
                    message : error.issues[0]?.message ?? "Invalid input",
                },
                {
                    status : 400
                }
            )
        }    

        return NextResponse.json(
            {
                message : "Internal server error",
            },
            {
                status : 500
            }
        )    

    }


    
    }else{
        return NextResponse.json({message :  "You do not have the required privilege to add products"})
    }

}

export async function DELETE(request : NextRequest){

    const hasPrivilege = await isPrivileged(request, "products: delete")

    if(!hasPrivilege){
        return NextResponse.json(
            {
                message : "You do not have the required privilege to delete products"
            }
        )
    }

    const id = request.nextUrl.searchParams.get("id")

    if(id == null){
        return NextResponse.json(
            {
                message : "Product id is required"
            },
            {
                status : 400
            }
        )
    }
     try{
    const existingProduct = await prisma.product.findUnique({
        where : {
            id : id
        }
    })

    if(existingProduct == null){
        return NextResponse.json({message : "Product not found"}, {status : 404})
    }

    if(existingProduct.status == ProductStatus.discontinued){
        return NextResponse.json({message : "Product not found"}, {status : 400})
    }

    await prisma.product.update(
        {
            where : {
                id : id
            },
            data : {

                status : ProductStatus.discontinued

            }
        }
    )

    return NextResponse.json(
        {
            message : "Product deleted successfully"
        },
        {
            status : 200
        }
    )
}catch(error){
    return NextResponse.json(
        {
            message : "Internal server error"
        },
        {
            status : 500 
        }
    )
}

}

export async function PUT(request : NextRequest){

    const hasPrivilege = await isPrivileged(request , "products: edit")

    if(!hasPrivilege){
        return NextResponse.json({message : "You do not have the required privilege to update a product"}, {status : 403})
    }

    const id = request.nextUrl.searchParams.get("id")

    if(id == null){
        return NextResponse.json({message : "Product id is required"}, {status : 400})
    }

    try{
        const body = await request.json()

        const parseBody = ProductCreationRequestSchema.parse(body)

        const existingProduct = await prisma.product.findUnique({
            where : {
                id : id
            }
        })

        if(existingProduct == null){
            return NextResponse.json({message : "Product not found"}, {status : 404})
        }

        await prisma.product.update({
            where : {
                id : id
            },
            data : {
                sku : parseBody.sku || existingProduct.sku,
                name : parseBody.name || existingProduct.name,
                altNames : parseBody.altNames || existingProduct.altNames,
                description : parseBody.description || existingProduct.description,
                stock : parseBody.stock || existingProduct.stock,
                status : parseBody.status || existingProduct.status,
                price : parseBody.price || existingProduct.price,
                compareAt : parseBody.compareAt || existingProduct.compareAt,
                brand : parseBody.brand || existingProduct.brand,
                model : parseBody.model || existingProduct.model,
            }
        }
    )

    if(parseBody.media != null && parseBody.media.length > 0){

        const parseMediaArray = MediaArraySchema.parse(parseBody.media)


        await prisma.media.deleteMany({
            where : {
                productId : id
            }
        })

        await prisma.product.update({
            where : {
                id : id
            },
            data : {
                media : {
                    create : parseMediaArray
                }
            }
        })
    }

    return NextResponse.json(
        {
            message : "Product updated successfully"
        },
        {
            status : 200
        }
    )

    }catch(error){

        if(error instanceof z.ZodError){
            return NextResponse.json(
                {
                    message : error.issues[0]?.message ?? "Invalid input",
                },
                {
                    status : 400
                }
            )
        }
        return NextResponse.json(
            {
                message : "Internal server error"
            },
            {
                status : 500 
            }
        )
    }
}

