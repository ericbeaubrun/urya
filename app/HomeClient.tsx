'use client';

import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Gallery from "@/app/components/Gallery";
import Services from "@/app/components/Services";
import Testimonials from "@/app/components/Testimonials";
import FAQ from "@/app/components/FAQ";
import PrestationForm from "@/app/components/PrestationForm";
import Footer from "@/app/components/Footer";
import StickyCta from "@/app/components/StickyCta";
import { useState } from 'react';

export default function HomeClient() {
    const [isFAQOpen, setIsFAQOpen] = useState(false);

    return (
        <>
            <Header onContactClick={() => setIsFAQOpen(true)} />
            <main id="top">
                <Hero />
                <About/>
                <Gallery/>
                <Services/>
                {/* Les avis suivent immédiatement les tarifs : c'est au moment
                    où le visiteur voit le prix qu'il cherche à savoir ce que
                    d'autres en ont eu. */}
                <Testimonials/>
                <FAQ isContactFormOpen={isFAQOpen} setIsContactFormOpen={setIsFAQOpen} />
                <PrestationForm/>
            </main>
            <Footer/>
            <StickyCta/>
        </>
    );
}
