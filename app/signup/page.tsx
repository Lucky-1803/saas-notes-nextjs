"use client"

import { FormEvent, useState,ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

interface SignupPageIn {
    name : string,
    password : string,
    confirmPassword : string,
    email : string 
}


export default function SignupPage(){
    const router = useRouter()
    
    const [formData , setFormData] = useState<SignupPageIn>({
        name : "",
        email : "",
        password:"",
        confirmPassword : ""
    })

    const [loading , setLoading] = useState<boolean>(false)
    const [error , setError] = useState<string>("")
    const [success , setSuccess] = useState<string>("")

    const handleChange = (e:ChangeEvent<HTMLInputElement>):void=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSignup = async (e:FormEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault()
        setSuccess("")
        setError("")

        if(formData.password !== formData.confirmPassword){
            setError("Password does not match")
            return
        }

        try{
            setLoading(true)
            const res:Response = await fetch("/api/register",{
            method:"POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                name : formData.name,
                email:formData.email,
                password : formData.password
            })
        })

        const data = await res.json()

        if(!res.ok){
            setError(data.message || "Signup failed !")
        }else {
            setSuccess("Account created successfully")
            setTimeout(()=>{
                router.push("/login")
            },2000)
        }
        }catch(error){
            setError("Something went wrong . Please try again later")
        }finally {
            setLoading(false)
        }
        
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSignup} className="flex flex-col gap-4 w-90 border border-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.6)] rounded-xl p-2">
                <h1 className="text-white font-bold h-8 m-6 text-4xl text-center">Create Account</h1>
                
                <input type="text" name = "name" required value={formData.name} onChange={handleChange} placeholder="Name..." className="border m-1 p-2 text-white placeholder-gray-400"/>

                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email..." className="text-white border m-1 p-2 placeholder-gray-400" />
                
                <input type="password" name="password" minLength={6} required value={formData.password} onChange={handleChange} placeholder="Password..." className="text-white border m-1 p-2 placeholder-gray-400" />
                
                <input type="password" name="confirmPassword" minLength={6} required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password..." className="text-white border m-1 p-2 placeholder-gray-400" />
                
                <button className="bg-blue-500 cursor-pointer transition m-1 text-white p-2 rounded-lg" type="submit" disabled={loading}>{loading? "Creating account...": "Signup"}</button>
                
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                {success && <p className="text-success text-center text-sm">{success}</p>}
                
                <hr />
                
                <button type="button" onClick={()=>{signIn("google",{callbackUrl:"/dashboard"})}} className="bg-red-500 m-1 text-white p-2 rounded-lg">Signup with Google</button>
                
                <p className="text-white text-center m-2">Already have an account ? {""}
                    <Link href="/login" className="text-blue-500 hover:underline transition">Login
                    </Link>
                </p>
            </form>
        </div>
    )
}