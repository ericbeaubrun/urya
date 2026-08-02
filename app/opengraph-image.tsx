import {ImageResponse} from 'next/og';
import {BRAND, OG_IMAGE} from '@/lib/seo';

/**
 * Image de partage générée à la volée.
 *
 * Un visuel dédié plutôt qu'une photo de la galerie : les aperçus WhatsApp,
 * Messenger et Google Business recadrent en 1.91:1, format sous lequel les
 * photos existantes perdent leur sujet. Le texte est intégré à l'image, seul
 * moyen qu'il apparaisse dans l'aperçu.
 */
export const alt = OG_IMAGE.alt;
export const size = {width: OG_IMAGE.width, height: OG_IMAGE.height};
export const contentType = 'image/png';

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background:
                        'radial-gradient(circle at 20% 20%, #3b1d5e 0%, #0b0b12 55%, #000000 100%)',
                    color: '#ffffff',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: 26,
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: '#c4a2ff',
                    }}
                >
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: '#c4a2ff',
                        }}
                    />
                    DJ professionnel
                </div>

                <div
                    style={{
                        display: 'flex',
                        fontSize: 104,
                        fontWeight: 700,
                        marginTop: 28,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {BRAND}
                </div>

                <div
                    style={{
                        display: 'flex',
                        fontSize: 42,
                        marginTop: 20,
                        color: '#e6e1f5',
                        lineHeight: 1.3,
                    }}
                >
                    Mariages · Anniversaires · Entreprises
                </div>

                <div
                    style={{
                        display: 'flex',
                        fontSize: 30,
                        marginTop: 40,
                        color: '#9d92b8',
                    }}
                >
                    Partout en France — devis gratuit sous 24 h
                </div>
            </div>
        ),
        size
    );
}
