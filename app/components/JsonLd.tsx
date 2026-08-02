/**
 * Injecte un bloc de données structurées.
 *
 * Composant serveur volontairement : le JSON-LD doit être présent dans le HTML
 * initial, un balisage ajouté après hydratation n'étant pas garanti d'être vu
 * par les crawlers.
 *
 * `JSON.stringify` est échappé sur `<` : sans cela, une chaîne éditée depuis
 * l'admin contenant `</script>` refermerait la balise et injecterait du HTML
 * arbitraire dans la page.
 */
export default function JsonLd({data}: { data: unknown }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    );
}
