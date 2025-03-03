"use client"
import "./login.css";
import { useEffect, useRef } from "react";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCred = await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
            const token = await userCred.user.getIdToken();
            document.cookie = `authToken=${token}; path=/;`
            console.log("Login Success");
            router.push("/")
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            document.getElementById("navbar").style.display = "none";
            document.getElementById("mobileNavbar").style.display = "none";
        }
    }, []);
    return <>
        <section className="page_Container" >
            <div className="container" >
                <div className="login_option" >
                    <div className="login_form_container" >
                        <h2>Sign In</h2>
                        <div className="login_form" >
                            <form onSubmit={handleLogin} >
                                <div className="input_container" >
                                    <label>Login ID</label>
                                    <input ref={emailRef} type="text" />
                                </div>
                                <div className="input_container" >
                                    <label>Password</label>
                                    <input ref={passwordRef} type="text" />
                                </div>
                                <div className="action_container">
                                    <button type="submit" className="btn btn-primary" >Log In</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}



