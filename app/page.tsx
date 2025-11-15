import CalendarPage from "@/app/components/CalendarPage";
import Hero from "@/app/components/Hero";
import Prestations from "@/app/components/Prestations";
import SocialMediaShowcase from "@/app/components/SocialMediaShowcase";
import ContactForm from "@/app/components/ContactForm";
import StatsSection from "@/app/components/StatsSection";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Home() {
    return (
        <>
            <Header/>
            <main id="top">
                <section id="hero" aria-label="Section héro">
                    <Hero/>
                </section>

                <section id="stats" aria-label="Section stats">
                    <StatsSection/>
                </section>

                <section id="prestations" aria-label="Section prestations">
                    <Prestations/> {/* >> PrestationForm */}
                </section>

                <section id="calendrier" aria-label="Section calendrier">
                    <CalendarPage/>
                </section>

                {/*<section id="reseaux" aria-label="Section héro">*/}
                {/*    <SocialMediaShowcase/> /!* >> InstagramEmbed + TikTokEmbed *!/*/}
                {/*</section>*/}

                <section id="contact" aria-label="Section contact">
                    <ContactForm/>
                </section>
            </main>
            <Footer/>
        </>
    );
}
