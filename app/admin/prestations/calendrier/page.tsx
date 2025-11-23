import {auth} from "@/auth";
import {redirect} from "next/navigation";
import CalendarAdmin from "./CalendarAdmin";

export default async function AdminPrestationsCalendrierPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    return <CalendarAdmin/>;
}
