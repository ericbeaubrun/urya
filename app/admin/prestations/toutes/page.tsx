import {auth} from "@/auth";
import PrestationsAdminPage from "@/app/admin/PrestationsAdminPage";
import {redirect} from "next/navigation";

export default async function PrestationsToutesPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    return (
        // Liste futures + passées, sans formulaire
        <PrestationsAdminPage showComposer={false} sections={["futures", "passees"]} />
    );
}
