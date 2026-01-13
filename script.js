document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".openSidebar");
  const appShell = document.querySelector(".appShell");

  if (toggleBtn && appShell) {
    toggleBtn.addEventListener("click", () => {
      appShell.classList.toggle("is-collapsed");
    });
  }

  // Clicking any nav item/button should open the sidebar
  const navTriggers = document.querySelectorAll(".nav a, .nav-Group, .nav-sublink, #createBttn, .navSetting");
  const openSidebar = () => appShell?.classList.remove("is-collapsed");
  navTriggers.forEach((el) => {
    el.addEventListener("click", openSidebar);
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
document.addEventListener("DOMContentLoaded", () => {
  // ...your existing code...
  
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
});
// =================DASHBOARD=================

const form = document.querySelector("form");
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
    // keep using the currently selected day; default is today
    openModal(selectedDay, null);
});
//===============MODAL FOR MAKING PLANS================
const eventModal = document.getElementById("eventModal");
const modalClose = document.querySelector(".modal-close");
const eventForm = document.getElementById("eventForm");
const eventTitleInput = document.getElementById("eventTitle");
const eventDescInput = document.getElementById("descripBox");
const dateHolder = document.getElementById("dateHolder");

const miniCalendar = document.querySelector(".miniCalendar");
const miniGrid = document.getElementById("miniGrid");
const miniMonthLabel = document.getElementById("miniMonthLabel");
const miniPrev = document.getElementById("miniPrev");
const miniNext = document.getElementById("miniNext");
const datePickers = document.querySelectorAll(".datePicker");

let miniYear = currentYear;
let miniMonth = currentMonth;
let lastFocusedElement = null;

function formatKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatPretty(date) {
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function openModal(date, eventId = null) {
    if (!eventModal) return;
    editingEventId = eventId;
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    eventModal.classList.remove("modal-hidden");
    eventModal.setAttribute("aria-hidden", "false");

    if (dateHolder) dateHolder.textContent = formatPretty(date);

    const key = formatKey(date);
    const entries = eventsByDate[key] || [];
    const current = eventId ? entries.find((e) => e.id === eventId) : null;

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

eventForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = eventTitleInput?.value.trim() ?? "";
    const description = eventDescInput?.value.trim() ?? "";
    const key = formatKey(selectedDay);

    const detailsHeading = document.querySelector(".futurePlans");
    if (detailsHeading) {
      detailsHeading.textContent = title || "Create Plans";
    }
    if (!title && !description) {
        closeModal();
        return;
    }

    if (!eventsByDate[key]) eventsByDate[key] = [];

    if (editingEventId) {
        const idx = eventsByDate[key].findIndex((evt) => evt.id === editingEventId);
        if (idx !== -1) {
            eventsByDate[key][idx] = { ...eventsByDate[key][idx], title, description };
        }
    } else {
        eventsByDate[key].push({ id: makeId(), title, description });
    }

    editingEventId = null;
    closeModal();
    renderCalendar();
});
//delteButton
const deleteBtn = document.querySelector(".popUpBttn");
deleteBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if(!editingEventId) return;
    const key = formatKey(selectedDay)
    const list = eventsByDate[key] || [];
    const next = list.filter(evt => evt.id !== editingEventId);
    if (next.length) {
        eventsByDate[key] = next;
    } else {
        delete eventsByDate[key]
    }
    editingEventId = null;
    closeModal();
    renderCalendar();
})


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

        cell.addEventListener("click", () => {
            selectedDay = day.date;
            miniCalendar?.classList.add("modal-hidden");
            renderCalendar();
            openModal(selectedDay);
        });

        miniGrid.appendChild(cell);
    });
}

datePickers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        miniCalendar?.classList.toggle("modal-hidden");
        miniMonth = selectedDay.getMonth();
        miniYear = selectedDay.getFullYear();
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
