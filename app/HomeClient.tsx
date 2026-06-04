'use client';

import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Gallery from "@/app/components/Gallery";
import Services from "@/app/components/Services";
import FAQ from "@/app/components/FAQ";
import PrestationForm from "@/app/components/PrestationForm";
import Footer from "@/app/components/Footer";
import { useState } from 'react';

export default function HomeClient() {
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
            <Footer/>
        </>
    );
}
