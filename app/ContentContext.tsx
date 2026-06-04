'use client';

import React, { createContext, useContext } from 'react';

const ContentContext = createContext<any>(undefined);

export function ContentProvider({ content, children }: { content: any; children: React.ReactNode }) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
