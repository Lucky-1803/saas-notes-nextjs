import mongoose ,{Schema , model , models , Document , Model} from "mongoose"

export interface NoteIn extends Document {
    title : string;
    content : string ;
    tags : string[];
    pinned : boolean;
    userId : string;
    createdAt : Date;
    updatedAt : Date;
}

const NoteSchema = new Schema <NoteIn> ({
    title : {type : String , required : true},
    content : {type : String , required : true},
    tags : [{type : String}],
    pinned : {type : Boolean , default : false},
    userId : {type : String , required : true}
    },
    {timestamps:true}
)

export const Note:Model<NoteIn> = models.Note || model<NoteIn>("Note" , NoteSchema)