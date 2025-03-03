"use client"
import { collection, getDocs, deleteDoc, getDoc, doc } from "firebase/firestore";
import CreateUser from "../components/CreateUser/page";
import "./user.css";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { toast } from "react-toastify";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import useAuth from "../_hooks/useAuth";
import axios from "axios";

const UsersPage = () => {
    const { user, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userList, setUserList] = useState([]);
    const [data, setData] = useState([]);
    const router = useRouter();
    const showAdUserPoup = () => {
        console.log("Clicked Show Add User");
        document.getElementById("createuserpopup").style.display = "flex";
    };

    const fetchUsers = async () => {
        try {
            const usersData = await getDocs(collection(db, "users"));
            const data = usersData.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserList(data);
            setData(data);
        } catch (err) {
            console.log(err);
        }

    };

    const handleDeleteUser = async (uid) => {
        console.log(uid, "UID");
        try {
            const userDoc = doc(db, "users", uid);
            await deleteDoc(userDoc);
            toast.success("User Deleted Successfuly!");
            fetchUsers();
            console.log("User deleted:", response.data);
        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error.message);
        }
    };

    const handleChangeInChild = (data) => {
        setData(data);
    };

    useEffect(() => {
        if (user && !user.superAdmin) {
            console.log("Is a Admin");
            router.push("/");
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [data]);


    if (loading) {
        return <Loading />
    };


    if (!user || !user.superAdmin) {
        return null; // Optionally render nothing while redirecting
    }


    return <>
        {user.superAdmin && <>
            <CreateUser trackChange={handleChangeInChild} />
            <section className="wptb-video-wrapper-">
                <div className="header_title" >
                    <h2>All Users</h2>
                    <p>Check out all queries</p>
                </div>
                <div className="container" bis_skin_checked={1} >
                    <div className="action_container" >
                        <button className="btn btn-success" onClick={showAdUserPoup} >Add User</button>
                    </div>
                    <div className="query_list" ><table className="table">
                        <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col" >Role</th>
                                <th scope="col" >Action</th>
                                {/* <th scope="col">Update/Delete</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {userList && userList.map((a, i) => {
                                return <tr>
                                    <th scope="row">{i}</th>
                                    <td>{a.name}</td>
                                    <td>{a.email}</td>
                                    <td>{a.role}</td>
                                    <td> <span onClick={() => handleDeleteUser(a.id)} ><i className="fa-solid fa-trash"></i></span> </td>
                                </tr>
                            })}
                        </tbody>
                    </table></div>
                </div>
            </section >
        </>}
    </>
}


export default UsersPage;