import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Note } from "@/app/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"

interface CreateNoteBody {
    title : string,
    content : string,
    tags ?: string[],
    userId : string,
    pinned? : boolean
}

interface ErrorResponse {
    message : string
}

export async function POST(req:Request): Promise<NextResponse> {
    try {
        await connectDB()

        const session = await getServerSession(authOptions)

        if (!session?.user?.id){
            return NextResponse.json({message:"UnAuthorized"},{status:401})
        }

        const body : CreateNoteBody = await req.json()
        const {title , content , tags } = body as CreateNoteBody

        if (!title || !content ){
            const error : ErrorResponse = {message:"Missing required fields" }
            return NextResponse.json(error , {status:400})
        }

        const note = await Note.create({title,content,tags,userId:session.user.id})
        return NextResponse.json({data:note, success:true},{status:200})

    }catch(error){
        const err : ErrorResponse = {message : "Error creating Note"}
        return NextResponse.json(err,{status : 500})
    }
}


// Get Notes

export async function GET (req:Request):Promise <NextResponse>{
    try {
        await connectDB()

        const session = await getServerSession(authOptions)
        console.log("SESSION:", session);

        if(!session?.user?.id){
            return NextResponse.json({message:"UnAuthorized"}, {status : 401})
        }

        const {searchParams} = new URL(req.url)

        const search =searchParams.get("search")

        let query : any = {userId:session.user.id}

        if(search) {
            query.$or = [
                {title: {$regex : search , $options:"i"}},
                {content:{$regex: search , $options:"i"}}
            ]
        }

        const notes = await Note.find(query).sort({pinned : -1 , createdAt : -1} )
        return NextResponse.json({data:notes, success:true }, {status:200})
    }catch(error){
        const err : ErrorResponse = {message: "Error fetching Notes"}
        return NextResponse.json(err, {status:500})
    }
}