const burger = document.getElementById("burger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const accordions = document.querySelectorAll(".accordion-toggle");
const mainContent = document.getElementById("main-content");
const usernameElem = document.getElementById("username");
const userclassElem = document.getElementById("userclass");

// ===== Tutorial Modal Functions =====
let currentTutorialStep = 0;
const maxTutorialSteps = 5;

function initTutorial() {
  const tutorialSeen = localStorage.getItem("tutorialSeen") === "true";
  if (!tutorialSeen) {
    setTimeout(() => {
      showTutorial();
    }, 500);
  }
}

function showTutorial() {
  const tutorialModal = document.getElementById("tutorialModal");
  tutorialModal.classList.add("active");
  currentTutorialStep = 0;
  updateTutorialStep();
}

function skipTutorial() {
  const tutorialModal = document.getElementById("tutorialModal");
  tutorialModal.classList.remove("active");
  localStorage.setItem("tutorialSeen", "true");
}

function nextTutorialStep() {
  if (currentTutorialStep < maxTutorialSteps - 1) {
    const steps = document.querySelectorAll(".tutorial-step");
    steps[currentTutorialStep].classList.add("prev");
    steps[currentTutorialStep].classList.remove("active");

    currentTutorialStep++;
    updateTutorialStep();
  } else {
    skipTutorial();
  }
}

function updateTutorialStep() {
  const steps = document.querySelectorAll(".tutorial-step");
  steps.forEach((step, index) => {
    if (index === currentTutorialStep) {
      step.classList.add("active");
      step.classList.remove("prev");
    } else {
      step.classList.remove("active");
    }
  });

  // Update dots
  const dotsContainer = document.getElementById("tutorialDots");
  dotsContainer.innerHTML = "";
  for (let i = 0; i < maxTutorialSteps; i++) {
    const dot = document.createElement("div");
    dot.className =
      "tutorial-dot" + (i === currentTutorialStep ? " active" : "");
    dot.onclick = () => {
      goToTutorialStep(i);
    };
    dotsContainer.appendChild(dot);
  }

  // Update button text
  const nextBtn = document.getElementById("tutorialNextBtn");
  if (currentTutorialStep === maxTutorialSteps - 1) {
    nextBtn.textContent = "Fertig!";
  } else {
    nextBtn.textContent = "Weiter →";
  }
}

function goToTutorialStep(step) {
  const steps = document.querySelectorAll(".tutorial-step");
  steps[currentTutorialStep].classList.remove("active");
  currentTutorialStep = step;
  updateTutorialStep();
}

// Initialize tutorial on page load
document.addEventListener("DOMContentLoaded", () => {
  initTutorial();
  const tutorialNextBtn = document.getElementById("tutorialNextBtn");
  if (tutorialNextBtn) {
    tutorialNextBtn.addEventListener("click", nextTutorialStep);
  }
});

// ===== Donation Bar Functions =====
function closeDonationBar() {
  const donationBar = document.getElementById("donationBar");
  donationBar.classList.add("hidden");
  localStorage.setItem("donationBarClosed", "true");
}

function checkDonationBarStatus() {
  const donationBar = document.getElementById("donationBar");
  const isClosed = localStorage.getItem("donationBarClosed") === "true";
  if (isClosed) {
    donationBar.classList.add("hidden");
  }
}

// Check donation bar status when page loads
document.addEventListener("DOMContentLoaded", checkDonationBarStatus);

// HTML escape-Funktion
function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Quiz-Daten inkl. Hints
const quizzes = {
  webdev: {
    1: [
      {
        type: "mcq",
        question: "Was bedeutet HTML?",
        options: ["Hyper Text Markup Language", "Hotmail", "Home Tool Markup"],
        answer: [0],
        hint: "Denke an die Sprache, mit der Webseiten strukturiert werden.",
      },
      {
        type: "tf",
        question: "<br> erzeugt einen Zeilenumbruch.",
        answer: true,
        hint: "Welches Tag wird benutzt, um Text in einer neuen Zeile darzustellen?",
      },
      {
        type: "text",
        question: "Schreibe das Tag für Überschrift 1 auf:",
        answer: "<h1>",
        hint: "Es beginnt mit 'h' und einer Zahl, die die Ebene angibt.",
      },
      {
        type: "mcq-multi",
        question: "Welche Tags gibt es?",
        options: ["<p>", "<div>", "<link>", "<javascript>"],
        answer: [0, 1, 2],
        hint: "Einige Tags dienen zum Strukturieren und Verlinken von HTML-Seiten.",
      },
      {
        type: "mcq",
        question: "Wie erstellt man einen Link?",
        options: ["<a>", "<link>", "<href>"],
        answer: [0],
        hint: "Denke an das Tag, das Ankerpunkte auf Webseiten erstellt.",
      },
      {
        type: "tf",
        question: "<p> erstellt einen Paragraphen.",
        answer: true,
        hint: "Welches Tag wird standardmäßig für Textblöcke genutzt?",
      },
      {
        type: "mcq-multi",
        question: "Welche HTML Elemente gibt es?",
        options: ["ul", "ol", "li", "txt"],
        answer: [0, 1, 2],
        hint: "Listen-Elemente sind Teil der Standard-HTML-Tags.",
      },
      {
        type: "text",
        question: "Schreibe das Tag für Fettgedruckten Text:",
        answer: "<b>",
        hint: "Es ist ein kurzes Tag für Bold Text.",
      },
      {
        type: "mcq",
        question: "Ein Bild fügt man mit welchem Tag ein?",
        options: ["<img>", "<picture>", "<image>"],
        answer: [0],
        hint: "Das Tag ist kurz, 3 Buchstaben, zeigt ein Bild an.",
      },
      {
        type: "tf",
        question: "<div> ist ein Block-Element.",
        answer: true,
        hint: "Denke an Container, die ganze Zeilen einnehmen.",
      },
      {
        type: "mcq",
        question: "Welches Tag enthält den sichtbaren Seiteninhalt?",
        options: ["<head>", "<body>", "<html>"],
        answer: [1],
        hint: "Alles, was im Browser angezeigt wird, liegt hier.",
      },
      {
        type: "tf",
        question: "<h1> ist größer als <h3>.",
        answer: true,
        hint: "Überschriften haben verschiedene Ebenen.",
      },
      {
        type: "text",
        question: "Schreibe das HTML-Tag für eine ungeordnete Liste:",
        answer: "<ul>",
        hint: "Listen ohne Nummerierung.",
      },
      {
        type: "mcq-multi",
        question: "Welche sind gültige HTML-Tags?",
        options: ["<section>", "<footer>", "<bold>", "<header>"],
        answer: [0, 1, 3],
        hint: "HTML5 brachte neue semantische Tags.",
      },
      {
        type: "mcq",
        question: "Welches Attribut beschreibt ein Bild?",
        options: ["alt", "href", "title"],
        answer: [0],
        hint: "Wichtig für Barrierefreiheit.",
      },
    ],
    2: [
      {
        type: "mcq",
        question: "Was macht das <head> Tag?",
        options: ["Enthält Metadaten", "Zeigt Inhalt an", "Definiert Links"],
        answer: [0],
        hint: "Daten, die nicht direkt auf der Seite sichtbar sind, werden hier gespeichert.",
      },
      {
        type: "mcq-multi",
        question: "Welche Attribute kann ein <a>-Tag haben?",
        options: ["href", "src", "target", "alt"],
        answer: [0, 2],
        hint: "Ein Link braucht die Adresse und optional, wo geöffnet wird.",
      },
      {
        type: "tf",
        question: "CSS wird in HTML direkt geschrieben.",
        answer: false,
        hint: "Es gibt externe Stylesheets.",
      },
      {
        type: "text",
        question: "Schreibe das Tag für einen Paragraph:",
        answer: "<p>",
        hint: "Es ist ein kurzes Tag für Textabsätze.",
      },
      {
        type: "mcq",
        question: "Welche Tags sind Inline-Elemente?",
        options: ["<span>", "<div>", "<b>", "<section>"],
        answer: [0, 2],
        hint: "Nur Elemente, die den Textfluss nicht unterbrechen.",
      },
      {
        type: "tf",
        question: "<ul> erstellt eine ungeordnete Liste.",
        answer: true,
        hint: "Welche Art von Listen beginnen typischerweise mit Punkten?",
      },
      {
        type: "mcq-multi",
        question: "Welche Tags dienen zur Textformatierung?",
        options: ["<b>", "<i>", "<p>", "<link>"],
        answer: [0, 1],
        hint: "Tags, die Schriftarten und Stile ändern, nicht die Struktur.",
      },
      {
        type: "text",
        question: "Tag für horizontale Linie:",
        answer: "<hr>",
        hint: "Es ist kurz, zwei Buchstaben, trennt Inhalt visuell.",
      },
      {
        type: "mcq",
        question: "Welches Tag für Tabellenzeile?",
        options: ["<tr>", "<td>", "<table>"],
        answer: [0],
        hint: "Es ist das Tag für eine einzelne Zeile innerhalb einer Tabelle.",
      },
      {
        type: "tf",
        question: "<img> kann einen alt-Text haben.",
        answer: true,
        hint: "Hilfreich für Barrierefreiheit und wenn Bild nicht lädt.",
      },
      {
        type: "mcq",
        question: "Wofür steht CSS?",
        options: [
          "Cascading Style Sheets",
          "Creative Style System",
          "Computer Styled Sections",
        ],
        answer: [0],
        hint: "Es beschreibt das Design von Webseiten.",
      },
      {
        type: "tf",
        question: "<span> ist ein Inline-Element.",
        answer: true,
        hint: "Es unterbricht keinen Textfluss.",
      },
      {
        type: "mcq-multi",
        question: "Welche Attribute gehören zu <img>?",
        options: ["src", "alt", "href", "width"],
        answer: [0, 1, 3],
        hint: "Ein Bild braucht eine Quelle.",
      },
      {
        type: "text",
        question: "Schreibe das Tag für eine Tabellenzelle:",
        answer: "<td>",
        hint: "Nicht die Zeile, sondern die Zelle.",
      },
      {
        type: "mcq",
        question: "Wo wird externes CSS eingebunden?",
        options: ["<body>", "<style>", "<head>"],
        answer: [2],
        hint: "Styles werden vor dem Inhalt geladen.",
      },
    ],
    3: [
      {
        type: "mcq-multi",
        question:
          "Welche Inhalte sind in der Regel urheberrechtlich geschützt?",
        options: ["Quellcode", "Ideen", "Texte", "Grafiken"],
        answer: [0, 2, 3],
        hint: "Geschützt ist die konkrete Ausgestaltung, nicht die bloße Idee.",
      },
      {
        type: "mcq",
        question: "Was bedeutet 'Open Source' im rechtlichen Sinne?",
        options: [
          "Der Code ist automatisch gemeinfrei",
          "Der Code darf unter bestimmten Bedingungen genutzt werden",
          "Der Code darf nicht verändert werden",
          "Der Code ist nicht urheberrechtlich geschützt",
        ],
        answer: [1],
        hint: "Open Source heißt nicht 'keine Regeln'.",
      },
      {
        type: "tf",
        question: "Ohne Einwilligung dürfen Tracking-Cookies gesetzt werden.",
        answer: false,
        hint: "Tracking ist nicht technisch notwendig.",
      },
      {
        type: "mcq-multi",
        question:
          "Welche Angaben gehören typischerweise in eine Datenschutzerklärung?",
        options: [
          "Zweck der Datenverarbeitung",
          "Verwendete Schriftarten",
          "Rechte der betroffenen Personen",
          "Kontakt des Verantwortlichen",
        ],
        answer: [0, 2, 3],
        hint: "Nutzer müssen wissen, was mit ihren Daten passiert.",
      },

      {
        type: "tf",
        question:
          "Fremde Bilder aus Google dürfen ohne Erlaubnis verwendet werden, wenn man die Quelle nennt.",
        answer: false,
        hint: "Quellenangabe ersetzt keine Lizenz.",
      },
      {
        type: "mcq-multi",
        question: "Wann ist ein Cookie als technisch notwendig einzustufen?",
        options: [
          "Warenkorb-Funktion",
          "Login-Session",
          "Webanalyse",
          "Sprachauswahl",
        ],
        answer: [0, 1, 3],
        hint: "Ohne diese Cookies funktioniert die Seite nicht korrekt.",
      },
      {
        type: "mcq",
        question: "Was ist eine mögliche Rechtsgrundlage nach DSGVO?",
        options: [
          "Einwilligung",
          "Gute Absicht",
          "Technische Machbarkeit",
          "Designentscheidung",
        ],
        answer: [0],
        hint: "Art. 6 DSGVO regelt die Grundlagen.",
      },
      {
        type: "tf",
        question: "Ein Impressum ist nur für Online-Shops verpflichtend.",
        answer: false,
        hint: "Auch viele andere geschäftsmäßige Websites benötigen eins.",
      },
      {
        type: "mcq-multi",
        question: "Welche Folgen kann ein Verstoß gegen die DSGVO haben?",
        options: [
          "Bußgelder",
          "Abmahnungen",
          "Automatische Abschaltung der Website",
          "Imageschäden",
        ],
        answer: [0, 1, 3],
        hint: "Die Konsequenzen können finanziell und reputativ sein.",
      },
      {
        type: "tf",
        question: "IP-Adressen gelten als personenbezogene Daten.",
        answer: true,
        hint: "Sie können einer Person zugeordnet werden.",
      },
      {
        type: "mcq",
        question: "Was regelt die DSGVO?",
        options: [
          "Datenschutz in der EU",
          "Webdesign-Standards",
          "Urheberrecht weltweit",
        ],
        answer: [0],
        hint: "Sie schützt personenbezogene Daten.",
      },
      {
        type: "mcq-multi",
        question: "Welche Inhalte benötigen eine Lizenz?",
        options: ["Musik", "Fotos", "Eigene Texte", "Fremde Grafiken"],
        answer: [0, 1, 3],
        hint: "Eigene Inhalte sind unproblematisch.",
      },
      {
        type: "tf",
        question: "Open-Source-Code darf immer ohne Nennung genutzt werden.",
        answer: false,
        hint: "Lizenzen enthalten Pflichten.",
      },
      {
        type: "mcq",
        question: "Was ist ein Auftragsverarbeiter?",
        options: ["Hosting-Anbieter", "Website-Besucher", "Grafikdesigner"],
        answer: [0],
        hint: "Er verarbeitet Daten im Auftrag.",
      },
    ],
  },
  python: {
    1: [
      {
        type: "mcq",
        question: "Wie beginnt man einen Kommentar in Python?",
        options: ["#", "//", "<!--"],
        answer: [0],
        hint: "Python nutzt ein einzelnes Zeichen am Zeilenanfang.",
      },
      {
        type: "tf",
        question: "Python ist eine kompilierte Sprache.",
        answer: false,
        hint: "Python wird in der Regel interpretiert.",
      },
      {
        type: "text",
        question: "Schreibe 'Hallo Welt' in Python.",
        answer: "print('Hallo Welt')",
        hint: "Welche Funktion gibt Text auf der Konsole aus?",
      },
      {
        type: "mcq-multi",
        question: "Welche Datentypen gibt es?",
        options: ["int", "str", "bool", "char"],
        answer: [0, 1, 2],
        hint: "Python kennt Ganzzahlen, Text und Wahrheitswerte.",
      },
      {
        type: "mcq",
        question: "Welches Zeichen für Multiplikation?",
        options: ["*", "x", "^"],
        answer: [0],
        hint: "Es ist das Standard-Mathematikzeichen in Python.",
      },
      {
        type: "tf",
        question: "Listen sind veränderbar.",
        answer: true,
        hint: "Kann man Elemente hinzufügen oder löschen?",
      },
      {
        type: "text",
        question: "Schreibe eine Variable mit Wert 5.",
        answer: "x=5",
        hint: "Zuweisung in Python erfolgt mit '='.",
      },
      {
        type: "mcq-multi",
        question: "Welche Keywords gibt es?",
        options: ["if", "for", "while", "switch"],
        answer: [0, 1, 2],
        hint: "Python kennt keine switch-case-Anweisungen.",
      },
      {
        type: "mcq",
        question: "Was gibt print() aus?",
        options: ["Text", "Variable", "Beides"],
        answer: [2],
        hint: "Kann Text und Variablen anzeigen.",
      },
      {
        type: "tf",
        question: "Funktionen werden mit def definiert.",
        answer: true,
        hint: "Wie wird eine neue Funktion in Python gestartet?",
      },
      {
        type: "mcq",
        question: "Wie prüft man Gleichheit?",
        options: ["=", "==", "==="],
        answer: [1],
        hint: "Ein Zeichen ist Zuweisung.",
      },
      {
        type: "tf",
        question: "Python ist case-sensitive.",
        answer: true,
        hint: "Groß- und Kleinschreibung zählt.",
      },
      {
        type: "text",
        question: "Wie heißt der Datentyp für Kommazahlen?",
        answer: "float",
        hint: "Nicht int.",
      },
      {
        type: "mcq",
        question: "Wie bekommt man die Länge einer Liste?",
        options: ["size()", "length()", "len()"],
        answer: [2],
        hint: "Eine eingebaute Funktion.",
      },
      {
        type: "mcq-multi",
        question: "Welche sind gültige Variablennamen?",
        options: ["my_var", "2var", "_test", "my-var"],
        answer: [0, 2],
        hint: "Keine Bindestriche, keine Zahlen am Anfang.",
      },
    ],
    2: [
      {
        type: "mcq-multi",
        question: "Welche Datentypen gibt es?",
        options: ["int", "str", "bool", "char"],
        answer: [0, 1, 2],
        hint: "Python hat keine 'char'-Variable.",
      },
      {
        type: "text",
        question: "Erstelle ein Dictionary mit key='a' value=1",
        answer: "{'a':1}",
        hint: "Dictionary wird mit geschweiften Klammern erstellt.",
      },
      {
        type: "mcq",
        question: "Welche Schleife wird in Python nicht genutzt?",
        options: ["for", "while", "do-while"],
        answer: [2],
        hint: "Python kennt keine do-while-Schleife.",
      },
      {
        type: "tf",
        question: "Tuple sind unveränderbar.",
        answer: true,
        hint: "Kann man Elemente hinzufügen oder ändern?",
      },
      {
        type: "text",
        question: "Erstelle eine Liste mit Werten 1,2,3",
        answer: "[1,2,3]",
        hint: "Listen werden mit eckigen Klammern geschrieben.",
      },
      {
        type: "mcq-multi",
        question: "Welche Methoden für Listen?",
        options: ["append", "pop", "remove", "add"],
        answer: [0, 1, 2],
        hint: "Drei Methoden funktionieren in Python, die vierte nicht.",
      },
      {
        type: "mcq",
        question: "Modul importieren?",
        options: ["import math", "include math", "use math"],
        answer: [0],
        hint: "Das Schlüsselwort in Python ist 'import'.",
      },
      {
        type: "tf",
        question: "Python benutzt Einrückungen für Blöcke.",
        answer: true,
        hint: "Code-Blöcke werden nicht mit geschweiften Klammern markiert.",
      },
      {
        type: "text",
        question: "String 'Hallo' in Großbuchstaben?",
        answer: "HALLO",
        hint: "Python hat eine Methode, um Strings in Großbuchstaben umzuwandeln.",
      },
      {
        type: "mcq",
        question: "True or False? 5>3",
        options: ["True", "False"],
        answer: [0],
        hint: "Ist 5 größer als 3?",
      },
      {
        type: "tf",
        question: "Ein Dictionary speichert Key-Value-Paare.",
        answer: true,
        hint: "Schlüssel → Wert.",
      },
      {
        type: "mcq",
        question: "Welche Klammern für Tupel?",
        options: ["()", "[]", "{}"],
        answer: [0],
        hint: "Runde Klammern.",
      },
      {
        type: "text",
        question: "Wie greift man auf das erste Listenelement zu?",
        answer: "liste[0]",
        hint: "Index beginnt bei 0.",
      },
      {
        type: "mcq-multi",
        question: "Welche sind Vergleichsoperatoren?",
        options: ["==", "!=", "=", "<="],
        answer: [0, 1, 3],
        hint: "= ist keine Abfrage.",
      },
      {
        type: "mcq",
        question: "Was macht break?",
        options: [
          "Beendet eine Schleife",
          "Springt zum Anfang",
          "Pausiert das Programm",
        ],
        answer: [0],
        hint: "Wird in Schleifen genutzt.",
      },
    ],
  },
};

// Sidebar Toggle
function toggleSidebar() {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  // animate burger lines
  if (sidebar.classList.contains("active")) {
    burger.classList.add("open");
  } else {
    burger.classList.remove("open");
  }
}
burger.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);
accordions.forEach((toggle) => {
  toggle.addEventListener("click", function (e) {
    // Use the button itself as the source (this/currentTarget)
    // and toggle its closest <li>. This ensures clicking the SVG
    // inside the button also toggles the accordion.
    const li = this.closest("li");
    if (li) li.classList.toggle("active");
  });
});

let currentQuiz = null;

// Wiederherstellung des letzten Zustands beim Laden
function loadLastState() {
  const state = JSON.parse(localStorage.getItem("currentQuiz"));
  if (state) {
    currentQuiz = state;
    renderQuestion();
  }
}

function startQuiz(subject, level) {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
  let savedProgress = JSON.parse(
    localStorage.getItem(`${subject}-level${level}`) || "{}",
  );
  currentQuiz = {
    subject,
    level,
    index: 0,
    answers: savedProgress,
    repeatQueue: [],
  };
  saveAppState();
  renderQuestion();
}

// Speichern des Quizzustands
function saveAppState() {
  if (currentQuiz)
    localStorage.setItem("currentQuiz", JSON.stringify(currentQuiz));
}

function renderQuestion() {
  const { subject, level, index } = currentQuiz;
  const q = quizzes[subject][level][index];
  let html = `<h2>${subject.toUpperCase()} Level ${level}</h2>`;
  html += `<p><strong>Frage ${index + 1} von ${
    quizzes[subject][level].length
  }</strong></p>`;
  html += `<p><code>${escapeHTML(q.question)}</code></p>`;
  html += `<div id="feedback" class="feedback"></div>`;

  if (q.hint) {
    html += `
  <button id="hintBtn" class="hint-button">
    Hinweis anzeigen
  </button>
`;
    html += `<div id="hintText" style="display:none;color:#555;margin-top:5px;">${escapeHTML(
      q.hint,
    )}</div>`;
  }

  if (q.type === "mcq") {
    q.options.forEach((opt, i) => {
      html += `<button class="quiz-btn" onclick="checkAnswer(${i})"><code>${escapeHTML(
        opt,
      )}</code></button>`;
    });
  } else if (q.type === "mcq-multi") {
    html += `<form id="mcqMultiForm">`;
    q.options.forEach((opt, i) => {
      html += `<label><input type="checkbox" name="option" value="${i}"><code>${escapeHTML(
        opt,
      )}</code></label><br>`;
    });
    html += `<button type="button" class="check-btn" onclick="checkMulti()">
  Antwort prüfen
</button></form>`;
  } else if (q.type === "tf") {
    html += `<button class="quiz-btn" onclick="checkAnswer(true)">Richtig</button>`;
    html += `<button class="quiz-btn" onclick="checkAnswer(false)">Falsch</button>`;
  } else if (q.type === "text") {
    html += `
    <div style="max-width: 480px; margin: 20px auto;">
      <input type="text" id="textAnswer" placeholder="Antwort hier..." style="width: 100%;">
      <button onclick="checkText()" class="check-btn" style="margin-top: 12px;">Antwort prüfen</button>
    </div>
  `;
  }

  mainContent.innerHTML = html;

  // Hint Button Event
  const hintBtn = document.getElementById("hintBtn");
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      const hintText = document.getElementById("hintText");
      hintText.style.display =
        hintText.style.display === "none" ? "block" : "none";
    });
  }

  saveAppState();
}

// Prüfen Funktionen
function checkAnswer(selected) {
  const { subject, level, index } = currentQuiz;
  const q = quizzes[subject][level][index];
  const feedback = document.getElementById("feedback");
  let correct =
    q.type === "mcq" ? q.answer.includes(selected) : selected === q.answer;
  if (correct) {
    feedback.textContent = "Richtig!";
    currentQuiz.answers[index] = true;
    setTimeout(nextQuestion, 700);
  } else {
    feedback.textContent = "Falsch! Wiederholen.";
    if (!currentQuiz.repeatQueue.includes(index))
      currentQuiz.repeatQueue.push(index);
    currentQuiz.answers[index] = false;
    setTimeout(nextQuestion, 700);
  }
  saveAppState();
}

function checkMulti() {
  const { subject, level, index } = currentQuiz;
  const q = quizzes[subject][level][index];
  const selected = Array.from(
    document.querySelectorAll("input[name=option]:checked"),
  ).map((i) => parseInt(i.value));
  const feedback = document.getElementById("feedback");
  const correct =
    JSON.stringify(selected.sort()) === JSON.stringify(q.answer.sort());
  if (correct) {
    feedback.textContent = "Richtig!";
    currentQuiz.answers[index] = true;
    setTimeout(nextQuestion, 700);
  } else {
    feedback.textContent = "Falsch! Wiederholen.";
    if (!currentQuiz.repeatQueue.includes(index))
      currentQuiz.repeatQueue.push(index);
    currentQuiz.answers[index] = false;
    setTimeout(nextQuestion, 700);
  }
  saveAppState();
}

function checkText() {
  const { subject, level, index } = currentQuiz;
  const q = quizzes[subject][level][index];
  const val = document.getElementById("textAnswer").value.trim();
  const feedback = document.getElementById("feedback");
  const correct = val.toLowerCase() === q.answer.toLowerCase();
  if (correct) {
    feedback.textContent = "Richtig!";
    currentQuiz.answers[index] = true;
    setTimeout(nextQuestion, 700);
  } else {
    feedback.textContent = "Falsch! Wiederholen.";
    if (!currentQuiz.repeatQueue.includes(index))
      currentQuiz.repeatQueue.push(index);
    currentQuiz.answers[index] = false;
    setTimeout(nextQuestion, 700);
  }
  saveAppState();
}

function nextQuestion() {
  if (currentQuiz.repeatQueue.length > 0) {
    currentQuiz.index = currentQuiz.repeatQueue.shift();
    renderQuestion();
  } else {
    const { subject, level, index } = currentQuiz;
    if (index + 1 < quizzes[subject][level].length) {
      currentQuiz.index++;
      renderQuestion();
    } else {
      mainContent.innerHTML =
        "<h2>Quiz beendet!</h2><p>Quiz beendet. Tippe auf die drei Striche oben für weitere Optionen.</p>";
      localStorage.removeItem("currentQuiz"); // optional
    }
  }
}

function showVideosPage() {
  mainContent.innerHTML = `
    <h1 style="text-align:center;">LernCoding Videos</h1>
    <p style="text-align:center;">Hier findest du nützliche Lernvideos!</p>

    <input
      type="text"
      id="videoSearch"
      placeholder="Suche Videos..."
      style="width:100%;padding:8px;margin:16px auto;border-radius:8px;border:1px solid #ccc;max-width:600px;display:block;"
      onkeyup="filterVideos()"
    >

    <div style="
      display:flex;
      flex-direction:column;
      gap:32px;
      margin-top:24px;
      padding:0 16px;
      max-width:1200px;
      margin-left:auto;
      margin-right:auto;
    ">

      <div class="video" data-search="html grundlagen webentwicklung">
        ${createVideo(
          "HTML Grundlagen einfach erklärt – Dein Einstieg in die Webentwicklung",
          "https://www.youtube.com/embed/nmiWXn6aIAs",
        )}
      </div>

      <div class="video" data-search="vscode visual studio code installieren">
        ${createVideo(
          "Visual Studio Code installieren – Schritt für Schritt erklärt",
          "https://www.youtube.com/embed/Glolz8NG0qY",
        )}
      </div>

      <div class="video" data-search="seo google ranking optimieren">
        ${createVideo(
          "SEO optimieren – So rankst du bei Google besser",
          "https://www.youtube.com/embed/rNRjB60CXI0",
        )}
      </div>

    </div>
  `;

  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
}
function filterVideos() {
  const search = document.getElementById("videoSearch").value.toLowerCase();

  document.querySelectorAll(".video").forEach((video) => {
    video.style.display = video.dataset.search.includes(search)
      ? "block"
      : "none";
  });
}
function showTextPage() {
  mainContent.innerHTML = `
    <section class="materials">
      <h2>Unterrichtsmaterialien</h2>
      <p class="intro">
        Hier findest du nützliche Arbeitsblätter zum Download.
      </p>

      <!-- Suchleiste -->
      <input 
        type="text" 
        id="searchInput" 
        placeholder="Thema suchen..." 
        class="search-bar"
        onkeyup="filterMaterials()"
      >

      <!-- Container für alle Karten -->
      <div class="materials-grid" id="materialsGrid">

        <div class="material-card" data-title="HTML Grundlagen">
          <h3>Arbeitsblatt: HTML Grundlagen</h3>
          <p>Grundlagen zu HTML.</p>

          <div class="pdf-preview">
            <embed src="HTML_WebDev_Grundlagen_und_Recht_LernCoding.pdf"
              type="application/pdf" width="100%" height="300px">
          </div>

          <a class="download-btn" href="HTML_WebDev_Grundlagen_und_Recht_LernCoding.pdf" download>
            PDF herunterladen
          </a>
        </div>

        <div class="material-card" data-title="Python Grundlagen">
          <h3>Arbeitsblatt: Python Grundlagen</h3>
          <p>Einführung in Python.</p>

          <div class="pdf-preview">
            <embed src="Python_Grundlagen_LernCoding.pdf"
              type="application/pdf" width="100%" height="300px">
          </div>

          <a class="download-btn" href="Python_Grundlagen_LernCoding.pdf" download>
            PDF herunterladen
          </a>
        </div>
  <div class="material-card" data-title="Steckbrief erstellen mit HTML">
          <h3>Arbeitsblatt: Steckbrief erstellen mit HTML</h3>
          <p>Erstelle ein Steckbrief mit HTML.</p>

          <div class="pdf-preview">
            <embed src="Arbeitsplan_Steckbrief_HTML_CSS.pdf"
              type="application/pdf" width="100%" height="300px">
          </div>

          <a class="download-btn" href="Arbeitsplan_Steckbrief_HTML_CSS.pdf" download>
            PDF herunterladen
          </a>
        </div>
          <div class="material-card" data-title="Python Geburtstagsnachricht Generator">
          <h3>Code: Python Geburtstagsnachricht Generator</h3>
          <p>Erstelle eine Geburtstagsnachricht mit Python.</p>

          <div class="pdf-preview">
            <embed src="Python_gratuliere.pdf"
              type="application/pdf" width="100%" height="300px">
          </div>

          <a class="download-btn" href="Python_gratuliere.pdf" download>
            PDF herunterladen
          </a>
        </div>
         <div class="material-card" data-title="To Do App mit HTML, CSS & JavaScript">
          <h3>Code: To Do App mit HTML, CSS & JavaScript</h3>
          <p>Erstelle eine To Do App mit HTML, CSS & JavaScript.</p>

          <div class="pdf-preview">
            <embed src="to_do.pdf"
              type="application/pdf" width="100%" height="300px">
          </div>

          <a class="download-btn" href="to_do.pdf" download>
            PDF herunterladen
          </a>
        </div>

<div class="material-card" data-title="Erstelle einen Discord Bot">
          <h3>Code: Discord Bot</h3>
          <p>Erstelle einen Discord Bot mit Python.</p>

          <div class="pdf-preview">
            <embed src="DiscordBot-Standard.pdf"
              type="application/pdf" width="100%" height="300px">
          </div>

          <a class="download-btn" href="DiscordBot-Standard.pdf" download>
            PDF herunterladen
          </a>
        </div>

      </div>
    </section>
  `;

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
}
function filterMaterials() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".material-card");

  cards.forEach((card) => {
    // Titel und Beschreibung auslesen
    const title = card.querySelector("h3").textContent.toLowerCase();
    const description = card.querySelector("p").textContent.toLowerCase();

    // Prüfen, ob Titel oder Beschreibung den Suchbegriff enthalten
    if (title.includes(input) || description.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function createVideo(title, src) {
  return `
    <div>
      <h4 style="margin-bottom:8px;">${title}</h4>
      <div style="
        position:relative;
        width:100%;
        padding-top:56.25%;
      ">
        <iframe
          src="${src}"
          style="
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            border-radius:12px;
          "
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `;
}
// Typing-Effect mit Light/Dark Mode Unterstützung
const words = ["Hobbys", "Fähigkeiten", "Karriere"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.getElementById("typing-text");
const typingSpeed = 120;
const deleteSpeed = 70;
const waitTime = 1800;

// Funktion, um die aktuelle Farbe aus CSS-Variable zu holen
function updateTypingColor() {
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue("--typing-color").trim();
  typingElement.style.color = color;
}

function type() {
  updateTypingColor(); // Farbe vor jedem Schritt updaten (für Theme-Wechsel)

  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(type, waitTime);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(type, isDeleting ? deleteSpeed : typingSpeed);
}

type(); // Start

function showStartPage() {
  mainContent.innerHTML = `
  <section id="homepage">
  <div class="hero-container">
    
    <!-- Linke Seite – dein aktueller Inhalt -->
    <div class="hero-left">
      <h1 style="text-align: start">Entwickle mit uns deine</h1>
      <h2 style="max-width: 40%; font-size: 20px;" class="start-item">
        #<span style="font-size: 20px;" id="typing-text" class="gradiant-text"></span>
      </h2>
      <p style="color: var(--text);">kostenlos · einfach · schnell</p>
      
      <div style="display:flex; justify-content: start; align-items: start;" class="stat-cards">
        <div class="stat-card" id="screentime-box">
          <div class="stat-title">Screentime</div>
          <div class="stat-value" id="screentime-value">0s</div>
        </div>
        <div class="stat-card" id="streak-box">
          <div class="stat-title">Streak</div>
          <div class="stat-value" id="streak-value">0 Tage</div>
        </div>
      </div>
      
      <p class="info-box">Interaktive Kurse, echte Projekte und <br>Challenges
      perfekt für Anfänger und Fortgeschrittene. </p>




      
    </div>
    <div class="start-list">
       

        <button class="start-item" onclick="startQuiz('webdev',1)">
          <svg width="36" height="36" viewBox="0 0 32 32" aria-hidden="true" style="margin-right:12px;flex-shrink:0;vertical-align:middle;fill:currentColor">
            <rect x="4" y="6" width="24" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
            <line x1="4" y1="10" x2="28" y2="10" stroke="currentColor" stroke-width="1.5" />
            <rect x="8" y="14" width="16" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
          <div>
            <strong>Quiz machen</strong>
            <span>Teste dein Wissen spielerisch</span>
          </div>
        </button>

        <button class="start-item" onclick="showVideosPage()">
          <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" style="margin-right:12px;flex-shrink:0;vertical-align:middle;fill:currentColor">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="currentColor" />
            <polygon points="10,8 10,16 16,12" fill="#fff" />
          </svg>
          <div>
            <strong>Videos ansehen</strong>
            <span>Erklärvideos einfach & verständlich</span>
          </div>
        </button>

        <button class="start-item" onclick="showTextPage()">
          <svg class="icon-pdf" width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" style="margin-right:12px;flex-shrink:0;vertical-align:middle;fill:currentColor">
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="1.5" />
            <line x1="4" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.5" />
            <line x1="4" y1="16" x2="14" y2="16" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <div>
            <strong>Unterrichtsmaterialien</strong>
            <span>Geeignet für Einsteiger</span>
          </div>
        </button>

        <button class="start-item" onclick="showAccountPage()">
          <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" style="margin-right:12px;flex-shrink:0;vertical-align:middle;fill:currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <div>
            <strong>Mein Account</strong>
            <span>Fortschritt & Einstellungen</span>
          </div>
        </button>
              <button class="start-item" onclick="showTutorialPage()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            style="
              margin-right: 12px;
              flex-shrink: 0;
              vertical-align: middle;
              fill: currentColor;
            "
          >
            <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>

          <div>
            <strong>Zur App machen</strong>
            <span>Tutorial wie man die Website zur App macht</span>
          </div>
        </button>
      </div>
    </div>
      </section>
  
</div>


  

<section class="video-section wavy-top" id="videos">
  <div class="video-container" style="text-align: center;">
    <h2>Was ist LernCoding?</h2>
    <div class="info-box">
      <p>Entdecke, wie LernCoding dir hilft, Programmieren einfach und
      interaktiv zu lernen, perfekt für Anfänger und Fortgeschrittene und von jedem Gerät aus!</p> 
    </div>
    <iframe
      src="https://www.youtube.com/embed/sXjFND-XXyQ"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  </div>
</section>


<section class="top-courses" id="intro">
  <div class="content-wrapper">

    <div style="flex-direction: column; max-width: 100vw; margin: 0; padding: 0;" class="header career-header">
      <h2>IT-Berufsfinder</h2>
      <div class="info-box">
        <p>Beantworte ein paar Fragen und finde heraus, welcher IT-Beruf wirklich zu dir passt.</p>
      </div>
    </div>

    <div class="career-finder">

      <div class="question-box" id="questionBox">
        <h3 id="questionText"></h3>
        <div class="answers" id="answers"></div>
      </div>

      <div style="margin-top: 3vh;" class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>

      <div class="result-box" id="resultBox" style="display:none;">
        <h3>Dein Interessenprofil</h3>
        <canvas id="interestChart"></canvas>
        <div class="career-ranking" id="careerRanking"></div>
      </div>

      <div class="nav-buttons">
        <button id="prevQuestion" class="nav-btn prev">← Zurück</button>
        <button id="nextQuestion" class="nav-btn next">Weiter →</button>
      </div>

<button id="restartQuiz" class="restart-btn" onclick="restartCareerFinder()">Quiz neustarten</button>

    </div>

  </div>
</section>



<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
;


<!-- ================== BLOG VORSCHAU – mit Mobile-Swipe ================== -->
<section  class="blog-preview-section" id="blog-preview">
  <div class="content-wrapper">
    <div class="section-header">
      <h2>Neueste Blog-Artikel</h2>
      <p class="section-subtitle">Persönliche Gedanken, Motivation & Learnings</p>
      <a href="blog.html" class="all-articles-link">Alle Beiträge ansehen →</a>
    </div>

    <div class="blog-carousel-wrapper">
      <div class="blog-carousel" id="blogCarousel">
        <!-- Artikel 1 -->
        <article class="blog-card">
          <div class="blog-content">
            <div class="blog-meta">
              <span class="blog-date">31. Januar 2026</span>
              <span class="blog-category">PROGRAMMING</span>
            </div>
            <h3 class="blog-title">
              <a href="blog.html">Der Gedanke hinter LernCoding</a>
            </h3>
            <p class="blog-excerpt">
              Als Jugendlicher verbrang ich Tage und Nächte lang vor dem PC und spielte Spiele. Ich wusste, dass sich eines Tages irgendetwas ändern muss...
            </p>
            <div class="blog-footer">
              <span class="read-time">~4 Min</span>
              <a href="blog.html" class="read-more">Weiterlesen →</a>
            </div>
          </div>
        </article>

        <!-- Artikel 2 -->
        <article class="blog-card">
          <div class="blog-content">
            <div class="blog-meta">
              <span class="blog-date">30. Januar 2026</span>
              <span class="blog-category">TEXT</span>
            </div>
            <h3 class="blog-title">
              <a href="blog.html">Meine Social Media Reise</a>
            </h3>
            <p class="blog-excerpt">
              Letzte Nacht dachte ich echt: „Keine Lust mehr.“ Motivation null. Heute Morgen trotzdem TikTok auf und jetzt habe ich wieder Bock...
            </p>
            <div class="blog-footer">
              <span class="read-time">~5 Min</span>
              <a href="blog.html" class="read-more">Weiterlesen →</a>
            </div>
          </div>
        </article>

 <article class="blog-card">
          <div class="blog-content">
            <div class="blog-meta">
              <span class="blog-date">08. Februar 2026</span>
              <span class="blog-category">TEXT</span>
            </div>
            <h3 class="blog-title">
              <a href="blog.html">Der erste Launch</a>
            </h3>
            <p class="blog-excerpt">
              Das erste Mal als ich LernCoding gelaunched habe dachte ich, dass sich niemand für die Seite interessieren würde, doch dann...
            </p>
            <div class="blog-footer">
              <span class="read-time">~2 Min</span>
              <a href="blog.html" class="read-more">Weiterlesen →</a>
            </div>
          </div>
        </article>

      </div>

      <!-- Pfeile (nur Desktop) -->
      <button class="carousel-prev" aria-label="Vorheriger Artikel">←</button>
      <button class="carousel-next" aria-label="Nächster Artikel">→</button>
    </div>
  </div>
</section>

<section style="margin-top:0vh;" class="socials-section" id="intro">
  <div class="container">
    <h2 class="section-title">Kontakt</h2>
    <p class="section-subtitle">Hamburg • Content • Community</p>

    <div class="social-grid">
      <a href="https://www.tiktok.com/@codehxb" target="_blank" rel="noopener noreferrer" class="social-item">
        <div class="icon-wrapper">
          <i class="fab fa-tiktok"></i>
        </div>
        <span class="platform">TikTok</span>
        <span class="handle">@codehxb</span>
      </a>

      <a href="https://www.youtube.com/@lerncoding2026" target="_blank" rel="noopener noreferrer" class="social-item">
        <div class="icon-wrapper">
          <i class="fab fa-youtube"></i>
        </div>
        <span class="platform">YouTube</span>
        <span class="handle">@LernCoding2026</span>
      </a>

      <a href="https://discord.gg/codebase" target="_blank" rel="noopener noreferrer" class="social-item">
        <div class="icon-wrapper">
          <i class="fab fa-discord"></i>
        </div>
        <span class="platform">Discord</span>
        <span class="handle">discord.gg/codebase</span>
      </a>

      <!-- Beispiel für weitere Plattformen – einfach kopieren & anpassen -->
      <!--
      <a href="https://instagram.com/ata_real" target="_blank" class="social-item">
        <div class="icon-wrapper">
          <i class="fab fa-instagram"></i>
        </div>
        <span class="platform">Instagram</span>
        <span class="handle">@ata_real</span>
      </a>
      -->
    </div>
<div class="contact">
  Business / Kooperationen:  
  <a href="mailto:lerncoding2026@gmail.com" class="email-link">lerncoding2026@gmail.com</a>
</div>

<div class="legal-links">
  <a href="impressum.html" class="legal-btn">Impressum</a>
  <a href="agb-datenschutz.html" class="legal-btn">Datenschutz & AGB</a>
</div>
<style>
.legal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;                    /* etwas mehr Luft zwischen den Buttons */
  justify-content: center;         /* ← das macht die Buttons horizontal mittig */
  align-items: center;
  margin: 2.5rem auto 2rem;        /* mehr Abstand nach oben + auto für horizontale Zentrierung */
  max-width: 600px;                /* verhindert, dass es bei sehr breiten Screens zu weit auseinandergeht */
}

.legal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  min-width: 130px;                /* etwas breiter → sieht ausgewogener aus */
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 0.97rem;
  font-weight: 500;
  color: var(--text);
  background: var(--start-bg);
  border: 1px solid var(--text);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.22s ease;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15);
}

.legal-btn:hover,
.legal-btn:focus {
  background: #004999;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 102, 204, 0.28);
  color: white;
}

/* Mobile Anpassung */
@media (max-width: 480px) {
  .legal-links {
    flex-direction: column;
    gap: 1rem;
    margin: 2rem auto;
  }
  
  .legal-btn {
    width: 100%;
    max-width: 260px;              /* verhindert ultra-breite Buttons auf Handy */
  }
}

/* Dark Mode (falls du es brauchst) */
@media (prefers-color-scheme: dark) {
  .legal-btn {
    background: #60a5fa;
    border-color: #60a5fa;
  }
  .legal-btn:hover,
  .legal-btn:focus {
    background: #3b82f6;
  }
}
</style>

  </div>
</section>



<!-- Font Awesome CDN (Icons) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<style>


  .socials-section {
   
    text-align: center;
  background: var(--start-bg);
  color: var(--text);
  width: 100vw;
  padding: 5rem 2rem;
  box-sizing: border-box;
  margin-top: 10vh;
  margin-bottom: -10vh;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .section-title {
    font-size: 2.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .section-subtitle {
    font-size: 1rem;
    opacity: 0.6;
    margin-bottom: 50px;
  }

  .social-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-bottom: 50px;
  }

  .social-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.25s ease;
    border: var(--text) 1px solid;
  }

  .social-item:hover {
    transform: translateY(-3px);
  }

  .icon-wrapper {
    font-size: 2.1rem;
    margin-bottom: 14px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
  }


  /* Plattform-spezifische Farben (dezente Variante) */
  .social-item:nth-child(1) .icon-wrapper { color: #ff0050; } /* TikTok */
  .social-item:nth-child(2) .icon-wrapper { color: #ff0000; } /* YouTube */
  .social-item:nth-child(3) .icon-wrapper { color: #5865f2; } /* Discord */

  .platform {
    font-size: 1.05rem;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .handle {
    font-size: 0.9rem;
    opacity: 0.65;
  }

  .contact {
    font-size: 0.95rem;
    opacity: 0.7;
    margin-top: 30px;
  }

  .email-link {
    text-decoration: none;
    transition: color 0.2s;
  }

  .email-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    .socials-section {
      padding: 50px 16px 70px;
    }
    .section-title {
      font-size: 1.8rem;
    }
    .social-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .social-item {
      padding: 20px 14px;
    }
  }
</style>




</div>
  `;
  // Typing-Effect mit Light/Dark Mode Unterstützung
  const words = ["Hobbys", "Fähigkeiten", "Karriere"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typingElement = document.getElementById("typing-text");
  const typingSpeed = 120;
  const deleteSpeed = 70;
  const waitTime = 1800;

  // Funktion, um die aktuelle Farbe aus CSS-Variable zu holen
  function updateTypingColor() {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue("--typing-color").trim();
    typingElement.style.color = color;
  }

  function type() {
    updateTypingColor(); // Farbe vor jedem Schritt updaten (für Theme-Wechsel)

    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, waitTime);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(type, isDeleting ? deleteSpeed : typingSpeed);
  }

  type(); // Start
  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");

  // Quiz-Zustand zurücksetzen
  localStorage.removeItem("currentQuiz");
  currentQuiz = null;
  // Stats initialisieren (wichtig nach Inhaltserzeugung)

  if (typeof initStats === "function") initStats();
  // remove python page class when showing start
  mainContent.classList.remove("python-page");

  // ===== Berufsfinder initialisieren =====
  setTimeout(() => {
    const qText = document.getElementById("questionText");
    const answersDiv = document.getElementById("answers");
    const progressFill = document.getElementById("progressFill");
    const questionBox = document.getElementById("questionBox");
    const resultBox = document.getElementById("resultBox");
    const prevBtn = document.getElementById("prevQuestion");
    const nextBtn = document.getElementById("nextQuestion");

    // Prüfen ob alle Elemente existieren
    if (!qText || !answersDiv) {
      console.warn("Career finder elements not found");
      return;
    }

    function showStartPage() {
      // alle aktiven Zustände entfernen
      document.querySelectorAll(".active").forEach((el) => {
        el.classList.remove("active");
      });

      // optional: alle Bereiche ausblenden
      document.querySelectorAll(".page").forEach((el) => {
        el.style.display = "none";
      });

      // Startseite anzeigen
      document.getElementById("startPage").style.display = "block";
    }

    // Berufsfinder Daten initialisieren
    window.careers = ["web", "data", "software", "it", "security", "ai"];

    window.scores = {
      web: 0,
      data: 0,
      software: 0,
      it: 0,
      security: 0,
      ai: 0,
    };

    window.questions = [
      {
        q: "Was macht dir am meisten Spaß?",
        a: [
          ["Design & Layout", "web"],
          ["Daten analysieren", "data"],
          ["Programme bauen", "software"],
          ["Systeme einrichten", "it"],
        ],
      },
      {
        q: "Wie arbeitest du am liebsten?",
        a: [
          ["Kreativ", "web"],
          ["Analytisch", "data"],
          ["Strukturiert", "software"],
          ["Praktisch", "it"],
        ],
      },
      {
        q: "Welche Tools klingen spannend?",
        a: [
          ["HTML/CSS (Websiten)", "web"],
          ["Python/SQL (Datenbanken)", "data"],
          ["Java/C# (Software)", "software"],
          ["Linux/Server (Informatik)", "it"],
        ],
      },
      {
        q: "Was reizt dich mehr?",
        a: [
          ["Benutzeroberflächen", "web"],
          ["KI & Modelle", "ai"],
          ["Algorithmen", "software"],
          ["Sicherheit", "security"],
        ],
      },
      {
        q: "Wie wichtig ist Design?",
        a: [
          ["Sehr wichtig", "web"],
          ["Eher unwichtig", "software"],
          ["Gar nicht", "data"],
          ["Mittel", "it"],
        ],
      },
      {
        q: "Welche Probleme löst du lieber?",
        a: [
          ["User Probleme", "web"],
          ["Datenprobleme", "data"],
          ["Systemprobleme", "it"],
          ["Logikprobleme", "software"],
        ],
      },
      {
        q: "Was klingt cool?",
        a: [
          ["Web Apps", "web"],
          ["Big Data", "data"],
          ["Betriebssysteme", "it"],
          ["Cyberangriffe stoppen", "security"],
        ],
      },
      {
        q: "Wie lernst du?",
        a: [
          ["Mit Tutorials", "web"],
          ["Mit Mathe", "data"],
          ["Mit Code", "software"],
          ["Mit Praxis", "it"],
        ],
      },
      {
        q: "Was ist dir wichtig?",
        a: [
          ["Kreativität", "web"],
          ["Genauigkeit", "data"],
          ["Performance", "software"],
          ["Stabilität", "it"],
        ],
      },
      {
        q: "Welche Branche reizt dich?",
        a: [
          ["Startups", "web"],
          ["Forschung", "ai"],
          ["Große Softwarefirmen", "software"],
          ["IT-Abteilungen", "it"],
        ],
      },
    ];

    window.current = 0;
    window.qText = qText;
    window.answersDiv = answersDiv;
    window.progressFill = progressFill;
    window.questionBox = questionBox;
    window.resultBox = resultBox;

    window.selectedAnswers = new Array(window.questions.length).fill(null);

    // Event-Listener für Buttons setzen
    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        prevCareerQuestion();
      };
    }
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        nextCareerQuestion();
      };
    }

    // Gespeicherten Zustand laden
    loadCareerFinderState();
  }, 50);
}

const profilePic = document.getElementById("profile-pic");
profilePic.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      profilePic.src = ev.target.result;
      localStorage.setItem("profilePic", ev.target.result);
    };
    reader.readAsDataURL(file);
  });

  fileInput.click();
});

/* ===== Loading overlay animation: schließt Kreis und verschwindet nach load ===== */
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader-overlay");
  if (!loader) return;
  const ring = loader.querySelector(".ring");

  // ensure a minimum visible time (ms)
  const minVisible = 500;
  let done = false;

  function closeLoader() {
    if (done) return;
    done = true;
    loader.classList.add("closing");
    // wait for stroke animation to finish, then fade out
    const onEnd = (e) => {
      loader.classList.add("done");
      loader.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    };
    if (ring) ring.addEventListener("transitionend", onEnd, { once: true });
    else setTimeout(onEnd, 1000);
  }

  // If the window load event already fired, close after minVisible
  const whenLoaded = () => setTimeout(closeLoader, minVisible);

  if (document.readyState === "complete") {
    whenLoaded();
  } else {
    window.addEventListener("load", whenLoaded);
  }

  // ===== Berufsfinder bei initialer index.html initialisieren =====
  setTimeout(() => {
    const questionBox = document.getElementById("questionBox");
    const answersDiv = document.getElementById("answers");
    const progressFill = document.getElementById("progressFill");
    const resultBox = document.getElementById("resultBox");
    const qText = document.getElementById("questionText");

    // Nur wenn wir auf der index.html sind (mit Berufsfinder-Elementen)
    if (questionBox && answersDiv && !window.questions) {
      // Berufsfinder initialisieren
      window.careers = ["web", "data", "software", "it", "security", "ai"];

      window.scores = {
        web: 0,
        data: 0,
        software: 0,
        it: 0,
        security: 0,
        ai: 0,
      };

      window.questions = [
        {
          q: "Was macht dir am meisten Spaß?",
          a: [
            ["Design & Layout", "web"],
            ["Daten analysieren", "data"],
            ["Programme bauen", "software"],
            ["Systeme einrichten", "it"],
          ],
        },
        {
          q: "Wie arbeitest du am liebsten?",
          a: [
            ["Kreativ", "web"],
            ["Analytisch", "data"],
            ["Strukturiert", "software"],
            ["Praktisch", "it"],
          ],
        },
        {
          q: "Welche Tools klingen spannend?",
          a: [
            ["HTML/CSS (Websiten)", "web"],
            ["Python/SQL (Datenbanken)", "data"],
            ["Java/C# (Software)", "software"],
            ["Linux/Server (Informatik)", "it"],
          ],
        },
        {
          q: "Was reizt dich mehr?",
          a: [
            ["Benutzeroberflächen", "web"],
            ["KI & Modelle", "ai"],
            ["Algorithmen", "software"],
            ["Sicherheit", "security"],
          ],
        },
        {
          q: "Wie wichtig ist Design?",
          a: [
            ["Sehr wichtig", "web"],
            ["Eher unwichtig", "software"],
            ["Gar nicht", "data"],
            ["Mittel", "it"],
          ],
        },
        {
          q: "Welche Probleme löst du lieber?",
          a: [
            ["User Probleme", "web"],
            ["Datenprobleme", "data"],
            ["Systemprobleme", "it"],
            ["Logikprobleme", "software"],
          ],
        },
        {
          q: "Was klingt cool?",
          a: [
            ["Web Apps", "web"],
            ["Big Data", "data"],
            ["Betriebssysteme", "it"],
            ["Cyberangriffe stoppen", "security"],
          ],
        },
        {
          q: "Wie lernst du?",
          a: [
            ["Mit Tutorials", "web"],
            ["Mit Mathe", "data"],
            ["Mit Code", "software"],
            ["Mit Praxis", "it"],
          ],
        },
        {
          q: "Was ist dir wichtig?",
          a: [
            ["Kreativität", "web"],
            ["Genauigkeit", "data"],
            ["Performance", "software"],
            ["Stabilität", "it"],
          ],
        },
        {
          q: "Welche Branche reizt dich?",
          a: [
            ["Startups", "web"],
            ["Forschung", "ai"],
            ["Große Softwarefirmen", "software"],
            ["IT-Abteilungen", "it"],
          ],
        },
      ];

      window.current = 0;
      window.qText = qText;
      window.answersDiv = answersDiv;
      window.progressFill = progressFill;
      window.questionBox = questionBox;
      window.resultBox = resultBox;

      window.selectedAnswers = new Array(window.questions.length).fill(null);

      // Event-Listener für Buttons setzen
      const prevBtn = document.getElementById("prevQuestion");
      const nextBtn = document.getElementById("nextQuestion");
      const restartBtn = document.getElementById("restartQuiz");

      if (prevBtn) {
        prevBtn.onclick = (e) => {
          e.preventDefault();
          prevCareerQuestion();
        };
      }
      if (nextBtn) {
        nextBtn.onclick = (e) => {
          e.preventDefault();
          nextCareerQuestion();
        };
      }
      if (restartBtn) {
        restartBtn.onclick = (e) => {
          e.preventDefault();
          restartCareerFinder();
        };
      }

      // Gespeicherten Zustand laden oder erste Frage anzeigen
      loadCareerFinderState();
    }
  }, 100);
});

// Lade gespeichertes Profilbild in Header (falls vorhanden)
try {
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) profilePic.src = savedPic;
} catch (e) {
  // ignore
}

// ===== Career Finder State Management =====
function saveCareerFinderState() {
  if (
    typeof window.current !== "undefined" &&
    typeof window.selectedAnswers !== "undefined" &&
    typeof window.scores !== "undefined"
  ) {
    const state = {
      current: window.current,
      selectedAnswers: window.selectedAnswers,
      scores: window.scores,
    };
    localStorage.setItem("careerFinderState", JSON.stringify(state));
  }
}

function loadCareerFinderState() {
  // Nur wenn die notwendigen Elemente verfügbar sind
  if (
    typeof window.questions === "undefined" ||
    !document.getElementById("questionBox")
  ) {
    return;
  }

  const state = JSON.parse(localStorage.getItem("careerFinderState"));
  if (state && typeof window.current !== "undefined") {
    window.current = state.current;
    window.selectedAnswers = state.selectedAnswers;
    window.scores = state.scores;

    // Nur laden wenn wir noch nicht beim Ergebnis sind
    if (window.current < window.questions.length) {
      loadCareerQuestion();
    }
  } else {
    // Erste Frage laden wenn kein Zustand gespeichert
    loadCareerQuestion();
  }
}

function loadCareerQuestion() {
  if (!window.questions || !window.qText) return;

  const q = window.questions[window.current];
  window.qText.textContent = q.q;
  window.answersDiv.innerHTML = "";

  q.a.forEach((ans) => {
    const btn = document.createElement("button");
    btn.textContent = ans[0];
    btn.classList.add("answers-btn"); // Für Styling

    // Highlight, wenn schon ausgewählt
    if (
      window.selectedAnswers &&
      window.selectedAnswers[window.current] === ans[1]
    ) {
      btn.classList.add("selected");
    }

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Alte Auswahl entfernen (visuell)
      Array.from(window.answersDiv.children).forEach((b) =>
        b.classList.remove("selected"),
      );
      btn.classList.add("selected");

      // Score nur ändern, wenn es eine neue Auswahl ist oder geändert wird
      if (window.selectedAnswers[window.current] !== null) {
        window.scores[window.selectedAnswers[window.current]]--;
      }
      window.selectedAnswers[window.current] = ans[1];
      window.scores[ans[1]]++;

      updateCareerNavButtons();
      saveCareerFinderState();
    };
    window.answersDiv.appendChild(btn);
  });

  window.progressFill.style.width =
    ((window.current + 1) / window.questions.length) * 100 + "%";
  updateCareerNavButtons();
}

function updateCareerNavButtons() {
  const prevBtn = document.getElementById("prevQuestion");
  const nextBtn = document.getElementById("nextQuestion");

  if (!prevBtn || !nextBtn) return;

  prevBtn.disabled = window.current === 0;
  nextBtn.disabled = window.selectedAnswers[window.current] === null;
}

function nextCareerQuestion() {
  if (
    window.selectedAnswers[window.current] !== null &&
    window.current < window.questions.length - 1
  ) {
    window.current++;
    loadCareerQuestion();
    saveCareerFinderState();
  } else if (
    window.selectedAnswers[window.current] !== null &&
    window.current === window.questions.length - 1
  ) {
    // Letzte Frage beantwortet → Ergebnisse zeigen
    showCareerResults();
  }
}

function prevCareerQuestion() {
  if (window.current > 0) {
    window.current--;
    loadCareerQuestion();
    saveCareerFinderState();
  }
}

function showCareerResults() {
  // Ergebnis-Box anzeigen, Frage ausblenden
  if (window.resultBox && window.questionBox) {
    window.questionBox.style.display = "none";
    window.resultBox.style.display = "block";
  }

  // Navigations-Buttons update
  const prevBtn = document.getElementById("prevQuestion");
  const nextBtn = document.getElementById("nextQuestion");
  if (prevBtn) prevBtn.disabled = false;
  if (nextBtn) nextBtn.disabled = true;

  // Scores sortieren und als Array konvertieren
  const sortedCareers = Object.entries(window.scores)
    .sort((a, b) => b[1] - a[1])
    .map(([career, score]) => ({ career, score }));

  // Grafik mit Chart.js rendern
  renderCareerChart(sortedCareers);

  // Rankings anzeigen
  const rankingDiv = document.getElementById("careerRanking");
  if (rankingDiv) {
    rankingDiv.innerHTML =
      "<h3 style='margin-top: 0;'>Deine Top-Karrieren:</h3>";

    sortedCareers.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("career-card");

      const careerNames = {
        web: "Web Development",
        data: "Data Science",
        software: "Software Engineering",
        it: "IT & Infrastruktur",
        security: "Cybersecurity",
        ai: "KI & Machine Learning",
      };

      const score = (
        (item.score / (window.questions.length * 2)) *
        100
      ).toFixed(0);
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${index + 1}. ${careerNames[item.career] || item.career}</span>
          <span style="font-weight: bold; color: #3b82f6;">${score}%</span>
        </div>
        <div style="background: #e5e7eb; border-radius: 4px; height: 8px; margin-top: 8px; overflow: hidden;">
          <div style="background: #3b82f6; height: 100%; width: ${score}%; transition: width 0.3s;"></div>
        </div>
      `;
      rankingDiv.appendChild(card);
    });
  }
}

function renderCareerChart(sortedCareers) {
  const canvas = document.getElementById("interestChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Alte Chart zerstören falls vorhanden
  if (window.careerChart) {
    window.careerChart.destroy();
  }

  const careerNames = {
    web: "Web Dev",
    data: "Data Science",
    software: "Software",
    it: "IT Ops",
    security: "Security",
    ai: "AI/ML",
  };

  const labels = sortedCareers.map((c) => careerNames[c.career] || c.career);
  const data = sortedCareers.map((c) => c.score);

  window.careerChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Interesse-Score",
          data: data,
          backgroundColor: [
            "#3b82f6",
            "#60a5fa",
            "#93c5fd",
            "#bfdbfe",
            "#dbeafe",
            "#eff6ff",
          ],
          borderColor: "#3b82f6",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: window.questions.length * 2,
        },
      },
    },
  });
}

function restartCareerFinder() {
  // Alle Scores zurücksetzen
  window.scores = {
    web: 0,
    data: 0,
    software: 0,
    it: 0,
    security: 0,
    ai: 0,
  };
  window.current = 0;
  window.selectedAnswers = new Array(window.questions.length).fill(null);

  // Ergebnis ausblenden, Frage wieder einblenden
  if (window.resultBox) window.resultBox.style.display = "none";
  if (window.questionBox) window.questionBox.style.display = "block";

  // Progress zurücksetzen
  if (window.progressFill) window.progressFill.style.width = "0%";

  // Erste Frage neu laden
  loadCareerQuestion();

  // State löschen
  localStorage.removeItem("careerFinderState");
}

function showAccountPage() {
  const savedName = localStorage.getItem("firstName") || "";
  const savedClass = localStorage.getItem("userClass") || "";
  const savedLang = localStorage.getItem("appLanguage") || "de";

  mainContent.innerHTML = `
<h2>Account Einstellungen</h2>
<p>Hier kannst du deine Account Einstellungen anpassen.</p>
<br>
<br>
<div style="
  max-width:420px;
  margin:auto;
  display:flex;
  flex-direction:column;
  gap:16px;
  align-items:flex-start; /* Alles links ausrichten */
">

  <!-- Profilbild -->
  <div style="text-align:left;">
    <img
      id="accountProfilePic"
      src="${
        localStorage.getItem("profilePic") || "https://via.placeholder.com/120"
      }"
      style="
        width:120px;
        height:120px;
        border-radius:50%;
        object-fit:cover;
        cursor:pointer;
        border:2px solid #ccc;
      "
    />
  </div>

  <!-- Name -->
  <label style="width:100%;">
    <strong>Name</strong>
    <input id="accName" value="${savedName}" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;">
  </label>

  <!-- Klasse -->
  <label style="width:100%;">
    <strong>Klasse</strong>
    <input id="accClass" value="${savedClass}" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;">
  </label>

  <!-- Speichern -->
  <button
    style="
      padding:12px;
      border:none;
      border-radius:10px;
      background:#4CAF50;
      color:white;
      font-size:16px;
      cursor:pointer;
      align-self:flex-start; /* Button auch links */
    "
    onclick="saveAccountSettings()"
  >
    Speichern
  </button>

</div>
`;

  // Profilbild Klick
  const pic = document.getElementById("accountProfilePic");
  pic.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        pic.src = e.target.result;
        profilePic.src = e.target.result; // Header aktualisieren
        localStorage.setItem("profilePic", e.target.result);
      };
      reader.readAsDataURL(file);
    };
  });

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");

  localStorage.removeItem("currentQuiz");
  currentQuiz = null;
}
function updateSidebarUserInfo() {
  const name = localStorage.getItem("firstName") || "Gast";
  const klasse = localStorage.getItem("userClass") || "—";

  // Die beiden Elemente in der Sidebar aktualisieren
  if (usernameElem) usernameElem.textContent = name;
  if (userclassElem) userclassElem.textContent = klasse;
}
function saveAccountSettings() {
  const name = document.getElementById("accName").value.trim();
  const userClass = document.getElementById("accClass").value.trim();

  if (!name || !userClass) {
    alert("Bitte Name und Klasse ausfüllen!");
    return;
  }

  localStorage.setItem("firstName", name);
  localStorage.setItem("userClass", userClass);

  // ── Wichtig ── beide Orte aktualisieren!
  updateSidebarUserInfo();

  // Optional: auch im Account-Bereich selbst aktualisieren (falls gewünscht)
  // usernameElem.textContent = name;
  // userclassElem.textContent = userClass;

  alert("Erfolgreich gespeichert!");
}

function showImpressum() {
  document.getElementById("main-content").innerHTML = `
    <h1>Impressum</h1>

    <p><strong>Angaben gemäß § 5 TMG:</strong></p>
    <p>
      Ata Zeran<br>
      LernCoding<br>
      Reclamstraße 4<br>
      22111 Hamburg<br>
      Deutschland
    </p>

    <p><strong>Kontakt:</strong></p>
    <p>
      E-Mail: <a href="mailto:lerncoding2026@gmail.com">lerncoding2026@gmail.com</a><br>
    </p>

    <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong></p>
    <p>
      Ata Zeran<br>
      Anschrift wie oben
    </p>

    <p><strong>Haftungshinweis:</strong></p>
    <p>
      Die Inhalte dieser Website dienen ausschließlich zu Lern- und Informationszwecken.  
      Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Vollständigkeit, Richtigkeit und Aktualität der Inhalte.  
      Für Schäden, die direkt oder indirekt aus der Nutzung der Website entstehen, wird keine Haftung übernommen.
    </p>

 
  `;

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
}

function showAGB() {
  document.getElementById("main-content").innerHTML = `
<h1>AGB & Datenschutzerklärung</h1>

<h2>1. Verantwortlicher</h2>
<p>
Ata Zeran<br>
Reclamstraße 4<br>
22111 Hamburg<br>
E-Mail: lerncoding2026@gmail.com
</p>

<h2>2. Allgemeines</h2>
<p>
Diese Website dient zu Informations- und Lernzwecken. Die Nutzung ist kostenlos.
Mit der Nutzung erklären Sie sich mit diesen Bedingungen einverstanden.
</p>

<h2>3. Haftung für Inhalte</h2>
<p>
Die Inhalte wurden mit größtmöglicher Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit
und Aktualität wird keine Haftung übernommen.
</p>

<h2>4. Lokale Datenspeicherung</h2>
<p>
Diese Website speichert Daten (z. B. Einstellungen oder Lernfortschritt) ausschließlich
temporär im Browser (Session Storage). Diese Daten werden nicht an Server übertragen
und beim Schließen des Browsers gelöscht.
</p>

<h2>5. E-Mail-Kontakt</h2>
<p>
Bei Kontaktaufnahme per E-Mail werden Ihre E-Mail-Adresse und der Inhalt der Nachricht
ausschließlich zur Bearbeitung gespeichert. Keine Weitergabe an Dritte.
</p>

<h2>6. Google AdSense</h2>
<p>
Diese Website nutzt Google AdSense der Google Ireland Limited, Gordon House, Barrow Street,
Dublin 4, Irland.
</p>
<p>
Google verarbeitet u. a. IP-Adresse, Geräteinformationen, Browserdaten und Nutzungsverhalten
mittels Cookies zur Anzeige personalisierter oder nicht-personalisierter Werbung.
</p>
<p>
Die Verarbeitung erfolgt ausschließlich auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
</p>
<p>
Es kann zu einer Übertragung von Daten in die USA kommen (EU-US Data Privacy Framework).
</p>
<p>
Google Datenschutzerklärung:
<a href="https://policies.google.com/privacy" target="_blank">https://policies.google.com/privacy</a>
</p>

<h2>7. Cookie-Einwilligung</h2>
<p>
Beim ersten Besuch wird Ihre Einwilligung zur Nutzung nicht notwendiger Cookies eingeholt.
Sie können diese jederzeit widerrufen, indem Sie Cookies im Browser löschen.
</p>

<h2>8. Rechte der Nutzer</h2>
<p>
Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
sowie Widerruf erteilter Einwilligungen.
</p>

<h2>9. Nutzung der Inhalte</h2>
<p>
Alle Inhalte sind ausschließlich für den privaten, nicht-kommerziellen Gebrauch bestimmt.
</p>

<h2>10. Impressum</h2>
<p>
Angaben gemäß §5 TMG:
</p>
<p>
Ata Zeran<br>
Reclamstraße 4<br>
22111 Hamburg<br>
Deutschland <br>
E-Mail: lerncoding2026@gmail.com
</p>
  `;

  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
}

function showCreateHTMLCSS() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>Html / Css</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. flexbox, farben, klassen, box model..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      HTML strukturiert Webseiten. CSS gestaltet das Aussehen (Farben, Layout, Schriftgrößen usw.).
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="htmlcssCode" class="python-editor">
<!DOCTYPE html>
<html>
<head>
<style>
h1 {
  color: blue;
}
</style>
</head>
<body>
<h1>Hallo Welt</h1>
<p>Das ist ein Absatz.</p>
</body>
</html>
      </textarea>
    </div>
    <button id="runBtn" class="run-btn">▶ Anzeigen</button>
    <iframe id="previewFrame" style="width:100%; height:300px; border-radius:8px; border:1px solid #ccc; margin-top:12px; background:white;"></iframe>
    
    <hr>

    <div class="video" data-search="html grundlagen webentwicklung">
      ${createVideo(
        "HTML Grundlagen",
        "https://www.youtube.com/embed/nmiWXn6aIAs",
      )}
    </div>
    
    <hr>

    <h3 data-search="grundstruktur html struktur">1. HTML Grundstruktur</h3>
    <div class="example-box">
&lt;html&gt;
  &lt;body&gt;
    Inhalt
  &lt;/body&gt;
&lt;/html&gt;
    </div>

    <h3 data-search="tags html elemente">2. HTML Tags</h3>
    <div class="example-box">
&lt;h1&gt;Überschrift&lt;/h1&gt;
&lt;p&gt;Text&lt;/p&gt;
&lt;a href="#"&gt;Link&lt;/a&gt;
    </div>

    <h3 data-search="farben css color">3. CSS Farben</h3>
    <div class="example-box">
h1 {
  color: red;
}
    </div>

    <h3 data-search="klassen class css">4. CSS Klassen</h3>
    <div class="example-box">
&lt;p class="text"&gt;Hallo&lt;/p&gt;
.text {
  color: green;
}
    </div>

    <h3 data-search="box model margin padding border">5. Box Model</h3>
    <div class="example-box">
div {
  margin: 10px;
  padding: 20px;
  border: 2px solid black;
}
    </div>

    <h3 data-search="flexbox flex">6. Flexbox</h3>
    <div class="example-box">
.container {
  display: flex;
  gap: 10px;
}
    </div>

  </div>

  <!-- Kleines CSS für die Suchleiste & Highlight -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #f8e7b3;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suche (wird nach dem Einfügen ausgeführt)
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      // Alle möglichen Überschriften suchen
      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          // Scrollen
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          // Kurz highlighten
          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // beim ersten Treffer aufhören
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    // Klick auf Button
    btn.addEventListener("click", performSearch);

    // Enter-Taste im Input
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });

    // Optional: Live-Suche während des Tippens (kann man auskommentieren)
    // input.addEventListener("input", performSearch);
  }, 100);

  document.getElementById("runBtn").onclick = () => {
    const code = document.getElementById("htmlcssCode").value;
    document.getElementById("previewFrame").srcdoc = code;
  };

  mainContent.classList.add("python-page");
  closeSidebar();
}

// ================================
// Python-Seite anzeigen
// ================================
function showCreatePython() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>Python</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. variablen, listen, funktionen, if, for, schleifen..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      Python wird verwendet, um Programme zu schreiben, Daten zu analysieren, Webseiten zu entwickeln und Automatisierungen zu erstellen.
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="pythonCode" class="python-editor">Vergiss nicht print("") einzusetzen</textarea>
      <pre id="output" class="python-output"></pre>
      <button id="runBtn" class="run-btn">▶ Code ausführen</button>
    </div>
    
    <hr>

    <h3 data-search="variablen variable zuweisung">1. Variablen</h3>
    <div class="example-box example-code" data-target-id="pythonCode">
      <pre><code>a = 5
text = "Hallo"
print(text, a)</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="datentypen integer string boolean type">2. Datentypen</h3>
    <div class="example-box example-code" data-target-id="pythonCode">
      <pre><code>zahl = 10
text = "Hallo"
ok = True
print(zahl, text, ok)</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="rechnen addition subtraktion multiplikation division modulo">3. Rechnen</h3>
    <div class="example-box example-code" data-target-id="pythonCode">
      <pre><code>a = 10
b = 3
print(a + b)      # 13
print(a - b)      # 7
print(a * b)      # 30
print(a / b)      # 3.333...
print(a // b)     # 3    (ganzzahlige Division)
print(a % b)      # 1    (Rest)</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="bedingungen if else elif vergleich">4. Bedingungen</h3>
    <div class="example-box example-code" data-target-id="pythonCode">
      <pre><code>alter = 18
if alter >= 18:
    print("Erwachsen")
else:
    print("Minderjährig")

# Mehrere Bedingungen
note = 2.3
if note <= 1:
    print("Sehr gut")
elif note <= 2:
    print("Gut")
elif note <= 3:
    print("Befriedigend")
else:
    print("Nicht bestanden")</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="schleifen for while range iteration">5. Schleifen</h3>
    <div class="example-box example-code" data-target-id="pythonCode">
      <pre><code># for-Schleife mit range
for i in range(5):
    print(i)          # 0 1 2 3 4

print("---")

# Mit Schrittweite
for i in range(0, 11, 2):
    print(i)          # 0 2 4 6 8 10</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="funktionen function def return parameter">6. Funktionen</h3>
    <div class="example-box example-code" data-target-id="pythonCode">
      <pre><code>def add(a, b):
    return a + b

print(add(3, 4))       # 7
print(add(10, 25))     # 35

# Mit Default-Wert
def begruessung(name="Gast"):
    print(f"Hallo {name}!")

begruessung()          # Hallo Gast!
begruessung("Sara")    # Hallo Sara!</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="listen list array append pop index len">7. Listen (Arrays)</h3>
    <div class="example-box example-code" data-target-id="pythonCode">
      <pre><code>namen = ["Anna", "Tom", "Lena"]
print(namen[0])           # Anna
print(namen[-1])          # Lena (letztes Element)
print(len(namen))         # 3

namen.append("Max")       # hinzufügen
print(namen)              # ['Anna', 'Tom', 'Lena', 'Max']

namen.pop()               # entfernt letztes Element
print(len(namen))         # 3</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

  </div>

  <!-- CSS für Suchleiste & Highlight (gleiches Styling wie bei HTML/CSS und JS) -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #ffc107;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // Stoppt nach dem ersten Treffer
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });

    // Optional: Live-Suche beim Tippen (auskommentiert)
    // input.addEventListener("input", performSearch);
  }, 100);

  document.getElementById("runBtn").onclick = runPython;

  loadPyodideIfNeeded();

  mainContent.classList.add("python-page");
  closeSidebar();
}

/* Pet UI removed */

// ===== Screentime und Streak Tracking =====
let totalSeconds = parseInt(localStorage.getItem("totalSeconds")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let screentimeInterval = null;
// XP for quizzes
let xp = parseInt(localStorage.getItem("xp")) || 0;

function addXP(delta) {
  xp = (parseInt(xp) || 0) + delta;
  localStorage.setItem("xp", xp);
  updateXPDisplay();
}

function formatXPForDisplay(v) {
  return `${v} XP`;
}

function createXPBar() {
  if (document.getElementById("xp-bar-container")) return;
  const container = document.createElement("div");
  container.id = "xp-bar-container";
  container.innerHTML = `
    <div class="xp-bar">
      <div class="xp-info"><span id="xp-text"></span></div>
      <div class="xp-progress"><div id="xp-fill" class="xp-fill"></div></div>
    </div>
    <div class="xp-note">sammel xp durchs beantworten vom quiz</div>
  `;
  document.body.appendChild(container);
  updateXPDisplay();
}

function createCompactXPBar(parentId) {
  const parent = document.getElementById(parentId);
  if (!parent) return;
  const container = document.createElement("div");
  container.id = `xp-bar-compact-${parentId}`;
  container.innerHTML = `
    <div class="xp-bar compact">
      <div class="xp-info"><span class="xp-text-compact"></span></div>
      <div class="xp-progress"><div class="xp-fill-compact xp-fill"></div></div>
    </div>
  `;
  parent.appendChild(container);
  updateXPDisplay();
}

function hideXPBar() {
  const el = document.getElementById("xp-bar-container");
  if (el) el.remove();
}

function updateXPDisplay() {
  const txt = document.getElementById("xp-text");
  const fill = document.getElementById("xp-fill");
  const acc = document.getElementById("account-xp-value");
  if (txt) txt.textContent = formatXPForDisplay(xp);
  if (fill) {
    // simple progress to next 100 XP
    const pct = Math.max(0, Math.min(100, xp % 100));
    fill.style.width = pct + "%";
  }
  if (acc) acc.textContent = xp;
  // compact variants (update all instances)
  const txtcAll = document.querySelectorAll(".xp-text-compact");
  const fillcAll = document.querySelectorAll(".xp-fill-compact");
  txtcAll.forEach((n) => (n.textContent = formatXPForDisplay(xp)));
  const pctc = Math.max(0, Math.min(100, xp % 100));
  fillcAll.forEach((n) => (n.style.width = pctc + "%"));
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  // Display in minutes only (no seconds): e.g. "0m", "5m", "1h 20m"
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function updateStatDisplays() {
  const st = document.getElementById("screentime-value");
  const sk = document.getElementById("streak-value");
  if (st) st.textContent = formatTime(totalSeconds);
  if (sk) sk.textContent = `${streak} Tage`;
}

function startScreentimeTracker() {
  function tick() {
    totalSeconds++;
    localStorage.setItem("totalSeconds", totalSeconds);
    updateStatDisplays();
  }

  if (document.visibilityState === "visible") {
    if (!screentimeInterval) screentimeInterval = setInterval(tick, 1000);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (!screentimeInterval) screentimeInterval = setInterval(tick, 1000);
    } else {
      if (screentimeInterval) {
        clearInterval(screentimeInterval);
        screentimeInterval = null;
      }
    }
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("totalSeconds", totalSeconds);
    localStorage.setItem("streak", streak);
    localStorage.setItem(
      "lastVisitDate",
      new Date().toISOString().slice(0, 10),
    );
  });
}

function showTutorialPage() {
  mainContent.innerHTML = `
<div class="pwa-install-instruction">
  <h2>Als App auf den Homescreen</h2>
  <p>So machst du aus unserer Website eine echte App:</p>

  <div class="platform-cards">
    <!-- Android -->
    <div class="platform android">
      <button class="accordion-header" aria-expanded="false" aria-controls="android-content">
        <span>Android (Chrome · Samsung Internet)</span>
        <span class="accordion-icon">+</span>
      </button>
      
      <div class="accordion-content" id="android-content">
        <div class="tutorial-media">
          <video class="tutorial-video" controls playsinline preload="metadata">
            <source src="android-get-app.mp4" type="video/mp4">
            Dein Browser unterstützt kein Video.
          </video>
        </div>
        
        <ol class="steps">
          <li>Öffne die Website im Browser</li>
          <li>Tippe auf das <strong>Menü</strong> (meist drei Punkte ⋮)</li>
          <li>Wähle <strong>Zum Startbildschirm hinzufügen</strong> / <strong>Home-Bildschirm</strong></li>
          <li>Bestätige mit <strong>Hinzufügen</strong></li>
        </ol>
      </div>
    </div>

    <!-- iOS -->
    <div class="platform ios">
      <button class="accordion-header" aria-expanded="false" aria-controls="ios-content">
        <span>iPhone / iPad (Safari)</span>
        <span class="accordion-icon">+</span>
      </button>
      
      <div class="accordion-content" id="ios-content">
        <div class="tutorial-media">
          <video class="tutorial-video" controls playsinline preload="metadata">
            <source src="Apple-get-App.mov" type="video/quicktime">
            Dein Browser unterstützt kein Video.
          </video>
        </div>
        
        <ol class="steps">
          <li>Öffne die Seite in Safari</li>
          <li>Tippe unten auf das <strong>Teilen-Symbol</strong> <span class="share-icon">□</span> mit Pfeil</li>
          <li>Scrolle und wähle <strong>Zum Home-Bildschirm</strong></li>
          <li>Tippe auf <strong>Hinzufügen</strong> (oben rechts)</li>
        </ol>
      </div>
    </div>
  </div>
</div>

<style>
.pwa-install-instruction {
  max-width: 960px;
  margin: 1.5rem auto;
  padding: 1.5rem;
  background: var(--card-bg, #fff);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  color: var(--text);
}

.pwa-install-instruction h2 {
  margin: 0 0 0.6rem 0;
  font-size: clamp(1.6rem, 5vw, 2.1rem);
}

.pwa-install-instruction > p {
  margin: 0 0 1.8rem 0;
  color: var(--text-secondary, #666);
  font-size: 1.05rem;
}

.platform-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.platform {
  border-radius: 12px;
  overflow: hidden;
  background: var(--card-bg, #f9f9f9);
  border: 1px solid rgba(0,0,0,0.08);
  transition: all 0.2s ease;
}

.platform.android { border-top: 5px solid #000; }
.platform.ios     { border-top: 5px solid #000; }

.accordion-header {
  width: 100%;
  padding: 1.1rem 1.3rem;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text);
  transition: background-color 0.2s;
}

.accordion-header:hover,
.accordion-header:focus {
  background: rgba(0,0,0,0.04);
}

.accordion-icon {
  font-size: 1.6rem;
  font-weight: bold;
  transition: transform 0.25s ease;
  transform-origin: center;
}

.platform.open .accordion-icon {
  transform: rotate(45deg);
}

.accordion-content {
  display: none;
  padding: 0 1.3rem 1.6rem;
}

.platform.open .accordion-content {
  display: block;
  animation: fadeInUp 0.35s ease-out;
}

.tutorial-media {
  margin: 1rem 0 1.4rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

.tutorial-video {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 9 / 16;
  object-fit: cover;
}

.steps {
  counter-reset: step;
  list-style: none;
  padding: 0;
  margin: 0.8rem 0 0.4rem;
  font-size: 1.03rem;
  line-height: 1.45;
}

.steps li {
  position: relative;
  padding-left: 2.6rem;
  margin-bottom: 1rem;
}

.steps li:last-child {
  margin-bottom: 0.3rem;
}

.steps li::before {
  counter-increment: step;
  content: counter(step);
  position: absolute;
  left: 0;
  top: 0;
  width: 2rem;
  height: 2rem;
  background: var(--primary, #0066cc);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
}

.share-icon {
  font-size: 1.3em;
  vertical-align: -0.15em;
}

/* Responsive Anpassungen */
@media (min-width: 680px) {
  .platform-cards {
    flex-direction: row;
    gap: 1.5rem;
  }
  
  .platform {
    flex: 1;
    min-width: 0;
  }
  
  .tutorial-video {
    aspect-ratio: 9 / 19.5; /* etwas schlanker für Desktop */
  }
}

@media (max-width: 480px) {
  .pwa-install-instruction {
    margin: 1rem;
    padding: 1.2rem;
  }
  
  .accordion-header {
    padding: 1rem 1.2rem;
  }
}
</style>
`;

  // Accordion Funktionalität
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const platform = header.closest(".platform");
      const isOpen = platform.classList.contains("open");

      // Optional: nur ein Panel gleichzeitig offen
      // document.querySelectorAll('.platform').forEach(p => p.classList.remove('open'));

      platform.classList.toggle("open");
      header.setAttribute("aria-expanded", !isOpen);
    });
  });

  sidebar?.classList.remove("active");
  overlay?.classList.remove("active");
  burger?.classList.remove("open");
}

function initStats() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const storedLast = localStorage.getItem("lastVisitDate");

  if (storedLast !== todayStr) {
    if (storedLast) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      if (storedLast === yStr) {
        streak = (parseInt(localStorage.getItem("streak")) || 0) + 1;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastVisitDate", todayStr);
  } else {
    streak = parseInt(localStorage.getItem("streak")) || 1;
  }

  totalSeconds = parseInt(localStorage.getItem("totalSeconds")) || 0;
  updateStatDisplays();
  startScreentimeTracker();
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark-theme");
  } else {
    document.documentElement.classList.remove("dark-theme");
  }
  localStorage.setItem("theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    const sunSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const moonSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.innerHTML = theme === "dark" ? sunSVG : moonSVG;
  }
}

function initTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark-theme");
      applyTheme(isDark ? "light" : "dark");
      btn.blur();
    });
  }
}

window.addEventListener("load", () => {
  loadLastState();
  initStats();
  initTheme();
  updateXPDisplay();
  updateSidebarUserInfo();

  // Optional: Falls du auch beim ersten Laden prüfen willst
  const savedName = localStorage.getItem("firstName");
  const savedClass = localStorage.getItem("userClass");

  if (savedName) usernameElem.textContent = savedName;
  if (savedClass) userclassElem.textContent = savedClass;

  try {
    const savedPic = localStorage.getItem("profilePic");
    if (savedPic && typeof profilePic !== "undefined" && profilePic)
      profilePic.src = savedPic;
  } catch (e) {}
});

function setOfflineVisible(visible) {
  const offlineScreen = document.getElementById("offline-screen");
  if (!offlineScreen) return;
  offlineScreen.setAttribute("aria-hidden", String(!visible));
  if (visible) {
    offlineScreen.classList.add("active");
  } else {
    offlineScreen.classList.remove("active");
  }
}

function updateOnlineStatus() {
  setOfflineVisible(!navigator.onLine);
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  updateOnlineStatus();
} else {
  window.addEventListener("DOMContentLoaded", updateOnlineStatus);
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "reload-btn") {
    const btn = e.target;
    if (navigator.onLine) {
      location.reload();
    } else {
      btn.textContent = "Kein Internet";
      setTimeout(() => (btn.textContent = "Neu laden"), 1400);
    }
  }
});

function showProfileNotice() {
  const notice = document.getElementById("profileNotice");
  const hasSeen = localStorage.getItem("hasSeenProfileNotice");

  if (!hasSeen) {
    notice.classList.add("show");
  }
}

function closeNotice() {
  const notice = document.getElementById("profileNotice");
  notice.classList.remove("show");

  // Merken, dass der User das gesehen/weggeklickt hat
  localStorage.setItem("hasSeenProfileNotice", "true");
}

// Start
document.addEventListener("DOMContentLoaded", () => {
  // Kleine Verzögerung damit es nicht zu aggressiv wirkt
  setTimeout(showProfileNotice, 1200);

  // Lade letzten Quiz-Zustand automatisch
  loadLastState();

  // Lade letzten Berufsfinder-Zustand automatisch
  loadCareerFinderState();
});
function showCreateHTML() {
  showCreateWPage();
}

function showCreateJS() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>JavaScript</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. variablen, if, schleifen, array, funktion..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      JavaScript ist eine Programmiersprache für Webseiten. Sie wird im Browser ausgeführt und macht Webseiten interaktiv.
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="jsCode" class="python-editor">
let name = "Anna";
let alter = 20;
console.log("Name:", name);
console.log("Alter:", alter);
      </textarea>
      <pre id="output" class="python-output"></pre>
    </div>
    <button id="runBtn" class="run-btn">▶ Code ausführen</button>
    
    <hr>

    <h3 data-search="variablen let const">1. Variablen</h3>
    <div class="info-box">
      Variablen speichern Werte. In JavaScript nutzt man <b>let</b> oder <b>const</b>.
    </div>
    <div class="example-box example-code" data-target-id="jsCode">
      <pre><code>let zahl = 5;
const pi = 3.14;
let name = "Sara";
console.log(zahl);       // 5
console.log(pi);         // 3.14
console.log(name);</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="datentypen number string boolean typeof null undefined">2. Datentypen</h3>
    <div class="info-box">
      Häufige Datentypen: Number, String, Boolean.
    </div>
    <div class="example-box example-code" data-target-id="jsCode">
      <pre><code>let a = 10;              // Number
let text = "Hallo";      // String
let ok = true;           // Boolean
let nichts = null;       // null
let undefiniert;         // undefined
console.log(typeof a);     // "number"
console.log(typeof text);  // "string"
console.log(typeof ok);    // "boolean"</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="rechnen addition subtraktion multiplikation division modulo potenz">3. Rechnen</h3>
    <div class="example-box example-code" data-target-id="jsCode">
      <pre><code>let x = 10;
let y = 3;
console.log(x + y);   // 13
console.log(x - y);   // 7
console.log(x * y);   // 30
console.log(x / y);   // 3.333...
console.log(x % y);   // 1    (Rest)
console.log(x ** 2);  // 100  (Potenz)</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="bedingungen if else elseif vergleich">4. Bedingungen (if)</h3>
    <div class="example-box example-code" data-target-id="jsCode">
      <pre><code>let alter = 18;
if (alter >= 18) {
  console.log("Erwachsen");
} else {
  console.log("Minderjährig");
}
// Mit else if
let note = 2.3;
if (note <= 1) {
  console.log("Sehr gut");
} else if (note <= 2) {
  console.log("Gut");
} else if (note <= 3) {
  console.log("Befriedigend");
} else {
  console.log("Nicht bestanden");
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="schleifen for loop iteration">5. Schleifen (for)</h3>
    <div class="example-box example-code" data-target-id="jsCode">
      <pre><code>for (let i = 1; i <= 5; i++) {
  console.log(i);          // 1 2 3 4 5
}
console.log("---");
// Mit Schrittweite
for (let i = 0; i <= 10; i += 2) {
  console.log(i);          // 0 2 4 6 8 10
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="funktionen function arrow arrow-funktion return">6. Funktionen</h3>
    <div class="example-box example-code" data-target-id="jsCode">
      <pre><code>function add(a, b) {
  return a + b;
}
console.log(add(3, 4));     // 7
console.log(add(10, 25));   // 35
// Arrow-Funktion (moderne Schreibweise)
const multiply = (x, y) => x * y;
console.log(multiply(6, 7));   // 42</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="arrays array push pop length index">7. Arrays</h3>
    <div class="example-box example-code" data-target-id="jsCode">
      <pre><code>let namen = ["Anna", "Tom", "Lena"];
console.log(namen[0]);       // Anna
console.log(namen[2]);       // Lena
console.log(namen.length);   // 3
// Element hinzufügen
namen.push("Max");
console.log(namen);          // ["Anna", "Tom", "Lena", "Max"]
// Letztes Element entfernen
namen.pop();
console.log(namen.length);   // 3</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

  </div>

  <!-- CSS für Suchleiste & Highlight (gleiches Styling wie bei HTML/CSS) -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #ffc107;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // Stoppt nach dem ersten Treffer
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });

    // Optional: Live-Suche beim Tippen (auskommentiert – kann aktiviert werden)
    // input.addEventListener("input", performSearch);
  }, 100);

  document.getElementById("runBtn").onclick = () => {
    const code = document.getElementById("jsCode").value;
    const output = document.getElementById("output");
    output.textContent = "";

    try {
      const oldLog = console.log;
      console.log = (...args) => (output.textContent += args.join(" ") + "\n");
      eval(code);
      console.log = oldLog;
    } catch (e) {
      output.textContent = e.toString();
    }
  };

  mainContent.classList.add("python-page");
  closeSidebar();
}

function showCreatePHP() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>PHP</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. variablen, arrays, funktionen, if, echo, schleifen..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      PHP wird verwendet, um dynamische Webseiten und Webanwendungen zu erstellen.
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="phpCode" class="python-editor">// Schreibe hier PHP-Code
// Wichtig: Der Code wird normalerweise zwischen <?php ... ?> ausgeführt

echo "Hallo aus PHP!";

$name = "Max";
echo "<br>Hallo " . $name . "!";</textarea>
      <pre id="output" class="python-output"></pre>
      <button id="runBtn" class="run-btn">▶ Code ausführen</button>
    </div>
    
    <hr>

    <h3 data-search="variablen variable dollar zeichen dollar">1. Variablen</h3>
    <div class="example-box example-code" data-target-id="phpCode">
      <pre><code>$zahl = 42;
$text = "Hallo Welt";
$preis = 19.99;
$istAktiv = true;

echo $zahl . "<br>";
echo $text . "<br>";
echo $preis . "<br>";</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="datentypen integer string boolean array null">2. Datentypen</h3>
    <div class="example-box example-code" data-target-id="phpCode">
      <pre><code>$int     = 123;
$float   = 3.14159;
$string  = "PHP ist cool";
$bool    = true;
$null    = null;
$array   = [1, 2, 3];

echo gettype($int)    . "<br>";     // integer
echo gettype($float)  . "<br>";     // double
echo gettype($string) . "<br>";     // string
echo gettype($bool)   . "<br>";     // boolean</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="rechnen addition subtraktion multiplikation division modulo">3. Rechnen</h3>
    <div class="example-box example-code" data-target-id="phpCode">
      <pre><code>$a = 10;
$b = 3;

echo $a + $b . "<br>";   // 13
echo $a - $b . "<br>";   // 7
echo $a * $b . "<br>";   // 30
echo $a / $b . "<br>";   // 3.333...
echo $a % $b . "<br>";   // 1
echo $a ** 2 . "<br>";   // 100 (Potenz seit PHP 7)</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="bedingungen if else elseif vergleich switch">4. if-Bedingungen</h3>
    <div class="example-box example-code" data-target-id="phpCode">
      <pre><code>$alter = 17;

if ($alter >= 18) {
    echo "Erwachsen";
} elseif ($alter >= 14) {
    echo "Jugendlicher";
} else {
    echo "Kind";
}

echo "<br>";

// Kurzform (ternärer Operator)
$status = ($alter >= 18) ? "volljährig" : "minderjährig";
echo $status;</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="schleifen for foreach while do while">5. Schleifen (for)</h3>
    <div class="example-box example-code" data-target-id="phpCode">
      <pre><code>// Klassische for-Schleife
for ($i = 1; $i <= 5; $i++) {
    echo $i . " ";
}

echo "<br>---<br>";

// foreach mit Array
$farben = ["rot", "grün", "blau"];
foreach ($farben as $farbe) {
    echo $farbe . " ";
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="funktionen function return parameter argument">6. Funktionen</h3>
    <div class="example-box example-code" data-target-id="phpCode">
      <pre><code>function begruessung($name = "Gast") {
    return "Hallo $name, willkommen!";
}

echo begruessung() . "<br>";        // Hallo Gast, willkommen!
echo begruessung("Sara") . "<br>";  // Hallo Sara, willkommen!

// Mit Typdeklaration (seit PHP 7)
function add(int $a, int $b): int {
    return $a + $b;
}

echo add(5, 7);     // 12</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="arrays array assoziativ numerisch push count">7. Arrays</h3>
    <div class="example-box example-code" data-target-id="phpCode">
      <pre><code>// Numerisches Array
$namen = ["Anna", "Tom", "Lena"];
echo $namen[1] . "<br>";          // Tom

// Assoziatives Array
$person = [
    "name"  => "Max",
    "alter" => 28,
    "stadt" => "Hamburg"
];

echo $person["name"] . " ist " . $person["alter"] . " Jahre alt.<br>";

// Element hinzufügen
$namen[] = "Sara";
echo count($namen) . " Namen<br>";   // 4</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

  </div>

  <!-- CSS für Suchleiste & Highlight (wie bei den anderen Sprachen) -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #ffc107;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // nur erster Treffer
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }, 100);

  document.getElementById("runBtn").onclick = () => {
    const code = document.getElementById("phpCode").value;
    const output = document.getElementById("output");
    output.textContent = "";

    const matches = code.match(/echo\s+"([^"]*)"/g);

    if (matches) {
      matches.forEach((m) => {
        const text = m.match(/"([^"]*)"/)[1];
        output.textContent += text.replace("\\n", "\n") + "\n";
      });
    } else {
      output.textContent = "⚠ PHP wird hier nur simuliert.";
    }
  };

  mainContent.classList.add("python-page");
  closeSidebar();
}

function showCreateJava() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>Java</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. variablen, methoden, arrays, if, for, schleifen..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      Java wird genutzt, um plattformunabhängige Anwendungen, Android-Apps und serverseitige Software zu entwickeln.
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="javaCode" class="python-editor">// Hier Java-Code schreiben
// Beispiel:
public class Main {
    public static void main(String[] args) {
        System.out.println("Hallo Java!");
    }
}</textarea>
      <pre id="output" class="python-output"></pre>
      <button id="runBtn" class="run-btn">▶ Code ausführen</button>
    </div>
    
    <hr>

    <h3 data-search="variablen variable deklaration zuweisung">1. Variablen</h3>
    <div class="example-box example-code" data-target-id="javaCode">
      <pre><code>int a = 5;
String text = "Hallo";
System.out.println(text + " " + a);</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="datentypen int double boolean string primitive typen">2. Datentypen</h3>
    <div class="example-box example-code" data-target-id="javaCode">
      <pre><code>int zahl = 10;
double pi = 3.14159;
boolean ok = true;
char buchstabe = 'A';
String name = "Java";
System.out.println(zahl + " | " + pi + " | " + ok);</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="rechnen addition subtraktion multiplikation division modulo">3. Rechnen</h3>
    <div class="example-box example-code" data-target-id="javaCode">
      <pre><code>int a = 10;
int b = 3;
System.out.println(a + b);   // 13
System.out.println(a - b);   // 7
System.out.println(a * b);   // 30
System.out.println(a / b);   // 3   (ganzzahlig!)
System.out.println(a % b);   // 1   (Rest)</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="bedingungen if else elseif vergleich">4. if-Bedingungen</h3>
    <div class="example-box example-code" data-target-id="javaCode">
      <pre><code>int alter = 18;
if (alter >= 18) {
    System.out.println("Erwachsen");
} else {
    System.out.println("Minderjährig");
}

// Mehrere Bedingungen
double note = 2.3;
if (note <= 1.0) {
    System.out.println("Sehr gut");
} else if (note <= 2.0) {
    System.out.println("Gut");
} else if (note <= 3.0) {
    System.out.println("Befriedigend");
} else {
    System.out.println("Nicht bestanden");
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="schleifen for loop iteration">5. Schleifen (for)</h3>
    <div class="example-box example-code" data-target-id="javaCode">
      <pre><code>for (int i = 1; i <= 5; i++) {
    System.out.println(i);          // 1 2 3 4 5
}
System.out.println("---");

// Mit Schrittweite
for (int i = 0; i <= 10; i += 2) {
    System.out.println(i);          // 0 2 4 6 8 10
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="funktionen methoden static return parameter">6. Funktionen (Methoden)</h3>
    <div class="example-box example-code" data-target-id="javaCode">
      <pre><code>static int add(int a, int b) {
    return a + b;
}

// Aufruf in main():
public static void main(String[] args) {
    System.out.println(add(3, 4));     // 7
    System.out.println(add(10, 25));   // 35
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="arrays array length index">7. Arrays</h3>
    <div class="example-box example-code" data-target-id="javaCode">
      <pre><code>String[] namen = {"Anna", "Tom", "Lena"};
System.out.println(namen[0]);         // Anna
System.out.println(namen.length);     // 3

// Element ändern
namen[1] = "Max";
System.out.println(namen[1]);         // Max

// For-each Schleife
for (String n : namen) {
    System.out.println(n);
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

  </div>

  <!-- CSS für Suchleiste & Highlight (konsistent mit den anderen Sprachen) -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #ffc107;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // nur erster Treffer
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });

    // Optional: Live-Suche beim Tippen (auskommentiert)
    // input.addEventListener("input", performSearch);
  }, 100);

  document.getElementById("runBtn").onclick = () => {
    const code = document.getElementById("javaCode").value;
    const output = document.getElementById("output");
    output.textContent = "";

    const matches = code.match(/println\("([^"]*)"\)/g);

    if (matches) {
      matches.forEach((m) => {
        const text = m.match(/"([^"]*)"/)[1];
        output.textContent += text + "\n";
      });
    } else {
      output.textContent = "⚠ Java wird hier nur simuliert.";
    }
  };

  mainContent.classList.add("python-page");
  closeSidebar();
}
let pyodide = null;

async function loadPyodideIfNeeded() {
  if (!pyodide) {
    pyodide = await loadPyodide();
  }
}

async function runPython() {
  const code = document.getElementById("pythonCode").value;
  const output = document.getElementById("output");

  output.textContent = "Läuft...";

  try {
    await loadPyodideIfNeeded();

    pyodide.setStdout({
      batched: (text) => {
        output.textContent += text;
      },
    });

    output.textContent = "";
    await pyodide.runPythonAsync(code);
  } catch (err) {
    output.textContent = err.toString();
  }
}
function showCreateCS() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>C#</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. variablen, datentypen, if, schleifen, methoden, arrays, list..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      C# ist eine moderne, sichere und leistungsstarke Programmiersprache von Microsoft.<br>
      Wird sehr häufig verwendet für: Desktop-Programme (WPF, WinForms), Spiele (Unity), Web-Backends (ASP.NET), Mobile (MAUI), Cloud...
      <br><br>
      → Läuft nicht direkt im Browser (wie JavaScript), sondern braucht .NET
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="csCode" class="python-editor">// Hier C#-Code schreiben
// Minimalbeispiel:
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hallo aus C#!");
        
        string name = "Test";
        Console.WriteLine("Name: " + name);
    }
}</textarea>

    </div>
    
    <hr>

    <h3 data-search="datentypen string int double bool char typen typisiert">Wichtige Datentypen in C#</h3>
    <div class="info-box" style="font-size: 0.95em;">
      <b>string</b>   → Text              ("Hallo")     &nbsp;&nbsp;wie str in Python<br>
      <b>int</b>       → ganze Zahl       (42, -17)     &nbsp;&nbsp;wie int in Python<br>
      <b>double</b>    → Kommazahl        (3.14, -0.001)&nbsp;&nbsp;wie float in Python<br>
      <b>bool</b>      → wahr/falsch      (true/false)  &nbsp;&nbsp;wie bool in Python (True/False)<br>
      <b>char</b>      → einzelnes Zeichen ('A', 'x')   &nbsp;&nbsp;kein direktes Äquivalent in Python<br>
      <br>
      → C# ist <b>streng typisiert</b>: Der Datentyp muss (fast immer) sofort angegeben werden!
    </div>

    <h3 data-search="beispielcode beispiel main console writeline">Beispielcode (C#)</h3>
    <div class="example-box example-code" data-target-id="csCode">
      <pre><code>using System;

class Program
{
    static void Main()
    {
        string name = "Anna";
        int alter = 20;
        double groesse = 1.68;
        bool istStudent = true;
        char buchstabe = 'A';

        Console.WriteLine("Name: " + name);
        Console.WriteLine($"Alter: {alter} Jahre");
        Console.WriteLine("Größe: " + groesse + " m");
        Console.WriteLine($"Student? {istStudent}");
        Console.WriteLine("Lieblingsbuchstabe: " + buchstabe);
    }
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="erklärung main using system console struktur aufbau">Erklärung – Schritt für Schritt</h3>
    <div class="info-box">
      <b>using System;</b> – gibt Zugriff auf Console, String, Math usw.<br>
      <b>class Program</b> – fast jedes C#-Programm braucht eine Klasse<br>
      <b>static void Main()</b> – Startpunkt des Programms (wie if __name__ == "__main__" in Python)<br>
      <b>string name = ...</b> – Variable deklarieren und zuweisen<br>
      <b>Console.WriteLine()</b> – Ausgabe auf der Konsole (ähnlich print())<br>
      <b>$"..."</b> – String-Interpolation (sehr praktisch seit C# 6)<br>
      <b>+</b> – klassische String-Konkatenation
    </div>

    <h3 data-search="variablen deklaration zuweisung var">1. Variablen & var</h3>
    <div class="example-box example-code" data-target-id="csCode">
      <pre><code>int zahl = 42;
string stadt = "Hamburg";
double temperatur = 18.7;

// var → Typ wird automatisch erkannt (seit C# 3.0)
var nachricht = "Heute ist super!";
Console.WriteLine(nachricht);</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="bedingungen if else elseif switch">2. Bedingungen (if / switch)</h3>
    <div class="example-box example-code" data-target-id="csCode">
      <pre><code>int note = 2;

if (note <= 1)
{
    Console.WriteLine("Sehr gut");
}
else if (note <= 2)
{
    Console.WriteLine("Gut");
}
else
{
    Console.WriteLine("Ausreichend oder schlechter");
}

// switch (sehr sauber bei vielen Fällen)
string tag = "Montag";
switch (tag)
{
    case "Montag":
        Console.WriteLine("Wochenstart");
        break;
    case "Freitag":
        Console.WriteLine("Fast Wochenende!");
        break;
    default:
        Console.WriteLine("Normaler Tag");
        break;
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="schleifen for foreach while do">3. Schleifen</h3>
    <div class="example-box example-code" data-target-id="csCode">
      <pre><code>// for
for (int i = 1; i <= 5; i++)
{
    Console.Write(i + " ");
}

Console.WriteLine();

// foreach (sehr häufig bei Listen/Arrays)
string[] namen = { "Anna", "Ben", "Clara" };
foreach (string name in namen)
{
    Console.WriteLine(name);
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

  </div>

  <!-- CSS für Suchleiste & Highlight -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #ffc107;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // erster Treffer → stoppen
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }, 100);

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // erster Treffer → stoppen
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }, 100);

  mainContent.classList.add("python-page");
  closeSidebar();
}
function showCreateTypeScript() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>TypeScript</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. typen, interface, union, array, funktion, type alias..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      TypeScript = JavaScript + Typen<br><br>
      → Alles, was JavaScript kann + Sicherheit durch Datentypen<br>
      → Wird heute fast überall im modernen Web-Frontend verwendet (React, Angular, Vue, Node.js-Backends...)
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="tsCode" class="python-editor">// Hier TypeScript-Code schreiben

let name: string = "Test";
let alter: number = 28;

console.log("Hallo aus TypeScript!");
console.log(name.toUpperCase());    // funktioniert
// console.log(alter.toUpperCase()); // Fehler schon beim Tippen!</textarea>
   
    </div>
    
    <hr>

    <h3 data-search="datentypen string number boolean any union literal">Wichtige Datentypen in TypeScript</h3>
    <div class="info-box" style="font-size: 0.95em;">
      <b>string</b>   → Text                  ("Hallo")<br>
      <b>number</b>   → Zahl (ganz & Komma)   (42, 3.14)   – kein separater int/float!<br>
      <b>boolean</b>  → wahr/falsch           (true/false)<br>
      <b>any</b>      → beliebiger Typ        (vermeiden wenn möglich!)<br>
      <b>undefined</b>, <b>null</b>  → "nichts" / "absichtlich leer"<br>
      <b>unknown</b>  → wie any, aber sicherer (muss geprüft werden)<br><br>
      → Typen werden meist direkt angegeben (: string)
    </div>

    <h3 data-search="beispielcode annotation typisierung console log">Beispielcode (TypeScript)</h3>
    <div class="example-box example-code" data-target-id="tsCode">
      <pre><code>let name: string = "Anna";
let age: number = 20;
let height: number = 1.68;
let isStudent: boolean = true;
let scores: number[] = [85, 92, 78];

console.log("Name:", name);
console.log("Alter:", age);
console.log("Größe:", height, "m");
console.log("Ist Student?", isStudent);
console.log("Noten:", scores);

// Fehler werden früh erkannt:
// let falsch: number = "25";   // ← Typfehler!
</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="erklärung let const annotation typen fehlererkennung">Erklärung</h3>
    <div class="info-box">
      <b>let</b> / <b>const</b> – Variablen erstellen (wie modernes JavaScript)<br>
      <b>: string</b> / <b>: number</b> – Typ-Annotation (das gibt es in purem JS nicht)<br>
      <b>console.log()</b> – Ausgabe in Konsole (Browser oder Node.js)<br>
      → Die meisten Editoren (VS Code) zeigen Typfehler **schon beim Tippen** an<br>
      → TypeScript wird zu JavaScript kompiliert (tsc)
    </div>

    <h3 data-search="array typisierte arrays tuple">1. Arrays & Tupel</h3>
    <div class="example-box example-code" data-target-id="tsCode">
      <pre><code>// Normales Array
let zahlen: number[] = [1, 2, 3, 4];
let namen: string[] = ["Anna", "Ben", "Clara"];

// Alternative Schreibweise
let ids: Array<number> = [101, 102, 103];

// Tupel (feste Länge + feste Typen)
let person: [string, number, boolean] = ["Max", 28, true];

console.log(zahlen[0]);      // 1
console.log(person[1]);      // 28
// person[0] = 999;          // Fehler – Typ nicht string!
</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="union typen oder literal typen">2. Union-Typen & Literal-Typen</h3>
    <div class="example-box example-code" data-target-id="tsCode">
      <pre><code>// Union-Typ (kann mehrere Typen haben)
let id: string | number = "ABC123";
id = 456;           // ok
// id = true;       // Fehler!

// Literal-Typen (sehr präzise)
let status: "success" | "error" | "loading" = "success";
// status = "pending";  // Fehler – nicht erlaubt!
</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="funktion typen parameter return typ arrow">3. Funktionen mit Typen</h3>
    <div class="example-box example-code" data-target-id="tsCode">
      <pre><code>function add(a: number, b: number): number {
    return a + b;
}

const multiply = (x: number, y: number): number => x * y;

console.log(add(5, 7));         // 12
console.log(multiply(4, 6));    // 24

// Optionaler Parameter
function greet(name: string, greeting?: string): string {
    return \`\${greeting ?? "Hallo"}, \${name}!\`;
}
</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

  </div>

  <!-- CSS für Suchleiste & Highlight -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #ffc107;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // Stoppt beim ersten Treffer
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }, 100);

  mainContent.classList.add("python-page");
  closeSidebar();
}
function showCreateCPP() {
  mainContent.innerHTML = `
  <div class="learn-container">
    <h1>C++</h1>
    <!-- Suchleiste -->
    <div class="search-box">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z. B. datentypen, cout, schleifen, pointer, vector, funktion..." 
        autocomplete="off"
      >
      <button id="searchBtn">Suchen</button>
    </div>

    <div class="info-box">
      C++ ist eine der schnellsten Programmiersprachen überhaupt.<br>
      Wird verwendet für: Spiele-Engines, Betriebssysteme, Treiber, Hochleistungs-Software, Embedded...
    </div>
    <div class="info-box">
      Unten findest du Material.
    </div>

    <h3>Code ausprobieren</h3>
    <div class="editor-box">
      <textarea id="cppCode" class="python-editor">// Hier C++-Code schreiben

#include <iostream>
#include <string>

using namespace std;

int main() {
    cout << "Hallo aus C++!" << endl;
    
    string name = "Test";
    cout << "Name: " << name << endl;
    
    return 0;
}</textarea>
  
    </div>
    
    <hr>

    <h3 data-search="datentypen int double float bool char string typen">Wichtige Datentypen in C++ (Anfänger-Level)</h3>
    <div class="info-box" style="font-size: 0.95em;">
      <b>std::string</b>   → Text                  ("Hallo")<br>
      <b>int</b>           → ganze Zahl            (42, -1000)<br>
      <b>double</b> / <b>float</b> → Kommazahl     (3.14, 0.001)<br>
      <b>bool</b>          → wahr/falsch           (true/false)<br>
      <b>char</b>          → einzelnes Zeichen     ('A')<br><br>
      → Sehr ähnlich zu C#, aber mehr manueller Arbeit (Speicherverwaltung!)
    </div>

    <h3 data-search="beispielcode main cout include using namespace">Beispielcode (C++)</h3>
    <div class="example-box example-code" data-target-id="cppCode">
      <pre><code>#include <iostream>
#include <string>

using namespace std;

int main() {
    string name = "Anna";
    int alter = 20;
    double groesse = 1.68;
    bool magKaffee = true;

    cout << "Name: " << name << endl;
    cout << "Alter: " << alter << " Jahre" << endl;
    cout << "Größe: " << groesse << " m" << endl;
    cout << "Mag Kaffee? " << (magKaffee ? "Ja" : "Nein") << endl;

    return 0;
}</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="erklärung include using cout endl main return">Erklärung</h3>
    <div class="info-box">
      <b>#include <...></b> – Bibliotheken einbinden (wie import)<br>
      <b>using namespace std;</b> – spart std:: vor cout, string, endl usw.<br>
      <b>int main()</b> – Einstiegspunkt des Programms<br>
      <b>cout << ... << endl;</b> – Ausgabe + Zeilenumbruch<br>
      <b>return 0;</b> – Programm erfolgreich beendet
    </div>

    <h3 data-search="variablen deklaration initialisierung auto">1. Variablen & auto</h3>
    <div class="example-box example-code" data-target-id="cppCode">
      <pre><code>int zahl = 42;
double pi = 3.14159;
string stadt = "Hamburg";
bool aktiv = true;

// Seit C++11: auto (Typ wird automatisch erkannt)
auto nachricht = "Automatisch string";
cout << nachricht << endl;</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="bedingungen if else elseif switch">2. Bedingungen</h3>
    <div class="example-box example-code" data-target-id="cppCode">
      <pre><code>int note = 2;

if (note <= 1) {
    cout << "Sehr gut" << endl;
} else if (note <= 2) {
    cout << "Gut" << endl;
} else {
    cout << "Ausreichend oder schlechter" << endl;
}

// switch
string tag = "Montag";
switch (tag) {
    case "Montag":   cout << "Wochenstart"; break;
    case "Freitag":  cout << "Fast Wochenende"; break;
    default:         cout << "Normaler Tag"; break;
}
cout << endl;</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

    <h3 data-search="schleifen for while do range-based for">3. Schleifen</h3>
    <div class="example-box example-code" data-target-id="cppCode">
      <pre><code>// Klassische for-Schleife
for (int i = 1; i <= 5; i++) {
    cout << i << " ";
}
cout << endl;

// Range-based for (seit C++11) – sehr praktisch
int zahlen[] = {10, 20, 30, 40};
for (int z : zahlen) {
    cout << z << " ";
}
cout << endl;</code></pre>
      <button class="load-to-editor-btn">↪</button>
    </div>

  </div>

  <!-- CSS für Suchleiste & Highlight -->
  <style>
    .search-box {
      margin: 16px 0;
      display: flex;
      gap: 8px;
      max-width: 600px;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .search-box button {
      padding: 0 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .search-box button:hover {
      background: #0055aa;
    }
    .highlight-target {
      background-color: #f8e7b3;
      border-left: 4px solid #ffc107;
      padding-left: 12px;
      transition: all 0.4s;
    }
  </style>
  `;

  // JavaScript für die Suchfunktion
  setTimeout(() => {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");

    function performSearch() {
      const term = input.value.trim().toLowerCase();
      if (!term) return;

      const headings = document.querySelectorAll("h3[data-search]");
      let found = false;

      headings.forEach((h) => {
        const keywords = h.getAttribute("data-search").toLowerCase();
        if (keywords.includes(term)) {
          h.scrollIntoView({ behavior: "smooth", block: "center" });

          h.classList.add("highlight-target");
          setTimeout(() => {
            h.classList.remove("highlight-target");
          }, 1800);

          found = true;
          return; // Stoppt beim ersten Treffer
        }
      });

      if (!found) {
        alert("Kein passender Abschnitt gefunden für: " + term);
      }
    }

    btn.addEventListener("click", performSearch);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
  }, 100);

  mainContent.classList.add("python-page");
  closeSidebar();
}
function showCookieBannerIfNeeded() {
  const consent = localStorage.getItem("cookieConsent");
  if (!consent) {
    document.getElementById("cookie-banner").classList.remove("hidden");
  }
}

function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");
  document.getElementById("cookie-banner").classList.add("hidden");
  loadAdSense();
}

function rejectCookies() {
  localStorage.setItem("cookieConsent", "rejected");
  document.getElementById("cookie-banner").classList.add("hidden");
}

function loadAdSense() {
  if (window.adsLoaded) return;
  window.adsLoaded = true;

  const script = document.createElement("script");
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}
function scrollToNextSection() {
  const section = document.getElementById("intro");

  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}
let lastScrollTop = 0;
const navbar = document.getElementById("languageNavbar");

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Nach unten scrollen → ausblenden
    navbar.style.transform = "translateY(-100%)";
  } else {
    // Nach oben scrollen → einblenden
    navbar.style.transform = "translateY(0)";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Für Mobile Bounce
});
// Lädt Code-Beispiele in den jeweiligen Editor (funktioniert für ALLE Sprachen)
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("load-to-editor-btn")) return;

  const box = e.target.closest(".example-box.example-code");
  if (!box) return;

  const targetId = box.dataset.targetId; // z. B. "jsCode", "pythonCode", "htmlcssCode" ...
  const textarea = document.getElementById(targetId);

  if (!textarea) {
    console.warn(`Textarea mit ID "${targetId}" nicht gefunden`);
    return;
  }

  // Code-Element finden (meist <pre><code> oder <pre>)
  const codeElement = box.querySelector("pre code, pre, code");
  if (!codeElement) {
    console.warn("Kein Code-Element in diesem Beispiel gefunden");
    return;
  }

  let codeText = codeElement.textContent.trim();

  // Entfernt überflüssige gemeinsame Einrückung (sehr nützlich!)
  codeText = dedent(codeText);

  // In Editor einfügen
  textarea.value = codeText;
  textarea.focus();
  textarea.setSelectionRange(0, 0); // Cursor ganz oben

  // Visuelles Feedback
  const originalText = e.target.textContent;
  e.target.textContent = "✓";
  e.target.style.background = "#28a745";
  setTimeout(() => {
    e.target.textContent = originalText;
    e.target.style.background = "";
  }, 1400);
});

// Hilfsfunktion: entfernt gemeinsame führende Leerzeichen
function dedent(str) {
  const lines = str.split("\n");
  if (lines.length <= 1) return str;

  // Minimale Einrückung aller nicht-leeren Zeilen finden
  const minIndent = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)[0].length)
    .reduce((a, b) => Math.min(a, b), Infinity);

  if (minIndent === Infinity || minIndent === 0) return str;

  return lines
    .map((line) => line.slice(minIndent))
    .join("\n")
    .trim();
}
// Neustart-Button
const restartBtn = document.getElementById("restartQuiz");

restartBtn.addEventListener("click", () => {
  // Alle Scores zurücksetzen
  Object.keys(scores).forEach((key) => (scores[key] = 0));

  // Zurück zum ersten Schritt
  current = 0;

  // Ergebnis ausblenden, Frage wieder einblenden
  resultBox.style.display = "none";
  questionBox.style.display = "block";

  // Progress zurücksetzen
  progressFill.style.width = "0%";

  // Erste Frage neu laden
  loadQuestion();

  // Optional: Chart zerstören, falls du mehrere Male spielst (vermeidet Überlagerung)
  // Wenn du Chart.js-Instanz speicherst, kannst du sie hier destroy() aufrufen
});
// Navigation Buttons
const prevBtn = document.getElementById("prevQuestion");
const nextBtn = document.getElementById("nextQuestion");

// Wir speichern die bisherigen Antworten, damit man zurückgehen und ändern kann
let selectedAnswers = new Array(questions.length).fill(null);

function updateNavButtons() {
  prevBtn.disabled = current === 0;
  nextBtn.disabled = selectedAnswers[current] === null; // nur aktiv, wenn schon gewählt
}

function loadQuestion() {
  const q = questions[current];
  qText.textContent = q.q;
  answersDiv.innerHTML = "";

  q.a.forEach((ans) => {
    const btn = document.createElement("button");
    btn.textContent = ans[0];

    // Highlight, wenn schon ausgewählt
    if (selectedAnswers[current] === ans[1]) {
      btn.classList.add("selected");
    }

    btn.onclick = () => {
      // Alte Auswahl entfernen (visuell)
      Array.from(answersDiv.children).forEach((b) =>
        b.classList.remove("selected"),
      );
      btn.classList.add("selected");

      // Score nur ändern, wenn es eine neue Auswahl ist oder geändert wird
      if (selectedAnswers[current] !== null) {
        scores[selectedAnswers[current]]--; // alte Antwort zurücknehmen
      }
      selectedAnswers[current] = ans[1];
      scores[ans[1]]++;

      updateNavButtons();

      // Auto-weiter bei manchen Designs (optional – auskommentieren wenn nicht gewollt)
      // setTimeout(() => { if (current < questions.length - 1) nextQuestion(); }, 400);
    };
    answersDiv.appendChild(btn);
  });

  progressFill.style.width = ((current + 1) / questions.length) * 100 + "%";
  updateNavButtons();
}

// Navigation Funktionen
prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    loadQuestion();
  }
};

nextBtn.onclick = () => {
  if (selectedAnswers[current] !== null && current < questions.length - 1) {
    current++;
    loadQuestion();
  } else if (
    selectedAnswers[current] !== null &&
    current === questions.length - 1
  ) {
    showResults();
  }
};

// Initial aufrufen (nach loadQuestion())
loadQuestion(); // ← das hast du schon
