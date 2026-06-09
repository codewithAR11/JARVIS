const setup = document.getElementById("setupScreen");
const app = document.getElementById("app");
const profile = document.getElementById("profile");
const statusEl = document.getElementById("status");
const historyEl = document.getElementById("history");

function speak(text) {

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speechSynthesis.speak(speech);

    addHistory("Jarvis", text);
}

function addHistory(sender, message) {

    if (!historyEl) return;

    historyEl.innerHTML += `
        <div style="margin:8px 0;">
            <b>${sender}:</b> ${message}
        </div>
    `;

    historyEl.scrollTop = historyEl.scrollHeight;
}

function loadProfile() {

    const name = localStorage.getItem("jarvis_name");

    if (!name) return;

    if (setup) setup.classList.add("hidden");
    if (app) app.classList.remove("hidden");

    const nickname =
        localStorage.getItem("jarvis_nickname");

    const gender =
        localStorage.getItem("jarvis_gender");

    let title = "Friend";

    if (gender === "male") title = "Sir";
    if (gender === "female") title = "Ma'am";

    if (profile) {

        profile.innerHTML = `
            <h2>${name}</h2>
            <p>Nickname: ${nickname}</p>
            <p>${title}</p>
        `;
    }

    greetUser(name, title);
}

function greetUser(name, title) {

    const hour = new Date().getHours();

    let greeting = "Hello";

    if (hour < 12)
        greeting = "Good Morning";

    else if (hour < 18)
        greeting = "Good Afternoon";

    else
        greeting = "Good Evening";

    speak(`${greeting} ${name} ${title}. I am Jarvis. How can I help you?`);
}

const saveBtn =
    document.getElementById("saveProfile");

if (saveBtn) {

    saveBtn.addEventListener("click", () => {

        localStorage.setItem(
            "jarvis_name",
            document.getElementById("name").value
        );

        localStorage.setItem(
            "jarvis_nickname",
            document.getElementById("nickname").value
        );

        localStorage.setItem(
            "jarvis_gender",
            document.getElementById("gender").value
        );

        localStorage.setItem(
            "jarvis_lang",
            document.getElementById("language").value
        );

        location.reload();
    });
}

const themeBtn =
    document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light");
    });
}

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

const recognition =
    SpeechRecognition
        ? new SpeechRecognition()
        : null;

if (recognition) {

    recognition.continuous = false;

    recognition.onstart = () => {

        if (statusEl)
            statusEl.innerText = "Listening...";
    };

    recognition.onend = () => {

        if (statusEl)
            statusEl.innerText = "Ready";
    };

    recognition.onresult = (event) => {

        const command =
            event.results[0][0].transcript.toLowerCase();

        addHistory("You", command);

        handleCommand(command);
    };
}

const micBtn =
    document.getElementById("micBtn");

if (micBtn) {

    micBtn.addEventListener("click", () => {

        if (!recognition) {

            alert(
                "Speech Recognition not supported in this browser."
            );

            return;
        }

        recognition.lang =
            localStorage.getItem("jarvis_lang")
            || "en-US";

        recognition.start();
    });
}

const websites = {

    youtube: "https://youtube.com",
    google: "https://google.com",
    github: "https://github.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    canva: "https://canva.com",
    chess: "https://chess.com",
    chatgpt: "https://chatgpt.com"
};

function solveMath(command) {

    try {

        let expression = command;

        expression =
            expression.replace("calculate", "")
                .replace("solve", "")
                .replace("what is", "")
                .replace("=", "")
                .trim();

        expression =
            expression.replace(/plus/g, "+")
                .replace(/minus/g, "-")
                .replace(/times/g, "*")
                .replace(/multiplied by/g, "*")
                .replace(/x/g, "*")
                .replace(/divided by/g, "/")
                .replace(/over/g, "/");

        const result = eval(expression);

        if (!isNaN(result)) {

            speak(`The answer is ${result}`);

            return true;
        }

    } catch (error) {

        return false;
    }

    return false;
}

function handleCommand(command) {

    if (
        command.includes("calculate") ||
        command.includes("solve") ||
        command.match(/[0-9]/)
    ) {

        if (solveMath(command))
            return;
    }

    const introQuestions = [

        "who are you",
        "what is your name",
        "introduce yourself",
        "tell me about yourself"
    ];

    if (
        introQuestions.some(q =>
            command.includes(q))
    ) {

        speak(
            "I am Jarvis, your personal offline voice assistant."
        );

        return;
    }

    if (
        command.includes("who made you") ||
        command.includes("creator")
    ) {

        speak(
            "I was created by Ahmed Rehmat."
        );

        return;
    }

    // TIME

    if (
        command.includes("time")
    ) {

        speak(
            `Current time is ${new Date().toLocaleTimeString()}`
        );

        return;
    }

    if (
        command.includes("date") ||
        command.includes("today")
    ) {

        speak(
            `Today is ${new Date().toDateString()}`
        );

        return;
    }

    for (let site in websites) {

        if (
            command.includes(site)
        ) {

            speak(
                `Opening ${site}`
            );

            window.open(
                websites[site],
                "_blank"
            );

            return;
        }
    }

    if (
        command.includes("hello") ||
        command.includes("hi")
    ) {

        speak(
            "Hello. How can I help you?"
        );

        return;
    }

    if (
        command.includes("bye") ||
        command.includes("goodbye")
    ) {

        speak(
            "Goodbye. Press the microphone button whenever you need me."
        );

        return;
    }

    if (
        command.includes("help") ||
        command.includes("what can you do")
    ) {

        speak(
            "I can solve math, open websites, tell time and date, and introduce myself."
        );

        return;
    }

    speak(
        "Sorry, I don't understand that command."
    );
}

function writeOnWebsite(text) {
    const active = document.activeElement;

    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        active.value += text;
        active.dispatchEvent(new Event("input", { bubbles: true }));
        return "Text written in active input field.";
    }

    const editable = document.querySelector("[contenteditable='true']");

    if (editable) {
        editable.innerText += text;
        return "Text written in content editable area.";
    }

    return "No writable field found on this page.";
}
// WRITE COMMAND
function writecommand(text){
if (command.startsWith("write ")) {

    let text = command.replace("write ", "");

    let active = document.activeElement;

    if (
        active &&
        (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA"
        )
    ) {

        active.value += text;

        active.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        speak("Text written");

    } else {

        speak("Click inside a text box first");
    }

    return;
}

// CLEAR TEXT

if (command === "clear text") {

    let active = document.activeElement;

    if (
        active &&
        (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA"
        )
    ) {

        active.value = "";

        active.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        speak("Text cleared");

    } else {

        speak("No text box selected");
    }

    return;
}

// GOOGLE SEARCH

if (command.startsWith("search google ")) {

    let query =
        command.replace(
            "search google ",
            ""
        );

    window.open(
        "https://www.google.com/search?q=" +
        encodeURIComponent(query),
        "_blank"
    );

    speak(
        "Searching Google for " +
        query
    );

    return;
}

// YOUTUBE SEARCH

if (
    command.startsWith(
        "open youtube and search "
    )
) {

    let query =
        command.replace(
            "open youtube and search ",
            ""
        );

    window.open(
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(query),
        "_blank"
    );

    speak(
        "Searching YouTube for " +
        query
    );

    return;
}

// REMEMBER NOTE

if (command.startsWith("remember ")) {

    let note =
        command.replace(
            "remember ",
            ""
        );

    localStorage.setItem(
        "jarvis_note",
        note
    );

    speak(
        "Note saved"
    );

    return;
}

// READ NOTE

if (
    command === "read note" ||
    command === "what do you remember"
) {

    let note =
        localStorage.getItem(
            "jarvis_note"
        );

    if (note) {

        speak(note);

    } else {

        speak(
            "No note saved"
        );
    }

    return;
}
}
loadProfile();