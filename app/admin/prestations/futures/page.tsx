import {auth} from "@/auth";
import PrestationsAdminPage from "@/app/admin/PrestationsAdminPage";
import {redirect} from "next/navigation";

export default async function PrestationsFuturesPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    return (
        <PrestationsAdminPage showComposer={false} sections={["futures"]} />
    );
}
