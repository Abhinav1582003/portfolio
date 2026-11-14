const dashboard = document.querySelector("[data-dashboard]");
const dashboardContent = document.querySelector("#dashboard-content");
const dashboardNavigation = document.querySelector(".dashboard-nav");
const breadcrumb = document.querySelector("[data-breadcrumb]");
const storageKey = `northstar-${dashboard.dataset.dashboard}-demo-v1`;
const isTransport = dashboard.dataset.dashboard === "transport";

const viewDefinitions = isTransport
  ? {
      overview: { label: "Overview", description: "Your school transport operations at a glance." },
      vehicles: {
        label: "Vehicles",
        description: "Track vehicle details, capacity, assignments, and service status.",
        collection: "vehicles",
        fields: [
          { key: "vehicle", label: "Vehicle name / number", required: true },
          { key: "plate", label: "Registration number", required: true },
          { key: "type", label: "Vehicle type", required: true, options: ["Bus", "Van", "Mini bus"] },
          { key: "capacity", label: "Seat capacity", type: "number", required: true },
          { key: "driver", label: "Assigned driver", required: true },
          { key: "status", label: "Status", options: ["Active", "Maintenance", "Inactive"] },
        ],
      },
      routes: {
        label: "Routes",
        description: "Manage route names, stops, assigned vehicles, and schedules.",
        collection: "routes",
        fields: [
          { key: "name", label: "Route name", required: true },
          { key: "stops", label: "Stops (comma separated)", required: true },
          { key: "vehicle", label: "Vehicle", required: true },
          { key: "schedule", label: "Schedule", required: true },
          { key: "status", label: "Status", options: ["Active", "Draft", "Paused"] },
        ],
      },
      staff: {
        label: "Drivers & staff",
        description: "Keep driver and transport team assignments up to date.",
        collection: "staff",
        fields: [
          { key: "name", label: "Full name", required: true },
          { key: "role", label: "Role", options: ["Driver", "Attendant", "Transport manager"] },
          { key: "phone", label: "Phone number", required: true },
          { key: "assignedRoute", label: "Assigned route" },
          { key: "status", label: "Status", options: ["Active", "On leave", "Inactive"] },
        ],
      },
      allocations: {
        label: "Student allocation",
        description: "Assign students to a route and keep pickup and drop-off stops clear.",
        collection: "allocations",
        fields: [
          { key: "student", label: "Student name", required: true },
          { key: "grade", label: "Grade / class", required: true },
          { key: "route", label: "Assigned route", required: true },
          { key: "pickup", label: "Pickup stop", required: true },
          { key: "dropoff", label: "Drop-off stop", required: true },
          { key: "status", label: "Status", options: ["Active", "Pending", "Inactive"] },
        ],
      },
    }
  : {
      overview: { label: "Overview", description: "Your student and academic operations at a glance." },
      students: {
        label: "Students",
        description: "Manage student profiles, contact details, class assignments, and enrolment status.",
        collection: "students",
        fields: [
          { key: "name", label: "Full name", required: true },
          { key: "email", label: "Email address", type: "email", required: true },
          { key: "grade", label: "Grade", required: true },
          { key: "section", label: "Section", required: true },
          { key: "status", label: "Status", options: ["Active", "Review", "Inactive"] },
        ],
      },
      academics: {
        label: "Academics",
        description: "Maintain classes, subjects, teacher assignments, rooms, and schedules.",
        collection: "academics",
        fields: [
          { key: "subject", label: "Subject / class", required: true },
          { key: "grade", label: "Grade / section", required: true },
          { key: "teacher", label: "Teacher", required: true },
          { key: "room", label: "Room", required: true },
          { key: "schedule", label: "Schedule", required: true },
          { key: "status", label: "Status", options: ["Scheduled", "In progress", "Completed"] },
        ],
      },
      attendance: {
        label: "Attendance",
        description: "Review and update daily student attendance records.",
        collection: "attendance",
        fields: [
          { key: "student", label: "Student name", required: true },
          { key: "grade", label: "Grade / section", required: true },
          { key: "date", label: "Date", type: "date", required: true },
          { key: "checkIn", label: "Check-in time", type: "time" },
          { key: "status", label: "Attendance status", options: ["Present", "Absent", "Late", "Leave"] },
        ],
      },
      notices: {
        label: "Notices",
        description: "Create and maintain announcements for students, families, and staff.",
        collection: "notices",
        fields: [
          { key: "title", label: "Notice title", required: true },
          { key: "audience", label: "Audience", options: ["All school", "Students", "Families", "Staff"] },
          { key: "publishDate", label: "Publish date", type: "date", required: true },
          { key: "details", label: "Notice details", type: "textarea", required: true },
          { key: "status", label: "Status", options: ["Published", "Draft", "Archived"] },
        ],
      },
    };

const defaultData = isTransport
  ? {
      vehicles: [
        { id: "VEH-101", vehicle: "School Bus 08", plate: "DL 01 AB 4821", type: "Bus", capacity: "42", driver: "Rajesh Kumar", status: "Active" },
        { id: "VEH-102", vehicle: "School Bus 12", plate: "DL 01 CD 1936", type: "Bus", capacity: "36", driver: "Sunil Patel", status: "Active" },
        { id: "VEH-103", vehicle: "Campus Van 03", plate: "DL 01 EF 7254", type: "Van", capacity: "16", driver: "Anita Menon", status: "Maintenance" },
      ],
      routes: [
        { id: "RTE-04", name: "North District", stops: "Green Park, Central Market, North Campus", vehicle: "School Bus 08", schedule: "07:30 – 08:45 AM", status: "Active" },
        { id: "RTE-08", name: "Lakeview Circle", stops: "Lakeview, River Road, North Campus", vehicle: "School Bus 12", schedule: "07:40 – 08:52 AM", status: "Active" },
        { id: "RTE-11", name: "Central Avenue", stops: "City Library, Central Avenue, North Campus", vehicle: "Campus Van 03", schedule: "08:00 – 09:05 AM", status: "Paused" },
      ],
      staff: [
        { id: "STF-201", name: "Rajesh Kumar", role: "Driver", phone: "+91 98765 43210", assignedRoute: "North District", status: "Active" },
        { id: "STF-202", name: "Sunil Patel", role: "Driver", phone: "+91 98765 43211", assignedRoute: "Lakeview Circle", status: "Active" },
        { id: "STF-203", name: "Anita Menon", role: "Attendant", phone: "+91 98765 43212", assignedRoute: "Central Avenue", status: "On leave" },
      ],
      allocations: [
        { id: "ALC-301", student: "Aarav Mehta", grade: "Grade 8 · A", route: "North District", pickup: "Green Park", dropoff: "North Campus", status: "Active" },
        { id: "ALC-302", student: "Sara Iyer", grade: "Grade 6 · B", route: "Lakeview Circle", pickup: "Lakeview", dropoff: "North Campus", status: "Active" },
        { id: "ALC-303", student: "Rohan Kumar", grade: "Grade 9 · A", route: "Central Avenue", pickup: "City Library", dropoff: "North Campus", status: "Pending" },
      ],
    }
  : {
      students: [
        { id: "STU-084", name: "Aarav Mehta", email: "aarav.m@example.com", grade: "Grade 8", section: "A", status: "Active" },
        { id: "STU-083", name: "Sara Iyer", email: "sara.i@example.com", grade: "Grade 6", section: "B", status: "Active" },
        { id: "STU-082", name: "Rohan Kumar", email: "rohan.k@example.com", grade: "Grade 9", section: "A", status: "Review" },
      ],
      academics: [
        { id: "CLS-801", subject: "Mathematics", grade: "Grade 8 · A", teacher: "Neha Sharma", room: "Room 204", schedule: "09:00 – 09:45 AM", status: "Scheduled" },
        { id: "CLS-602", subject: "Science", grade: "Grade 6 · B", teacher: "Arjun Rao", room: "Lab 02", schedule: "10:00 – 10:45 AM", status: "In progress" },
        { id: "CLS-901", subject: "English", grade: "Grade 9 · A", teacher: "Maya Das", room: "Room 108", schedule: "11:00 – 11:45 AM", status: "Scheduled" },
      ],
      attendance: [
        { id: "ATT-901", student: "Aarav Mehta", grade: "Grade 8 · A", date: "2025-08-19", checkIn: "08:12", status: "Present" },
        { id: "ATT-902", student: "Sara Iyer", grade: "Grade 6 · B", date: "2025-08-19", checkIn: "08:18", status: "Late" },
        { id: "ATT-903", student: "Rohan Kumar", grade: "Grade 9 · A", date: "2025-08-19", checkIn: "", status: "Absent" },
      ],
      notices: [
        { id: "NOT-110", title: "Science exhibition registration", audience: "Students", publishDate: "2025-08-20", details: "Register your project with the science department by Friday.", status: "Published" },
        { id: "NOT-109", title: "Parent-teacher meeting", audience: "Families", publishDate: "2025-08-22", details: "Meeting slots for Grade 6 families are now available.", status: "Published" },
        { id: "NOT-108", title: "Library schedule update", audience: "All school", publishDate: "2025-08-25", details: "The library will open at 8:00 AM from next week.", status: "Draft" },
      ],
    };

let records;
let currentView = "overview";
let query = "";
let statusFilter = "all";
let notificationTimer;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function readData() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return JSON.parse(JSON.stringify(defaultData));
    const parsed = JSON.parse(saved);
    for (const collection of Object.keys(defaultData)) {
      if (!Array.isArray(parsed[collection])) throw new Error(`Saved ${collection} data is invalid.`);
    }
    return parsed;
  } catch (error) {
    if (error instanceof DOMException && error.name === "SecurityError") {
      notify("Browser storage is blocked. Changes will only last for this page session.", "error");
      return JSON.parse(JSON.stringify(defaultData));
    }
    console.error("Could not read dashboard demo data:", error);
    notify("Saved demo data could not be read. Sample data has been restored for this session.", "error");
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function persistData() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error("Could not save dashboard demo data:", error);
    return false;
  }
}

function notify(message, type = "success") {
  let toast = document.querySelector(".dashboard-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "dashboard-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }
  toast.className = `dashboard-toast ${type}`;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function getResourceKeys() {
  return Object.keys(defaultData);
}

function allRecords() {
  return getResourceKeys().flatMap((key) => records[key]);
}

function statusClass(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function updateNavigation() {
  const definition = viewDefinitions[currentView];
  breadcrumb.textContent = definition.label;
  dashboardNavigation.querySelectorAll("[data-view]").forEach((link) => {
    const active = link.dataset.view === currentView;
    link.classList.toggle("active", active);
    if (link.dataset.view === (isTransport ? "vehicles" : "students")) {
      link.querySelector(".nav-count").textContent = records[definition.collection]?.length ?? records[isTransport ? "vehicles" : "students"].length;
    }
  });
}

function renderOverview() {
  const primaryCollection = isTransport ? "vehicles" : "students";
  const secondaryCollection = isTransport ? "routes" : "academics";
  const thirdCollection = isTransport ? "allocations" : "attendance";
  const metrics = [
    { label: isTransport ? "Vehicles" : "Students", value: records[primaryCollection].length, icon: isTransport ? "▣" : "♙", view: isTransport ? "vehicles" : "students" },
    { label: isTransport ? "Routes" : "Classes today", value: records[secondaryCollection].length, icon: isTransport ? "⌖" : "▤", view: isTransport ? "routes" : "academics" },
    { label: isTransport ? "Student allocations" : "Attendance records", value: records[thirdCollection].length, icon: isTransport ? "◇" : "◷", view: isTransport ? "allocations" : "attendance" },
    { label: isTransport ? "Transport staff" : "Notices", value: records[isTransport ? "staff" : "notices"].length, icon: isTransport ? "♙" : "✳", view: isTransport ? "staff" : "notices" },
  ];
  const recent = records[primaryCollection].slice(0, 4);
  const recentLabel = isTransport ? "Recently updated vehicles" : "Recently added students";
  const recentFields = isTransport
    ? [["vehicle", "Vehicle"], ["plate", "Registration"], ["driver", "Assigned driver"], ["status", "Status"]]
    : [["name", "Student"], ["email", "Email address"], ["grade", "Grade"], ["status", "Status"]];

  dashboardContent.innerHTML = `
    <div class="workspace-heading">
      <div><p class="workspace-eyebrow">NORTHSTAR ACADEMY · DEMO WORKSPACE</p><h1>${isTransport ? "Transport & fleet" : "Student & academics"}</h1><p>${escapeHTML(viewDefinitions.overview.description)}</p></div>
      <button class="primary-action" type="button" data-action="add" data-collection="${primaryCollection}"><span aria-hidden="true">＋</span> Add ${isTransport ? "vehicle" : "student"}</button>
    </div>
    <section class="welcome-panel app-welcome"><div><span class="welcome-kicker">${isTransport ? "EVERY JOURNEY, WELL COORDINATED" : "A GREAT DAY TO MAKE PROGRESS"}</span><h2>${isTransport ? "Your fleet, in sync." : "Your school, in sync."}</h2><p>${isTransport ? "Manage vehicles, routes, drivers, allocations, and pickup schedules from one workspace." : "Manage student records, academic schedules, attendance, and school notices from one workspace."}</p></div><div class="welcome-art" aria-hidden="true"><div class="welcome-orbit"></div><div class="welcome-book">${isTransport ? "▰" : "✦"}<span>✳</span></div></div><div class="school-year"><span>ACADEMIC SESSION</span><b>2025 — 2026</b><small>Demo workspace · Local data</small></div></section>
    <section class="workspace-metrics" aria-label="Workspace summary">${metrics.map((metric, index) => `<button class="workspace-metric" type="button" data-view="${metric.view}"><span class="metric-icon metric-icon-${index}">${metric.icon}</span><span class="metric-label">${metric.label}</span><strong>${metric.value}</strong><small>Open ${metric.label.toLowerCase()} <b aria-hidden="true">↗</b></small></button>`).join("")}</section>
    <section class="workspace-panel">
      <div class="workspace-panel-heading"><div><h2>${recentLabel}</h2><p>Review and manage records in your workspace.</p></div><button class="secondary-action" type="button" data-view="${isTransport ? "vehicles" : "students"}">View all <span aria-hidden="true">↗</span></button></div>
      ${renderTable(primaryCollection, recent, recentFields, false)}
    </section>
    <p class="workspace-note">Demo workspace · Changes are stored in this browser only.</p>`;
}

function renderTable(collection, list, fields = null, withActions = true) {
  const definition = Object.values(viewDefinitions).find((item) => item.collection === collection);
  const visibleFields = fields || definition.fields.map((field) => [field.key, field.label]);
  return `<div class="data-table-wrap"><table class="data-table"><thead><tr>${visibleFields.map(([, label]) => `<th>${escapeHTML(label)}</th>`).join("")}${withActions ? "<th class=\"actions-heading\">ACTIONS</th>" : ""}</tr></thead><tbody>${list.length ? list.map((record) => `<tr>${visibleFields.map(([key]) => {
    const value = record[key] || "—";
    return key === "status"
      ? `<td><span class="record-status status-${statusClass(value)}">${escapeHTML(value)}</span></td>`
      : `<td>${escapeHTML(value)}</td>`;
  }).join("")}${withActions ? `<td><div class="record-actions"><button type="button" class="row-action" data-action="edit" data-collection="${collection}" data-id="${escapeHTML(record.id)}">Edit</button><button type="button" class="row-action delete-action" data-action="delete" data-collection="${collection}" data-id="${escapeHTML(record.id)}">Delete</button></div></td>` : ""}</tr>`).join("") : `<tr><td class="empty-state" colspan="${visibleFields.length + (withActions ? 1 : 0)}">No records match. Add a new record or change your search.</td></tr>`}</tbody></table></div>`;
}

function filteredRecords(collection) {
  return records[collection].filter((record) => {
    const matchesQuery = Object.values(record).some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && (statusFilter === "all" || record.status === statusFilter);
  });
}

function renderCollection(view) {
  const definition = viewDefinitions[view];
  const collection = definition.collection;
  const statusOptions = [...new Set(records[collection].map((record) => record.status).filter(Boolean))];
  const list = filteredRecords(collection);
  dashboardContent.innerHTML = `
    <div class="workspace-heading">
      <div><p class="workspace-eyebrow">${isTransport ? "TRANSPORT MANAGEMENT" : "SCHOOL MANAGEMENT"} · RECORDS</p><h1>${escapeHTML(definition.label)}</h1><p>${escapeHTML(definition.description)}</p></div>
      <button class="primary-action" type="button" data-action="add" data-collection="${collection}"><span aria-hidden="true">＋</span> Add ${escapeHTML(singularLabel(definition.label))}</button>
    </div>
    <section class="workspace-panel records-panel">
      <div class="workspace-panel-heading"><div><h2>${escapeHTML(definition.label)} directory</h2><p><strong>${records[collection].length}</strong> total records · ${list.length} shown</p></div></div>
      <div class="table-toolbar"><label class="search-control"><span aria-hidden="true">⌕</span><input type="search" data-search placeholder="Search ${escapeHTML(definition.label.toLowerCase())}…" value="${escapeHTML(query)}" aria-label="Search ${escapeHTML(definition.label)}"></label><label class="filter-control"><span>Filter status</span><select data-filter aria-label="Filter by status"><option value="all">All statuses</option>${statusOptions.map((option) => `<option value="${escapeHTML(option)}" ${statusFilter === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select></label></div>
      ${renderTable(collection, list)}
    </section>
    <p class="workspace-note">Demo workspace · Add, edit, or delete records. Your changes are saved in this browser only.</p>`;
}

function renderView() {
  updateNavigation();
  const definition = viewDefinitions[currentView];
  if (!definition) {
    currentView = "overview";
    renderView();
    return;
  }
  if (currentView === "overview") renderOverview();
  else renderCollection(currentView);
}

function fieldControl(field, record) {
  const value = record?.[field.key] || "";
  const commonAttributes = `name="${escapeHTML(field.key)}" ${field.required ? "required" : ""}`;
  if (field.options) {
    return `<select ${commonAttributes}><option value="" ${value ? "" : "selected"} disabled>Select ${escapeHTML(field.label.toLowerCase())}</option>${field.options.map((option) => `<option value="${escapeHTML(option)}" ${value === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>`;
  }
  if (field.type === "textarea") return `<textarea ${commonAttributes} rows="4">${escapeHTML(value)}</textarea>`;
  return `<input type="${field.type || "text"}" ${commonAttributes} value="${escapeHTML(value)}" />`;
}

function singularLabel(label) {
  const labels = {
    Students: "student",
    Academics: "class",
    Attendance: "attendance record",
    Notices: "notice",
    Vehicles: "vehicle",
    Routes: "route",
    "Drivers & staff": "staff member",
    "Student allocation": "student allocation",
  };
  return labels[label] || label.toLowerCase();
}

function openRecordDialog(collection, id = "") {
  const definition = Object.values(viewDefinitions).find((item) => item.collection === collection);
  if (!definition) return;
  const record = id ? records[collection].find((item) => item.id === id) : null;
  if (id && !record) {
    notify("That record is no longer available.", "error");
    return;
  }
  const dialog = document.querySelector("#record-dialog");
  dialog.innerHTML = `
    <form class="record-form" method="dialog" data-collection="${collection}" data-id="${escapeHTML(id)}">
      <div class="dialog-heading"><div><p class="workspace-eyebrow">${isTransport ? "TRANSPORT WORKSPACE" : "SCHOOL WORKSPACE"}</p><h2>${record ? "Update" : "Add"} ${escapeHTML(singularLabel(definition.label))}</h2><p>${record ? "Update the fields below and save your changes." : "Enter the details below to add a new record."}</p></div><button type="button" class="dialog-close" data-action="close-dialog" aria-label="Close dialog">×</button></div>
      <div class="record-fields">${definition.fields.map((field) => `<label class="form-field"><span>${escapeHTML(field.label)}${field.required ? " <i>*</i>" : ""}</span>${fieldControl(field, record)}</label>`).join("")}</div>
      <div class="dialog-actions"><button class="secondary-action" type="button" data-action="close-dialog">Cancel</button><button class="primary-action" type="submit">${record ? "Save changes" : "Add record"}</button></div>
    </form>`;
  dialog.showModal();
  dialog.querySelector("input, select, textarea")?.focus();
}

function saveRecord(form) {
  const formData = new FormData(form);
  const collection = form.dataset.collection;
  const id = form.dataset.id;
  const values = Object.fromEntries(formData.entries());
  if (id) {
    const index = records[collection].findIndex((record) => record.id === id);
    if (index < 0) {
      notify("That record no longer exists.", "error");
      return;
    }
    records[collection][index] = { ...records[collection][index], ...values };
    const saved = persistData();
    notify(saved ? "Record updated." : "Record updated for this session, but could not be saved in this browser.", saved ? "success" : "error");
  } else {
    const prefix = collection.slice(0, 3).toUpperCase();
    records[collection].unshift({ id: `${prefix}-${Date.now().toString(36).toUpperCase()}`, ...values });
    const saved = persistData();
    notify(saved ? "Record added." : "Record added for this session, but could not be saved in this browser.", saved ? "success" : "error");
  }
  document.querySelector("#record-dialog").close();
  query = "";
  statusFilter = "all";
  renderView();
}

function deleteRecord(collection, id) {
  const record = records[collection].find((item) => item.id === id);
  if (!record) {
    notify("That record is no longer available.", "error");
    return;
  }
  const recordName = record.name || record.title || record.vehicle || record.subject || record.student || "this record";
  if (!window.confirm(`Delete "${recordName}"? This cannot be undone.`)) return;
  records[collection] = records[collection].filter((item) => item.id !== id);
  const saved = persistData();
  renderView();
  notify(saved ? "Record deleted." : "Record deleted for this session, but could not be saved in this browser.", saved ? "success" : "error");
}

function setView(view) {
  if (!viewDefinitions[view]) return;
  currentView = view;
  query = "";
  statusFilter = "all";
  history.replaceState(null, "", `#${view}`);
  renderView();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

records = readData();
const initialView = location.hash.slice(1);
currentView = viewDefinitions[initialView] ? initialView : "overview";
renderView();

dashboardNavigation.addEventListener("click", (event) => {
  const link = event.target.closest("[data-view]");
  if (!link) return;
  event.preventDefault();
  setView(link.dataset.view);
});

dashboardContent.addEventListener("click", (event) => {
  const control = event.target.closest("[data-action], [data-view]");
  if (!control) return;
  if (control.dataset.view) {
    setView(control.dataset.view);
  } else if (control.dataset.action === "add") {
    openRecordDialog(control.dataset.collection);
  } else if (control.dataset.action === "edit") {
    openRecordDialog(control.dataset.collection, control.dataset.id);
  } else if (control.dataset.action === "delete") {
    deleteRecord(control.dataset.collection, control.dataset.id);
  }
});

dashboardContent.addEventListener("input", (event) => {
  if (!event.target.matches("[data-search]")) return;
  query = event.target.value;
  const cursor = event.target.selectionStart;
  renderCollection(currentView);
  const search = dashboardContent.querySelector("[data-search]");
  search.focus();
  search.setSelectionRange(cursor, cursor);
});

dashboardContent.addEventListener("change", (event) => {
  if (!event.target.matches("[data-filter]")) return;
  statusFilter = event.target.value;
  renderCollection(currentView);
});

const recordDialog = document.querySelector("#record-dialog");
recordDialog.addEventListener("click", (event) => {
  if (event.target === recordDialog) recordDialog.close();
  if (event.target.closest('[data-action="close-dialog"]')) recordDialog.close();
});
recordDialog.addEventListener("submit", (event) => {
  const form = event.target.closest(".record-form");
  if (!form) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  saveRecord(form);
});

document.querySelector("[data-notifications]").addEventListener("click", () => {
  notify("You’re all caught up. This is a demo workspace.");
});

window.addEventListener("hashchange", () => {
  const view = location.hash.slice(1);
  if (viewDefinitions[view] && view !== currentView) {
    currentView = view;
    query = "";
    statusFilter = "all";
    renderView();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key !== storageKey || !event.newValue) return;
  try {
    const parsed = JSON.parse(event.newValue);
    for (const collection of getResourceKeys()) {
      if (!Array.isArray(parsed[collection])) throw new Error(`Shared ${collection} data is invalid.`);
    }
    records = parsed;
    renderView();
    notify("Demo data was updated in another tab.");
  } catch (error) {
    console.error("Could not sync dashboard demo data:", error);
    notify("Changes from another tab could not be loaded.", "error");
  }
});
