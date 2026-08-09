/**
 * Réinitialise le mot de passe d'un administrateur, en local.
 *
 *   npm run admin:reset -- admin@example.com
 *
 * Choix assumé : le site n'aura jamais plus de trois admins, donc « mot de passe
 * oublié » reste une opération d'exploitation et non une fonctionnalité. Pas de
 * table de jetons, pas d'e-mail de réinitialisation, donc aucune surface
 * d'attaque publique supplémentaire.
 *
 * Le mot de passe n'est jamais passé en argument : il serait visible dans
 * l'historique du shell et dans la liste des processus. Il est saisi en masqué,
 * confirmé, puis haché avec le même coût bcrypt que lib/auth-helpers.ts.
 *
 * Prérequis : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans
 * .env.local (ou dans l'environnement).
 */

import {createClient} from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import {createInterface} from "node:readline";
import {readFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Doit rester aligné sur hashPassword() dans lib/auth-helpers.ts : un hash
// produit ici avec un coût différent resterait valide, mais l'écart de temps de
// vérification trahirait quel compte a été réinitialisé.
const BCRYPT_COST = 12;

const MIN_PASSWORD_LENGTH = 12;

/**
 * Lit les fichiers d'environnement du projet. Next les charge tout seul, mais
 * ce script tourne hors de Next ; on évite une dépendance dotenv pour si peu.
 * L'environnement réel a toujours la priorité sur les fichiers.
 */
function loadEnvFiles() {
    // .env.local en dernier : c'est lui qui gagne, comme chez Next.
    for (const file of [".env", ".env.local"]) {
        let content;

        try {
            content = readFileSync(join(ROOT, file), "utf8");
        } catch {
            continue;
        }

        for (const line of content.split(/\r?\n/)) {
            const match = /^\s*(?:export\s+)?([\w.-]+)\s*=\s*(.*)$/.exec(line);
            if (!match || line.trimStart().startsWith("#")) continue;

            const [, key, rawValue] = match;

            process.env[key] = rawValue.trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
        }
    }
}

/**
 * Interrompt le script avec un message lisible. On lève une exception plutôt
 * que d'appeler process.exit() : sortir de force pendant que Node referme ses
 * sockets HTTP déclenche une assertion libuv sous Windows.
 */
function fail(message) {
    throw new ScriptError(message);
}

class ScriptError extends Error {}

// Une seule interface pour les deux saisies : en refermer une entre-temps
// ferait perdre ce qui est déjà en tampon sur stdin.
let rl;
let inputClosed = false;

function closeInput() {
    // Refermer une interface déjà en cours de fermeture fait planter libuv
    // sous Windows ; le drapeau évite ce double appel depuis fail().
    if (rl && !inputClosed) {
        inputClosed = true;
        rl.close();
    }
}

// Entrée redirigée (tests, script d'automatisation) : readline en mode terminal
// sur un tube perd la seconde ligne. On lit alors tout stdin d'un coup.
let pipedLines = null;

// Lecture synchrone du descripteur 0 : consommer stdin comme un flux laisse,
// sous Windows, un handle en cours de fermeture que process.exit() fait
// planter (assertion libuv).
function readPipedLines() {
    try {
        return readFileSync(0, "utf8").split(/\r?\n/);
    } catch {
        return [];
    }
}

/** Saisie sans écho, pour que le mot de passe ne reste pas à l'écran. */
async function promptHidden(question) {
    if (!process.stdin.isTTY) {
        pipedLines ??= readPipedLines();

        const line = pipedLines.shift();
        if (line === undefined) fail("Entrée épuisée, rien n'a été modifié.");

        process.stdout.write(`${question}\n`);
        return line;
    }

    if (!rl) {
        rl = createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });

        // Coupe l'écho des frappes : ni le mot de passe, ni sa longueur.
        rl._writeToOutput = () => {};

        rl.once("close", () => {
            inputClosed = true;
        });
    }

    return new Promise((resolve, reject) => {
        let answered = false;

        process.stdout.write(question);

        // Ctrl+C, Ctrl+D ou entrée redirigée épuisée : sans ce garde, la
        // promesse ne se résout jamais et le script s'arrête en silence,
        // en laissant croire que la réinitialisation a eu lieu.
        rl.once("close", () => {
            if (!answered) reject(new ScriptError("Saisie interrompue, rien n'a été modifié."));
        });

        rl.question("", (answer) => {
            answered = true;
            process.stdout.write("\n");
            resolve(answer);
        });
    });
}

async function main() {
    loadEnvFiles();

    // Vidé avant tout appel réseau : sous Windows, lire le descripteur 0 une
    // fois des requêtes HTTP passées déclenche une assertion libuv à la sortie.
    if (!process.stdin.isTTY) {
        pipedLines = readPipedLines();
    }

    const email = process.argv[2]?.trim();

    if (!email) {
        fail("Usage : npm run admin:reset -- admin@example.com");
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        fail("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (.env.local).");
    }

    const supabase = createClient(url, serviceRoleKey);

    // La comparaison faite à la connexion est sensible à la casse
    // (verifyAdminCredentials fait un .eq strict) : on cherche donc à
    // l'identique, et on aide à retrouver la bonne graphie en cas d'échec.
    const {data: admin, error} = await supabase
        .from("admins")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

    if (error) {
        fail(`Lecture de la table admins impossible : ${error.message}`);
    }

    if (!admin) {
        const {data: all} = await supabase.from("admins").select("email");
        const known = (all ?? []).map(a => `    · ${a.email}`).join("\n");

        fail(
            `Aucun admin avec l'email exact « ${email} ».` +
            (known ? `\n\n  Comptes existants :\n${known}` : "")
        );
    }

    console.log(`\n  Réinitialisation du mot de passe de ${admin.email}`);
    console.log(`  (${MIN_PASSWORD_LENGTH} caractères minimum, saisie masquée)\n`);

    const password = await promptHidden("  Nouveau mot de passe : ");

    if (password.length < MIN_PASSWORD_LENGTH) {
        fail(`Mot de passe trop court : ${MIN_PASSWORD_LENGTH} caractères minimum.`);
    }

    const confirmation = await promptHidden("  Confirmation          : ");

    if (password !== confirmation) {
        fail("Les deux saisies diffèrent, rien n'a été modifié.");
    }

    closeInput();

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    const {error: updateError} = await supabase
        .from("admins")
        .update({password_hash: passwordHash})
        .eq("id", admin.id);

    if (updateError) {
        fail(`Mise à jour refusée : ${updateError.message}`);
    }

    console.log(`\n  ✔ Mot de passe de ${admin.email} mis à jour.`);
    // Les sessions sont des JWT de 8 h (auth.config.ts) : elles ne sont pas
    // révoquées par ce changement. C'est sans conséquence pour un oubli de mot
    // de passe, mais après une compromission il faut aussi changer
    // AUTH_SECRET pour invalider les jetons déjà émis.
    console.log("  Les sessions ouvertes restent valides jusqu'à 8 h ; en cas de");
    console.log("  compromission, changer aussi AUTH_SECRET et redéployer.\n");
}

main().catch((err) => {
    closeInput();
    console.error(`\n  ✖ ${err instanceof Error ? err.message : String(err)}\n`);
    process.exitCode = 1;
});
