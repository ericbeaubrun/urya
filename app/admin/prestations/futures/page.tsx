import PrestationsAdminPage from "@/app/admin/PrestationsAdminPage";

// L'accès est contrôlé en amont : `proxy.ts` filtre /admin/*, puis
// `app/admin/layout.tsx` revérifie la session avant de rendre quoi que ce soit.
export default function PrestationsFuturesPage() {
    return <PrestationsAdminPage showComposer={false} sections={["futures"]}/>;
}
