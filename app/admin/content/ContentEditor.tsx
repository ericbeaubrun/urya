'use client';

import {useState} from 'react';
import {saveAndRefreshContent} from '@/app/actions/saveContent';
import {refreshSiteContent} from '@/app/actions/content';
import {uploadGalleryImage} from '@/app/actions/gallery';
import {compressImage} from '@/lib/image-compress';
import {ALLOWED_IMAGE_TYPES, MAX_GALLERY_IMAGES} from '@/lib/gallery';
import styles from './ContentEditor.module.css';
import type {GalleryImage, SiteContent, TestimonialItem} from '@/lib/site-content';
import {MAX_TESTIMONIALS} from '@/lib/site-content';

/**
 * Vue indexable du contenu. L'éditeur adresse les champs par chemin de clés
 * (`['hero', 'title', 'text']`), ce que le type structuré `SiteContent` ne
 * permet pas d'exprimer : les casts vers ce type sont donc confinés aux deux
 * fonctions de lecture/écriture ci-dessous, le reste du composant reste typé.
 */
type IndexableContent = Record<string, unknown>;

export default function ContentEditor({initialContent}: { initialContent: SiteContent }) {
    const [content, setContent] = useState<SiteContent>(initialContent || {});
    const [activeTab, setActiveTab] = useState('hero');
    const [saving, setSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleSave = async () => {
        try {
            if (!confirm('Voulez-vous sauvegarder ces modifications et rafraîchir le site ?')) return;

            setSaving(true);
            const result = await saveAndRefreshContent(content);
            setSaving(false);
            // window.location.reload();

            if (result.success) {
                alert(result.message);
                window.location.reload();
            } else {
                alert('Erreur : ' + result.message);
            }
        } catch (e) {
            alert('Erreur lors de la sauvegarde : ' + (e as Error).message);
        }
    };

    const handleRefreshOnly = async () => {
        if (!confirm('Voulez-vous rafraîchir le cache sans sauvegarder ?')) return;
        setRefreshing(true);
        const result = await refreshSiteContent();
        setRefreshing(false);

        if (result.success) {
            window.location.reload();
        } else {
            alert('Erreur : ' + result.message);
        }
    };
    const updateField = (path: string[], value: unknown) => {
        setContent((prev) => {
            const next = {...prev} as IndexableContent;
            let current = next;

            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                const child = current[key];

                current[key] = Array.isArray(child)
                    ? [...child]
                    : {...(child as IndexableContent)};
                current = current[key] as IndexableContent;
            }

            current[path[path.length - 1]] = value;
            return next as SiteContent;
        });
    };

    /** Lit une valeur par chemin et la ramène à une chaîne affichable. */
    const readField = (path: string[]): string => {
        let current: unknown = content;

        for (const key of path) {
            if (current === null || typeof current !== 'object') return '';
            current = (current as IndexableContent)[key];
        }

        return typeof current === 'string' || typeof current === 'number'
            ? String(current)
            : '';
    };

    const renderInput = (label: string, path: string[], type = 'text') => (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>{label}</label>
            <input
                type={type}
                className={styles.input}
                value={readField(path)}
                onChange={(e) => updateField(path, e.target.value)}
            />
        </div>
    );

    const renderTextarea = (label: string, path: string[]) => (
        <div className={styles.fieldGroup}>
            <label className={styles.label}>{label}</label>
            <textarea
                className={styles.textarea}
                value={readField(path)}
                onChange={(e) => updateField(path, e.target.value)}
            />
        </div>
    );

    // Listes éditables, ramenées à un tableau vide quand la section n'a jamais
    // été renseignée. Évite de répéter un `Array.isArray(...)` à chaque usage.
    const heroStats = content.hero?.stats ?? [];
    const aboutDescription = content.about?.description ?? [];
    const aboutTags = content.about?.tags ?? [];
    const aboutContactInfo = content.about?.contactInfo ?? [];
    const serviceItems = content.services?.items ?? [];
    const extraOptionItems = content.services?.extraOptions?.items ?? [];
    const faqItems = content.faq?.items ?? [];
    const prestationSteps = content.prestationForm?.steps ?? [];
    const galleryImages = content.gallery?.images ?? [];
    const testimonials = content.testimonials?.items ?? [];

    const setTestimonials = (items: TestimonialItem[]) =>
        updateField(['testimonials', 'items'], items);

    const updateTestimonial = (index: number, patch: Partial<TestimonialItem>) => {
        setTestimonials(
            testimonials.map((item, i) => (i === index ? {...item, ...patch} : item))
        );
    };

    const moveTestimonial = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= testimonials.length) return;

        const next = [...testimonials];
        [next[index], next[target]] = [next[target], next[index]];
        setTestimonials(next);
    };

    const setGalleryImages = (images: GalleryImage[]) =>
        updateField(['gallery', 'images'], images);

    const updateGalleryImage = (index: number, patch: Partial<GalleryImage>) => {
        setGalleryImages(
            galleryImages.map((image, i) => (i === index ? {...image, ...patch} : image))
        );
    };

    const moveGalleryImage = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= galleryImages.length) return;

        const next = [...galleryImages];
        [next[index], next[target]] = [next[target], next[index]];
        setGalleryImages(next);
    };

    /**
     * Le fichier de stockage n'est pas supprimé ici : le site public le sert
     * encore tant que la sauvegarde n'a pas eu lieu. Le ménage est fait après
     * l'enregistrement, par `pruneGalleryStorage`.
     */
    const removeGalleryImage = (index: number) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    const handleGalleryUpload = async (file: File) => {
        setUploadError(null);

        if (galleryImages.length >= MAX_GALLERY_IMAGES) return;

        setUploading(true);
        try {
            const optimised = await compressImage(file);
            const payload = new FormData();
            payload.append('file', optimised);

            const result = await uploadGalleryImage(payload);

            if (!result.success || !result.url) {
                setUploadError(result.message ?? "L'envoi a échoué.");
                return;
            }

            setGalleryImages([
                ...galleryImages,
                // La première image de la grille est la grande carte : une
                // galerie qui démarre à vide doit rester bien composée sans
                // que l'admin ait à connaître cette règle.
                {src: result.url, alt: '', big: galleryImages.length === 0},
            ]);
        } catch (e) {
            setUploadError((e as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const tabs = [
        {id: 'navigation', label: 'Navigation'},
        {id: 'hero', label: 'Accueil'},
        {id: 'about', label: 'À propos'},
        {id: 'services', label: 'Services'},
        {id: 'gallery', label: 'Galerie'},
        {id: 'testimonials', label: 'Avis'},
        {id: 'faq', label: 'Questions'},
        {id: 'prestation', label: 'Formulaire'},
        {id: 'footer', label: 'Pied de page'},
        {id: 'legal', label: 'Légal'},
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Éditeur de contenu</h1>
                    <p className={styles.subtitle}>Modifiez les textes du site public, puis enregistrez.</p>
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={handleRefreshOnly}
                        disabled={refreshing || saving}
                        className={styles.refreshBtn}
                    >
                        {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || refreshing}
                        className={styles.saveBtn}
                    >
                        {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </div>

            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.section}>
                {activeTab === 'navigation' && (
                    <div className={styles.grid}>
                        {renderInput('Texte du bouton CTA', ['navigation', 'cta'])}
                        {renderInput('Logo (partie 1)', ['navigation', 'logo', 'first'])}
                        {renderInput('Logo (partie 2)', ['navigation', 'logo', 'second'])}
                    </div>
                )}

                {activeTab === 'hero' && (
                    <>
                        <div className={styles.grid}>
                            {renderInput('Ligne 1 du titre', ['hero', 'title', 'line1'])}
                            {renderInput('Titre en gras (Highlight)', ['hero', 'title', 'highlight'])}
                            {renderInput('Ligne 2 du titre', ['hero', 'title', 'line2'])}
                            {renderInput('Statut (Disponibilité)', ['hero', 'status'])}
                        </div>
                        <div className={styles.subSection}>
                            {renderTextarea('Sous-titre 1', ['hero', 'subtitle1'])}
                            {renderTextarea('Sous-titre 2', ['hero', 'subtitle2'])}
                        </div>
                        <div className={styles.grid}>
                            {renderInput('Bouton Primaire', ['hero', 'ctas', 'primary'])}
                            {renderInput('Bouton Secondaire', ['hero', 'ctas', 'secondary'])}
                        </div>
                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Statistiques</h3>
                            {
                                heroStats.map((stat, index) => (
                                    <div key={index} className={styles.listItem}>
                                        <div className={styles.grid}>
                                            {renderInput('Valeur', ['hero', 'stats', index.toString(), 'value'])}
                                            {renderInput('Label', ['hero', 'stats', index.toString(), 'label'])}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {activeTab === 'about' && (
                    <>
                        <div className={`${styles.subSection} ${styles.subSectionFirst}`}>
                            <h3 className={styles.subTitle}>Description</h3>
                            {
                                aboutDescription.map((_, index) => (
                                    <div key={index} className={styles.fieldGroup}>
                  <textarea
                      className={styles.textarea}
                      value={aboutDescription[index]}
                      onChange={(e) => {
                          const newDesc = [...aboutDescription];
                          newDesc[index] = e.target.value;
                          updateField(['about', 'description'], newDesc);
                      }}
                  />
                                    </div>
                                ))}
                        </div>

                        <div className={styles.grid}>
                            {renderInput('Titre (Texte)', ['about', 'title', 'text'])}
                            {renderInput('Titre (Highlight)', ['about', 'title', 'highlight'])}
                        </div>
                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Tags</h3>
                            <div className={styles.stack}>
                                {aboutTags.map((tag, index) => (
                                    <div key={index} className={`${styles.listItem} ${styles.listItemRow}`}>
                                        <input
                                            className={styles.input}
                                            value={tag}
                                            onChange={(e) => {
                                                const newTags = [...aboutTags];
                                                newTags[index] = e.target.value;
                                                updateField(['about', 'tags'], newTags);
                                            }}
                                        />
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => {
                                                const newTags = aboutTags.filter((_, i) => i !== index);
                                                updateField(['about', 'tags'], newTags);
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className={styles.addBtn}
                                    onClick={() => {
                                        const newTags = [...aboutTags, 'Nouveau tag'];
                                        updateField(['about', 'tags'], newTags);
                                    }}
                                >
                                    + Ajouter un tag
                                </button>
                            </div>
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Informations de contact</h3>
                            <div className={styles.grid}>
                                {
                                    aboutContactInfo.map((info, index) => (
                                        <div key={index} className={styles.listItem}>
                                            <span className={styles.itemTitle}>{info.sub}</span>
                                            {renderInput('Label', ['about', 'contactInfo', index.toString(), 'label'])}
                                            {renderInput('Sous-titre', ['about', 'contactInfo', index.toString(), 'sub'])}
                                            {renderInput('Icône (Lucide)', ['about', 'contactInfo', index.toString(), 'icon'])}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'services' && (
                    <>
                        <div className={styles.grid}>
                            {renderInput('Titre (Texte)', ['services', 'title', 'text'])}
                            {renderInput('Titre (Highlight)', ['services', 'title', 'highlight'])}
                        </div>
                        {renderTextarea('Sous-titre', ['services', 'subtitle'])}
                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Prestations</h3>
                            {
                                serviceItems.map((item, index) => (
                                    <div key={index} className={styles.listItem}>
                                        <div className={styles.itemHead}>
                                            <h4 className={styles.itemTitle}>Service #{index + 1}</h4>
                                            <button
                                                className={styles.removeBtn}
                                                onClick={() => {
                                                    if (confirm('Supprimer cette prestation ?')) {
                                                        const newItems = serviceItems.filter((_, i) => i !== index);
                                                        updateField(['services', 'items'], newItems);
                                                    }
                                                }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        <div className={styles.grid}>
                                            {renderInput(`Titre`, ['services', 'items', index.toString(), 'title'])}
                                            {renderInput('Prix', ['services', 'items', index.toString(), 'price'])}
                                        </div>
                                        {renderTextarea('Description', ['services', 'items', index.toString(), 'subtitle'])}
                                        <div className={styles.stack}>
                                            <label className={styles.label}>Inclusions</label>
                                            {(item.inclusions ?? []).map((inclusion, iIndex) => (
                                                <div key={iIndex} className={`${styles.listItem} ${styles.listItemRow}`}>
                                                    <input
                                                        className={styles.input}
                                                        value={inclusion}
                                                        onChange={(e) => {
                                                            const newInclusions = [...(item.inclusions ?? [])];
                                                            newInclusions[iIndex] = e.target.value;
                                                            updateField(['services', 'items', index.toString(), 'inclusions'], newInclusions);
                                                        }}
                                                    />
                                                    <button
                                                        className={styles.removeBtn}
                                                        onClick={() => {
                                                            const newInclusions = (item.inclusions ?? []).filter((_, i) => i !== iIndex);
                                                            updateField(['services', 'items', index.toString(), 'inclusions'], newInclusions);
                                                        }}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className={styles.addBtn}
                                                onClick={() => {
                                                    const newInclusions = [...(item.inclusions || []), 'Nouvelle inclusion'];
                                                    updateField(['services', 'items', index.toString(), 'inclusions'], newInclusions);
                                                }}
                                            >
                                                + Ajouter une inclusion
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            <button
                                className={styles.addBtn}
                                onClick={() => {
                                    const newItem = {
                                        icon: "Sparkles",
                                        image: "/soiree.webp",
                                        price: "À partir de ... €",
                                        title: "Nouveau Service",
                                        subtitle: "Description du service",
                                        inclusions: []
                                    };
                                    const newItems = [...serviceItems, newItem];
                                    updateField(['services', 'items'], newItems);
                                }}
                            >
                                + Ajouter une prestation
                            </button>
                        </div>
                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Options supplémentaires</h3>
                            {renderInput('Titre des options', ['services', 'extraOptions', 'title'])}
                            <div className={styles.stack}>
                                <label className={styles.label}>Liste des options</label>
                                {extraOptionItems.map((item, index) => (
                                    <div key={index} className={`${styles.listItem} ${styles.listItemRow}`}>
                                        <input
                                            className={styles.input}
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...extraOptionItems];
                                                newItems[index] = e.target.value;
                                                updateField(['services', 'extraOptions', 'items'], newItems);
                                            }}
                                        />
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => {
                                                const newItems = extraOptionItems.filter((_, i) => i !== index);
                                                updateField(['services', 'extraOptions', 'items'], newItems);
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className={styles.addBtn}
                                    onClick={() => {
                                        const newItems = [...extraOptionItems, ''];
                                        updateField(['services', 'extraOptions', 'items'], newItems);
                                    }}
                                >
                                    + Ajouter une option
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'gallery' && (
                    <>
                        <div className={styles.grid}>
                            {renderInput('Titre (Texte)', ['gallery', 'title', 'text'])}
                            {renderInput('Titre (Highlight)', ['gallery', 'title', 'highlight'])}
                        </div>
                        {renderTextarea('Sous-titre', ['gallery', 'subtitle'])}

                        <div className={styles.subSection}>
                            <div className={styles.itemHead}>
                                <h3 className={styles.subTitle}>
                                    Images ({galleryImages.length}/{MAX_GALLERY_IMAGES})
                                </h3>
                            </div>

                            <p className={styles.helpText}>
                                La grille est prévue pour {MAX_GALLERY_IMAGES} images : une grande
                                (cochée « Grande ») et quatre normales remplissent exactement la
                                rangée sur écran large. L&apos;ordre ci-dessous est celui de
                                l&apos;affichage. Vos photos sont réduites et converties
                                automatiquement avant l&apos;envoi.
                            </p>

                            {uploadError && (
                                <p className={styles.uploadError}>⚠️ {uploadError}</p>
                            )}

                            {galleryImages.map((image, index) => (
                                <div key={image.src || index} className={styles.listItem}>
                                    <div className={styles.galleryRow}>
                                        {/* Les visuels d'origine sont servis depuis
                                            `public/`, les nouveaux depuis Supabase :
                                            une balise simple couvre les deux sans
                                            configuration de domaine. */}
                                        <img
                                            src={image.src}
                                            alt=""
                                            className={styles.galleryThumb}
                                        />

                                        <div className={styles.galleryFields}>
                                            <label className={styles.label}>
                                                Description (texte alternatif)
                                            </label>
                                            <input
                                                className={styles.input}
                                                value={image.alt ?? ''}
                                                placeholder="Ex. : ouverture de bal, mariage à Melun"
                                                onChange={(e) =>
                                                    updateGalleryImage(index, {alt: e.target.value})
                                                }
                                            />

                                            <label className={styles.galleryCheck}>
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(image.big)}
                                                    onChange={(e) =>
                                                        updateGalleryImage(index, {big: e.target.checked})
                                                    }
                                                />
                                                <span>Grande (occupe deux colonnes)</span>
                                            </label>

                                            <div className={styles.rowActions}>
                                                <button
                                                    className={styles.addBtn}
                                                    disabled={index === 0}
                                                    onClick={() => moveGalleryImage(index, -1)}
                                                >
                                                    ↑ Monter
                                                </button>
                                                <button
                                                    className={styles.addBtn}
                                                    disabled={index === galleryImages.length - 1}
                                                    onClick={() => moveGalleryImage(index, 1)}
                                                >
                                                    ↓ Descendre
                                                </button>
                                                <button
                                                    className={styles.removeBtn}
                                                    onClick={() => removeGalleryImage(index)}
                                                >
                                                    Retirer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {galleryImages.length < MAX_GALLERY_IMAGES ? (
                                <label className={`${styles.addBtn} ${styles.galleryUpload}`}>
                                    {uploading ? 'Envoi en cours…' : '+ Ajouter une image'}
                                    <input
                                        type="file"
                                        accept={ALLOWED_IMAGE_TYPES.join(',')}
                                        disabled={uploading}
                                        className={styles.galleryFileInput}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            // Le champ est remis à zéro pour que
                                            // renvoyer le même fichier après une
                                            // erreur redéclenche bien l'événement.
                                            e.target.value = '';
                                            if (file) handleGalleryUpload(file);
                                        }}
                                    />
                                </label>
                            ) : (
                                <p className={styles.helpText}>
                                    Maximum atteint. Retirez une image pour en ajouter une autre.
                                </p>
                            )}

                            <p className={styles.helpText}>
                                Une image retirée reste en ligne jusqu&apos;à
                                l&apos;enregistrement : tant que vous n&apos;avez pas cliqué sur
                                « Enregistrer », le site public affiche encore la galerie
                                précédente et vous pouvez quitter la page pour tout annuler.
                            </p>
                        </div>
                    </>
                )}

                {activeTab === 'testimonials' && (
                    <>
                        <div className={styles.grid}>
                            {renderInput('Titre (Texte)', ['testimonials', 'title', 'text'])}
                            {renderInput('Titre (Highlight)', ['testimonials', 'title', 'highlight'])}
                        </div>
                        {renderTextarea('Sous-titre', ['testimonials', 'subtitle'])}

                        <div className={styles.subSection}>
                            <div className={styles.itemHead}>
                                <h3 className={styles.subTitle}>
                                    Avis ({testimonials.length}/{MAX_TESTIMONIALS})
                                </h3>
                            </div>

                            <p className={styles.helpText}>
                                Tant qu&apos;aucun avis n&apos;est saisi, la section
                                n&apos;apparaît pas sur le site : mieux vaut aucun avis
                                qu&apos;une rubrique vide. Un avis sans texte est ignoré,
                                même si le titre, le nom et la note sont remplis. La pastille
                                colorée reprend la première lettre du nom affiché.
                                L&apos;ordre ci-dessous est celui de l&apos;affichage.
                            </p>

                            {testimonials.map((item, index) => (
                                <div key={index} className={styles.listItem}>
                                    <div className={styles.itemHead}>
                                        <h4 className={styles.itemTitle}>Avis #{index + 1}</h4>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => {
                                                if (confirm('Supprimer cet avis ?')) {
                                                    setTestimonials(
                                                        testimonials.filter((_, i) => i !== index)
                                                    );
                                                }
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </div>

                                    {renderInput('Titre de l\'avis', ['testimonials', 'items', index.toString(), 'title'])}
                                    {renderTextarea('Avis', ['testimonials', 'items', index.toString(), 'quote'])}

                                    <div className={styles.grid}>
                                        {renderInput('Prénom / Nom affiché', ['testimonials', 'items', index.toString(), 'author'])}

                                        <div className={styles.fieldGroup}>
                                            <label className={styles.label}>Note</label>
                                            {/* Stockée en nombre : la valeur d'un
                                                `<select>` étant toujours une chaîne,
                                                la conversion est faite ici plutôt que
                                                laissée à l'affichage. */}
                                            <select
                                                className={styles.input}
                                                value={String(item.rating ?? '')}
                                                onChange={(e) =>
                                                    updateTestimonial(index, {
                                                        rating: e.target.value
                                                            ? Number(e.target.value)
                                                            : undefined,
                                                    })
                                                }
                                            >
                                                <option value="">Aucune étoile</option>
                                                {[5, 4, 3, 2, 1].map((note) => (
                                                    <option key={note} value={note}>
                                                        {'★'.repeat(note)} ({note}/5)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.rowActions}>
                                        <button
                                            className={styles.addBtn}
                                            disabled={index === 0}
                                            onClick={() => moveTestimonial(index, -1)}
                                        >
                                            ↑ Monter
                                        </button>
                                        <button
                                            className={styles.addBtn}
                                            disabled={index === testimonials.length - 1}
                                            onClick={() => moveTestimonial(index, 1)}
                                        >
                                            ↓ Descendre
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {testimonials.length < MAX_TESTIMONIALS ? (
                                <button
                                    className={styles.addBtn}
                                    onClick={() =>
                                        setTestimonials([
                                            ...testimonials,
                                            {title: '', quote: '', author: '', rating: 5},
                                        ])
                                    }
                                >
                                    + Ajouter un avis
                                </button>
                            ) : (
                                <p className={styles.helpText}>
                                    Maximum atteint. Supprimez un avis pour en ajouter un autre.
                                </p>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'faq' && (
                    <>
                        <div className={styles.grid}>
                            {renderInput('Titre (Texte)', ['faq', 'title', 'text'])}
                            {renderInput('Titre (Highlight)', ['faq', 'title', 'highlight'])}
                        </div>
                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Questions / Réponses</h3>
                            {
                                faqItems.map((item, index) => (
                                    <div key={index} className={styles.listItem}>
                                        <div className={styles.itemHead}>
                                            <h4 className={styles.itemTitle}>Question #{index + 1}</h4>
                                            <button
                                                className={styles.removeBtn}
                                                onClick={() => {
                                                    if (confirm('Supprimer cette question ?')) {
                                                        const newItems = faqItems.filter((_, i) => i !== index);
                                                        updateField(['faq', 'items'], newItems);
                                                    }
                                                }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        {renderInput(`Question`, ['faq', 'items', index.toString(), 'question'])}
                                        {renderTextarea('Réponse', ['faq', 'items', index.toString(), 'answer'])}
                                    </div>
                                ))}
                            <button
                                className={styles.addBtn}
                                onClick={() => {
                                    const newItem = {
                                        question: "Nouvelle question",
                                        answer: "Nouvelle réponse"
                                    };
                                    const newItems = [...faqItems, newItem];
                                    updateField(['faq', 'items'], newItems);
                                }}
                            >
                                + Ajouter une question
                            </button>
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Formulaire de contact (FAQ)</h3>
                            {renderInput('Texte de déclenchement', ['faqForm', 'trigger'])}
                            {renderTextarea('Description', ['faqForm', 'description'])}

                            <div className={styles.grid}>
                                <div className={styles.listItem}>
                                    <h4 className={styles.itemTitle}>Modale de succès</h4>
                                    {renderInput('Titre (Succès)', ['faqForm', 'modal', 'success', 'title'])}
                                    {renderTextarea('Message (Succès)', ['faqForm', 'modal', 'success', 'text'])}
                                </div>
                                <div className={styles.listItem}>
                                    <h4 className={styles.itemTitle}>Modale d&apos;erreur</h4>
                                    {renderInput('Titre (Erreur)', ['faqForm', 'modal', 'error', 'title'])}
                                    {renderTextarea('Message (Erreur)', ['faqForm', 'modal', 'error', 'text'])}
                                </div>
                            </div>

                            <div className={styles.grid}>
                                {renderInput('Bouton Fermer', ['faqForm', 'modal', 'close'])}
                                {renderInput('Bouton Envoyer', ['faqForm', 'buttons', 'send'])}
                                {renderInput('Bouton Envoi en cours...', ['faqForm', 'buttons', 'sending'])}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'prestation' && (
                    <>
                        <div className={styles.grid}>
                            {renderInput('Titre (Texte)', ['prestationForm', 'title', 'text'])}
                            {renderInput('Titre (Highlight)', ['prestationForm', 'title', 'highlight'])}
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Sélecteur de mode</h3>
                            <div className={styles.grid}>
                                {renderInput('Onglet Prestation', ['prestationForm', 'toggles', 'prestation'])}
                                {renderInput('Onglet Rendez-vous', ['prestationForm', 'toggles', 'appointment'])}
                            </div>
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Sous-titres</h3>
                            {renderTextarea('Texte Prestation', ['prestationForm', 'subtitles', 'prestation'])}
                            {renderTextarea('Texte Rendez-vous', ['prestationForm', 'subtitles', 'appointment'])}
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Étapes</h3>
                            <div className={styles.grid}>
                                {
                                    prestationSteps.map((step, index) => (
                                        <div key={index} className={styles.listItem}>
                                            <span className={styles.itemTitle}>Étape {step.number}</span>
                                            {renderInput('Libellé', ['prestationForm', 'steps', index.toString(), 'label'])}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Champs du formulaire</h3>
                            <div className={styles.grid}>
                                {renderInput('Date', ['prestationForm', 'fields', 'date'])}
                                {renderInput('Date de fin', ['prestationForm', 'fields', 'date_fin'])}
                                {renderInput('Heure de début', ['prestationForm', 'fields', 'timeStart'])}
                                {renderInput('Heure de fin', ['prestationForm', 'fields', 'timeEnd'])}
                                {renderInput('Type de prestation', ['prestationForm', 'fields', 'type'])}
                                {renderInput('Lieu', ['prestationForm', 'fields', 'location'])}
                                {renderInput('Nom complet', ['prestationForm', 'fields', 'name'])}
                                {renderInput('Email', ['prestationForm', 'fields', 'email'])}
                                {renderInput('Téléphone', ['prestationForm', 'fields', 'phone'])}
                            </div>
                            {renderTextarea('Notes / Options', ['prestationForm', 'fields', 'notes'])}
                            <div className={styles.grid}>
                                {renderInput('Placeholder Lieu', ['prestationForm', 'placeholders', 'location'])}
                                {renderInput('Placeholder Notes', ['prestationForm', 'placeholders', 'notes'])}
                            </div>
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Boutons et Confirmation</h3>
                            <div className={styles.grid}>
                                {renderInput('Bouton Suivant', ['prestationForm', 'buttons', 'next'])}
                                {renderInput('Bouton Précédent', ['prestationForm', 'buttons', 'prev'])}
                                {renderInput('Bouton Envoyer (Prestation)', ['prestationForm', 'buttons', 'send'])}
                                {renderInput('Bouton Envoyer (RDV)', ['prestationForm', 'buttons', 'sendAppointment'])}
                                {renderInput('Bouton Recommencer', ['prestationForm', 'buttons', 'reset'])}
                            </div>
                            <div className={styles.grid}>
                                <div className={styles.listItem}>
                                    <h4 className={styles.itemTitle}>Succès de l&apos;envoi</h4>
                                    {renderInput('Titre', ['prestationForm', 'success', 'title'])}
                                    {renderTextarea('Texte (Prestation)', ['prestationForm', 'success', 'textPrestation'])}
                                    {renderTextarea('Texte (Rendez-vous)', ['prestationForm', 'success', 'textAppointment'])}
                                </div>
                            </div>
                            {renderTextarea('Note de confidentialité', ['prestationForm', 'privacyNote'])}
                        </div>
                    </>
                )}

                {activeTab === 'footer' && (
                    <div className={styles.grid}>
                        {renderInput('Copyright', ['footer', 'copyright'])}
                        {renderInput('Signature / Date', ['footer', 'signature'])}
                    </div>
                )}

                {activeTab === 'legal' && (
                    <>
                        {/*<p className={styles.helpText}>*/}
                        {/*    Ces informations alimentent les pages « Mentions légales » et « Politique de*/}
                        {/*    confidentialité ». Tout champ laissé vide s&apos;affiche en <code>*********</code> sur le*/}
                        {/*    site : le site reste fonctionnel, mais ces mentions sont obligatoires (article 6 de la*/}
                        {/*    LCEN) et doivent être complétées avant la mise en ligne définitive.*/}
                        {/*</p>*/}

                        <div className={`${styles.subSection} ${styles.subSectionFirst}`}>
                            <h3 className={styles.subTitle}>Éditeur du site</h3>
                            <div className={styles.grid}>
                                {renderInput('Nom / Raison sociale', ['legal', 'editor', 'name'])}
                                {renderInput('Forme juridique (ex. Entrepreneur individuel)', ['legal', 'editor', 'legalForm'])}
                                {renderInput('Capital social (sociétés uniquement)', ['legal', 'editor', 'capital'])}
                                {renderInput('Adresse du siège', ['legal', 'editor', 'address'])}
                                {renderInput('N° SIRET (14 chiffres)', ['legal', 'editor', 'siret'])}
                                {renderInput('Immatriculation RCS (sociétés uniquement)', ['legal', 'editor', 'rcs'])}
                                {renderInput('N° TVA intracommunautaire (vide si franchise en base)', ['legal', 'editor', 'vatNumber'])}
                                {renderInput('Email de contact public', ['legal', 'editor', 'email'])}
                                {renderInput('Téléphone (facultatif)', ['legal', 'editor', 'phone'])}
                                {renderInput('Directeur de la publication', ['legal', 'publicationDirector'])}
                            </div>
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Site & hébergeur</h3>
                            <div className={styles.grid}>
                                {renderInput('Nom du site', ['legal', 'siteName'])}
                                {renderInput('URL du site (ex. https://www.djurya.fr)', ['legal', 'siteUrl'])}
                                {renderInput('Hébergeur', ['legal', 'host', 'name'])}
                                {renderInput('Adresse de l\'hébergeur', ['legal', 'host', 'address'])}
                                {renderInput('Site web de l\'hébergeur', ['legal', 'host', 'website'])}
                            </div>
                        </div>

                        <div className={styles.subSection}>
                            <h3 className={styles.subTitle}>Données personnelles</h3>
                            <div className={styles.grid}>
                                {renderInput('Durée de conservation des demandes', ['legal', 'dataRetention'])}
                                {renderInput('Date de dernière mise à jour (ex. 21 juillet 2026)', ['legal', 'lastUpdate'])}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className={styles.footerBar}>
                <button
                    onClick={handleSave}
                    disabled={saving || refreshing}
                    className={styles.saveBtn}
                >
                    {saving ? 'Sauvegarde…' : 'Enregistrer les modifications'}
                </button>
            </div>

        </div>
    );
}
