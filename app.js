// Alfabetul românesc cu litere mici, inclusiv caracterele speciale (ă, â, î, ș, ț)
const alfabet = [
    'a', 'ă', 'â', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'î', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
    'r', 's', 'ș', 't', 'ț', 'u', 'v', 'w', 'x', 'y', 'z'
];

// Creăm o versiune cu majuscule a alfabetului românesc
const ALFABET = alfabet.map(l => l.toUpperCase());

// Numărul total de litere (31)
const totalLitere = alfabet.length;

// Verifică dacă un caracter este literă românească (mică sau mare)
function esteLiteraRomana(l) {
    return alfabet.includes(l) || ALFABET.includes(l);
}

// Returnează indexul unei litere în alfabet (indiferent dacă este mică sau mare)
// Dacă nu e literă românească, returnează -1
function indexLitera(litera) {
    if (alfabet.includes(litera)) {
        return alfabet.indexOf(litera);
    } else if (ALFABET.includes(litera)) {
        return ALFABET.indexOf(litera);
    } else {
        return -1;
    }
}

// La selectarea unui fișier .txt, citește conținutul lui și îl afișează în textarea de input
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; // Obține fișierul selectat
    if (!file) return; // Dacă nu a fost ales niciun fișier, ieșim

    const reader = new FileReader(); // Cititor pentru fișiere text

    // Când fișierul este încărcat, punem conținutul în caseta de input
    reader.onload = function(event) {
        document.getElementById('inputText').value = event.target.result;
    };

    // Citește fișierul ca text simplu
    reader.readAsText(file);
});

// Funcție care modifică o literă în funcție de poziție, cheie și dacă e criptare sau decriptare
function modificaLitera(litera, pozitie, cheie, criptare = true) {
    const esteMare = ALFABET.includes(litera); // Verificăm dacă litera este cu majusculă
    const lista = esteMare ? ALFABET : alfabet; // Alegem lista corespunzătoare

    let idx = indexLitera(litera); // Găsim indexul literei în alfabet
    if (idx === -1) return litera; // Dacă nu e literă românească, o returnăm fără schimbare

    // Dacă poziția e pară și criptăm => +cheie
    // Dacă poziția e impară și criptăm => -cheie
    // Invers pentru decriptare
    const oper = ((pozitie % 2 === 0) === criptare) ? cheie : -cheie;

    // Aplicăm operația și ne asigurăm că rămânem în intervalul alfabetului
    idx = (idx + oper + totalLitere) % totalLitere;

    return lista[idx]; // Returnăm litera modificată
}

// Funcție care codifică textul din textarea folosind cheia
function codifica() {
    const text = document.getElementById("inputText").value; // Textul de intrare
    const cheie = parseInt(document.getElementById("key").value); // Cheia introdusă

    // Validare cheie
    if (isNaN(cheie) || cheie < 1 || cheie > 20) {
        alert("Introdu o cheie validă între 1 și 20.");
        return;
    }

    let rezultat = ""; // Rezultatul criptat
    let pozAlfabet = 0; // Numără doar literele românești (ignori spații, semne etc.)

    for (let char of text) {
        if (esteLiteraRomana(char)) {
            rezultat += modificaLitera(char, pozAlfabet, cheie, true); // Criptăm litera
            pozAlfabet++;
        } else {
            rezultat += char; // Lăsăm restul caracterelor nemodificate
        }
    }

    document.getElementById("outputText").value = rezultat; // Afișăm rezultatul
}

// Funcție care decodifică textul din textarea folosind cheia
function decodifica() {
    const text = document.getElementById("inputText").value;
    const cheie = parseInt(document.getElementById("key").value);

    // Observație: aici limita cheii este greșită — trebuie să fie tot 10–99, corectăm:
    if (isNaN(cheie) || cheie < 1 || cheie > 20) {
        alert("Introdu o cheie validă între 1 și 20.");
        return;
    }

    let rezultat = "";
    let pozAlfabet = 0;

    for (let char of text) {
        if (esteLiteraRomana(char)) {
            rezultat += modificaLitera(char, pozAlfabet, cheie, false); // Decriptăm litera
            pozAlfabet++;
        } else {
            rezultat += char;
        }
    }

    document.getElementById("outputText").value = rezultat;
}

// Funcție care exportă rezultatul în fișier .txt
function exportText() {
    const continut = document.getElementById("outputText").value;

    // Creează un obiect de tip fișier text
    const blob = new Blob([continut], { type: "text/plain;charset=utf-8" });

    // Creează un element de descărcare automată
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rezultat.txt"; // Numele fișierului salvat
    a.click(); // Simulează click pentru descărcare
}