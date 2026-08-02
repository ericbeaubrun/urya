import {redirect} from "next/navigation";

// L'accès est contrôlé en amont : `proxy.ts` filtre /admin/*, puis
// `app/admin/layout.tsx` revérifie la session avant de rendre quoi que ce soit.
export default function AdminPage() {
    redirect("/admin/prestations/futures");
}
