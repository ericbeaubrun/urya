import PrestationForm from "@/app/prestation-form/PrestationForm";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sp = await searchParams;
    const rawDate = sp?.date;
    const initialDate = Array.isArray(rawDate) ? rawDate[0] : rawDate;
    return <PrestationForm initialDate={initialDate} />;
}
