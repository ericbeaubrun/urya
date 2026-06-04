'use client';

import { useState } from 'react';
import { saveAndRefreshContent } from '@/app/actions/saveContent';
import { refreshSiteContent } from '@/app/actions/content';
import styles from './ContentEditor.module.css';

export default function ContentEditor({ initialContent }: { initialContent: any }) {
  const [content, setContent] = useState(JSON.stringify(initialContent, null, 2));
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = async () => {
    try {
      const parsedContent = JSON.parse(content);
      if (!confirm('Voulez-vous sauvegarder ces modifications et rafraîchir le site ?')) return;

      setSaving(true);
      const result = await saveAndRefreshContent(parsedContent);
      setSaving(false);

      if (result.success) {
        alert(result.message);
      } else {
        alert('Erreur : ' + result.message);
      }
    } catch (e) {
      alert('Erreur JSON invalide : ' + (e as Error).message);
    }
  };

  const handleRefreshOnly = async () => {
    if (!confirm('Voulez-vous rafraîchir le cache sans sauvegarder ?')) return;
    setRefreshing(true);
    const result = await refreshSiteContent();
    setRefreshing(false);
    alert(result.message);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Édition du Contenu JSON</h1>
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
      
      <p className={styles.info}>
        Attention : Modifiez le JSON avec précaution. Assurez-vous de respecter la structure existante.
      </p>

      <textarea
        className={styles.editor}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
