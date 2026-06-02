export function emailLayout(content: string, title: string) {
    const primaryColor = '#8b5cf6';
    const bgColor = '#0b0b0e';
    const cardBg = '#111111';
    const textColor = '#ffffff';
    const textMuted = '#9ca3af';

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: ${bgColor};
            color: ${textColor};
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            padding-bottom: 40px;
        }
        .card {
            background-color: ${cardBg};
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }
        .title {
            color: ${primaryColor};
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .content {
            line-height: 1.6;
            color: ${textColor};
            font-size: 16px;
        }
        .footer {
            text-align: center;
            padding-top: 40px;
            color: ${textMuted};
            font-size: 12px;
        }
        .hr {
            border: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            margin: 20px 0;
        }
        .data-row {
            margin-bottom: 10px;
        }
        .data-label {
            color: ${textMuted};
            font-weight: bold;
            margin-right: 5px;
        }
        .button {
            display: inline-block;
            background-color: ${primaryColor};
            color: white !important;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white; margin: 0; font-size: 28px;">URYA</h1>
        </div>
        <div class="card">
            ${content}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} URYA. Tous droits réservés.
        </div>
    </div>
</body>
</html>
    `;
}
