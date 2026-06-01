'use client';

import CalendarPage from "@/app/components/CalendarPage";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import About from "@/app/components/About";
import Hero from "@/app/components/Hero";
import Services from "@/app/components/Services";
import Gallery from "@/app/components/Gallery";
import PrestationForm from "@/app/components/PrestationForm";
import FAQ from "@/app/components/FAQ";

import { useState } from 'react';

export default function Home() {
    const [isFAQOpen, setIsFAQOpen] = useState(false);

    return (
        <>
            <Header onContactClick={() => setIsFAQOpen(true)} />
            <main id="top">
                <Hero onContactClick={() => setIsFAQOpen(true)} />
                <About/>
                <Gallery/>
                <Services/>
                <FAQ isContactFormOpen={isFAQOpen} setIsContactFormOpen={setIsFAQOpen} />
                <PrestationForm/>
            </main>
            {/*            insta tiktok            tel email adresse            tous droit reservé*/}
            <Footer/>
        </>
    );
}
