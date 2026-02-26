import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"
import { redirect } from "next/navigation";
import NotesSectionPage from "@/components/NotesSection";


export default async function DashboardPage(){
    const session = await getServerSession(authOptions)
    if(!session){
        redirect("/login")
    }
    return (
        <div className="min-h-screen">
            <Navbar user={session.user}/>
            <div className="p-6">
                <NotesSectionPage/>
            </div>
        </div>
    )
}