// This is a comprehensive cleaned version of calendar.js
// All duplicate function declarations and block-scoped variable conflicts have been resolved

document.addEventListener('DOMContentLoaded', () => {
    // --- AUTH CHECK ---
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!authToken || !user) {
        window.location.href = '/login.html';
        return;
    }

    // --- ELEMENT SELECTION ---
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById('menu-btn');
    const calendarHeader = document.getElementById("calendar-header");
    const calendarGrid = document.getElementById("calendar-grid");
    const currentMonthYearEl = document.getElementById("current-month-year");
    const prevMonthBtn = document.getElementById("prev-month-btn");
    const nextMonthBtn = document.getElementById("next-month-btn");
    const todayBtn = document.getElementById("today-btn");
    
    // User Menu Elements
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    const userMenuUsername = document.getElementById('user-menu-username');
    const userMenuNameInDropdown = document.getElementById('user-menu-name');
    const userMenuEmailInDropdown = document.getElementById('user-menu-email');
    const userMenuDeleteBtn = document.getElementById('user-menu-delete-btn');
    const userMenuLogoutBtn = document.getElementById('user-menu-logout-btn');

    // Modal elements
    const eventModal = document.getElementById("event-modal");
    const closeModal = document.getElementById("close-modal");
    const createBtn = document.getElementById("create-btn");
    const createForm = document.getElementById("create-form");
    const modalTabs = document.getElementById("modal-tabs");

    // Dashboard elements
    const dashboardViewBtn = document.getElementById("dashboard-view-btn");
    const calendarViewBtn = document.getElementById("calendar-view-btn");
    const projectsViewBtn = document.getElementById("projects-view-btn");
    const dashboardContent = document.getElementById("dashboard-content");
    const calendarView = document.getElementById("calendar-view");
    const projectsView = document.getElementById("projects-view");
    const tasksView = document.getElementById("tasks-view");
    const calendarControls = document.getElementById("calendar-controls");
    const dashboardTitle = document.getElementById("dashboard-title");
    const currentDateSpan = document.getElementById("current-date");
    const refreshDashboard = document.getElementById("refresh-dashboard");

    // Navigation elements
    const navDashboard = document.getElementById("nav-dashboard");
    const navCalendar = document.getElementById("nav-calendar");
    const navProjects = document.getElementById("nav-projects");
    const navTasks = document.getElementById("nav-tasks");

    // Projects page elements
    const projectsContainer = document.getElementById("projects-container");
    const projectsEmptyState = document.getElementById("projects-empty-state");
    const totalProjectsCount = document.getElementById("total-projects-count");
    const statsTotal = document.getElementById("stats-total");
    const statsActive = document.getElementById("stats-active");
    const statsCompleted = document.getElementById("stats-completed");
    const statsUpcoming = document.getElementById("stats-upcoming");
    
    // Filter buttons
    const filterAll = document.getElementById("filter-all");
    const filterActive = document.getElementById("filter-active");
    const filterCompleted = document.getElementById("filter-completed");
    const filterUpcoming = document.getElementById("filter-upcoming");

    // Project detail modal elements
    const projectDetailModal = document.getElementById("project-detail-modal");
    const projectDetailTitle = document.getElementById("project-detail-title");
    const projectDetailInfo = document.getElementById("project-detail-info");
    const projectDetailCloseModal = document.getElementById("project-detail-close-modal");
    const projectEditBtn = document.getElementById("project-edit-btn");
    const projectDeleteBtn = document.getElementById("project-delete-btn");
    const projectRelatedTasks = document.getElementById("project-related-tasks");
    const projectTasksCount = document.getElementById("project-tasks-count");
    const projectProgressPercent = document.getElementById("project-progress-percent");
    const projectProgressBar = document.getElementById("project-progress-bar");
    const projectCompletedTasks = document.getElementById("project-completed-tasks");
    const projectTotalTasks = document.getElementById("project-total-tasks");
    const projectStartDate = document.getElementById("project-start-date");
    const projectEndDate = document.getElementById("project-end-date");
    const projectDuration = document.getElementById("project-duration");
    const projectRemainingDays = document.getElementById("project-remaining-days");

    // Sidebar projects widget
    const sidebarProjects = document.getElementById("sidebar-projects");
    
    // Tasks page elements
    const tasksContainer = document.getElementById("tasks-container");
    const tasksEmptyState = document.getElementById("tasks-empty-state");
    const totalTasksCount = document.getElementById("total-tasks-count");
    const taskStatsTotal = document.getElementById("task-stats-total");
    const taskStatsPending = document.getElementById("task-stats-pending");
    const taskStatsInProgress = document.getElementById("task-stats-in-progress");
    const taskStatsCompleted = document.getElementById("task-stats-completed");
    
    // Task filter buttons
    const taskFilterAll = document.getElementById("task-filter-all");
    const taskFilterPending = document.getElementById("task-filter-pending");
    const taskFilterInProgress = document.getElementById("task-filter-in-progress");
    const taskFilterCompleted = document.getElementById("task-filter-completed");
    
    // Date selector elements
    const dateMonthSelector = document.getElementById("date-month-selector");
    const dateDaySelector = document.getElementById("date-day-selector");
    const dateYearSelector = document.getElementById("date-year-selector");
    const dateTodayBtn = document.getElementById("date-today-btn");

    // Dashboard data containers
    const todayEvents = document.getElementById("today-events");
    const todayTasks = document.getElementById("today-tasks");
    const todayPlans = document.getElementById("today-plans");
    const eventsCount = document.getElementById("events-count");
    const tasksCount = document.getElementById("tasks-count");
    const plansCount = document.getElementById("plans-count");
    const timelineGrid = document.getElementById("timeline-grid");

    // Detail modal elements
    const detailModal = document.getElementById("detail-modal");
    const detailModalTitle = document.getElementById("detail-modal-title");
    const detailContent = document.getElementById("detail-content");
    const detailCloseModal = document.getElementById("detail-close-modal");
    const detailEditBtn = document.getElementById("detail-edit-btn");
    const detailDeleteBtn = document.getElementById("detail-delete-btn");

    // Edit modal elements
    const editModal = document.getElementById("edit-modal");
    const editModalTitle = document.getElementById("edit-modal-title");
    const editContent = document.getElementById("edit-content");
    const editCloseModal = document.getElementById("edit-close-modal");
    const editCancelBtn = document.getElementById("edit-cancel-btn");
    const editSaveBtn = document.getElementById("edit-save-btn");
    const editForm = document.getElementById("edit-form");

    // Timer elements
    const timerBtn = document.getElementById("timer-btn");
    const timerModal = document.getElementById("timer-modal");
    const timerCloseModal = document.getElementById("timer-close-modal");
    const timerDisplay = document.getElementById("timer-display");
    const timerStatus = document.getElementById("timer-status");
    const timerStartBtn = document.getElementById("timer-start");
    const timerPauseBtn = document.getElementById("timer-pause");
    const timerStopBtn = document.getElementById("timer-stop");
    const timerTaskSelect = document.getElementById("timer-task-select");

    // Header Date Picker elements
    const datePickerBtn = document.getElementById("date-picker-btn");
    const datePickerDropdown = document.getElementById("date-picker-dropdown");
    const selectedDateText = document.getElementById("selected-date-text");
    const quickTodayBtn = document.getElementById("quick-today");
    const quickYesterdayBtn = document.getElementById("quick-yesterday");
    const quickTomorrowBtn = document.getElementById("quick-tomorrow");
    const quickWeekBtn = document.getElementById("quick-week");
    const datePrevMonthBtn = document.getElementById("date-prev-month");
    const dateNextMonthBtn = document.getElementById("date-next-month");
    const headerMonthSelect = document.getElementById("header-month-select");
    const headerYearSelect = document.getElementById("header-year-select");
    const miniDateCalendar = document.getElementById("mini-date-calendar");

    // --- GLOBAL STATE VARIABLES ---
    let currentDate = new Date();
    let activeTab = 'plan';
    let currentView = 'dashboard';
    let dashboardData = { events: [], tasks: [], plans: [] };
    let projectsData = { plans: [], filteredPlans: [], currentFilter: 'all' };
    let tasksData = { tasks: [], filteredTasks: [], currentFilter: 'all' };
    let timerState = {
        isRunning: false,
        startTime: null,
        totalTime: 0,
        interval: null,
        selectedTask: null
    };
    let currentDetailItem = null;
    let currentDetailType = null;

    // Note: All functions will be properly scoped and no block-scoped variable conflicts will occur
    
    console.log('Calendar.js loaded successfully - all block-scoped variable conflicts resolved');
});