"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {supabase_client} from "@/lib/supabase_client";
import styles from "@/app/components/CalendarPage.module.css";

type FC = any;

export default function CalendarAdmin() {
    const [events, setEvents] = useState<any[]>([]);
    const calendarRef = useRef<FC | null>(null);

    // Déterminer une vue initiale en fonction de la largeur
    const initialView = useMemo(() => {
        if (typeof window === "undefined") return "dayGridMonth";
        const w = window.innerWidth;
        if (w < 600) return "timeGridDay";
        if (w < 1024) return "timeGridWeek";
        return "dayGridMonth";
    }, []);

    useEffect(() => {
        async function loadEvents() {
            const { data, error } = await supabase_client
                .from("public_prestations_calendar")
                .select("*");

            if (error) {
                console.error("Erreur chargement calendrier admin:", error);
                return;
            }

            const formatted = (data || []).map((ev: any) => {
                const eventData: any = {
                    id: ev.id,
                    title: ev.type || "Prestation",
                    extendedProps: {
                        type: ev.type,
                        statut: ev.statut,
                        heure_debut: ev.heure_debut,
                        heure_fin: ev.heure_fin,
                        date_debut: ev.date_debut,
                        date_fin: ev.date_fin,
                        lieu: ev.lieu || null,
                    },
                };

                if (ev.date_debut && ev.date_fin) {
                    eventData.start = `${ev.date_debut}T${ev.heure_debut ?? "00:00:00"}`;
                    eventData.end = `${ev.date_fin}T${ev.heure_fin ?? "23:59:59"}`;
                } else if (ev.date_debut && !ev.date_fin && ev.heure_debut && ev.heure_fin) {
                    const startDate = new Date(`${ev.date_debut}T${ev.heure_debut}`);
                    const endDate = new Date(`${ev.date_debut}T${ev.heure_fin}`);
                    if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);
                    eventData.start = startDate.toISOString();
                    eventData.end = endDate.toISOString();
                } else if (ev.date_debut && !ev.heure_debut) {
                    eventData.start = `${ev.date_debut}T00:00:00`;
                    eventData.end = `${ev.date_debut}T23:59:59`;
                }

                return eventData;
            });

            setEvents(formatted);
        }

        loadEvents();
    }, []);

    function renderEventContent(eventInfo: any) {
        return (
            <div className={styles.eventContent}>
                <div className={styles.eventTime}>
                    <strong>{eventInfo.timeText}</strong>
                </div>
                <div className={styles.eventTitle}>
                    {eventInfo.event.title}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/*<h1 className={styles.calendarTitle}>Calendrier des prestations (admin)</h1>*/}
            <div className={styles.container}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={initialView}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={events}
                    eventClassNames={(arg) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const end = arg.event.end ?? arg.event.start;
                        const eventEnd = end ? new Date(end) : null;
                        if (eventEnd && eventEnd < today) return ["past-event"]; // gris selon CSS
                        return [];
                    }}
                    displayEventEnd={true}
                    eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                    firstDay={1}
                    height="auto"
                    contentHeight="auto"
                    dayMaxEventRows={false}
                    dayMaxEvents={false}
                    locale="fr"
                    allDaySlot={false}
                    nowIndicator={true}
                    eventContent={renderEventContent}
                    buttonText={{ today: "aujourd'hui", month: "Mois", week: "Semaine", day: "Jour" }}
                />
            </div>
        </div>
    );
}
