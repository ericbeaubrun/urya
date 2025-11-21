"use client";

import {useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {supabase_client} from "@/lib/supabase_client";
import styles from "../styles/CalendarPage.module.css";
import {useRouter} from "next/navigation";
import {FILTER_PRESTATION_CALENDAR} from "@/app/config/config";

export default function CalendarPage() {
    const [events, setEvents] = useState([]);

    const router = useRouter();

    // Tronque les titres d'événements au-delà de 7 caractères et ajoute '...'
    function truncateTitle(title: string, max: number = 7) {
        if (!title) return "";
        return title.length > max ? `${title.slice(0, max)}...` : title;
    }

    function handleDateClick(dateStr: string) {
        const clickedDate = new Date(dateStr);
        const today = new Date();

        clickedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (clickedDate < today) {
            console.log("Jour passé !");
            return;
        }

        router.push(`/prestation-form?date=${dateStr}`);
    }

    // function getColorByStatus(statut: string) {
    //     switch (statut) {
    //         case "confirmee":
    //             return "#10b981"; // vert
    //         case "terminee":
    //             return "#6366f1"; // bleu
    //         default:
    //             return "#6b7280"; // gris
    //     }
    // }

    useEffect(() => {
        async function loadEvents() {
            let {data, error} = await supabase_client
                .from("public_prestations_calendar")
                .select("*");


            if (error) {
                console.error("Erreur lors du chargement des événements:", error);
                return;
            }

            if (FILTER_PRESTATION_CALENDAR) {
                data = (data || []).filter(
                    (ev) => ev.statut !== "en_attente" && ev.statut !== "annulee"
                );
            }


            const formattedEvents = (data || []).map((ev: any) => {
                const title = ev.type ? ev.type : "Prestation";

                const eventData: any = {
                    id: ev.id,
                    title: title,
                    // backgroundColor: getColorByStatus(ev.statut),
                    // borderColor: getColorByStatus(ev.statut),
                    extendedProps: {
                        type: ev.type,
                        statut: ev.statut,
                        heure_debut: ev.heure_debut,
                        heure_fin: ev.heure_fin,
                        date_debut: ev.date_debut,
                        date_fin: ev.date_fin
                    }
                };

                // 1) Si on a date_debut + date_fin → affichage multi-jours normal
                if (ev.date_debut && ev.date_fin) {
                    eventData.start = `${ev.date_debut}T${ev.heure_debut ?? "00:00:00"}`;
                    eventData.end = `${ev.date_fin}T${ev.heure_fin ?? "23:59:59"}`;
                }
                // 2) Si on a date_debut mais pas de date_fin → cas multi-jour potentiel via heures
                else if (ev.date_debut && !ev.date_fin && ev.heure_debut && ev.heure_fin) {
                    const startDate = new Date(`${ev.date_debut}T${ev.heure_debut}`);
                    const endDate = new Date(`${ev.date_debut}T${ev.heure_fin}`);

                    // Si l'heure de fin est plus petite → cela veut dire que l'événement passe minuit
                    if (endDate <= startDate) {
                        endDate.setDate(endDate.getDate() + 1); // Ajoute 1 jour
                    }

                    eventData.start = startDate.toISOString();
                    eventData.end = endDate.toISOString();
                }
                    // 3) Si aucune heure → événement journée entière
                    // else if (ev.date_debut && !ev.heure_debut) {
                    //     eventData.start = ev.date_debut;
                    //     eventData.allDay = true;
                // }
                else if (ev.date_debut && !ev.heure_debut) {
                    eventData.start = `${ev.date_debut}T00:00:00`;
                    eventData.end = `${ev.date_debut}T23:59:59`;
                }

                // --------------------------------------------------------------------

                return eventData;
            });
            setEvents(formattedEvents);
        }

        loadEvents();
    }, []);


    function renderEventContent(eventInfo: any) {
        // const {extendedProps} = eventInfo.event;
        return (
            <div className={styles.eventContent}>
                <div className={styles.eventTime}>
                    <strong>{eventInfo.timeText}</strong>
                </div>
                <div className={styles.eventTitle}>
                    {truncateTitle(eventInfo.event.title, 15)}
                </div>
                {/*{extendedProps.lieu && (*/}
                {/*    <div className={styles.eventLocation}>*/}
                {/*        📍 {extendedProps.lieu}*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.calendarTitle}>Choisir une date de prestation</h1>

            <div className={styles.container}>

                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    // initialView="timeGridWeek"
                    headerToolbar={{
                        left: "today",
                        center: "title",
                        right: "prev,next"
                        // left: "today"
                        // right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }}

                    dateClick={(info) => {
                        handleDateClick(info.dateStr)
                    }}

                    events={events}
                    eventClassNames={(arg) => {
                        // Marquer les événements passés en rouge
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // Utiliser la fin de l'événement s'il existe, sinon le début
                        const end = arg.event.end ?? arg.event.start;
                        const eventEnd = end ? new Date(end) : null;

                        if (eventEnd && eventEnd < today) {
                            return ["past-event"]; // classe globale via CSS module
                        }
                        return [];
                    }}
                    displayEventEnd={true}
                    eventTimeFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    }}
                    firstDay={1}
                    // contentHeight="auto"
                    // height="10%"
                    height="auto"
                    contentHeight="auto"
                    dayMaxEventRows={false}
                    dayMaxEvents={false}
                    // contentHe
                    // ight={"550px"}
                    locale="fr"
                    // slotMinTime="06:00:00"
                    // slotMaxTime="22:00:00"
                    dayCellClassNames={(arg) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (arg.date < today) {
                            return `${styles.pastDay} ${styles.dayHover}`;
                            // return `${styles.pastDay}`;
                        }
                        return `${styles.dayHover}`;
                    }}

                    dayCellDidMount={(info) => {
                        if (info.date >= new Date().setHours(0, 0, 0, 0)) {
                            info.el.setAttribute("title", "Demander une prestation");
                        }
                    }}

                    allDaySlot={false}
                    nowIndicator={true}
                    eventContent={renderEventContent}
                    buttonText={{
                        today: "aujourd'hui",
                        month: "Mois",
                        week: "Semaine",
                        day: "Jour"
                    }}
                />
            </div>
        </div>
    );
}
