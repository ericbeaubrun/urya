import CalendarPage from "@/app/CalendarPage";
import Hero from "@/app/Hero";
import Prestations from "@/app/Prestations";
import InstagramEmbed from "@/app/InstagramEmbed";
import TikTokEmbed from "@/app/TikTokEmbed";

export default function Home() {
    return (
        <div>
            <main>
                <Hero/>
                <InstagramEmbed instagramUrl={"https://www.instagram.com/reel/DO3VFXCCAvF/"}/>
                <TikTokEmbed tiktokUrl="https://www.tiktok.com/@djxuryax77/video/7566774986745122070" />
                <Prestations/>
                <CalendarPage/>
            </main>
        </div>
    );
}
