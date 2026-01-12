const burger = document.getElementById("burger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const accordions = document.querySelectorAll(".accordion-toggle");
const mainContent = document.getElementById("main-content");
const usernameElem = document.getElementById("username");
const userclassElem = document.getElementById("userclass");

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
    ],
  },
};

// Benutzerinfo mit lokal Speicherung
function askUserInfo() {
  let firstName =
    localStorage.getItem("firstName") ||
    prompt("Bitte deinen Vornamen eingeben:");
  let userClass =
    localStorage.getItem("userClass") || prompt("Bitte deine Klasse eingeben:");
  localStorage.setItem("firstName", firstName);
  localStorage.setItem("userClass", userClass);
  usernameElem.textContent = firstName;
  userclassElem.textContent = userClass;
}

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
accordions.forEach((toggle) =>
  toggle.addEventListener("click", (e) =>
    e.target.parentElement.classList.toggle("active")
  )
);

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
    localStorage.getItem(`${subject}-level${level}`) || "{}"
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
    html += `<button id="hintBtn" style="margin:5px;font-size:16px;cursor:pointer;">💡 Hinweis</button>`;
    html += `<div id="hintText" style="display:none;color:#555;margin-top:5px;">${escapeHTML(
      q.hint
    )}</div>`;
  }

  if (q.type === "mcq") {
    q.options.forEach((opt, i) => {
      html += `<button class="quiz-btn" onclick="checkAnswer(${i})"><code>${escapeHTML(
        opt
      )}</code></button>`;
    });
  } else if (q.type === "mcq-multi") {
    html += `<form id="mcqMultiForm">`;
    q.options.forEach((opt, i) => {
      html += `<label><input type="checkbox" name="option" value="${i}"><code>${escapeHTML(
        opt
      )}</code></label><br>`;
    });
    html += `<button style="margin-top:5px;font-size:16px;cursor:pointer;" type="button" onclick="checkMulti()">Antwort prüfen</button></form>`;
  } else if (q.type === "tf") {
    html += `<button class="quiz-btn" onclick="checkAnswer(true)">Richtig</button>`;
    html += `<button class="quiz-btn" onclick="checkAnswer(false)">Falsch</button>`;
  } else if (q.type === "text") {
    html += `<input type="text" id="textAnswer" placeholder="Antwort hier..."><button onclick="checkText()">Antwort prüfen</button>`;
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
    feedback.textContent = "✅";
    currentQuiz.answers[index] = true;
    setTimeout(nextQuestion, 700);
  } else {
    feedback.textContent = "❌ Falsch! Wiederholen.";
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
    document.querySelectorAll("input[name=option]:checked")
  ).map((i) => parseInt(i.value));
  const feedback = document.getElementById("feedback");
  const correct =
    JSON.stringify(selected.sort()) === JSON.stringify(q.answer.sort());
  if (correct) {
    feedback.textContent = "✅ Richtig!";
    currentQuiz.answers[index] = true;
    setTimeout(nextQuestion, 700);
  } else {
    feedback.textContent = "❌ Falsch! Wiederholen.";
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
    feedback.textContent = "✅ Richtig!";
    currentQuiz.answers[index] = true;
    setTimeout(nextQuestion, 700);
  } else {
    feedback.textContent = "❌ Falsch! Wiederholen.";
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
          "https://www.youtube.com/embed/nmiWXn6aIAs"
        )}
      </div>

      <div class="video" data-search="vscode visual studio code installieren">
        ${createVideo(
          "Visual Studio Code installieren – Schritt für Schritt erklärt",
          "https://www.youtube.com/embed/Glolz8NG0qY"
        )}
      </div>

      <div class="video" data-search="seo google ranking optimieren">
        ${createVideo(
          "SEO optimieren – So rankst du bei Google besser",
          "https://www.youtube.com/embed/rNRjB60CXI0"
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
    <h2>PDF Texte</h2>
    <p>Hier findest du nützliche PDF Texte zum Download!</p>
    <ul>
      <li><a href="HTML_WebDev_Grundlagen_und_Recht_LernCoding.pdf" target="_blank">HTML Grundlagen (PDF)</a></li>
      <li><a href="Python_Grundlagen_LernCoding.pdf" target="_blank">Python Einführung (PDF)</a></li>
    </ul>

  `;
  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
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

function showStartPage() {
  mainContent.innerHTML = `
         <h1 style="text-align: center">Homepage</h1>
               <p style="text-align: center">Drücke einen Knopf um zu starten.</p>

      <div class="stat-cards">
        <div class="stat-card" id="screentime-box">
          <div class="stat-title">Screentime</div>
          <div class="stat-value" id="screentime-value">0s</div>
        </div>
        <div class="stat-card" id="streak-box">
          <div class="stat-title">Streak</div>
          <div class="stat-value" id="streak-value">0 Tage</div>
        </div>
      </div>

      <div class="start-list">
        <button class="start-item" onclick="showCreateWPage()">
          <div>
            <strong>Website erstellen</strong>
            <span>Baue deine eigene Webseite mit HTML & CSS</span>
          </div>
        </button>
        <button class="start-item" onclick="showCreatePPage()">
          <div>
            <strong>Programmieren lernen</strong>
            <span>Starte dein eigenes Python-Programm</span>
          </div>
        </button>
        <button class="start-item" onclick="startQuiz('webdev',1)">
          <div>
            <strong>Quiz machen</strong>
            <span>Teste dein Wissen spielerisch</span>
          </div>
        </button>
        <button class="start-item" onclick="showVideosPage()">
          <div>
            <strong>Videos ansehen</strong>
            <span>Erklärvideos einfach & verständlich</span>
          </div>
        </button>
        <button class="start-item" onclick="showTextPage()">
          <div>
            <strong>Lern-PDFs</strong>
            <span>Alles zum Nachlesen</span>
          </div>
        </button>
        <button class="start-item" onclick="showAccountPage()">
          <div>
            <strong>Mein Account</strong>
            <span>Fortschritt & Einstellungen</span>
          </div>
        </button>
      </div>
  `;

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
}

const profilePic = document.getElementById("profile-pic");

profilePic.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePic.src = e.target.result;
        localStorage.setItem("profilePic", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
});
function showAccountPage() {
  const savedName = localStorage.getItem("firstName") || "";
  const savedClass = localStorage.getItem("userClass") || "";
  const savedLang = localStorage.getItem("appLanguage") || "de";

  mainContent.innerHTML = `
    <h2>Account Einstellungen</h2>
<p>Hier kannst du deine Account Einstellungen anpassen.</p>
<br>
    <div style="
      max-width:420px;
      margin:auto;
      display:flex;
      flex-direction:column;
      gap:16px;
    ">


      <!-- Profilbild -->
      <div style="text-align:center;">
        <img
          id="accountProfilePic"
          src="${
            localStorage.getItem("profilePic") ||
            "https://via.placeholder.com/120"
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
      <label>
        <strong>Name</strong>
        <input id="accName" value="${savedName}" style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;">
      </label>

      <!-- Klasse -->
      <label>
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

function saveAccountSettings() {
  const name = document.getElementById("accName").value.trim();
  const userClass = document.getElementById("accClass").value.trim();

  if (!name || !userClass) {
    alert("Bitte Name und Klasse ausfüllen!");
    return;
  }

  localStorage.setItem("firstName", name);
  localStorage.setItem("userClass", userClass);

  // Header sofort aktualisieren
  usernameElem.textContent = name;
  userclassElem.textContent = userClass;

  alert("Erfolgreich gespeichert!");
}

function showImpressum() {
  document.getElementById("main-content").innerHTML = `
    <h1>Impressum</h1>
    <p><strong>Angaben gemäß § 5 TMG</strong></p>

    <p>
      Ata --<br>
      LernCoding<br>
      Abc Straße 1<br>
      12345 Musterstadt
    </p>

    <p>
      <strong>Kontakt:</strong><br>
      E-Mail: ata2005hh@gmail.com
    </p>

    <p>
      Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br>
      Ata --
    </p>
  `;
  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
}

function showAGB() {
  document.getElementById("main-content").innerHTML = `
    <h1>AGB & Datenschutz</h1>

    <h2>Allgemeines</h2>
    <p>
      Diese Website dient ausschließlich zu Lern- und Informationszwecken.
      Die Nutzung ist kostenlos.
    </p>

    <h2>Datenspeicherung</h2>
    <p>
      Auf dieser Website werden <strong>keine personenbezogenen Daten in einer Cloud
      oder auf einem Server gespeichert</strong>.
      Alle Daten (z. B. Fortschritt oder Einstellungen) werden ausschließlich
      <strong>lokal im Browser</strong> gespeichert.
    </p>

    <h2>E-Mail-Kontakt</h2>
    <p>
      Wenn Sie mir eine E-Mail über die angegebene E-Mail-Adresse senden,
      erhalte ich die E-Mail inklusive der Absenderadresse,
      um auf Ihre Anfrage antworten zu können.
      Eine weitere Verarbeitung oder Weitergabe der Daten erfolgt nicht.
    </p>

    <h2>Haftung</h2>
    <p>
      Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
      übernehme ich keine Gewähr.
    </p>
  `;
  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");
}

function showCreateWPage() {
  mainContent.innerHTML = `
<style>
  .editor-container {
    display: flex;
    gap: 50px;
    margin-top: 20px;
  }

  .editor, .preview {
    width: 50%;
  }

  textarea {
    width: 100%;
    height: 300px;
    font-family: monospace;
    font-size: 14px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: vertical;
  }

  iframe {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: white;
  }

  .btn-group {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }
</style>

<h2>Eigene Website erstellen</h2>
<p>Schreibe unten HTML & CSS und sieh dir sofort das Ergebnis:</p>
<p>Zum kopieren: " ; , . () [] </p>
  <p style="margin-top:15px; cursor:pointer;"
     onclick="showVideosPage()">
     Kleiner Tipp: Schau dir die <span style="text-decoration:underline; color:#007bff;">Videos</span> an, um einfacher zu lernen!
  </p> 
<div class="editor-container">
  <div class="editor">
    <h3>HTML Code</h3>
    <textarea id="htmlCode"></textarea>

    <div class="btn-group">
      <button class="run-btn" onclick="resetCode()">⟲</button>
    </div>
  </div>

  <div class="preview">
    <h3>Vorschau</h3>
    <iframe id="previewFrame"></iframe>
  </div>
</div>
`;

  const textarea = document.getElementById("htmlCode");

  const defaultHTML = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Meine Website</title>
</head>
<body>
  <h1>Hey Website</h1>
  <p>Das ist meine eigene Website.</p>
</body>
</html>`;

  // Inhalt aus LocalStorage laden, wenn vorhanden
  const savedHTML = localStorage.getItem("myWebsiteHTML");
  textarea.value = savedHTML || defaultHTML;

  updatePreview();

  // Änderungen speichern
  textarea.addEventListener("input", () => {
    localStorage.setItem("myWebsiteHTML", textarea.value);
    updatePreview();
  });

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");

  // Quiz-Zustand zurücksetzen
  localStorage.removeItem("currentQuiz");
  currentQuiz = null;

  // Funktion zum Zurücksetzen
  window.resetCode = function () {
    textarea.value = defaultHTML;
    localStorage.setItem("myWebsiteHTML", defaultHTML);
    updatePreview();
  };
}

function updatePreview() {
  const html = document.getElementById("htmlCode").value;
  const iframe = document.getElementById("previewFrame");

  iframe.srcdoc = html;
}

// ================================
// Python-Seite anzeigen
// ================================
function showCreatePPage() {
  mainContent.innerHTML = `
    <h2>Eigene Python Programme erstellen</h2>
    <p>Schreibe einfachen Python-Code und führe ihn direkt aus:</p>
  <p style="margin-top:15px; cursor:pointer;"
     onclick="showVideosPage()">
    Tipp: Schau dir die <span style="text-decoration:underline; color:#007bff;">Videos</span> an, um einfacher zu lernen!
  </p>
 
  <textarea id="pythonCode" style="width:80vw; height:150px; font-family:monospace; background:#f0f0f0; padding:20px; border-radius:20px; border:1px solid #ccc;">
print("Hallo Welt!")

    </textarea>

   <br> <br>
<button id="runBtn" class="run-btn">
  ▶ Run
</button>

    <pre id="output" style="width:80vw; height:150px; font-family:monospace; background:#f0f0f0; padding:20px; border-radius:20px; border:1px solid #ccc;"></pre>

    <div style="max-width:80vw; margin-top:12px; display:flex; gap:8px; align-items:center;">
      <input id="terminalInput" placeholder="Terminal: Python-Ausdruck oder Eingabe (z.B. 2+2 oder name = input('Wie heißt du?'))" style="flex:1; padding:8px; border-radius:8px; border:1px solid #ccc; font-family:monospace;">
      <button id="terminalRunBtn" class="run-btn">↵ Ausführen</button>
    </div>

<br>
    <div class="python-example" style="width:80vw; background:#e8f4ff; padding:20px; border-radius:15px; border:1px solid #99c2ff; font-family:monospace;">
      <h3>Beispiel:</h3>
      <ul>
        <li><strong>print("Text")</strong> – Text ausgeben</li>
        <li><strong>input("Frage")</strong> – Eingabe vom Benutzer</li>
        <li><strong>Zahlen rechnen:</strong> +, -, *, /, ** (Hoch)</li>
      </ul>
    </div>
  `;

  document.getElementById("runBtn").onclick = runPython;
  document.getElementById("terminalRunBtn").onclick = runTerminal;
  document.getElementById("terminalInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runTerminal();
    }
  });

  loadPyodideIfNeeded();

  // Mark main content as python page for specific styling
  mainContent.classList.add("python-page");

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.classList.remove("open");

  // Quiz-Zustand zurücksetzen
  localStorage.removeItem("currentQuiz");
  currentQuiz = null;
}

// ================================
// Pyodide laden (einmal)
// ================================
let pyodideReady = false;

async function loadPyodideIfNeeded() {
  if (pyodideReady) return;

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";

  script.onload = async () => {
    window.pyodide = await loadPyodide();
    pyodideReady = true;
  };

  document.head.appendChild(script);
}

// ================================
// Python-Code ausführen
// ================================
async function runPython() {
  const code = document.getElementById("pythonCode").value;
  const output = document.getElementById("output");

  if (!pyodideReady) {
    output.textContent = "Python wird noch geladen...";
    return;
  }

  output.textContent = "";

  try {
    // input() in Python mit browser-prompt verbinden
    pyodide.runPython(
      `from js import prompt as js_prompt\ninput = lambda prompt='': js_prompt(prompt)`
    );

    // stdout abfangen
    pyodide.runPython(
      `import sys\nfrom io import StringIO\nsys.stdout = StringIO()`
    );

    // User-Code ausführen
    pyodide.runPython(code);

    // Ausgabe anzeigen
    const result = pyodide.runPython("sys.stdout.getvalue()");
    output.textContent = result || "(kein Output)";
  } catch (err) {
    output.textContent = err;
  }
}

// Terminal-Eingabe: versucht zuerst eval, dann exec
function runTerminal() {
  const input = document.getElementById("terminalInput").value.trim();
  const output = document.getElementById("output");
  if (!pyodideReady) {
    output.textContent = "Python wird noch geladen...";
    return;
  }
  if (!input) return;

  try {
    // Versuch: als Ausdruck auswerten
    const res = pyodide.runPython(`eval(${JSON.stringify(input)})`);
    output.textContent += `\n>>> ${input}\n${String(res)}`;
  } catch (e) {
    try {
      // Falls kein Ausdruck, als Statement ausführen
      pyodide.runPython(`exec(${JSON.stringify(input)})`);
      output.textContent += `\n>>> ${input}\n(Executed)`;
    } catch (err) {
      output.textContent += `\n>>> ${input}\nError: ${err}`;
    }
  }

  document.getElementById("terminalInput").value = "";
  // scroll to bottom
  output.scrollTop = output.scrollHeight;
}

const toggleBtn = document.getElementById("togglePetBtn");
const petContainer = document.getElementById("pet-container");

const canvas = document.getElementById("petCanvas");
const ctx = canvas.getContext("2d");
const feedBtn = document.getElementById("feedBtn");
const countdownDiv = document.getElementById("countdown");

const tileSize = 10;

// Drachen-Sprite
let dragon = {
  x: 6,
  y: 7,
  bodyColor: "#FF4500",
  wingColor: "#800000",
  eyeColor: "#FFFFFF",
};

// Boden
const groundY = 10;

// Fütterung
let lastFed = localStorage.getItem("lastFed")
  ? parseInt(localStorage.getItem("lastFed"))
  : 0;
const cooldown = 30 * 60 * 1000; // 30 Minuten

// Toggle Panel
toggleBtn.addEventListener("click", () => {
  if (petContainer.style.display === "none") {
    petContainer.style.display = "block";
  } else {
    petContainer.style.display = "none";
  }
});

// Zeichne Szene
function drawScene() {
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gras
  ctx.fillStyle = "#4CAF50";
  for (let i = 0; i < canvas.width / tileSize; i++) {
    ctx.fillRect(i * tileSize, groundY * tileSize, tileSize, tileSize);
  }

  // Erde
  ctx.fillStyle = "#8B4513";
  for (let y = groundY + 1; y < canvas.height / tileSize; y++) {
    for (let x = 0; x < canvas.width / tileSize; x++) {
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // Drachen
  // Körper
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 3; x++) {
      ctx.fillStyle = dragon.bodyColor;
      ctx.fillRect(
        (dragon.x + x) * tileSize,
        (dragon.y + y) * tileSize,
        tileSize,
        tileSize
      );
    }
  }
  // Kopf
  ctx.fillStyle = dragon.bodyColor;
  ctx.fillRect(
    (dragon.x + 3) * tileSize,
    (dragon.y + 0) * tileSize,
    tileSize,
    tileSize
  );
  // Auge
  ctx.fillStyle = dragon.eyeColor;
  ctx.fillRect(
    (dragon.x + 3) * tileSize,
    (dragon.y + 0) * tileSize,
    tileSize / 2,
    tileSize / 2
  );
  // Flügel
  ctx.fillStyle = dragon.wingColor;
  ctx.fillRect(
    (dragon.x + 1) * tileSize,
    (dragon.y - 1) * tileSize,
    tileSize,
    tileSize
  );
  ctx.fillRect(
    (dragon.x + 2) * tileSize,
    (dragon.y - 1) * tileSize,
    tileSize,
    tileSize
  );
  // Schwanz
  ctx.fillStyle = dragon.bodyColor;
  ctx.fillRect(
    (dragon.x - 1) * tileSize,
    (dragon.y + 1) * tileSize,
    tileSize,
    tileSize
  );
}

// Animation
function animateDragon() {
  let jumpHeight = 2,
    steps = 0,
    up = true;
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (up) {
      dragon.y -= 0.3;
      steps++;
      if (steps >= jumpHeight * 2) up = false;
    } else {
      dragon.y += 0.3;
      steps--;
      if (steps <= 0) {
        clearInterval(interval);
        dragon.y = 7;
      }
    }
    drawScene();
  }, 30);
}

// Füttern
function feedDragon() {
  const now = Date.now();
  if (now - lastFed >= cooldown) {
    lastFed = now;
    localStorage.setItem("lastFed", lastFed);
    animateDragon();
    updateCountdown();
  } else {
    alert(
      "Drachen kann erst wieder gefüttert werden, wenn der Countdown abgelaufen ist!"
    );
  }
}

feedBtn.addEventListener("click", feedDragon);

// Countdown
function updateCountdown() {
  const now = Date.now();
  let remaining = cooldown - (now - lastFed);
  if (remaining <= 0) {
    feedBtn.disabled = false;
    toggleBtn.textContent = "Drachen füttern - Bereit!";
    return;
  }
  feedBtn.disabled = true;
  feedBtn.style.background = "#ccc";
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  toggleBtn.textContent = ` Drachen füttern - ${minutes}m ${seconds}s`;
}

// Initial
drawScene();
setInterval(updateCountdown, 1000);
updateCountdown();

// Button Hover
feedBtn.addEventListener("mouseenter", () => {
  if (!feedBtn.disabled);
});
feedBtn.addEventListener("mouseleave", () => {
  if (!feedBtn.disabled);
});

let feedCount = localStorage.getItem("feedCount")
  ? parseInt(localStorage.getItem("feedCount"))
  : 0;

const feedCountDiv = document.createElement("div");
feedCountDiv.style.marginTop = "10px";
feedCountDiv.style.fontWeight = "bold";
feedCountDiv.textContent = `Drachen gefüttert: ${feedCount} mal`;
petContainer.appendChild(feedCountDiv);

function feedDragon() {
  const now = Date.now();
  if (now - lastFed >= cooldown) {
    lastFed = now;
    localStorage.setItem("lastFed", lastFed);
    animateDragon();
    feedCount++; // Zähler erhöhen
    localStorage.setItem("feedCount", feedCount);
    feedCountDiv.textContent = `Drachen gefüttert: ${feedCount} mal`; // UI aktualisieren
    updateCountdown();
  } else {
    alert(
      "Drachen kann erst wieder gefüttert werden, wenn der Countdown abgelaufen ist!"
    );
  }
}

// Beim Laden gespeichertes Bild setzen
window.addEventListener("load", () => {
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) profilePic.src = savedPic;
});

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
      new Date().toISOString().slice(0, 10)
    );
  });
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

// ===== Theme (Dark / Light) =====
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark-theme");
  } else {
    document.documentElement.classList.remove("dark-theme");
  }
  localStorage.setItem("theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    // use SVG icons instead of emoji
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
      // ensure focus stays visible for keyboard users
      btn.blur();
    });
  }
}

window.addEventListener("load", () => {
  askUserInfo();
  loadLastState();
  initStats();
  initTheme();
  updateXPDisplay();
});

// ===== Online / Offline Handling =====
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

// Initialize state after DOM ready
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  updateOnlineStatus();
} else {
  window.addEventListener("DOMContentLoaded", updateOnlineStatus);
}

// Reload-Button Verhalten
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
