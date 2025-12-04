"use client";

import {useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {EventContentArg, EventInput} from "@fullcalendar/core";
import {supabase_client} from "@/lib/supabase_client";
import styles from "../styles/CalendarPage.module.css";
import {useRouter} from "next/navigation";
import {FILTER_PRESTATION_CALENDAR, ANIMATION_ONCE} from "@/app/config/config";
import {motion} from "framer-motion";

export default function CalendarPage() {

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


    const [events, setEvents] = useState<EventInput[]>([]);

    const router = useRouter();

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
            return;
        }

        router.push(`/prestation-form?date=${dateStr}`);
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
                // Utiliser le libellé lisible via TYPE_LABEL_TO_VALUE pour l'affichage
                const mappedLabel = ev?.type ? (TYPE_LABEL_TO_VALUE[ev.type] ?? ev.type) : undefined;
                const title = mappedLabel ?? "Prestation";

                const eventData: EventInput = {
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


    function renderEventContent(eventInfo: EventContentArg) {
        // const {extendedProps} = eventInfo.event;
        return (
            <div className={styles.eventContent}>
                <div className={styles.eventTime}>
                    <strong>{eventInfo.timeText}</strong>
                </div>
                <div className={styles.eventTitle}>
                    {truncateTitle(eventInfo.event.title ?? "", 15)}
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
            <motion.h1
                className={styles.calendarTitle}
                variants={{
                    hidden: {opacity: 0, y: 30},
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {duration: 0.6, delay: 0.15, ease: "easeOut"},
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.3}}
            >
Demande de Prestation            </motion.h1>

            <motion.p
                className={styles.calendarIntro}
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
            >
                Cliquez sur un jour disponible pour demander une prestation.
            </motion.p>

            <motion.div
                className={styles.container}
                variants={{
                    hidden: {opacity: 0, y: 30},
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {duration: 0.6, delay: 0.25, ease: "easeOut"},
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{once: ANIMATION_ONCE, amount: 0.2}}
            >

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
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (info.date >= today) {
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
            </motion.div>
        </div>
    );
}
