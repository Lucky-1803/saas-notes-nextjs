import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/models/User";

interface RegisterIn {
    email : string,
    password : string,
    name? : string
}

export async function POST(req:NextRequest):Promise<NextResponse> {
    try {
        await connectDB()

        const body:RegisterIn = await req.json()
        const {name , email , password} = body

        if (!email || !password){
            return NextResponse.json(
                {success : false,message : "All fields are required"},
                {status:400}
            )
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return NextResponse.json(
                {success:false , message:"User already exists"},
                {status:400}
            )
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const createUser = await User.create({name,email,password :hashedPassword , providers: ["credentials"]})

        const userWithoutPassword = {
            _id : createUser._id,
            name : createUser.name,
            email : createUser.email,
            providers : createUser.providers
        }

        return NextResponse.json(
            {success:true , data : userWithoutPassword},
            {status:200}
        )
    }catch(error){
        return NextResponse.json(
            {message : "Error in creating account"},
            {status :500}
        )
    }    
}