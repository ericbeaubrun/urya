import {redirect} from "next/navigation";

// Section « Gestion des prestations » : l'onglet « À venir » est l'affichage
// par défaut.
export default function PrestationsIndexPage() {
    redirect("/admin/prestations/futures");
}
