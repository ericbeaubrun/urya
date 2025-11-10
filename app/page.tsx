import CalendarPage from "@/app/components/CalendarPage";
import Hero from "@/app/components/Hero";
import Prestations from "@/app/components/Prestations";
import InstagramEmbed from "@/app/components/InstagramEmbed";
import TikTokEmbed from "@/app/components/TikTokEmbed";
import PrestationForm from "@/app/components/PrestationForm";

export default function Home() {
    return (
        <div>
            <main>
                <Hero/>
                {/*<Prestations/>*/}
                <Prestations/>
                {/*<InstagramEmbed instagramUrl={"https://www.instagram.com/reel/DO3VFXCCAvF/"}/>*/}
                {/*<TikTokEmbed tiktokUrl="https://www.tiktok.com/@djxuryax77/video/7566774986745122070" />*/}
                {/*<PrestationForm/>*/}
                <CalendarPage/>
            </main>
        </div>
    );
}
