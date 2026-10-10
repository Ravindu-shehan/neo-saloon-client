import {NextRequest, NextResponse} from 'next/server'
import { isPrivileged } from '@/utils/authentication';
import ProductCreationRequestSchema from '@/types/dto/ProductCreationRequest';
import z from 'zod';
import prisma from '@/lib/prisma';
import getPaginationInfo from '@/utils/pageInfoRetrieval';

export async function GET(request: NextRequest) {

   const params = getPaginationInfo(request)

    const totalProducts = await prisma.product.count()

    const totalPages = Math.ceil(totalProducts / params.pageSize)

    const products = await prisma.product.findMany({
        skip : (params.pageNumber - 1)* params.pageSize,
        take : params.pageSize,
        include : {
            media : true
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


    
    }

}


