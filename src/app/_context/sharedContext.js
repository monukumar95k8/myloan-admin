"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Router } from "next/navigation";

const sharedContext = createContext();

export const SharedProvider = ({ children }) => {
    const [hideNavbar, setHideNavbar] = useState(false);

    let params = usePathname();
    useEffect(() => {
        if (params == "/login") {
            setHideNavbar(true);
        } else {
            setHideNavbar(false);
        }
    }, [Router])
    return (
        <sharedContext.Provider value={{ hideNavbar, setHideNavbar }} >
            {children}
        </sharedContext.Provider>
    )
}

export const useSharedContext = () => useContext(sharedContext);