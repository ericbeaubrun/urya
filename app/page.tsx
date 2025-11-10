import CalendarPage from "@/app/components/CalendarPage";
import Hero from "@/app/components/Hero";
import Prestations from "@/app/components/Prestations";
import InstagramEmbed from "@/app/components/InstagramEmbed";
import TikTokEmbed from "@/app/components/TikTokEmbed";
import PrestationForm from "@/app/prestation-form/PrestationForm";
import SocialMediaShowcase from "@/app/components/SocialMediaShowcase";
import ContactForm from "@/app/components/ContactForm";

export default function Home() {
    return (
        <div>
            <main>
                <Hero/>
                {/*<Prestations/>*/}

                <SocialMediaShowcase/>
                {/*<InstagramEmbed instagramUrl={"https://www.instagram.com/reel/DO3VFXCCAvF/"}/>*/}
                {/*<TikTokEmbed tiktokUrl="https://www.tiktok.com/@djxuryax77/video/7566774986745122070" />*/}

                <Prestations/>
                {/*<PrestationForm/>*/}

                <CalendarPage/>

                <ContactForm/>

            </main>
        </div>
    );
}
