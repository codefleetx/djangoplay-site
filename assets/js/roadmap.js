document.addEventListener("DOMContentLoaded", function () {
  console.log("Roadmap script loaded");

  const btn = document.getElementById("roadmap-btn");
  const modal = document.getElementById("roadmap-modal");
  const closeBtn = document.getElementById("roadmap-close");

  console.log(btn, modal, closeBtn);

  if (!btn || !modal || !closeBtn) {
    console.log("Roadmap elements missing");
    return;
  }

  // Open modal
  btn.addEventListener("click", () => {
    console.log("Roadmap button clicked");
    loadRoadmap();
    btn.classList.add("active");   // highlight button
  });

  // Close button
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    btn.classList.remove("active");
  });

  // Click outside modal
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("show");
      btn.classList.remove("active");
    }
  });

  // Escapte key to close modal
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        modal.classList.remove("show");
        btn.classList.remove("active");
    }
    });
});

function loadRoadmap() {
  const modal = document.getElementById("roadmap-modal");
  const btn = document.getElementById("roadmap-btn");
  if (!modal) return;

  if (modal.dataset.loaded) {
    modal.classList.add("show");
    btn.classList.add("active");
    return;
  }

  fetch('/dist/json/roadmap.pkg')
    .then(res => res.text())
    .then(base64 => {
      const decoded = atob(base64.replace(/\s/g, ''));
      const data = JSON.parse(decoded);

      // Inject date into JSON object
      const today = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });

      data.last_updated = `Last updated: ${today}`;

      renderRoadmap(data);

      modal.dataset.loaded = "true";
      modal.classList.add("show");
      btn.classList.add("active");
    });
}

function renderRoadmap(data) {
  const titleEl = document.getElementById("roadmap-title");

  titleEl.textContent = data.title;

  if (data.last_updated) {
    const dateEl = document.createElement("div");
    dateEl.className = "roadmap-date";
    dateEl.textContent = data.last_updated;
    titleEl.appendChild(document.createElement("br"));
    titleEl.appendChild(dateEl);
  }

  const body = document.getElementById("roadmap-body");
  body.innerHTML = "";

  data.sections.forEach(section => {
    const h = document.createElement("h3");
    h.textContent = section.label;
    body.appendChild(h);

    const ul = document.createElement("ul");
    section.items.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = marked.parse(item);
      ul.appendChild(li);
    });

    body.appendChild(ul);
  });
}