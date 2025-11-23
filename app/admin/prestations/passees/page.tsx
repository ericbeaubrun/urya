import {auth} from "@/auth";
import PrestationsAdminPage from "@/app/admin/PrestationsAdminPage";
import {redirect} from "next/navigation";

export default async function PrestationsPasseesPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    return (
        // Liste des passées uniquement
        <PrestationsAdminPage showComposer={false} sections={["passees"]} />
    );
}
