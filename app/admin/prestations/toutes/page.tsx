import PrestationsAdminPage from "@/app/admin/PrestationsAdminPage";

export default function PrestationsToutesPage() {
    return <PrestationsAdminPage showComposer={false} sections={["futures", "passees"]}/>;
}
