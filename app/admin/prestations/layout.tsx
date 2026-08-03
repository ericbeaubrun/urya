import React from "react";
import PrestationsTabs from "./PrestationsTabs";

export default function PrestationsLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <PrestationsTabs/>
            {children}
        </>
    );
}
