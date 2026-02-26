import { NextResponse , NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Note } from "@/app/models/Note";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface RouteParams {
    params : {
        id : string
    }
}

export async function PATCH (req : NextRequest ,context : {params: Promise<{id:string}>})  {
    try {
        await connectDB()

        const {id} = await context.params

        const body : Partial <{
            title : string ,
            content : string
        }>= await req.json()

        if(!Types.ObjectId.isValid(id)){
            return NextResponse.json({message : "Invalid NoteId"}, {status : 400})
        }

        const session = await getServerSession(authOptions)
        if(!session?.user?.id){
            return NextResponse.json({message : "Unauthorized"}, {status: 401})
        }

        const updateNote = await Note.findOneAndUpdate(
            {_id:id, userId : session.user.id} , body , {new : true}
        )

        if(!updateNote){
            return NextResponse.json({message : "Note not found"} , {status : 404})
        }

        return NextResponse.json({data : updateNote,success : true})
    }catch(error:unknown){
        return NextResponse.json(
            {message : "Got error in updating note"},{status:500}
        )
    }
}

// Delete Note 

export async function DELETE(req:NextRequest , context : {params: Promise<{id:string}>}){
    try {
        await connectDB()

        const {id} = await context.params

        const session = await getServerSession(authOptions)
        if(!session?.user?.id){
            return NextResponse.json({message : "UnAuthorized"}, {status:401})
        }

        const deleteNote = await Note.findOneAndDelete({_id:id , userId : session.user.id})

        if(!deleteNote){
            return NextResponse.json({message:"Note not found"},{status:404})
        }

        return NextResponse.json({message:"Note deleted successfully",success:true},{status:200})

    }catch(error){
        return NextResponse.json({message:"Error in deleting Note"}, {status:500})
    }    
}