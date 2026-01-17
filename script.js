document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".openSidebar");
  const appShell = document.querySelector(".appShell");

// =================VIEW ROUTER=================
  const views = Array.from(document.querySelectorAll(".view"));

  function showView(viewId) {
    views.forEach((v)=> v.classList.remove("is-active"));
    document.getElementById(viewId)?.classList.add("is-active");

    document.querySelectorAll(".mobileNav_item").forEach((el) => {
        const target = el.dataset.view;
        el.classList.toggle("is-active", target === viewId);
      });
  }
  function parseHash() {
    const raw = window.location.hash.replace("#","").trim();
    if(!raw) return { view: "dashboard", subview: null };

    const [view, subview] = raw.split ("/");
    return { view,subview: subview || null }; 
  }

  function setHash(view, subview = null) {
    const next=subview ? `#${view}/${subview}` : `#${view}`;
    history.pushState(null, "", next);
  }
  function routeFromHash() {
    const { view } = parseHash();
    const exists = document.getElementById(view);
    showView(exists ? view : "dashboard");
  }


  routeFromHash();

  document.querySelectorAll("[data-view]").forEach((el)=> {
    el.addEventListener("click", (e) => {
        e.preventDefault();
        const view = el.dataset.view;
        const subview = el.dataset.subview || null;

        showView(view);
        setHash(view, subview);
    });
  });

  window.addEventListener("popstate", routeFromHash);

  if (toggleBtn && appShell) {
    toggleBtn.addEventListener("click", () => {
      appShell.classList.toggle("is-collapsed");
    });
  }

  // Clicking any nav item/button should open the sidebar
  const navTriggers = document.querySelectorAll(".nav a, .nav-sublink, .navSetting");
  const openSidebar = () => appShell?.classList.remove("is-collapsed");
  navTriggers.forEach((el) => {
    el.addEventListener("click",() =>
    appShell?.classList.remove("is-collapsed"));
  });

  // Dropdown-like nav groups
  const navGroups = document.querySelectorAll(".nav-Group");
  navGroups.forEach((btn) => {
    const panel = btn.nextElementSibling;
    if (!panel || !panel.classList.contains("nav-group-items")) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.classList.toggle("is-open", !isOpen);
    });
  });
});

  const closeChat = document.getElementById("closeChat");
  const newChat = document.querySelector(".newChat");
  const chatPanel = document.getElementById("chatPanel");
  const appShellChat = document.querySelector(".appShell");
  
  const toggleChat = () => {
    if (!appShellChat) return;
    appShellChat.classList.toggle("chat-collapsed");
  };
  
  if (closeChat && chatPanel) {
    closeChat.addEventListener("click", toggleChat);
  }
  if (newChat && chatPanel) {
    newChat.addEventListener("click", toggleChat);
  }

// =================DASHBOARD=================

const form = document.querySelector(".inviteForm");
const input = document.querySelector("#todo-input");
const container = document.querySelector("#mainContainer");
const numbersDisplay = document.querySelector("#numbers");
const progressFill = document.querySelector("#progressBar .progressFill");
const progressRing = document.querySelector(".progressRing");
const checkButton = document.querySelector(".checkBttn");
const clearButton = document.querySelector(".clearBttn");

const tasks = [];

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = input.value.trim();

    if (taskText !== "") {
        addTask(taskText);
        input.value = "";
    }
});

checkButton?.addEventListener("click", (event) => {
    event.preventDefault();
    const allChecked = tasks.every((task) => task.completed);
    tasks.forEach((task) => {
        task.completed = !allChecked;
    });
    renderTasks();
});

clearButton?.addEventListener("click", (event) => {
    event.preventDefault();
    tasks.splice(0, tasks.length); // clear the list in place
    renderTasks();
});

function addTask(text) {
    const newTask = {
        id: Date.now().toString(),
        text,
        completed: false,
    };

    tasks.push(newTask);
    renderTasks();
}
function renderTasks() {
    container.innerHTML = "";
    
    if (!tasks.length) {
      container.style.display = "none";
      updateStats();
      return;
    }
    container.style.display ="";

    tasks.forEach((task) => {
        const todoContainer = document.createElement("div");
        todoContainer.classList.add("todoContainer");

        const ul = document.createElement("ul");
        ul.classList.add("toDos");

        const li = document.createElement("li");

        const todoLabel = document.createElement("label");
        todoLabel.classList.add("todoLabel");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todoCheckbox");
        checkbox.checked = task.completed;

        const taskText = document.createElement("span");
        taskText.classList.add("todoText");
        taskText.textContent = task.text;
        taskText.classList.toggle("completed", task.completed);

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            taskText.classList.toggle("completed", task.completed);
            updateStats();
        });

        todoLabel.appendChild(checkbox);
        todoLabel.appendChild(taskText);
        li.appendChild(todoLabel);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttonContainer");

        const editButton = document.createElement("button");
        editButton.classList.add("iconButton");
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("iconButton");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        deleteButton.addEventListener("click", () => {
            removeTask(task.id);
        });

        editButton.addEventListener("click", () => {
            const currentText = task.text.trim();
            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.value = currentText;
            inputField.classList.add("editInput");

            todoLabel.replaceChild(inputField, taskText);
            inputField.focus();

            const finishEditing = () => {
                const updatedText = inputField.value.trim() || currentText;
                task.text = updatedText;
                taskText.textContent = updatedText;
                todoLabel.replaceChild(taskText, inputField);
            };

            inputField.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    finishEditing();
                }
            });

            inputField.addEventListener("blur", finishEditing);
        });

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        li.appendChild(buttonContainer);
        ul.appendChild(li);
        todoContainer.appendChild(ul);
        container.appendChild(todoContainer);
    });

    updateStats();
}

function removeTask(taskId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        renderTasks();
    }
}

function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;

    numbersDisplay.textContent = totalTasks ? `${completedTasks}/${totalTasks}` : "0/0";
    const completionPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    if (progressFill) {
        progressFill.style.width = `${completionPercent}%`;
    }
    if (progressRing) {
        const degrees = completionPercent * 3.6;
        progressRing.style.setProperty('--progress',360 - degrees);

    }
}
updateStats();
//=============CALENDAR LOGIC=============
const monthLabel = document.getElementById("monthLabel");
const nextMonthBttn = document.getElementById("nextMonth");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthBttn = document.getElementById("prevMonth");

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDay = new Date(today);

const eventsByDate = {};
let editingEventId = null;

function makeId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function formatKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
// Events store (keyed by local YYYY-MM-DD)


const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function buildDays(year,month) {
    const firstOfMonth = new Date(year,month, 1);
    const startDay = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year,month, 0).getDate();

    const days = [];
//leading days
    for(let i = startDay - 1; i >= 0; i--) {
        const dateNum = daysInPrevMonth - i;
        const date = new Date(year, month -1,dateNum);
        days.push({date,inCurrentMonth: false});
    }
//current month
    for (let d = 1; d<= daysInMonth; d++) {
        const date = new Date(year,month, d);
        days.push({date, inCurrentMonth: true});
    }

        const cellsNeeded = Math.ceil(days.length / 7)* 7;
        const trailing = cellsNeeded - days.length;
        for (let t = 1; t<=trailing; t++) {
            const date = new Date(year, month +1,t);
            days.push({date, inCurrentMonth: false});
        } 
        return days;
}
// rendering of calendar
function renderCalendar() {
    if(!monthLabel|| !calendarGrid) return;

    monthLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarGrid.innerHTML = "";


const days = buildDays(currentYear, currentMonth);

days.forEach((day) => {
    const isToday = day.date.toDateString()=== today.toDateString();
    const isSelected = day.date.toDateString()=== selectedDay.toDateString();
    
    const cell = document.createElement("div");
    cell.className = "dayCell";
    if (!day.inCurrentMonth) cell.classList.add("otherMonth");
    if (isSelected) cell.classList.add("selected")

        const number = document.createElement("div");
        number.className = "dayNumber";
        number.textContent = day.date.getDate();

        const dots = document.createElement("div");
        dots.className ="eventDots";

        const key = formatKey(day.date);
        const entries = eventsByDate[key];
        if (entries && entries.length) {
            entries.forEach((evt) => {
                const dot = document.createElement("button");
                dot.type ="button"
                dot.className = "eventDot";
                dot.textContent = evt.title || ".";
                dot.setAttribute("aria-label", `Edit ${evt.title || "event"}`);
                dot.addEventListener("click", (e) => {
                    e.stopPropagation();
                    selectedDay = day.date;
                    openModal(selectedDay, evt.id);
                });
                dots.appendChild(dot);
            });
        }

        cell.appendChild(number);
        cell.appendChild(dots);

        cell.addEventListener("click", ()=> {
            selectedDay = day.date;
            renderCalendar();
            openModal(selectedDay, null);
    });

    calendarGrid.appendChild(cell);
    });
}
prevMonthBttn.addEventListener("click",()=> {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBttn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

renderCalendar();

// Allow the "Make Plans" button to open the modal just like clicking a day
const createButton = document.getElementById("createBttn");
createButton?.addEventListener("click", (e) => {
    e.preventDefault();
    const mobileCreate = document.getElementById("mobileCreate");
    mobileCreate?.addEventListener("click", (e) => {
     e.preventDefault();
    openModal(selectedDay, null);
});

    // keep using the currently selected day; default is today
    openModal(selectedDay, null);
});
//===============MODAL FOR MAKING PLANS================
const eventModal = document.getElementById("eventModal");
const modalClose = document.querySelector(".modal-close");
const eventForm = document.getElementById("eventForm");
const eventTitleInput = document.getElementById("eventTitle");
const eventDescInput = document.getElementById("descripBox");

const startDateHolder = document.getElementById("startDateHolder");
const endDateHolder = document.getElementById("endDateHolder");

const miniCalendar = document.querySelector(".miniCalendar");
const miniGrid = document.getElementById("miniGrid");
const miniMonthLabel = document.getElementById("miniMonthLabel");
const miniPrev = document.getElementById("miniPrev");
const miniNext = document.getElementById("miniNext");
const datePickers = document.querySelectorAll(".datePicker");

let miniYear = currentYear;
let miniMonth = currentMonth;
let lastFocusedElement = null;

let startDate = new Date(selectedDay);
let endDate = new Date(selectedDay);
let activeDateRole = "start";

// ---------- helpers ----------
function clampToMidnight(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function eachDayBetween(start, end) {
  const days = [];
  let cur = clampToMidnight(start);
  const last = clampToMidnight(end);

  while (cur <= last) {
    days.push(new Date(cur));
    cur = addDays(cur, 1);
  }
  return days;
}

function formatMonthDay(date) {
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

function renderDateRangeLabels() {
  if (startDateHolder) startDateHolder.textContent = formatMonthDay(startDate);
  if (endDateHolder) endDateHolder.textContent = formatMonthDay(endDate);
}

function fromISOKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// keep ONE formatKey in your whole file


// ---------- modal ----------
function openModal(date, eventId = null) {
  if (!eventModal) return;

  editingEventId = eventId;
  lastFocusedElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  eventModal.classList.remove("modal-hidden");
  eventModal.setAttribute("aria-hidden", "false");

  // default range = clicked day
  startDate = new Date(date);
  endDate = new Date(date);

  const key = formatKey(date);
  const entries = eventsByDate[key] || [];
  const current = eventId ? entries.find((e) => e.id === eventId) : null;

  // load saved range if editing
  if (current?.startKey) startDate = fromISOKey(current.startKey);
  if (current?.endKey) endDate = fromISOKey(current.endKey);
  if (endDate < startDate) endDate = new Date(startDate);

  renderDateRangeLabels();

  if (eventTitleInput) eventTitleInput.value = current?.title ?? "";
  if (eventDescInput) eventDescInput.value = current?.description ?? "";

  miniCalendar?.classList.add("modal-hidden");
  eventTitleInput?.focus();
}

function closeModal() {
  if (!eventModal) return;
  eventModal.classList.add("modal-hidden");
  eventModal.setAttribute("aria-hidden", "true");
  miniCalendar?.classList.add("modal-hidden");

  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  lastFocusedElement?.focus?.();
}

modalClose?.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

eventModal?.addEventListener("click", (e) => {
  if (e.target instanceof HTMLElement && e.target.classList.contains("modal-backdrop")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && eventModal && !eventModal.classList.contains("modal-hidden")) {
    closeModal();
  }
});

// ---------- submit (spread across range) ----------
eventForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = eventTitleInput?.value.trim() ?? "";
  const description = eventDescInput?.value.trim() ?? "";

  const detailsHeading = document.querySelector(".futurePlans");
  if (detailsHeading) detailsHeading.textContent = title || "Create Plans";

  const dashTitle = document.getElementById("dashPlanTitle");
  const dashDates = document.getElementById("dashPlanDates");
  if (dashTitle) dashTitle.textContent = title || "Create Plans";
  if (dashDates) dashDates.textContent = `${formatMonthDay(startDate)} — ${formatMonthDay(endDate)}`;

  if (!title && !description) {
    closeModal();
    return;
  }

  // remove old copies if editing
  if (editingEventId) {
    Object.keys(eventsByDate).forEach((key) => {
      eventsByDate[key] = (eventsByDate[key] || []).filter(
        (evt) => evt.id !== editingEventId
      );
      if (!eventsByDate[key].length) delete eventsByDate[key];
    });
  }

  const id = editingEventId || makeId();

  eachDayBetween(startDate, endDate).forEach((d) => {
    const key = formatKey(d);
    if (!eventsByDate[key]) eventsByDate[key] = [];
    eventsByDate[key].push({
      id,
      title,
      description,
      startKey: formatKey(startDate),
      endKey: formatKey(endDate),
    });
  });

  editingEventId = null;
  closeModal();
  renderCalendar();
});

// ---------- delete (remove from all dates) ----------
const deleteBtn = document.querySelector(".popUpBttn");
deleteBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (!editingEventId) return;

  Object.keys(eventsByDate).forEach((key) => {
    eventsByDate[key] = (eventsByDate[key] || []).filter(
      (evt) => evt.id !== editingEventId
    );
    if (!eventsByDate[key].length) delete eventsByDate[key];
  });

  editingEventId = null;
  closeModal();
  renderCalendar();
});

// ---------- mini calendar rendering ----------
function renderMiniCalendar() {
  if (!miniGrid || !miniMonthLabel) return;

  miniMonthLabel.textContent = `${monthNames[miniMonth]} ${miniYear}`;
  miniGrid.innerHTML = "";

  const days = buildDays(miniYear, miniMonth);

  days.forEach((day) => {
    const cell = document.createElement("div");
    cell.className = "dayCell";
    if (!day.inCurrentMonth) cell.classList.add("otherMonth");

    const number = document.createElement("div");
    number.className = "dayNumber";
    number.textContent = day.date.getDate();
    cell.appendChild(number);

    // IMPORTANT: pick start/end here, not outside
    cell.addEventListener("click", () => {
      const picked = day.date;

      if (activeDateRole === "start") {
        startDate = new Date(picked);
        if (endDate < startDate) endDate = new Date(startDate);
      } else {
        endDate = new Date(picked);
        if (endDate < startDate) startDate = new Date(endDate);
      }

      renderDateRangeLabels();
      miniCalendar?.classList.add("modal-hidden");
    });
    
    miniGrid.appendChild(cell);
  });
}

// open mini calendar and set which role is active
datePickers.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    activeDateRole = btn.dataset.dateRole || "start";
    miniCalendar?.classList.toggle("modal-hidden");

    const base = activeDateRole === "end" ? endDate : startDate;
    miniMonth = base.getMonth();
    miniYear = base.getFullYear();

    renderMiniCalendar();
  });
});

miniPrev?.addEventListener("click", (e) => {
  e.preventDefault();
  miniMonth--;
  if (miniMonth < 0) {
    miniMonth = 11;
    miniYear--;
  }
  renderMiniCalendar();
});

miniNext?.addEventListener("click", (e) => {
  e.preventDefault();
  miniMonth++;
  if (miniMonth > 11) {
    miniMonth = 0;
    miniYear++;
  }
  renderMiniCalendar();
});
