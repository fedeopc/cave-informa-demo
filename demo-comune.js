/* Cave Informa · DEMO — dati comuni a regia e app dimostrativa */
const DEMO = (() => {
  const CAVE = { lat: 41.8189, lon: 12.9306 };
  const NTFY = "https://ntfy.sh/";
  const topic = (k) => "caveinforma-demo-" + String(k || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  // Defibrillatori di base (stessi dell'app vera)
  const DAE = [
    { nome: "Viale Giulio Venzi, 1", lat: 41.8219052, lon: 12.9294543 },
    { nome: "Via Speciano, 5", lat: 41.8159704, lon: 12.9391443 },
    { nome: "Via G. D'Annunzio", lat: 41.8145234, lon: 12.9309421 },
    { nome: "Via dell'Artigianato, 4", lat: 41.8187452, lon: 12.94853 },
    { nome: "Via della Selce", lat: 41.819704, lon: 12.9170557 },
    { nome: "Viale Giorgioli", lat: 41.8183068, lon: 12.9318414 },
    { nome: "Via Filippo Venzi / Piazza delle Erbe", lat: 41.8182472, lon: 12.9292479 },
  ];

  // Comuni vicini già pronti per le scosse (coordinate approssimate del centro)
  const PAESI = [
    ["Palestrina", 41.8393, 12.8910], ["Genazzano", 41.8311, 12.9718], ["Olevano Romano", 41.8606, 13.0306],
    ["Subiaco", 41.9253, 13.0946], ["Affile", 41.8850, 13.0990], ["Fiuggi", 41.7989, 13.2242],
    ["Colleferro", 41.7292, 13.0040], ["Valmontone", 41.7766, 12.9195], ["Roma", 41.8933, 12.4829],
    ["L'Aquila", 42.3498, 13.3995], ["Norcia", 42.7926, 13.0937], ["Sora", 41.7176, 13.6131],
  ];

  // Fenomeni del bollettino di vigilanza (stessi codici della legenda DPC)
  const FEN = [
    [1, "💧 Piogge sparse"], [2, "🌧️ Piogge diffuse"], [5, "⛈️ Temporali isolati"], [6, "⛈️ Temporali sparsi"], [7, "⛈️ Temporali diffusi"],
    [10, "🌬️ Venti forti"], [11, "🌬️ Burrasca"], [12, "🌪️ Tempesta"], [13, "🌬️ Raffiche frequenti"],
    [3, "❄️ Neve debole"], [4, "❄️ Neve abbondante"], [20, "🧊 Gelate in collina"], [21, "🧊 Gelate in pianura"],
    [30, "🌫️ Nebbie notturne"], [31, "🌫️ Nebbie persistenti"], [60, "🌡️ Caldo"], [61, "🌡️ Caldo intenso"], [62, "🌡️ Freddo"], [63, "🌡️ Freddo intenso"],
  ];
  const PIOGGE = ["", "Non rilevanti", "Deboli", "Moderate", "Elevate", "Molto elevate"];

  // Situazioni pronte per le previsioni dei 3 giorni: [max, min, raffiche, pioggia]
  const PREVISIONI = {
    "☀️ Bel tempo": [[21, 11, 18, 0], [22, 12, 15, 0], [21, 10, 20, 0]],
    "⛈️ Maltempo": [[16, 11, 58, 42], [14, 9, 44, 18], [17, 8, 25, 2]],
    "🔥 Ondata di calore": [[37, 22, 15, 0], [38, 23, 12, 0], [36, 22, 18, 0]],
    "🌬️ Burrasca": [[15, 9, 82, 6], [14, 8, 70, 3], [16, 9, 40, 0]],
    "❄️ Neve": [[2, -3, 35, 14], [1, -4, 25, 8], [4, -2, 20, 0]],
  };

  // Messaggi pronti per la bacheca: [tipo, titolo, testo]
  const MESSAGGI = [
    ["urgente", "Domani scuole chiuse per allerta", "Su disposizione del Sindaco le scuole di ogni ordine e grado resteranno chiuse. Seguite gli aggiornamenti."],
    ["urgente", "Strada chiusa per allagamento", "Via Prenestina chiusa al traffico all'altezza del ponte. Seguite la segnaletica e le indicazioni dei volontari."],
    ["avviso", "Punto di raccolta attivo in piazza Garibaldi", "I volontari della protezione civile sono presenti per assistenza e informazioni."],
    ["avviso", "Allerta rientrata", "La situazione è tornata alla normalità. Grazie a tutti per la collaborazione."],
    ["evento", "Esercitazione di protezione civile in piazza", "Prova pratica aperta ai cittadini: come comportarsi in caso di emergenza."],
    ["avviso", "Raccolta beni di prima necessità", "Coperte, acqua e alimenti a lunga conservazione presso la sede di via Pio XII 55."],
  ];

  const NORMALE = () => ({
    v: 0, t: Date.now(),
    a: { oggi: [0, 0, 0], dom: [0, 0, 0], ieri: -1, nodom: false, arch: null },
    m: { p: [1, 1], f: [], fd: [], fc: PREVISIONI["☀️ Bel tempo"].map((r) => r.slice()) },
    q: [], b: [], dae: [],
  });

  const km = (a, b) => { const R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };

  return { CAVE, NTFY, topic, DAE, PAESI, FEN, PIOGGE, PREVISIONI, MESSAGGI, NORMALE, km };
})();
