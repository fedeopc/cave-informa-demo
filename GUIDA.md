# Cave Informa · DEMO — guida completa

Versione dimostrativa di Cave Informa per presentare l'app (per esempio al Comune).
L'app gira sul **PC** (anche collegato a un proiettore) dentro la sagoma di un telefono; tu la comandi dal **tuo telefono** con la **regia**: allerta, meteo, terremoti, bacheca, defibrillatori e notifiche.

Tutti i dati sono **simulati**: l'app vera e i suoi dati non vengono mai toccati. In alto c'è sempre la fascia gialla "Modalità dimostrazione · dati simulati".

---

## 1. Cosa contiene la cartella

| File / cartella | A cosa serve |
|---|---|
| `pc.html` | La pagina da aprire sul PC o sul proiettore (sagoma del telefono, logo, funzioni) |
| `regia.html` | La regia da aprire sul tuo telefono |
| `index.html` | L'app dimostrativa (copia dell'app vera, versione 3.5) |
| `demo.js`, `demo-comune.js` | Il "motore" della demo: crea i dati simulati e collega regia e PC |
| `demo-data/` | Le mappe delle zone di allerta e di vigilanza meteo (servono per simulare i bollettini) |
| `icons/` | Icone |
| `GUIDA.md` | Questa guida |

---

## 2. Caricare la demo su GitHub (una volta sola)

Serve un **computer** (dal telefono non si possono caricare le cartelle).

1. **Scompatta** il file `cave-informa-demo.zip` sul PC: ottieni la cartella `cave-informa-demo`.
2. Vai su **github.com** con il tuo account e in alto a destra tocca **+ → New repository**.
3. Compila:
   - **Repository name:** `cave-informa-demo`
   - **Public** (necessario per GitHub Pages gratuito)
   - non spuntare nient'altro → **Create repository**.
4. Nella pagina del repository vuoto clicca il link **"uploading an existing file"**.
5. Apri la cartella `cave-informa-demo` sul PC, **seleziona tutto il contenuto** (i file e le cartelle `demo-data` e `icons`, **non** la cartella esterna) e **trascinalo** nella pagina di GitHub.
   - Controlla che nell'elenco compaiano anche `demo-data/criticita.json`, `demo-data/vigilanza.json` e i file in `icons/`.
6. In basso clicca **Commit changes** e attendi il caricamento (i due file delle mappe pesano circa 2 MB in tutto).
7. Vai su **Settings → Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` e cartella `/ (root)` → **Save**.
8. Dopo 1–2 minuti la demo è online all'indirizzo:
   **`https://TUONOMEUTENTE.github.io/cave-informa-demo/pc.html`**
   (al posto di TUONOMEUTENTE il tuo nome utente GitHub; lo stesso dell'app vera).

---

## 3. Abbinare il telefono al PC (una volta sola)

1. **Sul PC** apri `https://TUONOMEUTENTE.github.io/cave-informa-demo/pc.html`.
   Al primo avvio compare la finestra **"Collega la regia"** con un **QR code**, il **link della regia** e un **codice** (per esempio `K7Q2-M9XA`). L'indirizzo in alto nel browser ora finisce con `#k=…`: **salvalo nei preferiti del PC** così com'è.
2. **Sul telefono** inquadra il QR code con la fotocamera e apri il link (oppure scrivi a mano il link mostrato).
3. Si apre la **regia**. Su iPhone: tocca **Condividi → Aggiungi alla schermata Home** (su Android: menu ⋮ → **Aggiungi a schermata Home**). Da ora la regia si apre come un'app, già abbinata.
4. In pochi secondi:
   - sulla regia, in alto a destra, compare **"PC collegato"** (pallino verde);
   - sul PC, a destra, compare **"Collegata alla regia"** e la finestra del QR si chiude da sola.

Il codice resta memorizzato sia sul PC sia sul telefono: le volte successive apri il preferito sul PC e la regia sul telefono, senza rifare l'abbinamento. Per rivedere QR e link sul PC: tasto **🔗** in basso a destra.

---

## 4. Usare la regia

In alto ci sono sempre due tasti:
- **🔔 Simula notifica** – sul PC scende dall'alto la notifica come la vedrebbe un cittadino (testo scelto in base alla situazione: allerta, scossa o messaggio).
- **↺ Torna alla normalità** – tutto verde, nessuna scossa, bacheca vuota, tutti i DAE disponibili.

Sotto, le sezioni a tendina (accanto al titolo vedi com'è impostata ognuna):

**⚠️ Allerta**
- Una riga di colori (verde, gialla, arancione, rossa) **per ogni rischio**, per oggi e per domani.
- **Bollettino di domani non ancora uscito**: come prima delle 16, "domani" risulta in attesa.
- **Cosa prevedeva ieri per oggi**: se è diverso dal livello di oggi, l'app mostra "▲ Alzata" o "▼ Abbassata rispetto alla previsione di ieri".
- **Bollettino vero dall'archivio DPC**: scegli una data passata e tocca **Carica**; l'app mostra il bollettino reale di quel giorno come se fosse oggi (in alto sul PC compare la data). **Annulla** per tornare ai livelli scelti a mano.

**🌧️ Meteo e previsioni**
- Scegli **Oggi** o **Domani**, poi il livello di **piogge** e i **fenomeni** (temporali, burrasca, neve, gelate, nebbie, caldo, freddo…).
- **Previsioni 3 giorni**: tocca una situazione pronta (bel tempo, maltempo, ondata di calore, burrasca, neve) e, se vuoi, ritocca i numeri.

**🌍 Terremoti**
- Scrivi **qualsiasi comune italiano** o tocca uno di quelli pronti; la regia mostra la **distanza vera da Cave**.
- Scegli magnitudo, profondità e "quando", poi **＋ Aggiungi scossa**. Puoi aggiungerne più di una e toglierle.
- Come nell'app vera, le scosse oltre 100 km da Cave non compaiono nell'elenco.

**📢 Bacheca**
- **Messaggi pronti** con un tocco (scuole chiuse, strada chiusa, punto di raccolta, allerta rientrata, esercitazione, raccolta beni).
- **Messaggio libero**: avviso, urgente (in evidenza in prima pagina) o evento (con data, ora e luogo).
- Elenco dei pubblicati con **Togli**.

**❤️ Defibrillatori**
- Un interruttore per ogni DAE: acceso = "non disponibile al momento" (icona gialla; l'app indica il più vicino disponibile).

**🔔 Notifica**
- Testi pronti in base alla situazione, oppure un testo scritto da te → **Invia al PC**.

Ogni modifica arriva sul PC in circa 1–2 secondi.

---

## 5. Durante la presentazione

- **Prima di iniziare**: apri il preferito sul PC, apri la regia sul telefono, controlla "PC collegato" e tocca **↺ Torna alla normalità**.
- **Schermo intero**: tasto **⛶** in basso a destra sul PC (oppure F11).
- L'app dentro la sagoma è **vera e cliccabile** con il mouse: puoi mostrare Cosa fare, Zaino, DAE, Contatti, aprire i dettagli di meteo e terremoti, cambiare comune.
- Il tasto **Chiama 112** e gli altri numeri **non chiamano**: compare "Demo: qui partirebbe la chiamata".
- **Se il telefono non ha rete**: sul PC tocca **⚙️** in basso a destra; la stessa regia si apre a lato e la usi con il mouse.

Un esempio di scenario da raccontare:
1. Situazione normale (tutto verde).
2. Allerta **gialla** per domani → **Simula notifica**.
3. Il giorno dopo l'allerta sale ad **arancione** (imposta "ieri: gialla") → compare "▲ Alzata".
4. Bacheca: **"Domani scuole chiuse per allerta"** → in prima pagina compare l'avviso.
5. Meteo: **temporali diffusi e venti forti**, previsioni "Maltempo".
6. **Scossa** a Subiaco M 3.8 → l'app indica 18 km da Cave.
7. DAE di via della Selce **non disponibile** → "Trova il più vicino" porta a quello disponibile.
8. **Torna alla normalità**.

---

## 6. Se qualcosa non va

| Problema | Cosa fare |
|---|---|
| La regia dice "In attesa del PC…" | Controlla che PC e telefono siano connessi a internet; ricarica `pc.html` sul PC. |
| Il PC dice "In attesa della regia…" | Apri la regia dal link del QR (stesso codice); tocca un comando qualsiasi. |
| Codici diversi tra PC e telefono | Sul PC tasto 🔗 → inquadra di nuovo il QR. |
| "Bollettino dall'archivio" non si carica | Usa una data in cui è uscito un bollettino (quasi tutti i giorni); GitHub permette un numero limitato di richieste all'ora: riprova dopo qualche minuto. |
| Il QR code non compare | Usa il link scritto accanto o il tasto "Copia link della regia". |
| Voglio un nuovo codice | Sul PC: 🔗 → **Nuovo codice**, poi ricollega la regia. |

---

## 7. Note tecniche

- **Collegamento regia–PC**: avviene tramite **ntfy.sh**, un servizio pubblico gratuito che inoltra messaggi istantanei. Non serve nessun account. Viaggiano solo i dati della simulazione (livelli, scosse, messaggi di prova); il "canale" è il codice di abbinamento, generato a caso e scritto solo nei link, non nei file su GitHub.
- **Separazione dall'app vera**: la demo usa memorie del browser separate (prefisso `demo:`) e non installa il funzionamento offline, quindi non interferisce con l'app vera anche se è sullo stesso account GitHub e sullo stesso PC.
- **Indirizzo dell'app vera mostrato a sinistra sul PC**: è in cima allo script di `pc.html`, nella riga `const APP_URL = "…"`. Modificalo quando l'app avrà l'indirizzo definitivo (per esempio dopo il trasferimento all'organizzazione dell'associazione).
- **Aggiornare la demo** quando cambia l'app vera: `index.html` della demo è una copia dell'app (versione 3.5) con due righe in più all'inizio (`demo-comune.js` e `demo.js`) e senza funzionamento offline. Chiedi una nuova copia e ricarica solo `index.html`.
