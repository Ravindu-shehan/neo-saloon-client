import {NextRequest, NextResponse} from 'next/server'
import { isPrivileged } from '@/utils/authentication';
import ProductCreationRequestSchema from '@/types/dto/ProductCreationRequest';
import z from 'zod';

export async function GET(request: NextRequest) {

   

    

    console.log("GET request received at /api /products");
}

export async function POST(request: NextRequest) {

    const hashPrivilege = await isPrivileged(request,  "products:add")

    if(hashPrivilege){
        try{
            
        const body = await request.json()

        const parseBody = ProductCreationRequestSchema.parse(body)
        
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