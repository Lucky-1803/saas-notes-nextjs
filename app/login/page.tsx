"use client"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState , FormEvent } from "react"
import Link from "next/link"

export default function LoginPage() {

    const router = useRouter()

    const [email , setEmail] = useState<string>("")
    const [password , setPassword] = useState<string>("")
    const [loading , setLoading] = useState<boolean>(false)
    const [error , setError] = useState<string>("")

    const handleLogin = async(e:FormEvent<HTMLFormElement>): Promise <void>=> {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await signIn("credentials" , {email , password , redirect:false})

        setLoading(false)

        if(res?.error){
            setError("Invalid Credentials")
        }else {
            router.push("/dashboard")
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleLogin} className = "border shadow-[0_0_5px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.6)] border-blue-500 rounded-xl shadow flex flex-col gap-5 w-90">
                <h1 className="text-4xl h-8 m-8 font-bold text-center text-white">Login</h1>
                <input type="email" placeholder="Email..." className="text-white m-2 placeholder-gray-400 border border-gray-300 p-2" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)} />
                <input type="password" placeholder="Password..." className="m-2 placeholder-gray-400 border text-white border-gray-300 p-2" value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} />
                <button type="submit" className="m-2 bg-blue-500 hover:bg-blue-600 transition cursor-pointer text-white p-2 rounded-lg" disabled={loading}>{loading? "Logging in..." : "Login"}</button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <hr/>
                <button type="button" className="m-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white p-2 rounded-lg" onClick={()=>signIn("google", { callbackUrl: "/dashboard" })}>Continue with Google</button>
                <p className="text-white text-center m-2">Dont have an account ? {" "}
                    <Link href="/signup" className="hover:underline text-blue-500">Signup</Link>
                </p>
            </form>

        </div>
    )
}