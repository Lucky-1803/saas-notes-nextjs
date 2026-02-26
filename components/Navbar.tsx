"use client"

import { signOut } from "next-auth/react"

interface NavbarProps {
    user ? : {
        email?:string |null,
        name?:string|null
    }
}

export default function Navbar({user} : NavbarProps){
    return(
        <nav className="flex justify-between items-center bg-blue-500/20 shadow px-6 py-4">
            <h1 className="text-blue-200 text-3xl font-bold ">Notes</h1>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-white font-semibold">{user?.name}</p>
                    <p className=" text-sm text-gray-300">{user?.email}</p>
                </div>
                <button onClick={()=> signOut({callbackUrl:"/login"})} className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600 transition">Log out</button>
            </div>
        </nav>
    )    
}