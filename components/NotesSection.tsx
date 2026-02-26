"use client"
import { useEffect, useState } from "react"
import {useSession } from "next-auth/react"

interface NoteType{
    title : string,
    _id : string,
    content : string
}

export default function NotesSectionPage(){
    const {data:session} = useSession()

    const [title , setTitle] = useState("")
    const [content , setContent ] = useState("")
    const [notes , setNotes] = useState<NoteType[]>([])

    const [editingId,setEditingId] = useState<string|null>(null)
    const [editTitle , setEditTitle] = useState("")
    const [editContent , setEditContent] = useState("")

    const fetchNotes = async()=>{
        const res:Response = await fetch("/api/notes") 
        const data = await res.json()
        if(data.success){
            setNotes(data.data)
        }
    }

    useEffect(() => {
        if(session){
            fetchNotes()
        }
    }, [session])

    const handleCreate = async ()=>{
        if(!title || !content) return

        const res = await fetch ("/api/notes", {
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify({title,content})
        })
        const data = await res.json()
        if(data.success){
            setTitle("")
            setContent("")
            fetchNotes()
        }        
    };

    // -----------DeleteNote-----------------

    const handleDelete = async(id:string)=>{
        await fetch(`/api/notes/${id}`,
        {method : "DELETE"}
    );
    fetchNotes()
    }
    
    // ------------Start Edit ---------

    const handlestartediting =(note : NoteType)=>{
        setEditingId(note._id)
        setEditTitle(note.title)
        setEditContent(note.content)
    }

    // ----------- save edit-----------

    const handleSaveEdit = async()=>{
        if(!editingId) return

        await fetch (`/api/notes/${editingId}`,{
            method : "PATCH",
            headers : {"Content-Type":"application/json"},
            body: JSON.stringify({
                title : editTitle,
                content : editContent
            })
        })
        setEditingId(null)
        fetchNotes()
    }

    return(
        <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-2xl mb-6 font-bold">Your Notes</h2>

            <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
                <input onChange={(e)=> setTitle(e.target.value)} value={title} placeholder="Title..." className="w-full border p-2 rounded" type="text" />
                <textarea onChange={(e)=> setContent(e.target.value)} value={content} placeholder="Content..." className="w-full border p-2 rounded" name="" id=""></textarea>
                <button onClick={handleCreate} className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 cursor-pointer">Add Note</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {notes.map((note)=>(
                    <div key={note._id} className="bg-white shadow-md rounded-xl p-6">
                        {editingId === note._id ? (
                            <>
                            <input className="w-full border p-2 rounded mb-2" onChange={(e)=>{setEditTitle(e.target.value)}} value={editTitle} />
                            <textarea className="w-full border p-2 rounded mb-3"
                            rows={3}
                            value={editContent}
                            onChange={(e)=> setEditContent(e.target.value)}></textarea>
                            <div className="flex gap-2">
                                <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                                <button onClick={()=> setEditingId(null)} className="bg-red-400 text-white px-3 py-1 rounded">Cancel</button>
                            </div>
                            </>
                        ):(
                            <>
                            <h3 className="font-bold text-lg">{note.title}</h3>
                            <p className="text-gray-600 mt-2">{note.content}</p>
                            <div className="flex gap-3 mt-4">
                            <button onClick={()=> handlestartediting(note)} className="text-blue-600 font-medium">Edit</button>
                            <button onClick={()=> handleDelete(note._id)} className="text-red-600 font-medium" >Delete</button>
                            </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}