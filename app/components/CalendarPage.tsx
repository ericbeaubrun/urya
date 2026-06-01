"use client";

import styles from "./CalendarPage.module.css";
import { useRouter } from "next/navigation";
import { ANIMATION_ONCE } from "@/app/config";
import { motion } from "framer-motion";
import CalendarPicker from "./CalendarPicker";

export default function CalendarPage() {
    const router = useRouter();

    function handleDateSelect(dateStr: string) {
        router.push(`/prestation-form?date=${dateStr}`);
    }

    return (
        <div className={styles.wrapper}>
            <motion.h2
                className={styles.calendarTitle}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, delay: 0.15, ease: "easeOut" },
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.3 }}
            >
                Demande de Prestation
            </motion.h2>

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
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, delay: 0.25, ease: "easeOut" },
                    },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: ANIMATION_ONCE, amount: 0.2 }}
            >
                <CalendarPicker onDateSelect={handleDateSelect} />
            </motion.div>
        </div>
    );
}
