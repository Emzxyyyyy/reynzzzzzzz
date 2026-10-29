// MOBILE NAVIGATION
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.textContent = isOpen ? "✕ Close" : "☰ Menu";
});

// Close the mobile menu after clicking a link
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰ Menu";
  });
});

// AUTOMATIC COPYRIGHT YEAR
document.getElementById("year").textContent =
  new Date().getFullYear();

// SCROLL REVEAL ANIMATION
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("show"));
}

// ANIMATED SKILL BARS
const skillBars = document.querySelectorAll(".skill-fill");

if ("IntersectionObserver" in window) {
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => skillObserver.observe(bar));
} else {
  skillBars.forEach(bar => {
    bar.style.width = bar.dataset.width;
  });
}

// ACTIVE NAVIGATION LINK
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach(section => navObserver.observe(section));
}

// BACK TO TOP BUTTON
const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {
  backTop.classList.toggle("visible", window.scrollY > 400);
});

backTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// SCROLL PROGRESS BAR
const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollable > 0
    ? (window.scrollY / scrollable) * 100
    : 0;

  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, {
  passive: true
});

window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

// DARK AND LIGHT THEME TOGGLE
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");

  themeBtn.textContent = isLight ? "☾" : "☼";

  themeBtn.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );

  themeBtn.title = isLight
    ? "Switch to dark theme"
    : "Switch to light theme";
});

// PROJECT CATEGORY FILTERS
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(item => {
      const selected = item === button;

      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    projectCards.forEach(card => {
      const matches =
        filter === "all" || card.dataset.category === filter;

      card.classList.toggle("filtered-out", !matches);
    });
  });
});

// CONTACT FORM
// Sends the message straight to Gmail through FormSubmit (free service).
// If sending fails, it falls back to opening the visitor's email app.
const MY_EMAIL = "reynzdaryl6@gmail.com";

document.getElementById("contactForm").addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    const form = event.target;
    const note = document.getElementById("formNote");
    const sendBtn = form.querySelector("button[type='submit']");

    const name = document.getElementById("senderName").value.trim();
    const email = document.getElementById("senderEmail").value.trim();
    const message = document.getElementById("senderMessage").value.trim();

    // Spam trap: real visitors never fill this hidden field
    if (document.getElementById("website").value) return;

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    note.className = "form-note";
    note.textContent = "Sending your message...";

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/" + MY_EMAIL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: "Portfolio message from " + name,
            _replyto: email,
            _template: "table",
            _captcha: "false"
          })
        }
      );

      const result = await response.json();

      if (response.ok && String(result.success) === "true") {
        form.reset();
        note.className = "form-note contact-form-status";
        note.textContent = "✓ Message sent! Thank you, I'll get back to you soon.";
      } else {
        throw new Error(result.message || "Send failed");
      }
    } catch (error) {
      note.textContent =
        "Couldn't send automatically. Opening your email app instead...";

      const subject = encodeURIComponent("Portfolio message from " + name);
      const body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Message:\n" + message
      );

      window.location.href =
        "mailto:" + MY_EMAIL + "?subject=" + subject + "&body=" + body;
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Message ↗";
    }
  }
);

// SAVED THEME
try {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    themeBtn.textContent = "☾";
    themeBtn.setAttribute("aria-label", "Switch to dark theme");
  }
} catch (e) {}
themeBtn.addEventListener("click", () => {
  try {
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light-theme") ? "light" : "dark"
    );
  } catch (e) {}
});

// TYPING ROLE LINE
(function () {
  const el = document.getElementById("roleLine");
  const roles = ["Aspiring Web Developer", "Computer Engineering Student", "Beginner Guitarist", "Lifelong Learner"];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = roles[0];
    return;
  }
  let r = 0, c = 0, deleting = false;
  function tick() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    let delay = deleting ? 40 : 85;
    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
    setTimeout(tick, delay);
  }
  tick();
})();

// MODALS
let lastTrigger = null;
function openModal(id, trigger) {
  lastTrigger = trigger || null;
  const m = document.getElementById(id);
  m.classList.add("open");
  document.body.style.overflow = "hidden";
  const focusTarget = m.querySelector("input, button:not(.close-btn)") || m.querySelector(".close-btn");
  if (focusTarget) focusTarget.focus();
}
function closeModals() {
  document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
  document.body.style.overflow = "";
  if (lastTrigger) lastTrigger.focus();
}
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.open, btn));
});
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", closeModals);
});
document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("mousedown", e => { if (e.target === m) closeModals(); });
});

// CALCULATOR (no eval: simple, safe logic)
(function () {
  const display = document.getElementById("calcDisplay");
  const history = document.getElementById("calcHistory");
  const modal = document.getElementById("calcModal");
  let current = "0", previous = null, operator = null, fresh = false, error = false;

  function compute(a, b, op) {
    if (op === "+") return a + b;
    if (op === "−") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") return b === 0 ? NaN : a / b;
    return b;
  }
  function fmt(n) {
    if (!isFinite(n)) return "Error";
    const rounded = parseFloat(n.toPrecision(12));
    let t = String(rounded);
    if (t.length > 14) t = rounded.toExponential(6);
    return t;
  }
  function render() {
    display.textContent = current;
    history.textContent = previous !== null && operator ? fmt(previous) + " " + operator : "";
  }
  function reset() { current = "0"; previous = null; operator = null; fresh = false; error = false; }
  function num(d) {
    if (error) reset();
    if (fresh) { current = "0"; fresh = false; }
    if (current === "0") current = d;
    else if (current.replace(/[-.]/g, "").length < 14) current += d;
    render();
  }
  function dot() {
    if (error) reset();
    if (fresh) { current = "0"; fresh = false; }
    if (!current.includes(".")) current += ".";
    render();
  }
  function setOp(op) {
    if (error) return;
    if (operator && !fresh) {
      const result = compute(previous, parseFloat(current), operator);
      current = fmt(result);
      if (current === "Error") { error = true; previous = null; operator = null; render(); return; }
      previous = result;
    } else {
      previous = parseFloat(current);
    }
    operator = op;
    fresh = true;
    render();
  }
  function equals() {
    if (error || !operator) return;
    const b = parseFloat(current);
    const result = compute(previous, b, operator);
    history.textContent = fmt(previous) + " " + operator + " " + fmt(b) + " =";
    current = fmt(result);
    if (current === "Error") error = true;
    previous = null; operator = null; fresh = true;
    display.textContent = current;
  }
  function back() {
    if (error) { reset(); render(); return; }
    if (fresh) return;
    current = current.length > 1 && current !== "-0" ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
    render();
  }
  function sign() {
    if (error || current === "0") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    render();
  }
  function percent() {
    if (error) return;
    current = fmt(parseFloat(current) / 100);
    fresh = false;
    render();
  }

  document.getElementById("calcKeys").addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.num) num(b.dataset.num);
    else if (b.dataset.op) setOp(b.dataset.op);
    else if (b.dataset.act === "clear") { reset(); render(); }
    else if (b.dataset.act === "back") back();
    else if (b.dataset.act === "dot") dot();
    else if (b.dataset.act === "equals") equals();
    else if (b.dataset.act === "sign") sign();
    else if (b.dataset.act === "percent") percent();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModals(); return; }
    if (!modal.classList.contains("open")) return;
    const k = e.key;
    if (/^[0-9]$/.test(k)) num(k);
    else if (k === ".") dot();
    else if (k === "+") setOp("+");
    else if (k === "-") setOp("−");
    else if (k === "*" || k === "x") setOp("×");
    else if (k === "/") { e.preventDefault(); setOp("÷"); }
    else if (k === "Enter" || k === "=") { e.preventDefault(); equals(); }
    else if (k === "Backspace") back();
    else if (k === "%") percent();
    else if (k.toLowerCase() === "c") { reset(); render(); }
  });
  render();
})();

// TASK PLANNER
(function () {
  const form = document.getElementById("todoForm");
  const input = document.getElementById("todoInput");
  const list = document.getElementById("todoList");
  const count = document.getElementById("todoCount");
  const bar = document.getElementById("todoBar");
  const KEY = "portfolio-tasks";
  let tasks = [];

  try { tasks = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { tasks = []; }
  if (!Array.isArray(tasks)) tasks = [];
  if (!tasks.length) {
    tasks = [
      { id: 1, text: "Practice guitar chords", done: false },
      { id: 2, text: "Study JavaScript", done: false }
    ];
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) {} }

  function render() {
    list.innerHTML = "";
    if (!tasks.length) {
      const empty = document.createElement("li");
      empty.className = "todo-empty";
      empty.textContent = "No tasks yet. Add one above!";
      list.appendChild(empty);
    }
    tasks.forEach(t => {
      const li = document.createElement("li");
      if (t.done) li.className = "done";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = "task-" + t.id;
      cb.checked = t.done;
      cb.addEventListener("change", () => { t.done = cb.checked; save(); render(); });

      const label = document.createElement("label");
      label.htmlFor = cb.id;
      label.textContent = t.text;

      const del = document.createElement("button");
      del.className = "todo-del";
      del.type = "button";
      del.textContent = "🗑";
      del.setAttribute("aria-label", "Delete task: " + t.text);
      del.addEventListener("click", () => { tasks = tasks.filter(x => x.id !== t.id); save(); render(); });

      li.append(cb, label, del);
      list.appendChild(li);
    });
    const done = tasks.filter(t => t.done).length;
    count.textContent = done + " of " + tasks.length + " done";
    bar.style.width = tasks.length ? (done / tasks.length * 100) + "%" : "0";
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now(), text, done: false });
    input.value = "";
    save();
    render();
  });

  document.getElementById("todoClear").addEventListener("click", () => {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
  });

  render();
})();