import { Schema,model,models, Document,Model } from "mongoose";

export interface UserIn extends Document{
    email : string,
    password? : string,
    name?:string,
    providers: ("credentials" | "google")[]
    createdAt : Date
}

const UserSchema = new Schema<UserIn>({
    email : {type:String, required:true,unique:true},
    password : {type : String},
    name : {type : String},
    providers:{
        type:[String],
        enum : ["credentials","google"],
        required: true,
        default :[]
    }
}, {timestamps: true})

export const User: Model<UserIn> = 
models.User || model<UserIn>("User", UserSchema) 