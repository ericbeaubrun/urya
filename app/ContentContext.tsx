'use client';

import React, { createContext, useContext } from 'react';
import type { SiteContent } from '@/lib/site-content';

const ContentContext = createContext<SiteContent | undefined>(undefined);

export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
