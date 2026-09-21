const config = window.INVITE_CONFIG;
const screens = [...document.querySelectorAll(".card")];
const noButton = document.querySelector("#noButton");
const microcopy = document.querySelector("#microcopy");
let dodges = 0;

document.querySelector("#recipientName").textContent = config.recipientName;
document.querySelector("#dateIdea").textContent = config.dateIdea;
let selectedChoice = "";

function show(id) {
  screens.forEach(screen => screen.classList.toggle("hidden", screen.id !== id));
}

document.querySelector("#startButton").addEventListener("click", () => show("question"));
document.querySelector("#yesButton").addEventListener("click", () => {
  show("success");
  const layer = document.querySelector(".sparkles");
  for (let i = 0; i < 28; i += 1) {
    const dot = document.createElement("i");
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.bottom = `${Math.random() * 25}%`;
    dot.style.animationDelay = `${Math.random() * .45}s`;
    layer.append(dot);
  }
});

document.querySelectorAll(".date-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedChoice = button.dataset.choice;
    document.querySelector("#choiceTitle").textContent = `${selectedChoice} λοιπόν.`;
    document.querySelector("#activity").value = selectedChoice;
    show("finalChoice");
  });
});

document.querySelector("#changeChoice").addEventListener("click", () => show("success"));

const dateTimeInput = document.querySelector("#dateTime");
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
dateTimeInput.min = now.toISOString().slice(0, 16);

document.querySelector("#planForm").addEventListener("submit", async event => {
  event.preventDefault();
  const status = document.querySelector("#submitStatus");
  const submitButton = document.querySelector("#submitPlan");

  if (config.formEndpoint.includes("ΑΛΛΑΞΕ_ΜΕ")) {
    status.textContent = "Χρειάζεται πρώτα να συνδεθεί η ειδοποίηση στο config.js.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Στέλνεται…";
  status.textContent = "";

  try {
    const response = await fetch(config.formEndpoint, {
      method: "POST",
      body: new FormData(event.currentTarget),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Form submission failed");
    show("confirmed");
  } catch (error) {
    status.textContent = "Δεν στάλθηκε. Δοκίμασε ξανά σε λίγο.";
    submitButton.disabled = false;
    submitButton.textContent = "Κλείσαμε ✨";
  }
});

const dodgeLines = [
  "Χμ… αυτό το κουμπί έχει άλλη άποψη.",
  "Είναι λίγο ντροπαλό. Μία τελευταία προσπάθεια;",
  "ΟΚ, οκ — τώρα θα κάτσει ήσυχο. Υπόσχομαι."
];

function dodge(event) {
  if (dodges >= 3) return;
  event.preventDefault();
  const margin = 18;
  const maxX = window.innerWidth - noButton.offsetWidth - margin;
  const maxY = window.innerHeight - noButton.offsetHeight - margin;
  noButton.classList.add("dodging");
  noButton.style.left = `${Math.max(margin, Math.random() * maxX)}px`;
  noButton.style.top = `${Math.max(margin, Math.random() * maxY)}px`;
  microcopy.textContent = dodgeLines[dodges];
  dodges += 1;
}

noButton.addEventListener("pointerenter", dodge);
noButton.addEventListener("touchstart", dodge, { passive: false });
noButton.addEventListener("click", () => {
  if (dodges < 3) return;
  noButton.classList.remove("dodging");
  show("decline");
});
