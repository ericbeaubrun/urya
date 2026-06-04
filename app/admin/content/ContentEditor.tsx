'use client';

import { useState } from 'react';
import { saveAndRefreshContent } from '@/app/actions/saveContent';
import { refreshSiteContent } from '@/app/actions/content';
import styles from './ContentEditor.module.css';

export default function ContentEditor({ initialContent }: { initialContent: any }) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = async () => {
    try {
      if (!confirm('Voulez-vous sauvegarder ces modifications et rafraîchir le site ?')) return;

      setSaving(true);
      const result = await saveAndRefreshContent(content);
      setSaving(false);

      if (result.success) {
        alert(result.message);
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
    alert(result.message);
  };

  const updateField = (path: string[], value: any) => {
    setContent((prev: any) => {
      const newContent = { ...prev };
      let current = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  const renderInput = (label: string, path: string[], type = 'text') => (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        value={path.reduce((obj, key) => obj?.[key], content) || ''}
        onChange={(e) => updateField(path, e.target.value)}
      />
    </div>
  );

  const renderTextarea = (label: string, path: string[]) => (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={path.reduce((obj, key) => obj?.[key], content) || ''}
        onChange={(e) => updateField(path, e.target.value)}
      />
    </div>
  );

  const tabs = [
    { id: 'navigation', label: 'Navigation' },
    { id: 'hero', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'faq', label: 'Questions' },
    { id: 'prestation', label: 'Formulaire' },
    { id: 'footer', label: 'Pied de page' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Édition du Contenu</h1>
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleRefreshOnly} 
            disabled={refreshing || saving}
            className={styles.refreshBtn}
          >
            {refreshing ? 'Rafraîchissement...' : 'Rafraîchir le cache'}
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || refreshing}
            className={styles.saveBtn}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder et Appliquer'}
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
              {content.hero?.stats?.map((stat: any, index: number) => (
                <div key={index} className={styles.listItem}>
                  <div className={styles.grid} style={{ flex: 1 }}>
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
            <div className={styles.subSection} style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
              <h3 className={styles.subTitle}>Description</h3>
              {content.about?.description?.map((_: any, index: number) => (
                <div key={index} className={styles.fieldGroup}>
                  <textarea
                    className={styles.textarea}
                    value={content.about.description[index]}
                    onChange={(e) => {
                      const newDesc = [...content.about.description];
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
              <div className={styles.fieldGroup}>
                {content.about?.tags?.map((tag: string, index: number) => (
                  <div key={index} className={styles.listItem} style={{ marginBottom: '0.5rem' }}>
                    <input
                      className={styles.input}
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...content.about.tags];
                        newTags[index] = e.target.value;
                        updateField(['about', 'tags'], newTags);
                      }}
                    />
                    <button
                      className={styles.refreshBtn}
                      style={{ padding: '0.5rem', color: '#ef4444' }}
                      onClick={() => {
                        const newTags = content.about.tags.filter((_: any, i: number) => i !== index);
                        updateField(['about', 'tags'], newTags);
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  className={styles.refreshBtn}
                  onClick={() => {
                    const newTags = [...(content.about?.tags || []), 'Nouveau tag'];
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
                {content.about?.contactInfo?.map((info: any, index: number) => (
                  <div key={index} className={styles.listItem} style={{ flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className={styles.label} style={{ color: '#4f46e5' }}>{info.sub}</span>
                    </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className={styles.subTitle} style={{ margin: 0 }}>Prestations</h3>
              </div>
              {content.services?.items?.map((item: any, index: number) => (
                <div key={index} className={styles.listItem} style={{ flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#4f46e5' }}>Service #{index + 1}</h4>
                    <button
                      className={styles.refreshBtn}
                      style={{ padding: '0.3rem 0.6rem', color: '#ef4444', fontSize: '0.8rem' }}
                      onClick={() => {
                        if (confirm('Supprimer cette prestation ?')) {
                          const newItems = content.services.items.filter((_: any, i: number) => i !== index);
                          updateField(['services', 'items'], newItems);
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className={styles.grid} style={{ width: '100%' }}>
                    {renderInput(`Titre`, ['services', 'items', index.toString(), 'title'])}
                    {renderInput('Prix', ['services', 'items', index.toString(), 'price'])}
                  </div>
                  <div style={{ width: '100%', marginTop: '1rem' }}>
                    {renderTextarea('Description', ['services', 'items', index.toString(), 'subtitle'])}
                  </div>
                  <div style={{ width: '100%', marginTop: '1rem' }}>
                    <label className={styles.label}>Inclusions</label>
                    {item.inclusions?.map((inclusion: string, iIndex: number) => (
                      <div key={iIndex} className={styles.listItem} style={{ marginBottom: '0.5rem', background: '#18181b' }}>
                        <input
                          className={styles.input}
                          value={inclusion}
                          onChange={(e) => {
                            const newInclusions = [...item.inclusions];
                            newInclusions[iIndex] = e.target.value;
                            updateField(['services', 'items', index.toString(), 'inclusions'], newInclusions);
                          }}
                        />
                        <button
                          className={styles.refreshBtn}
                          style={{ padding: '0.5rem', color: '#ef4444' }}
                          onClick={() => {
                            const newInclusions = item.inclusions.filter((_: any, i: number) => i !== iIndex);
                            updateField(['services', 'items', index.toString(), 'inclusions'], newInclusions);
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                    <button
                      className={styles.refreshBtn}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
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
                className={styles.refreshBtn}
                onClick={() => {
                  const newItem = {
                    icon: "Sparkles",
                    image: "/soiree.png",
                    price: "À partir de ... €",
                    title: "Nouveau Service",
                    subtitle: "Description du service",
                    inclusions: []
                  };
                  const newItems = [...(content.services?.items || []), newItem];
                  updateField(['services', 'items'], newItems);
                }}
              >
                + Ajouter une prestation
              </button>
            </div>
            <div className={styles.subSection}>
              <h3 className={styles.subTitle}>Options supplémentaires</h3>
              {renderInput('Titre des options', ['services', 'extraOptions', 'title'])}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Liste des options</label>
                {content.services?.extraOptions?.items?.map((item: string, index: number) => (
                  <div key={index} className={styles.listItem} style={{ marginBottom: '0.5rem' }}>
                    <input
                      className={styles.input}
                      value={item}
                      onChange={(e) => {
                        const newItems = [...content.services.extraOptions.items];
                        newItems[index] = e.target.value;
                        updateField(['services', 'extraOptions', 'items'], newItems);
                      }}
                    />
                    <button
                      className={styles.refreshBtn}
                      style={{ padding: '0.5rem', color: '#ef4444' }}
                      onClick={() => {
                        const newItems = content.services.extraOptions.items.filter((_: any, i: number) => i !== index);
                        updateField(['services', 'extraOptions', 'items'], newItems);
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  className={styles.refreshBtn}
                  onClick={() => {
                    const newItems = [...(content.services?.extraOptions?.items || []), ''];
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
          </>
        )}

        {activeTab === 'faq' && (
          <>
            <div className={styles.grid}>
              {renderInput('Titre (Texte)', ['faq', 'title', 'text'])}
              {renderInput('Titre (Highlight)', ['faq', 'title', 'highlight'])}
            </div>
            <div className={styles.subSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className={styles.subTitle} style={{ margin: 0 }}>Questions / Réponses</h3>
              </div>
              {content.faq?.items?.map((item: any, index: number) => (
                <div key={index} className={styles.listItem} style={{ flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#4f46e5' }}>Question #{index + 1}</h4>
                    <button
                      className={styles.refreshBtn}
                      style={{ padding: '0.3rem 0.6rem', color: '#ef4444', fontSize: '0.8rem' }}
                      onClick={() => {
                        if (confirm('Supprimer cette question ?')) {
                          const newItems = content.faq.items.filter((_: any, i: number) => i !== index);
                          updateField(['faq', 'items'], newItems);
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                  <div style={{ width: '100%' }}>
                    {renderInput(`Question`, ['faq', 'items', index.toString(), 'question'])}
                    {renderTextarea('Réponse', ['faq', 'items', index.toString(), 'answer'])}
                  </div>
                </div>
              ))}
              <button
                className={styles.refreshBtn}
                onClick={() => {
                  const newItem = {
                    question: "Nouvelle question",
                    answer: "Nouvelle réponse"
                  };
                  const newItems = [...(content.faq?.items || []), newItem];
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
              
              <div className={styles.grid} style={{ marginTop: '1rem' }}>
                <div className={styles.fieldGroup}>
                  <h4 className={styles.label} style={{ color: '#4f46e5', marginBottom: '1rem' }}>Modale de succès</h4>
                  {renderInput('Titre (Succès)', ['faqForm', 'modal', 'success', 'title'])}
                  {renderTextarea('Message (Succès)', ['faqForm', 'modal', 'success', 'text'])}
                </div>
                <div className={styles.fieldGroup}>
                  <h4 className={styles.label} style={{ color: '#ef4444', marginBottom: '1rem' }}>Modale d\'erreur</h4>
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
              <h3 className={styles.subTitle}>Sous-titres</h3>
              {renderTextarea('Texte Prestation', ['prestationForm', 'subtitles', 'prestation'])}
              {renderTextarea('Texte Rendez-vous', ['prestationForm', 'subtitles', 'appointment'])}
            </div>

            <div className={styles.subSection}>
              <h3 className={styles.subTitle}>Étapes</h3>
              <div className={styles.grid}>
                {content.prestationForm?.steps?.map((step: any, index: number) => (
                  <div key={index} className={styles.listItem} style={{ flexDirection: 'column', gap: '0.5rem' }}>
                    <span className={styles.label} style={{ color: '#4f46e5' }}>Étape {step.number}</span>
                    {renderInput('Libellé', ['prestationForm', 'steps', index.toString(), 'label'])}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.subSection}>
              <h3 className={styles.subTitle}>Champs du formulaire</h3>
              <div className={styles.grid}>
                {renderInput('Date', ['prestationForm', 'fields', 'date'])}
                {renderInput('Heure de début', ['prestationForm', 'fields', 'timeStart'])}
                {renderInput('Heure de fin', ['prestationForm', 'fields', 'timeEnd'])}
                {renderInput('Type de prestation', ['prestationForm', 'fields', 'type'])}
                {renderInput('Lieu', ['prestationForm', 'fields', 'location'])}
                {renderInput('Nom complet', ['prestationForm', 'fields', 'name'])}
                {renderInput('Email', ['prestationForm', 'fields', 'email'])}
                {renderInput('Téléphone', ['prestationForm', 'fields', 'phone'])}
              </div>
              {renderTextarea('Notes / Options', ['prestationForm', 'fields', 'notes'])}
              <div className={styles.grid} style={{ marginTop: '1rem' }}>
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
              <div className={styles.grid} style={{ marginTop: '1.5rem' }}>
                <div className={styles.fieldGroup}>
                  <h4 className={styles.label} style={{ color: '#4f46e5', marginBottom: '1rem' }}>Succès de l\'envoi</h4>
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
      </div>
    </div>
  );
}
