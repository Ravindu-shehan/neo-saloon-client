import { NextRequest } from "next/server";
import * as jose from "jose";

async function GetUser(request: NextRequest){

     const loginToken = request.cookies.get("login-token")?.value;
    
        const secretText = process.env.JOSE_SECRET || "TestSecret22@";
    
        const secret = new TextEncoder().encode(secretText);

        try{
            const user = await jose.jwtVerify(
            loginToken || "",
            secret
        );

        return user.payload

        }catch{

            return null
        }
    
        
}