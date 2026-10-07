import {NextRequest, NextResponse} from 'next/server'
import { isPrivileged } from '@/utils/authentication';

export async function GET(request: NextRequest) {

   

    

    console.log("GET request received at /api /products");
}

export async function POST(request: NextRequest) {

    const hashPrivilege = await isPrivileged(request,  "products:add")

    if(hashPrivilege){

        const body = await request.json()

    }else{
        return NextResponse.json(
            {
                message : "You are not authorized to add products"
            },
            {
                status : 403
            }
        )
    }
}