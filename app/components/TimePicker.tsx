"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import styles from "./TimePicker.module.css";

interface TimePickerProps {
    onTimeSelect: (timeStr: string) => void;
    initialTime?: string;
}

export default function TimePicker({ onTimeSelect, initialTime }: TimePickerProps) {
    const [selectedTime, setSelectedTime] = useState(initialTime || "");

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minutes = ["00", "15", "30", "45"];

    const currentHour = selectedTime.split(":")[0];
    const currentMinute = selectedTime.split(":")[1];

    const handleSelect = (h: string, m: string) => {
        const time = `${h}:${m}`;
        setSelectedTime(time);
    };

    return (
        <div className={styles.container}>
            <div className={styles.pickerGrid}>
                <div className={styles.column}>
                    <div className={styles.columnTitle}>Heures</div>
                    <div className={styles.scrollArea}>
                        {hours.map((h) => (
                            <button
                                key={h}
                                type="button"
                                className={`${styles.timeButton} ${currentHour === h ? styles.active : ""}`}
                                onClick={() => handleSelect(h, currentMinute || "00")}
                            >
                                {h}h
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.columnTitle}>Minutes</div>
                    <div className={styles.scrollArea}>
                        {minutes.map((m) => (
                            <button
                                key={m}
                                type="button"
                                className={`${styles.timeButton} ${currentMinute === m ? styles.active : ""}`}
                                onClick={() => handleSelect(currentHour || "12", m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className={styles.footer}>
                <div className={styles.preview}>
                    <Clock size={16} />
                    <span>{selectedTime || "--:--"}</span>
                </div>
                <button 
                    type="button" 
                    className={styles.validateButton}
                    onClick={() => {
                        if (selectedTime) {
                            onTimeSelect(selectedTime);
                        }
                    }}
                    disabled={!selectedTime}
                >
                    Valider
                </button>
            </div>
        </div>
    );
}
