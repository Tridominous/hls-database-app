"use client";

import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";

interface ThemeContextType {
   mode: string;
   setMode: (mode: string) => void; 
}
// set ThemecontextType of type ThemeContextType or undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: {
    children: ReactNode
}) {
    const [mode, setMode] = useState("");

    // Handle changing theme modes
    const handleThemeChange =() => {
        if(localStorage.theme === 'dark' || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark").matches)){
            setMode("dark");
            document.documentElement.classList.add("dark")
        } else {
            setMode("light");
            document.documentElement.classList.remove("dark")
        }
    }

    useEffect(() => {
        handleThemeChange();
    }, [mode]);

    return (
        <ThemeContext.Provider value={{mode, setMode}}>
            {children}
        </ThemeContext.Provider>
    )
}

// function to easily use defined theme
export function useTheme () {
    const context = useContext(ThemeContext);

    if(context === undefined){
        throw new Error("useTheme must be used within ThemeProvider")
    }

    return context;
}
