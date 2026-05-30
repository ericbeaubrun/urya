import CalendarPage from "@/app/components/CalendarPage";
import ContactForm from "@/app/components/ContactForm";
import Header from "@/app/components/Header";

export default function Home() {
    return (
        <>
            <Header/>
            <main id="top">

                <section id="calendrier" aria-label="Section calendrier">
                    <CalendarPage/>
                </section>

                <section id="contact" aria-label="Section contact">
                    <ContactForm/>
                </section>
            </main>
        </>
    );
}
