import { getSiteContent } from '@/lib/content';
import { ContentProvider } from './ContentContext';
import HomeClient from './HomeClient';
import { redirect } from 'next/navigation';

export default async function Home() {
    const content = await getSiteContent();

    if (!content) {
        redirect('/maintenance');
    }

    return (
        <ContentProvider content={content}>
            <HomeClient />
        </ContentProvider>
    );
}
