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
  burger.innerHTML = sidebar.classList.contains("active")
    ? "&times;"
    : "&#9776;";
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
  burger.innerHTML = "&#9776;";
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
        "<h2>Quiz beendet!</h2><p>Alle Fragen korrekt beantwortet. Tippe auf die drei Striche oben für weitere Optionen.</p>";
      localStorage.removeItem("currentQuiz"); // optional
    }
  }
}

function showVideosPage() {
  mainContent.innerHTML = `
    <h1>LernCoding Videos</h1>
    <p>Hier findest du nützliche Lernvideos!</p>

    <div style="
      display:flex;
      flex-direction:column;
      gap:24px;
      margin-top:16px;
      padding:0 16px;
    ">

      <div>
        <h4>HTML Grundlagen</h4>
        <p>Lerne die Grundlagen von HTML.</p>
        <div style="position:relative; padding-top:56.25%;">
          <iframe 
      src="https://www.youtube.com/embed/nmiWXn6aIAs" 
            style="
              position:absolute;
              top:0; left:0;
              width:100%;
              height:100%;
              border-radius:8px;
            "
            frameborder="0"
            allowfullscreen>
          </iframe>
        </div>
      </div>


      <div>
        <h4>Python</h4>
        <p>Einführung in die Programmiersprache Python.</p>
        <div style="position:relative; padding-top:56.25%;">
          <iframe 
            src=""
            style="
              position:absolute;
              top:0; left:0;
              width:100%;
              height:100%;
              border-radius:8px;
            "
            frameborder="0"
            allowfullscreen>
          </iframe>
        </div>
      </div>

    </div>
  `;

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.innerHTML = "&#9776;";
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
  burger.innerHTML = "&#9776;";
}

function showVideosPage() {
  mainContent.innerHTML = `
    <h1 style="text-align:center;">LernCoding Videos</h1>
    <p style="text-align:center;">Hier findest du nützliche Lernvideos!</p>

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

      ${createVideo(
        "HTML Grundlagen",
        "https://www.youtube.com/embed/nmiWXn6aIAs"
      )}

   
      ${createVideo("Mehr Videos folgen", "")}

    </div>
  `;
  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.innerHTML = "&#9776;";
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
    <h1>Startseite</h1>     

    <p>Stelle sicher, dass du die App <b><i>zur Startseite hinzugefügt</i></b> hast, damit dein Stand gespeichert wird!</p>


   

    <hr style="margin: 30px 0" />

    <h2>LernCoding zum Startbildschirm hinzufügen</h2>

      <ol
        style="
          font-size: 16px;
          background-color: rgb(247, 247, 177);
          border-radius: 20px;
          border: 1px solid #e0e0a3;
          display: flex;
          justify-content: center;
          align-items: start;
          flex-direction: column;
          text-align: left;
          padding-bottom: 15px;
                    max-width: 420px;

        "
      >
      <h2>Auf Apple Geräten</h2>
        <li>Öffne diese Webseite in <strong>Safari</strong> (nicht Chrome).</li>
        <li>Tippe unten auf das <strong>Teilen-Symbol</strong>.</li>
        <li>
          Scrolle nach unten und tippe auf
          <strong>„Zum Home-Bildschirm“</strong>.
        </li>
        <li>Wähle einen Namen (z. B. <strong>LernCoding</strong>).</li>
        <li>Tippe auf <strong>„Hinzufügen“</strong>.</li>
      </ol>
<ol
        style="
          font-size: 16px;
          background-color: rgb(247, 247, 177);
          border-radius: 20px;
          border: 1px solid #e0e0a3;
          display: flex;
          justify-content: center;
          align-items: start;
          flex-direction: column;
          text-align: left;
          padding-bottom: 15px;
                    max-width: 420px;

        "
      >
      <h2>Auf Android Geräten</h2>
        <li>Chrome öffnen.</li>
        <li>Auf das <strong>Drei-Punkte-Menü</strong> oben rechts tippen.</li>
        <li>Auf <strong>„Zum Startbildschirm hinzufügen“</strong> tippen.</li>
        <li>Einen Namen wählen (z. B. <strong>LernCoding</strong>).</li>
        <li>Auf <strong>„Hinzufügen“</strong> tippen.</li>
      </ol>
        


      <p style="margin-top: 15px">
        Die App erscheint jetzt wie eine echte App auf deinem Gerät!
      </p>
  `;

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.innerHTML = "&#9776;";

  // Quiz-Zustand zurücksetzen
  localStorage.removeItem("currentQuiz");
  currentQuiz = null;
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
  burger.innerHTML = "&#9776;";
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
  burger.innerHTML = "&#9776;";
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
  burger.innerHTML = "&#9776;";

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

    <textarea id="pythonCode" style="width:80vw; height:150px; font-family:monospace; background:#f0f0f0; padding:20px; border-radius:20px; border:1px solid #ccc;">
print("Hallo Welt!")

    </textarea>

   <br> <br>
<button id="runBtn" class="run-btn">
  ▶ Run
</button>

    <pre id="output" style="width:80vw; height:150px; font-family:monospace; background:#f0f0f0; padding:20px; border-radius:20px; border:1px solid #ccc;"></pre>

<br>
    <div style="width:80vw; background:#e8f4ff; padding:20px; border-radius:15px; border:1px solid #99c2ff; font-family:monospace;">
      <h3>Beispiele:</h3>
      <ul>
        <li><strong>print("Text")</strong> – Text ausgeben</li>
        <li><strong>len("Text")</strong> – Länge eines Strings ermitteln</li>
        <li><strong>sum([1,2,3])</strong> – Summe einer Liste berechnen</li>
        <li><strong>range(5)</strong> – Zahlen von 0 bis 4 erzeugen</li>
        <li><strong>for i in range(5): print(i)</strong> – Schleife durch Zahlen</li>
        <li><strong>if x &gt; 10: ...</strong> – Bedingte Anweisungen</li>
        <li><strong>import math</strong> – Mathematische Funktionen nutzen</li>
        <li><strong>help(list)</strong> – Hilfe zu Funktionen/Objekten anzeigen</li>
      </ul>
    </div>
  `;

  document.getElementById("runBtn").onclick = runPython;

  loadPyodideIfNeeded();

  // Sidebar schließen
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  burger.innerHTML = "&#9776;";

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
    // stdout abfangen
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

    // User-Code ausführen
    pyodide.runPython(code);

    // Ausgabe anzeigen
    const result = pyodide.runPython("sys.stdout.getvalue()");
    output.textContent = result || "(kein Output)";
  } catch (err) {
    output.textContent = err;
  }
}

// Beim Laden gespeichertes Bild setzen
window.addEventListener("load", () => {
  const savedPic = localStorage.getItem("profilePic");
  if (savedPic) profilePic.src = savedPic;
});

window.addEventListener("load", () => {
  askUserInfo();
  loadLastState();
});
