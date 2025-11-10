"use client";

import {useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {supabase_client} from "@/lib/supabase_client";
import styles from "./CalendarPage.module.css";

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        async function loadEvents() {
            const {data, error} = await supabase_client
                .from("public_prestations_calendar")
                .select("*");

            if (error) {
                console.error("Erreur lors du chargement des événements:", error);
                return;
            }

            // ✅ On filtre ici les prestations à ignorer
            const filteredData = (data || []).filter(
                (ev) => ev.statut !== "en_attente" && ev.statut !== "annulee"
            );

            const formattedEvents = (data || []).map((ev: any) => {
                const title = ev.type ? ev.type : "Prestation";

                const eventData: any = {
                    id: ev.id,
                    title: title,
                    backgroundColor: getColorByStatus(ev.statut),
                    borderColor: getColorByStatus(ev.statut),
                    extendedProps: {
                        type: ev.type,
                        statut: ev.statut,
                        heure_debut: ev.heure_debut,
                        heure_fin: ev.heure_fin,
                        date_debut: ev.date_debut,
                        date_fin: ev.date_fin
                    }
                };

                // ---------------- LOGIQUE DE DÉTERMINATION DES DATES ----------------

                // 1) Si on a date_debut + date_fin → affichage multi-jours normal
                if (ev.date_debut && ev.date_fin) {
                    eventData.start = `${ev.date_debut}T${ev.heure_debut ?? "00:00:00"}`;
                    eventData.end   = `${ev.date_fin}T${ev.heure_fin ?? "23:59:59"}`;
                }
                // 2) Si on a date_debut mais pas de date_fin → cas multi-jour potentiel via heures
                else if (ev.date_debut && !ev.date_fin && ev.heure_debut && ev.heure_fin) {
                    const startDate = new Date(`${ev.date_debut}T${ev.heure_debut}`);
                    const endDate   = new Date(`${ev.date_debut}T${ev.heure_fin}`);

                    // Si l'heure de fin est plus petite → cela veut dire que l'événement passe minuit
                    if (endDate <= startDate) {
                        endDate.setDate(endDate.getDate() + 1); // Ajoute 1 jour
                    }

                    eventData.start = startDate.toISOString();
                    eventData.end   = endDate.toISOString();
                }
                // 3) Si aucune heure → événement journée entière
                // else if (ev.date_debut && !ev.heure_debut) {
                //     eventData.start = ev.date_debut;
                //     eventData.allDay = true;
                // }
                else if (ev.date_debut && !ev.heure_debut) {
                    eventData.start = `${ev.date_debut}T00:00:00`;
                    eventData.end   = `${ev.date_debut}T23:59:59`;
                }

                // --------------------------------------------------------------------

                return eventData;
            });
            setEvents(formattedEvents);
        }

        loadEvents();
    }, []);

    function getColorByStatus(statut: string) {
        switch (statut) {
            case "confirmee":
                return "#10b981"; // vert
            case "terminee":
                return "#6366f1"; // bleu
            default:
                return "#6b7280"; // gris
        }
    }

    function renderEventContent(eventInfo: any) {
        const {extendedProps} = eventInfo.event;
        return (
            <div className={styles.eventContent}>
                <div className={styles.eventTime}>
                    <strong>{eventInfo.timeText}</strong>
                </div>
                <div className={styles.eventTitle}>
                    {eventInfo.event.title}
                </div>
                {extendedProps.lieu && (
                    <div className={styles.eventLocation}>
                        📍 {extendedProps.lieu}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Calendrier des prestations</h1>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                // initialView="timeGridWeek"
                headerToolbar={{
                    // left: "prev,next today",
                    center: "title",
                    // right: "dayGridMonth,timeGridWeek,timeGridDay"
                }}

                dateClick={(info) => {
                    handleDateClick(info.dateStr)
                }}

                events={events}

                displayEventEnd={true}
                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false // Choisir false pour format 24h
                }}


                height="auto"
                locale="fr"
                // slotMinTime="06:00:00"
                // slotMaxTime="22:00:00"
                dayCellClassNames={(arg) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (arg.date < today) {
                        return styles.pastDay;
                    }
                    return "";
                }}
                allDaySlot={false}
                nowIndicator={true}
                eventContent={renderEventContent}
                buttonText={{
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour"
                }}
            />
        </div>
    );
}
