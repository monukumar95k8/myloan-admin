"use client"

import useAuth from "@/app/_hooks/useAuth";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [mobileNavActive, setMobileNavActuve] = useState(false);



    useEffect(() => {
        if (user) {
            console.log(user, "USer");
            setIsAdmin(user.superAdmin);
        }
    }, [user]);

    const toggleMobileNave = () => {
        if (!mobileNavActive) {
            document.body.classList.add("mr-menu_active");
            setMobileNavActuve(true);
        } if (mobileNavActive) {
            document.body.classList.remove("mr-menu_active");
            setMobileNavActuve(false);
        }

    }

    return <><header id="navbar" className="header style8 py-4 py-lg-0">
        <div className="container" bis_skin_checked={1}>
            <div
                className="header_inner d-flex align-items-center justify-content-between"
                bis_skin_checked={1}
            >
                <div className="logo flex-shrink-0" bis_skin_checked={1}>
                    <a href="/" className="logo-default">
                        <img
                            style={{ width: "50%" }}
                            className="text-center img-fluid"
                            src="https://indiadhaniservice.co.in/upload/admin_images/2024-11-20loo.png"
                        />{" "}
                        {/*<img src="https://indiadhaniservice.co.in/backend/images/logo.png" alt="logo">*/}
                    </a>
                </div>
                <div
                    className="header_right_part d-flex align-items-center justify-content-between gap-lg-5"
                    bis_skin_checked={1}
                >
                    <div className="mainnav d-none d-lg-block" bis_skin_checked={1}>
                        <ul className="main-menu">
                            <li className="menu-item active- active">
                                <a href="/" id="">
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li className="menu-item ">
                                <a href="/queries" id="">
                                    <span>Queries</span>
                                </a>
                            </li>
                            {isAdmin && <li className="menu-item ">
                                <a href="/users" id="">
                                    <span>Users</span>
                                </a>
                            </li>}
                            {/*<li class="menu-item menu-item-has-children"><a href="#"><span>Services</span></a>
                        <ul class="sub-menu" style="background: #ffff;">
                                      <li><a href="https://indiadhaniservice.co.in/service/Personal-Loan">Personal Loan</a></li>
          <li><a href="https://indiadhaniservice.co.in/service/Business-Loan">Business Loan</a></li>
          <li><a href="https://indiadhaniservice.co.in/service/Home-Loan">Home Loan</a></li>
          <li><a href="https://indiadhaniservice.co.in/service/Gold-Loan">Gold Loan</a></li>
          <li><a href="https://indiadhaniservice.co.in/service/Credit-Cards">Credit Cards</a></li>
          <li><a href="https://indiadhaniservice.co.in/service/Saving-Bank-Account">Saving Bank Account</a></li>
          <li><a href="https://indiadhaniservice.co.in/service/Track-Application">Track Application</a></li>
          <li><a href="https://indiadhaniservice.co.in/service/Free-Credit-Score">Free Credit Score</a></li>
                               
                        </ul>
                    </li>*/}
                            {isAdmin && <li className="menu-item">
                                <a href="/profile" id="">
                                    <span>Profile</span>
                                </a>
                            </li>}
                            <li className="menu-item ">
                                <a href="#" id="">
                                    <span>Change Password</span>
                                </a>
                            </li>
                            <li className="menu-item ">
                                <a href="#" id="">
                                    <span>Settings</span>
                                </a>
                            </li>
                            <li className="menu-item ">
                                <a onClick={() => signOut(auth)} id="">
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="btn-part d-flex align-items-center gap-4"
                        bis_skin_checked={1}
                    >
                        {/* Mobile Responsive Menu Toggle Button */}
                        <button onClick={toggleMobileNave} type="button" className="mr-menu_toggle d-lg-none">
                            <i className="bi bi-list" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    </>
}


export default Navbar;