"use client"
import { useRef, useState } from "react";
import "./createuser.css";
import { auth, db } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
const CreateUser = ({ trackChange }) => {
    let firstNameRef = useRef(null);
    let lastNameRef = useRef(null);
    let emailRef = useRef(null);
    let passwordRef = useRef(null);
    let confirmPasswordRef = useRef(null);
    const [role, setRole] = useState("");

    const closePopup = () => {
        document.getElementById("createuserpopup").style.display = "none";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let password;
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            toast.error("Password did not matched!");
            return;
        } else if (role == "") {
            toast.error("Please select a role!")
        }
        else {
            try {
                password = passwordRef.current.value;
                let newUserData = { displayName: firstNameRef.current.value + " " + lastNameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value };
                let newUser = await createUserWithEmailAndPassword(auth, newUserData.email, newUserData.password);
                let user = newUser.user
                await updateProfile(user, {
                    displayName: newUserData.displayName
                });
                let docRf = doc(db, "users", user.uid);
                await setDoc(docRf, {
                    name: newUserData.displayName,
                    email: newUserData.email,
                    role: role
                })
                trackChange(newUser);
                toast.success("User created successfully!");
                document.getElementById("createuserpopup").style.display = "none"
            } catch (err) {
                console.log("Error in creating user!", err)
            }
        }
    };


    return <>
        <div
            id="createuserpopup"
            className="query_popup"
            style={{ position: "fixed", display: "none" }}
        >
            <div className="content_container">

                <div className="query_item_container">
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 15, height: "100%" }} >
                        <div style={{ display: "flex", alignItems: "center", height: "100%" }} >
                            <h2 style={{ padding: 0, margin: 0 }} >Create User</h2>
                        </div>
                        <p style={{ textDecoration: "underline", cursor: "pointer" }} onClick={closePopup}>
                            Close
                        </p>
                    </div>
                    <form className="container" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <strong>First Name</strong>
                                <input
                                    type="text"
                                    name="name"

                                    ref={firstNameRef}
                                />
                            </div>
                            <div className="col">
                                <strong>Last Name</strong>
                                <input
                                    type="text"
                                    name="mobile"

                                    ref={lastNameRef}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <strong>Email</strong>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    style={{ width: "100%" }}
                                    ref={emailRef}
                                />
                            </div>

                        </div>
                        <div className="row">
                            <div className="col">
                                <strong>Select Role</strong>
                                <select onChange={(e) => setRole(e.target.value)} >
                                    <option value="" >Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user" >User</option>
                                </select>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col">
                                <strong>Password</strong>
                                <input
                                    type="text"
                                    name="adhaar"

                                    ref={passwordRef}
                                />
                            </div>
                            <div className="col">
                                <strong>Confirm Password</strong>
                                <input
                                    type="text"
                                    name="PAN"

                                    ref={confirmPasswordRef}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div
                                style={{ boxShadow: "none" }}
                                className="col"
                            >
                                <button type="submit" className="btn btn-success">
                                    Create User
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    </>
}

export default CreateUser;