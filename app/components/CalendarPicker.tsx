"use client";

import {useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {EventContentArg, EventInput} from "@fullcalendar/core";
import {supabase_client} from "@/lib/supabase_client";
import {FILTER_PRESTATION_CALENDAR} from "@/app/config";
import styles from "./CalendarPicker.module.css";

interface CalendarPickerProps {
    onDateSelect: (dateStr: string) => void;
    initialDate?: string;
}

const TYPE_LABEL_TO_VALUE: Record<string, string> = {
    mariage: "Mariage",
    anniversaire: "Anniversaire",
    soiree_privee: "Soirée privée",
    evenement_corporate: "Évènement",
    club: "Club",
    festival: "Festival",
    concert: "Concert",
    seminaire: "Séminaire",
    autre: "Évènement spécial",
};

export default function CalendarPicker({onDateSelect, initialDate}: CalendarPickerProps) {
    const [events, setEvents] = useState<EventInput[]>([]);

    function truncateTitle(title: string, max: number = 15) {
        if (!title) return "";
        return title.length > max ? `${title.slice(0, max)}...` : title;
    }

    function handleDateClick(dateStr: string) {
        const clickedDate = new Date(dateStr);
        const today = new Date();

        clickedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (clickedDate < today) {
            return;
        }

        onDateSelect(dateStr);
    }

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

            const formattedEvents: EventInput[] = (data || []).map((ev: any) => {
                const mappedLabel = ev?.type ? (TYPE_LABEL_TO_VALUE[ev.type] ?? ev.type) : undefined;
                const title = mappedLabel ?? "Prestation";

                const eventData: EventInput = {
                    id: ev.id,
                    title: title,
                    extendedProps: {
                        type: ev.type,
                        statut: ev.statut,
                        heure_debut: ev.heure_debut,
                        heure_fin: ev.heure_fin,
                        date_debut: ev.date_debut,
                        date_fin: ev.date_fin
                    }
                };

                if (ev.date_debut && ev.date_fin) {
                    eventData.start = `${ev.date_debut}T${ev.heure_debut ?? "00:00:00"}`;
                    eventData.end = `${ev.date_fin}T${ev.heure_fin ?? "23:59:59"}`;
                } else if (ev.date_debut && !ev.date_fin && ev.heure_debut && ev.heure_fin) {
                    const startDate = new Date(`${ev.date_debut}T${ev.heure_debut}`);
                    const endDate = new Date(`${ev.date_debut}T${ev.heure_fin}`);

                    if (endDate <= startDate) {
                        endDate.setDate(endDate.getDate() + 1);
                    }

                    eventData.start = startDate.toISOString();
                    eventData.end = endDate.toISOString();
                } else if (ev.date_debut && !ev.heure_debut) {
                    eventData.start = `${ev.date_debut}T00:00:00`;
                    eventData.end = `${ev.date_debut}T23:59:59`;
                }

                return eventData;
            });
            setEvents(formattedEvents);
        }

        loadEvents();
    }, []);

    function renderEventContent(eventInfo: EventContentArg) {
        return (
            <div className={styles.eventContent}>
                <div className={styles.eventTime}>
                    <strong>{eventInfo.timeText}</strong>
                </div>
                <div className={styles.eventTitle}>
                    {truncateTitle(eventInfo.event.title ?? "", 15)}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: "today",
                    center: "title",
                    right: "prev,next"
                }}
                dateClick={(info) => {
                    handleDateClick(info.dateStr)
                }}
                initialDate={initialDate}
                events={events}
                eventClassNames={(arg) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const end = arg.event.end ?? arg.event.start;
                    const eventEnd = end ? new Date(end) : null;

                    if (eventEnd && eventEnd < today) {
                        return ["past-event"];
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
                // height="auto"
                height="parent"

                contentHeight="auto"
                dayMaxEventRows={false}
                dayMaxEvents={false}
                locale="fr"
                dayCellClassNames={(arg) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (arg.date < today) {
                        return `${styles.pastDay}`;
                    }
                    return `${styles.futureDay}`;
                }}
                dayCellDidMount={(info) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (info.date >= today) {
                        info.el.setAttribute("title", "Choisir cette date");
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
    );
}
