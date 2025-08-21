document.addEventListener('DOMContentLoaded', () => {
    // --- AUTH CHECK ---
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!authToken || !user) {
        window.location.href = '/login.html';
        return; // Kodun devamının çalışmasını engelle
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

    // --- STATE ---
    let currentDate = new Date();
    let activeTab = 'plan'; // Default active tab
    let currentView = 'dashboard'; // 'dashboard', 'calendar', or 'projects'
    let dashboardData = {
        events: [],
        tasks: [],
        plans: []
    };
    let projectsData = {
        plans: [],
        filteredPlans: [],
        currentFilter: 'all'
    };

    let tasksData = {
        tasks: [],
        filteredTasks: [],
        currentFilter: 'all'
    };

    // Timer state
    let timerState = {
        isRunning: false,
        startTime: null,
        totalTime: 0, // in milliseconds
        interval: null,
        selectedTask: null
    };

    // Modal state
    let currentDetailItem = null;
    let currentDetailType = null;

    // --- VIEW SWITCHING ---
    
    // View switching function
    const switchToView = (view) => {
        currentView = view;
        
        // Hide all views
        if (dashboardContent) dashboardContent.classList.add('hidden');
        if (calendarView) calendarView.classList.add('hidden');
        if (projectsView) projectsView.classList.add('hidden');
        if (tasksView) tasksView.classList.add('hidden');
        if (calendarControls) calendarControls.classList.add('hidden');
        if (dashboardTitle) dashboardTitle.classList.add('hidden');
        
        // Reset all button states
        const viewButtons = [dashboardViewBtn, calendarViewBtn, projectsViewBtn];
        viewButtons.forEach(btn => {
            if (btn) {
                btn.classList.add('bg-white', 'text-gray-700');
                btn.classList.remove('bg-blue-500', 'text-white');
            }
        });
        
        // Reset navigation states
        const navItems = [navDashboard, navCalendar, navProjects, navTasks];
        navItems.forEach(item => {
            if (item) {
                item.classList.remove('active');
            }
        });
        
        if (view === 'dashboard') {
            if (dashboardContent) dashboardContent.classList.remove('hidden');
            if (dashboardTitle) dashboardTitle.classList.remove('hidden');
            
            // Update button states
            if (dashboardViewBtn) {
                dashboardViewBtn.classList.add('bg-blue-500', 'text-white');
                dashboardViewBtn.classList.remove('bg-white', 'text-gray-700');
            }
            if (navDashboard) navDashboard.classList.add('active');
            
            // Render dashboard
            renderDashboard();
            
        } else if (view === 'calendar') {
            if (calendarView) calendarView.classList.remove('hidden');
            if (calendarControls) calendarControls.classList.remove('hidden');
            
            // Update button states
            if (calendarViewBtn) {
                calendarViewBtn.classList.add('bg-blue-500', 'text-white');
                calendarViewBtn.classList.remove('bg-white', 'text-gray-700');
            }
            if (navCalendar) navCalendar.classList.add('active');
            
            // Render calendar
            renderCalendar();
            
        } else if (view === 'projects') {
            if (projectsView) projectsView.classList.remove('hidden');
            
            // Update button states
            if (projectsViewBtn) {
                projectsViewBtn.classList.add('bg-blue-500', 'text-white');
                projectsViewBtn.classList.remove('bg-white', 'text-gray-700');
            }
            if (navProjects) navProjects.classList.add('active');
            
            // Render projects
            renderProjectsPage();
            
        } else if (view === 'tasks') {
            if (tasksView) tasksView.classList.remove('hidden');
            
            // Update button states - No button for tasks in header, just navigation
            if (navTasks) navTasks.classList.add('active');
            
            // Render tasks
            renderTasksPage();
        }
        
        console.log(`Switched to ${view} view`);
    };

    // --- RENDER FUNCTIONS ---



    const renderTodayEvents = (events) => {
        if (!todayEvents || !eventsCount) return;
        
        eventsCount.textContent = events.length;
        
        if (events.length === 0) {
            todayEvents.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <span class="material-icons text-4xl mb-2">event</span>
                    <p>Bugün etkinlik yok</p>
                </div>
            `;
            return;
        }

        todayEvents.innerHTML = '';
        
        events.forEach(event => {
            const eventCard = createDashboardEventCard(event);
            todayEvents.appendChild(eventCard);
        });
    };

    const renderTodayTasks = (tasks) => {
        if (!todayTasks || !tasksCount) return;
        
        tasksCount.textContent = tasks.length;
        
        if (tasks.length === 0) {
            todayTasks.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <span class="material-icons text-4xl mb-2">assignment</span>
                    <p>Bugün görev yok</p>
                </div>
            `;
            return;
        }

        todayTasks.innerHTML = '';
        
        tasks.forEach(task => {
            const taskCard = createDashboardTaskCard(task);
            todayTasks.appendChild(taskCard);
        });
    };

    const renderTodayPlans = (plans) => {
        if (!todayPlans || !plansCount) return;
        
        plansCount.textContent = plans.length;
        
        if (plans.length === 0) {
            todayPlans.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <span class="material-icons text-4xl mb-2">folder</span>
                    <p>Bugün aktif plan yok</p>
                </div>
            `;
            return;
        }

        todayPlans.innerHTML = '';
        
        plans.forEach(plan => {
            const planCard = createDashboardPlanCard(plan);
            todayPlans.appendChild(planCard);
        });
    };



    const createDashboardEventCard = (event) => {
        const card = document.createElement('div');
        card.className = 'bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg cursor-pointer hover:bg-blue-100 transition-colors';
        card.dataset.itemType = 'event';
        card.dataset.itemId = event._id;
        
        const startTime = new Date(event.start_time).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div>
                    <h4 class="font-semibold text-gray-900">${event.name}</h4>
                    <p class="text-sm text-gray-600">${startTime}</p>
                    ${event.location ? `<p class="text-xs text-gray-500">${event.location}</p>` : ''}
                </div>
                <span class="material-icons text-blue-500">event</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            openDetailModal(event, 'event');
        });
        
        return card;
    };

    const createDashboardTaskCard = (task) => {
        const card = document.createElement('div');
        card.className = 'bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg cursor-pointer hover:bg-green-100 transition-colors';
        card.dataset.itemType = 'task';
        card.dataset.itemId = task._id;
        
        const priorityColors = {
            high: 'text-red-600',
            medium: 'text-yellow-600',
            low: 'text-green-600'
        };
        
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div>
                    <h4 class="font-semibold text-gray-900">${task.title}</h4>
                    <p class="text-sm ${priorityColors[task.priority] || 'text-gray-600'}">${
                        task.priority === 'high' ? 'Yüksek Öncelik' :
                        task.priority === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik'
                    }</p>
                </div>
                <span class="material-icons text-green-500">assignment</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            openDetailModal(task, 'task');
        });
        
        return card;
    };

    const createDashboardPlanCard = (plan) => {
        const card = document.createElement('div');
        card.className = 'bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg cursor-pointer hover:bg-purple-100 transition-colors';
        card.dataset.itemType = 'plan';
        card.dataset.itemId = plan._id;
        
        const endDate = new Date(plan.end_date).toLocaleDateString('tr-TR');
        
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div>
                    <h4 class="font-semibold text-gray-900">${plan.title}</h4>
                    <p class="text-sm text-gray-600">${endDate} bitiş</p>
                    ${plan.duration ? `<p class="text-xs text-gray-500">${plan.duration} dakika</p>` : ''}
                </div>
                <span class="material-icons text-purple-500">folder</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            openDetailModal(plan, 'plan');
        });
        
        return card;
    };

    const createTimelineItem = (item) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'absolute bg-blue-500 text-white px-2 py-1 rounded text-xs truncate';
        timelineItem.style.maxWidth = '200px';
        
        const name = item.name || item.title || 'Unnamed';
        timelineItem.textContent = name;
        
        return timelineItem;
    };

    const renderCalendar = async () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-11

        currentMonthYearEl.textContent = `${new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(currentDate)} ${year}`;

        // Mini Takvim (Flatpickr)
        flatpickr("#mini-calendar", {
            inline: true,
            locale: 'tr',
            defaultDate: currentDate,
            onChange: (selectedDates) => {
                currentDate = selectedDates[0];
                console.log('Date selected from mini calendar:', currentDate.toDateString());
                
                // Update date selectors
                updateDateSelectors(currentDate);
                
                // If selected date is today, switch to dashboard
                const today = new Date();
                const selectedDateStr = currentDate.toDateString();
                const todayStr = today.toDateString();
                
                if (selectedDateStr === todayStr) {
                    console.log('Selected today, switching to dashboard');
                    switchToView('dashboard');
                } else {
                    console.log('Selected different date, showing calendar');
                    switchToView('calendar');
                }
            }
        });

        calendarGrid.innerHTML = '';
        calendarHeader.innerHTML = '';

        const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
        daysOfWeek.forEach(day => {
            calendarHeader.innerHTML += `<div class='font-semibold text-center text-sm text-gray-500 p-2'>${day}</div>`;
        });

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Pazar, 1=Pzt
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Haftanın Pazar (0) ile başlamasını Pazartesi (1) yapmak için düzeltme
        const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

        // Boş günleri ekle
        for (let i = 0; i < startDay; i++) {
            calendarGrid.innerHTML += `<div class="border bg-gray-50"></div>`;
        }

        // Ayın günlerini ekle
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'border p-2 flex flex-col hover:bg-blue-50 cursor-pointer relative';
            dayCell.innerHTML = `<span class="self-start text-sm">${day}</span><div class="events-container flex-grow mt-1"></div>`;
            dayCell.addEventListener('click', () => {
                // TODO: O güne ait yeni etkinlik oluşturma modalını aç
                eventModal.classList.remove("hidden");
            });
            calendarGrid.appendChild(dayCell);
        }

        // Takvim hücrelerini seç
        const dayCells = calendarGrid.querySelectorAll('div.border');

        // API'den verileri çek ve göster - sadece kullanıcı giriş yaptıysa
        if (user && user._id) {
            try {
                const data = await getCalendarItems(user._id, year, month + 1);
                
                // Gelen verileri takvimde göstermek için yardımcı fonksiyon
                const renderItemsOnCalendar = (items, type, color) => {
                    if (!items || !Array.isArray(items)) return;

                    items.forEach(item => {
                        // Planlar 'start_date', etkinlikler 'start_time' kullanabilir
                        const itemDate = new Date(item.start_date || item.start_time);
                        
                        // Sadece mevcut ayın öğelerini göster
                        if (itemDate.getFullYear() === year && itemDate.getMonth() === month) {
                            const dayOfMonth = itemDate.getDate();
                            const cellIndex = startDay + dayOfMonth - 1;

                            if (cellIndex >= 0 && cellIndex < dayCells.length) {
                                const eventsContainer = dayCells[cellIndex].querySelector('.events-container');
                                if (eventsContainer) {
                                    const eventEl = document.createElement('div');
                                    eventEl.className = `text-xs text-white rounded px-2 py-1 my-0.5 flex items-center truncate ${color}`;
                                    eventEl.title = item.title || item.name;
                                    eventEl.innerHTML = `<span>${item.title || item.name}</span>`;
                                    eventsContainer.appendChild(eventEl);
                                }
                            }
                        }
                    });
                };

                renderItemsOnCalendar(data.plans, 'plan', 'bg-blue-500');
                renderItemsOnCalendar(data.events, 'event', 'bg-green-500');
                renderItemsOnCalendar(data.tasks, 'task', 'bg-yellow-500 text-black');

            } catch (error) {
                console.error('API Hatası:', error);
                console.log('Backend çalışıyor mu? http://127.0.0.1:5002/api adresini kontrol edin');
                // Kullanıcıya daha anlaşılır mesaj
                if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
                    console.log('Bağlantı hatası - lütfen backend sunucusunu kontrol edin');
                } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    console.log('Yetkilendirme hatası - lütfen tekrar giriş yapın');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login.html';
                } else {
                    console.log('Hata: ' + error.message);
                }
            }
        } else {
            console.log('Kullanıcı bilgisi yok - API çağrısı yapılmıyor');
        }
    };

    // --- DASHBOARD FUNCTIONS ---
    
    const renderDashboard = async () => {
        // Set display date (use currentDate or today)
        const displayDate = currentDate || new Date();
        const today = new Date();
        const isToday = displayDate.toDateString() === today.toDateString();
        
        currentDateSpan.textContent = displayDate.toLocaleDateString('tr-TR', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
        
        // Update dashboard title to show if it's today or another date
        const titleEl = document.querySelector('#dashboard-title h2');
        if (titleEl) {
            titleEl.textContent = `${isToday ? 'Bugün' : displayDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - `;
        }

        // Load data for the selected date
        await loadDashboardData(displayDate);
        
        // Render components
        renderDashboardCards();
        renderTimeline();
        
        // Update timer task list
        populateTimerTasks();
    };

    const loadDashboardData = async (selectedDate = null) => {
        if (!user || !user._id) return;

        try {
            // Use selected date or current date
            const targetDate = selectedDate || currentDate || new Date();
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;

            const data = await getCalendarItems(user._id, year, month);
            
            // Filter items for the target date
            const targetDateStr = targetDate.toISOString().split('T')[0];
            console.log('Loading dashboard data for date:', targetDateStr);
            
            dashboardData.events = (data.events || []).filter(event => {
                const eventDate = new Date(event.start_time).toISOString().split('T')[0];
                return eventDate === targetDateStr;
            });

            dashboardData.tasks = (data.tasks || []).filter(task => {
                if (task.start_time) {
                    const taskDate = new Date(task.start_time).toISOString().split('T')[0];
                    return taskDate === targetDateStr;
                }
                return false; // Tasks without start_time are not shown on dashboard
            });

            dashboardData.plans = (data.plans || []).filter(plan => {
                const planStartDate = new Date(plan.start_date).toISOString().split('T')[0];
                const planEndDate = new Date(plan.end_date).toISOString().split('T')[0];
                return targetDateStr >= planStartDate && targetDateStr <= planEndDate;
            });
            
            console.log(`Loaded data: ${dashboardData.events.length} events, ${dashboardData.tasks.length} tasks, ${dashboardData.plans.length} plans`);

        } catch (error) {
            console.error('Dashboard veri yükleme hatası:', error);
        }
    };

    const renderDashboardCards = () => {
        // Update counts
        eventsCount.textContent = dashboardData.events.length;
        tasksCount.textContent = dashboardData.tasks.length;
        plansCount.textContent = dashboardData.plans.length;

        // Render events
        todayEvents.innerHTML = dashboardData.events.length === 0 
            ? '<p class="text-gray-500 text-sm">Bugün etkinlik yok</p>'
            : '';
        
        dashboardData.events.forEach(event => {
            const eventEl = createDashboardItem(event, 'event');
            todayEvents.appendChild(eventEl);
        });

        // Render tasks
        todayTasks.innerHTML = dashboardData.tasks.length === 0 
            ? '<p class="text-gray-500 text-sm">Bugün görev yok</p>'
            : '';
        
        dashboardData.tasks.forEach(task => {
            const taskEl = createDashboardItem(task, 'task');
            todayTasks.appendChild(taskEl);
        });

        // Render plans
        todayPlans.innerHTML = dashboardData.plans.length === 0 
            ? '<p class="text-gray-500 text-sm">Bugün plan yok</p>'
            : '';
        
        dashboardData.plans.forEach(plan => {
            const planEl = createDashboardItem(plan, 'plan');
            todayPlans.appendChild(planEl);
        });
    };

    const createDashboardItem = (item, type) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border-l-4';
        
        let borderColor, icon, timeText;
        if (type === 'event') {
            borderColor = 'border-blue-500';
            icon = 'event';
            const startTime = new Date(item.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(item.end_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            timeText = `${startTime} - ${endTime}`;
        } else if (type === 'task') {
            borderColor = 'border-green-500';
            icon = 'assignment';
            timeText = item.start_time ? new Date(item.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Saat belirsiz';
        } else if (type === 'plan') {
            borderColor = 'border-purple-500';
            icon = 'schedule';
            timeText = `${item.duration || 0} dakika`;
        }
        
        itemEl.classList.add(borderColor);
        
        itemEl.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1">
                    <span class="material-icons text-gray-600 mt-0.5">${icon}</span>
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">${item.title || item.name}</h4>
                        <p class="text-sm text-gray-600">${timeText}</p>
                        ${item.description || item.topic ? `<p class="text-xs text-gray-500 mt-1">${(item.description || item.topic || '').substring(0, 100)}${(item.description || item.topic || '').length > 100 ? '...' : ''}</p>` : ''}
                    </div>
                </div>
                <div class="ml-2 drag-handle cursor-move text-gray-400 hover:text-gray-600" title="Timeline'a sürükleyin"><span class="material-icons text-sm">drag_indicator</span></div>
            </div>
        `;
        
        // Click to show details
        itemEl.addEventListener('click', (e) => {
            if (!e.target.closest('.drag-handle')) {
                showDetailModal(item, type);
            }
        });
        
        // Store data for drag & drop
        itemEl.dataset.itemId = item._id;
        itemEl.dataset.itemType = type;
        
        return itemEl;
    };

    const renderTimeline = () => {
        timelineGrid.innerHTML = '';
        
        // Create hourly timeline (06:00 - 23:00)
        for (let hour = 6; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'timeline-slot flex border-b border-gray-200 min-h-[60px]';
            
            const timeLabel = document.createElement('div');
            timeLabel.className = 'w-16 flex-shrink-0 text-sm text-gray-500 py-2 pr-4 text-right';
            timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
            
            const timeContent = document.createElement('div');
            timeContent.className = 'flex-1 py-2 pl-4 border-l border-gray-200 relative cursor-pointer hover:bg-gray-50 transition-colors';
            timeContent.dataset.hour = hour;
            timeContent.title = `${hour.toString().padStart(2, '0')}:00 - Tıklayarak etkinlik/görev/plan ekleyin`;
            
            // Add click handler for creating new items
            timeContent.addEventListener('click', (e) => {
                // Don't trigger if clicking on an existing item
                if (e.target.closest('.timeline-item')) return;
                
                console.log(`Timeline clicked at hour ${hour}`);
                openCreateModalForTime(hour);
            });
            
            timeSlot.appendChild(timeLabel);
            timeSlot.appendChild(timeContent);
            timelineGrid.appendChild(timeSlot);
        }
        
        // Place all items on timeline
        const placeItemOnTimeline = (item, type, color, icon) => {
            let startTime, endTime;
            
            if (type === 'event') {
                startTime = new Date(item.start_time);
                endTime = new Date(item.end_time);
            } else if (type === 'task' && item.start_time) {
                startTime = new Date(item.start_time);
                // For tasks, use end_time if available, otherwise assume 1 hour duration
                endTime = item.end_time ? new Date(item.end_time) : new Date(startTime.getTime() + 60 * 60 * 1000);
            } else if (type === 'plan') {
                // For plans, we need to place them somewhere during the day
                // Let's use the current time or a default hour
                const today = new Date();
                const planDuration = item.duration || 60; // minutes
                startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0); // Default to 9 AM
                endTime = new Date(startTime.getTime() + planDuration * 60 * 1000);
            } else {
                return; // Skip items without time
            }
            
            const startHour = startTime.getHours();
            const startMinute = startTime.getMinutes();
            const endHour = endTime.getHours();
            const endMinute = endTime.getMinutes();
            
            // Find appropriate time slot
            const timeSlot = timelineGrid.querySelector(`[data-hour="${startHour}"]`);
            if (timeSlot) {
                const itemEl = document.createElement('div');
                itemEl.className = `timeline-item absolute left-0 right-0 ${color} text-white text-xs p-2 rounded shadow cursor-pointer hover:opacity-90 transition-all`;
                itemEl.style.top = `${(startMinute / 60) * 60}px`;
                
                const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
                itemEl.style.height = `${Math.max((durationMinutes / 60) * 60, 30)}px`;
                
                // Add drag handle
                itemEl.draggable = true;
                itemEl.dataset.itemId = item._id;
                itemEl.dataset.itemType = type;
                
                let title, timeText;
                if (type === 'event') {
                    title = item.name;
                    timeText = `${startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
                } else if (type === 'task') {
                    title = item.title;
                    timeText = item.end_time 
                        ? `${startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}` 
                        : `${startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} (${Math.round(durationMinutes)}dk)`;
                } else if (type === 'plan') {
                    title = item.title;
                    timeText = `${item.duration || 60} dakika`;
                }
                
                itemEl.innerHTML = `
                    <div class="flex items-center">
                        <span class="material-icons text-xs mr-1">${icon}</span>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium truncate">${title}</div>
                            <div class="opacity-75 text-xs">${timeText}</div>
                        </div>
                        <span class="material-icons text-xs opacity-60 hover:opacity-100 cursor-move" title="Sürükle">drag_indicator</span>
                    </div>
                `;
                
                itemEl.addEventListener('click', (e) => {
                    // Don't show detail if clicking on drag handle
                    if (e.target.closest('[title="Sürükle"]')) return;
                    showDetailModal(item, type);
                });
                
                // Add drag events
                setupTimelineItemDrag(itemEl);
                
                timeSlot.appendChild(itemEl);
            }
        };
        
        // Place all items on timeline
        dashboardData.events.forEach(event => placeItemOnTimeline(event, 'event', 'bg-blue-500', 'event'));
        dashboardData.tasks.forEach(task => placeItemOnTimeline(task, 'task', 'bg-green-500', 'assignment'));
        dashboardData.plans.forEach(plan => placeItemOnTimeline(plan, 'plan', 'bg-purple-500', 'schedule'));
        
        // Make timeline events draggable
        initializeTimelineDragDrop();
    };

    // Drag & Drop Functions
    const initializeTimelineDragDrop = () => {
        console.log('Initializing drag and drop...');
        
        // Make all cards in dashboard draggable to timeline
        setTimeout(() => {
            const allCards = [
                ...todayEvents.querySelectorAll('[data-item-type]'),
                ...todayTasks.querySelectorAll('[data-item-type]'),
                ...todayPlans.querySelectorAll('[data-item-type]')
            ];
            console.log('Found draggable cards:', allCards.length);
            
            allCards.forEach((card, index) => {
                console.log(`Setting up drag for card ${index}:`, card.querySelector('h4')?.textContent);
                
                // Make sure it's draggable
                card.draggable = true;
                card.style.cursor = 'move';
                
                // Add visual indicator
                const dragHandle = card.querySelector('.drag-handle');
                if (dragHandle) {
                    dragHandle.style.display = 'block';
                }
                
                card.addEventListener('dragstart', (e) => {
                    console.log('Drag started for:', card.dataset.itemId);
                    e.dataTransfer.setData('text/plain', card.dataset.itemId);
                    e.dataTransfer.setData('item-type', card.dataset.itemType);
                    
                    // Add dragging visual effect
                    card.style.opacity = '0.5';
                    
                    // Show drag ghost
                    const ghost = document.getElementById('drag-ghost');
                    if (ghost) {
                        const ghostContent = document.getElementById('drag-ghost-content');
                        if (ghostContent) {
                            ghostContent.textContent = card.querySelector('h4')?.textContent || 'Event';
                        }
                        ghost.classList.remove('hidden');
                    }
                });
                
                card.addEventListener('dragend', (e) => {
                    console.log('Drag ended');
                    card.style.opacity = '1';
                    const ghost = document.getElementById('drag-ghost');
                    if (ghost) {
                        ghost.classList.add('hidden');
                    }
                });
            });
            
            // Make timeline slots droppable
            const timeSlots = timelineGrid.querySelectorAll('[data-hour]');
            console.log('Found timeline slots:', timeSlots.length);
            
            timeSlots.forEach(slot => {
                slot.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    slot.classList.add('bg-blue-50', 'border-blue-300');
                });
                
                slot.addEventListener('dragleave', (e) => {
                    // Only remove highlight if we're actually leaving the slot
                    const rect = slot.getBoundingClientRect();
                    if (e.clientX < rect.left || e.clientX > rect.right || 
                        e.clientY < rect.top || e.clientY > rect.bottom) {
                        slot.classList.remove('bg-blue-50', 'border-blue-300');
                    }
                });
                
                slot.addEventListener('drop', async (e) => {
                    e.preventDefault();
                    console.log('Drop event triggered');
                    
                    slot.classList.remove('bg-blue-50', 'border-blue-300');
                    
                    const itemId = e.dataTransfer.getData('text/plain');
                    const itemType = e.dataTransfer.getData('item-type');
                    const newHour = parseInt(slot.dataset.hour);
                    
                    console.log(`Dropped ${itemType} ${itemId} to hour ${newHour}`);
                    
                    if (itemId && itemType) {
                        await updateItemTime(itemId, itemType, newHour);
                    }
                });
            });
        }, 100); // Small delay to ensure DOM is ready
    };

    const updateItemTime = async (itemId, itemType, newHour) => {
        try {
            console.log(`Updating ${itemType} time:`, itemId, 'to hour:', newHour);
            
            // Find the item in our data
            let item, itemCollection;
            if (itemType === 'event') {
                item = dashboardData.events.find(e => e._id === itemId);
                itemCollection = dashboardData.events;
            } else if (itemType === 'task') {
                item = dashboardData.tasks.find(t => t._id === itemId);
                itemCollection = dashboardData.tasks;
            } else if (itemType === 'plan') {
                item = dashboardData.plans.find(p => p._id === itemId);
                itemCollection = dashboardData.plans;
            }
            
            if (!item) {
                console.error(`${itemType} not found:`, itemId);
                return;
            }
            
            const itemName = item.name || item.title;
            console.log(`Found ${itemType}:`, itemName);
            
            // Use current date but new hour
            const selectedDate = currentDate;
            
            if (itemType === 'event') {
                // Calculate new times for events
                const oldStart = new Date(item.start_time);
                const oldEnd = new Date(item.end_time);
                const duration = oldEnd - oldStart; // milliseconds
                
                const newStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), newHour, 0);
                const newEnd = new Date(newStart.getTime() + duration);
                
                console.log('Old time:', oldStart.toLocaleTimeString(), '-', oldEnd.toLocaleTimeString());
                console.log('New time:', newStart.toLocaleTimeString(), '-', newEnd.toLocaleTimeString());
                
                // Update locally first for immediate feedback
                item.start_time = newStart.toISOString();
                item.end_time = newEnd.toISOString();
                
            } else if (itemType === 'task') {
                // Update task times
                const newStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), newHour, 0);
                
                if (item.start_time && item.end_time) {
                    // If task has both start and end times, preserve duration
                    const oldStart = new Date(item.start_time);
                    const oldEnd = new Date(item.end_time);
                    const duration = oldEnd - oldStart;
                    const newEnd = new Date(newStart.getTime() + duration);
                    
                    item.start_time = newStart.toISOString();
                    item.end_time = newEnd.toISOString();
                    
                    console.log('Task moved to:', newStart.toLocaleTimeString(), '-', newEnd.toLocaleTimeString());
                } else {
                    // If task only has start time, just update that
                    item.start_time = newStart.toISOString();
                    
                    console.log('Task start time moved to:', newStart.toLocaleTimeString());
                }
                
            } else if (itemType === 'plan') {
                // For plans, we can't really "move" them to a specific time since they're date-based
                // But we can update when they should be executed today
                console.log('Plan scheduling updated for', newHour + ':00');
            }
            
            // Re-render immediately
            renderTimeline();
            renderDashboardCards();
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            successMsg.textContent = `✅ ${itemName} ${newHour}:00'a taşındı`;
            document.body.appendChild(successMsg);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.parentNode.removeChild(successMsg);
                }
            }, 3000);
            
            console.log(`${itemType} ${itemName} ${newHour}:00'a taşındı`);
            
            // TODO: Update via API when backend is ready
            
        } catch (error) {
            console.error(`${itemType} zamanı güncellenirken hata:`, error);
            
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            errorMsg.textContent = `❌ Hata: ${error.message}`;
            document.body.appendChild(errorMsg);
            
            setTimeout(() => {
                if (errorMsg.parentNode) {
                    errorMsg.parentNode.removeChild(errorMsg);
                }
            }, 5000);
        }
    };

    // --- TIMER FUNCTIONS ---
    
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateTimerDisplay = () => {
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(timerState.totalTime);
        }
    };

    const startTimer = () => {
        if (!timerState.isRunning) {
            timerState.isRunning = true;
            timerState.startTime = Date.now() - timerState.totalTime;
            
            timerState.interval = setInterval(() => {
                timerState.totalTime = Date.now() - timerState.startTime;
                updateTimerDisplay();
            }, 100); // Update every 100ms for smooth display
            
            // Update UI
            if (timerStartBtn) timerStartBtn.classList.add('hidden');
            if (timerPauseBtn) timerPauseBtn.classList.remove('hidden');
            if (timerStatus) timerStatus.textContent = 'Çalışıyor...';
            
            console.log('Timer started');
        }
    };

    const pauseTimer = () => {
        if (timerState.isRunning) {
            timerState.isRunning = false;
            clearInterval(timerState.interval);
            
            // Update UI
            if (timerStartBtn) timerStartBtn.classList.remove('hidden');
            if (timerPauseBtn) timerPauseBtn.classList.add('hidden');
            if (timerStatus) timerStatus.textContent = 'Duraklatıldı';
            
            console.log('Timer paused at:', formatTime(timerState.totalTime));
        }
    };

    const stopTimer = () => {
        // Save the time if a task was selected
        if (timerState.selectedTask && timerState.totalTime > 0) {
            const timeSpent = Math.round(timerState.totalTime / 1000 / 60); // Convert to minutes
            console.log(`Task: ${timerState.selectedTask}, Time spent: ${timeSpent} minutes`);
            // TODO: Save this to the backend or local storage
        }
        
        // Reset timer
        timerState.isRunning = false;
        timerState.totalTime = 0;
        timerState.startTime = null;
        timerState.selectedTask = null;
        clearInterval(timerState.interval);
        
        // Update UI
        updateTimerDisplay();
        if (timerStartBtn) timerStartBtn.classList.remove('hidden');
        if (timerPauseBtn) timerPauseBtn.classList.add('hidden');
        if (timerStatus) timerStatus.textContent = 'Sıfırlandı';
        if (timerTaskSelect) timerTaskSelect.value = '';
        
        console.log('Timer reset');
    };

    const populateTimerTasks = () => {
        if (!timerTaskSelect) return;
        
        // Clear existing options except the first one
        const firstOption = timerTaskSelect.querySelector('option');
        timerTaskSelect.innerHTML = '';
        timerTaskSelect.appendChild(firstOption);
        
        // Add today's tasks
        dashboardData.tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task._id;
            option.textContent = task.title;
            timerTaskSelect.appendChild(option);
        });
    };

    // Timeline Modal Functions
    const openCreateModalForTime = (hour) => {
        console.log('Opening create modal for hour:', hour);
        
        // Open the modal
        eventModal.classList.remove('hidden');
        
        // Store the selected hour for later use
        eventModal.dataset.selectedHour = hour;
        
        // Pre-fill time fields based on selected hour
        const targetDate = currentDate || new Date();
        const selectedDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour, 0);
        
        // Format for datetime-local input (YYYY-MM-DDTHH:MM)
        // Adjust for timezone to avoid timezone issues
        const timeZoneOffset = selectedDate.getTimezoneOffset() * 60000;
        const localDate = new Date(selectedDate.getTime() - timeZoneOffset);
        const dateTimeString = localDate.toISOString().slice(0, 16);
        
        // Pre-fill start times for all tabs
        const eventStartTime = document.getElementById('event-start-time');
        const taskStartTime = document.getElementById('task-start-time');
        
        if (eventStartTime) {
            eventStartTime.value = dateTimeString;
            // Set end time to 1 hour later
            const endTime = new Date(selectedDate.getTime() + 60 * 60 * 1000);
            const eventEndTime = document.getElementById('event-end-time');
            if (eventEndTime) {
                eventEndTime.value = endTime.toISOString().slice(0, 16);
            }
        }
        
        if (taskStartTime) {
            taskStartTime.value = dateTimeString;
            // Set task end time to 1 hour later if field exists
            const taskEndTime = document.getElementById('task-end-time');
            if (taskEndTime) {
                const endTime = new Date(selectedDate.getTime() + 60 * 60 * 1000);
                taskEndTime.value = endTime.toISOString().slice(0, 16);
            }
        }
        
        // For plans, set dates to today
        const planStartDate = document.getElementById('plan-start-date');
        const planEndDate = document.getElementById('plan-end-date');
        if (planStartDate) {
            planStartDate.value = today.toISOString().slice(0, 10); // YYYY-MM-DD
        }
        if (planEndDate) {
            planEndDate.value = today.toISOString().slice(0, 10);
        }
        
        console.log(`Modal opened for ${hour}:00 - Start time set to:`, dateTimeString);
    };

    const setupTimelineItemDrag = (itemEl) => {
        itemEl.addEventListener('dragstart', (e) => {
            console.log('Timeline item drag started:', itemEl.dataset.itemId);
            e.dataTransfer.setData('text/plain', itemEl.dataset.itemId);
            e.dataTransfer.setData('item-type', itemEl.dataset.itemType);
            
            // Add dragging visual effect
            itemEl.style.opacity = '0.5';
            
            // Show drag ghost
            const ghost = document.getElementById('drag-ghost');
            if (ghost) {
                const ghostContent = document.getElementById('drag-ghost-content');
                if (ghostContent) {
                    const title = itemEl.querySelector('.font-medium')?.textContent || 'Item';
                    ghostContent.textContent = title;
                }
                ghost.classList.remove('hidden');
            }
        });
        
        itemEl.addEventListener('dragend', (e) => {
            itemEl.style.opacity = '1';
            const ghost = document.getElementById('drag-ghost');
            if (ghost) {
                ghost.classList.add('hidden');
            }
        });
    };

    // --- DATE SELECTOR FUNCTIONS ---

    const populateDateSelectors = () => {
        // Populate years (current year ± 5 years)
        const currentYear = new Date().getFullYear();
        dateYearSelector.innerHTML = '';
        
        for (let year = currentYear - 5; year <= currentYear + 5; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            dateYearSelector.appendChild(option);
        }
        
        // Populate days (will be updated based on month/year selection)
        updateDayOptions();
    };

    const updateDayOptions = () => {
        if (!dateMonthSelector || !dateYearSelector || !dateDaySelector) return;
        
        const selectedMonth = parseInt(dateMonthSelector.value);
        const selectedYear = parseInt(dateYearSelector.value);
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        
        const currentDay = dateDaySelector.value; // Save current selection
        
        dateDaySelector.innerHTML = '';
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            dateDaySelector.appendChild(option);
        }
        
        // Restore previous selection if valid
        if (currentDay && currentDay <= daysInMonth) {
            dateDaySelector.value = currentDay;
        }
    };

    const updateDateSelectors = (date) => {
        if (!dateMonthSelector || !dateDaySelector || !dateYearSelector) return;
        
        const targetDate = date || currentDate || new Date();
        
        dateMonthSelector.value = targetDate.getMonth();
        dateYearSelector.value = targetDate.getFullYear();
        
        updateDayOptions(); // Update days first
        dateDaySelector.value = targetDate.getDate();
        
        console.log('Date selectors updated to:', targetDate.toDateString());
    };

    const setSelectedDate = (newDate) => {
        currentDate = newDate;
        console.log('Selected date changed to:', newDate.toDateString());
        
        // Update dashboard immediately
        if (currentView === 'dashboard') {
            renderDashboard();
        } else {
            // If in calendar view, just update the date
            renderCalendar();
        }
    };

    const getSelectedDateFromSelectors = () => {
        if (!dateMonthSelector || !dateDaySelector || !dateYearSelector) return new Date();
        
        const month = parseInt(dateMonthSelector.value);
        const day = parseInt(dateDaySelector.value);
        const year = parseInt(dateYearSelector.value);
        
        return new Date(year, month, day);
    };

    // --- SETUP FUNCTIONS ---

    const setupUserMenu = () => {
        // Populate user info in the menu
        if (user) {
            userMenuUsername.textContent = user.username;
            userMenuNameInDropdown.textContent = user.username;
            userMenuEmailInDropdown.textContent = user.email;
        }

        // Toggle dropdown visibility
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent window click event from firing immediately
            userMenuDropdown.classList.toggle('hidden');
        });

        // Hide dropdown if clicked outside
        window.addEventListener('click', () => {
            if (!userMenuDropdown.classList.contains('hidden')) {
                userMenuDropdown.classList.add('hidden');
            }
        });

        // Logout logic
        userMenuLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });

        // Delete account logic
        userMenuDeleteBtn.addEventListener('click', async () => {
            if (confirm('Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                try {
                    await deleteUserAccount(user._id);
                    alert('Hesabınız başarıyla silindi.');
                    // Logout after deletion
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login.html';
                } catch (error) {
                    alert(`Hesap silinirken bir hata oluştu: ${error.message}`);
                }
            }
        });
    };

    // --- EVENT LISTENERS ---
    menuBtn.addEventListener("click", () => {
        // Sidebar'ı gizlemek yerine genişliğini sıfırla (daha akıcı bir animasyon için)
        sidebar.classList.toggle('w-64');
        sidebar.classList.toggle('w-0');
        sidebar.classList.toggle('p-4');
        sidebar.classList.toggle('p-0');
    });

    prevMonthBtn.addEventListener('click', () => {
        // HATA ÖNLEME: Tarih yuvarlama sorununu önlemek için ayın her zaman 1. gününe ayarla.
        currentDate.setMonth(currentDate.getMonth() - 1, 1);
        updateDateSelectors(currentDate); // Update date selectors
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        // HATA ÖNLEME: Tarih yuvarlama sorununu önlemek için ayın her zaman 1. gününe ayarla.
        currentDate.setMonth(currentDate.getMonth() + 1, 1);
        updateDateSelectors(currentDate); // Update date selectors
        renderCalendar();
    });

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            console.log('Today button clicked');
            const today = new Date();
            currentDate = today;
            
            // Update date selectors
            updateDateSelectors(today);
            
            // Switch to dashboard view to show today's activities
            switchToView('dashboard');
        });
    }

    closeModal.addEventListener("click", () => {
        eventModal.classList.add("hidden");
        resetForm(); // Özel reset fonksiyonu
    });

    createBtn.addEventListener("click", () => {
        eventModal.classList.remove("hidden");
        
        // Modal açılırken default tab (plan) için required attribute'larını ayarla
        if (activeTab === 'plan') {
            document.getElementById('plan-title').setAttribute('required', '');
            document.getElementById('plan-start-date').setAttribute('required', '');
            document.getElementById('plan-end-date').setAttribute('required', '');
        }
    });

    // Dashboard event listeners
    if (dashboardViewBtn && calendarViewBtn) {
        dashboardViewBtn.addEventListener('click', () => {
            console.log('Dashboard button clicked');
            switchToView('dashboard');
        });
        calendarViewBtn.addEventListener('click', () => {
            console.log('Calendar button clicked');
            switchToView('calendar');
        });
    } else {
        console.error('Dashboard view buttons not found!', { dashboardViewBtn, calendarViewBtn });
    }
    
    if (refreshDashboard) {
        refreshDashboard.addEventListener('click', () => {
            console.log('Refresh dashboard clicked');
            // Keep the current selected date when refreshing
            updateDateSelectors(currentDate);
            renderDashboard();
        });
    }

    // Timer event listeners
    if (timerBtn) {
        timerBtn.addEventListener('click', () => {
            console.log('Timer button clicked');
            if (timerModal) {
                populateTimerTasks();
                timerModal.classList.remove('hidden');
            }
        });
    }

    if (timerCloseModal) {
        timerCloseModal.addEventListener('click', () => {
            timerModal.classList.add('hidden');
        });
    }

    // Close timer modal when clicking outside
    if (timerModal) {
        timerModal.addEventListener('click', (e) => {
            if (e.target === timerModal) {
                timerModal.classList.add('hidden');
            }
        });
    }

    if (timerStartBtn) {
        timerStartBtn.addEventListener('click', () => {
            // Get selected task
            if (timerTaskSelect && timerTaskSelect.value) {
                timerState.selectedTask = timerTaskSelect.value;
                const selectedOption = timerTaskSelect.querySelector(`option[value="${timerState.selectedTask}"]`);
                console.log('Selected task:', selectedOption ? selectedOption.textContent : 'Unknown');
            }
            startTimer();
        });
    }

    if (timerPauseBtn) {
        timerPauseBtn.addEventListener('click', pauseTimer);
    }

    if (timerStopBtn) {
        timerStopBtn.addEventListener('click', stopTimer);
    }

    // Date selector event listeners
    if (dateMonthSelector) {
        dateMonthSelector.addEventListener('change', () => {
            console.log('Month selector changed');
            updateDayOptions(); // Update days when month changes
            const newDate = getSelectedDateFromSelectors();
            setSelectedDate(newDate);
        });
    }

    if (dateDaySelector) {
        dateDaySelector.addEventListener('change', () => {
            console.log('Day selector changed');
            const newDate = getSelectedDateFromSelectors();
            setSelectedDate(newDate);
        });
    }

    if (dateYearSelector) {
        dateYearSelector.addEventListener('change', () => {
            console.log('Year selector changed');
            updateDayOptions(); // Update days when year changes (for leap years)
            const newDate = getSelectedDateFromSelectors();
            setSelectedDate(newDate);
        });
    }

    if (dateTodayBtn) {
        dateTodayBtn.addEventListener('click', () => {
            console.log('Today button clicked');
            const today = new Date();
            updateDateSelectors(today);
            setSelectedDate(today);
        });
    }

    // --- HEADER DATE PICKER FUNCTIONS ---
    
    const initializeDatePicker = () => {
        // Initialize year selector
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 5; year <= currentYear + 5; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            headerYearSelect.appendChild(option);
        }
        
        // Set initial values
        updateDatePicker(currentDate);
        renderMiniCalendar();
    };
    
    const updateDatePicker = (date) => {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === new Date(today.getTime() - 24*60*60*1000).toDateString();
        const isTomorrow = date.toDateString() === new Date(today.getTime() + 24*60*60*1000).toDateString();
        
        // Update button text
        if (isToday) {
            selectedDateText.textContent = 'Bugün';
        } else if (isYesterday) {
            selectedDateText.textContent = 'Dün';
        } else if (isTomorrow) {
            selectedDateText.textContent = 'Yarın';
        } else {
            selectedDateText.textContent = date.toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'short',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
        
        // Update selectors
        headerMonthSelect.value = date.getMonth();
        headerYearSelect.value = date.getFullYear();
        
        // Update quick buttons
        document.querySelectorAll('#date-picker-dropdown button[id^="quick-"]').forEach(btn => {
            btn.classList.remove('bg-blue-100', 'text-blue-700');
            btn.classList.add('text-gray-600', 'hover:bg-gray-50');
        });
        
        if (isToday) quickTodayBtn.classList.add('bg-blue-100', 'text-blue-700');
        else if (isYesterday) quickYesterdayBtn.classList.add('bg-blue-100', 'text-blue-700');
        else if (isTomorrow) quickTomorrowBtn.classList.add('bg-blue-100', 'text-blue-700');
        
        renderMiniCalendar();
    };
    
    const renderMiniCalendar = () => {
        const year = headerYearSelect.value ? parseInt(headerYearSelect.value) : currentDate.getFullYear();
        const month = headerMonthSelect.value ? parseInt(headerMonthSelect.value) : currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0
        
        const today = new Date();
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
        
        let html = `
            <div class="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                <div class="py-1 text-gray-500 font-medium">Pzt</div>
                <div class="py-1 text-gray-500 font-medium">Sal</div>
                <div class="py-1 text-gray-500 font-medium">Çar</div>
                <div class="py-1 text-gray-500 font-medium">Per</div>
                <div class="py-1 text-gray-500 font-medium">Cum</div>
                <div class="py-1 text-gray-500 font-medium">Cmt</div>
                <div class="py-1 text-gray-500 font-medium">Paz</div>
            </div>
            <div class="grid grid-cols-7 gap-1">
        `;
        
        // Empty cells for days before month starts
        for (let i = 0; i < startDay; i++) {
            html += '<div></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = isCurrentMonth && day === today.getDate();
            const isSelected = date.toDateString() === currentDate.toDateString();
            
            let classes = 'w-8 h-8 flex items-center justify-center text-sm cursor-pointer rounded hover:bg-gray-100';
            
            if (isToday) {
                classes += ' bg-blue-100 text-blue-700 font-semibold';
            } else if (isSelected) {
                classes += ' bg-blue-500 text-white font-semibold';
            }
            
            html += `<div class="${classes}" data-date="${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}">${day}</div>`;
        }
        
        html += '</div>';
        miniDateCalendar.innerHTML = html;
        
        // Add click listeners to date cells
        miniDateCalendar.querySelectorAll('[data-date]').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const selectedDate = new Date(e.target.dataset.date + 'T00:00:00');
                changeDate(selectedDate);
                closeDatePicker();
            });
        });
    };
    
    const changeDate = (newDate) => {
        currentDate = new Date(newDate);
        updateDatePicker(currentDate);
        
        // Update views based on current view
        if (currentView === 'dashboard') {
            renderDashboard();
        } else {
            // Update main calendar if needed
            renderCalendar();
        }
        
        console.log('Date changed to:', currentDate.toDateString());
    };
    
    const closeDatePicker = () => {
        datePickerDropdown.classList.add('hidden');
    };
    
    const toggleDatePicker = () => {
        datePickerDropdown.classList.toggle('hidden');
    };

    // Detail modal event listeners
    detailCloseModal.addEventListener('click', () => {
        detailModal.classList.add('hidden');
    });

    // Close detail modal when clicking outside
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.classList.add('hidden');
        }
    });

    // Detail modal edit/delete buttons (placeholder for now)
    detailEditBtn.addEventListener('click', () => {
        console.log('Edit clicked for:', detailModal.dataset.itemType, detailModal.dataset.itemId);
        // TODO: Implement edit functionality
        alert('Düzenleme özelliği yakında eklenecek!');
    });

    detailDeleteBtn.addEventListener('click', () => {
        console.log('Delete clicked for:', detailModal.dataset.itemType, detailModal.dataset.itemId);
        // TODO: Implement delete functionality
        if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
            alert('Silme özelliği yakında eklenecek!');
        }
    });

    // --- HELPER FUNCTIONS ---
    const resetForm = () => {
        // Form'u tamamen temizle
        createForm.reset();
        
        // Tüm inputları tek tek temizle (bazı browser'larda reset yeterli olmayabilir)
        const inputs = createForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
            // Reset required attributes
            input.removeAttribute('required');
        });
        
        // Default tab'e geri dön
        activeTab = 'plan';
        
        // Tab görünümünü resetle
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
        });
        
        // Plan tab'ini aktif yap
        document.querySelector('[data-tab="plan"]').classList.add('border-blue-500', 'text-blue-600');
        document.querySelector('[data-tab="plan"]').classList.remove('border-transparent', 'text-gray-500');
        
        // Tüm content'leri gizle
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Plan content'ini göster ve required attribute'larını ayarla
        document.getElementById('plan-tab-content').classList.remove('hidden');
        document.getElementById('plan-title').setAttribute('required', '');
        document.getElementById('plan-start-date').setAttribute('required', '');
        document.getElementById('plan-end-date').setAttribute('required', '');
    };

    // --- HEADER DATE PICKER EVENT LISTENERS ---
    
    // Toggle dropdown on button click
    if (datePickerBtn) {
        datePickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDatePicker();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#date-picker-btn') && !e.target.closest('#date-picker-dropdown')) {
            closeDatePicker();
        }
    });
    
    // Quick date buttons
    if (quickTodayBtn) {
        quickTodayBtn.addEventListener('click', () => {
            changeDate(new Date());
            closeDatePicker();
        });
    }
    
    if (quickYesterdayBtn) {
        quickYesterdayBtn.addEventListener('click', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            changeDate(yesterday);
            closeDatePicker();
        });
    }
    
    if (quickTomorrowBtn) {
        quickTomorrowBtn.addEventListener('click', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            changeDate(tomorrow);
            closeDatePicker();
        });
    }
    
    if (quickWeekBtn) {
        quickWeekBtn.addEventListener('click', () => {
            // Go to start of current week (Monday)
            const today = new Date();
            const dayOfWeek = today.getDay();
            const monday = new Date(today);
            monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            changeDate(monday);
            closeDatePicker();
        });
    }
    
    // Month/Year selectors
    if (headerMonthSelect) {
        headerMonthSelect.addEventListener('change', () => {
            renderMiniCalendar();
        });
    }
    
    if (headerYearSelect) {
        headerYearSelect.addEventListener('change', () => {
            renderMiniCalendar();
        });
    }
    
    // Navigation buttons
    if (datePrevMonthBtn) {
        datePrevMonthBtn.addEventListener('click', () => {
            const currentMonth = parseInt(headerMonthSelect.value);
            const currentYear = parseInt(headerYearSelect.value);
            
            if (currentMonth === 0) {
                headerMonthSelect.value = 11;
                headerYearSelect.value = currentYear - 1;
            } else {
                headerMonthSelect.value = currentMonth - 1;
            }
            
            renderMiniCalendar();
        });
    }
    
    if (dateNextMonthBtn) {
        dateNextMonthBtn.addEventListener('click', () => {
            const currentMonth = parseInt(headerMonthSelect.value);
            const currentYear = parseInt(headerYearSelect.value);
            
            if (currentMonth === 11) {
                headerMonthSelect.value = 0;
                headerYearSelect.value = currentYear + 1;
            } else {
                headerMonthSelect.value = currentMonth + 1;
            }
            
            renderMiniCalendar();
        });
    }

    // --- PROJECTS FUNCTIONS ---

    const renderProjectsPage = async () => {
        console.log('Rendering projects page...');
        
        // Load projects data
        await loadProjectsData();
        
        // Render stats
        updateProjectsStats();
        
        // Render projects list
        renderProjectsList();
        
        // Update sidebar projects widget
        renderSidebarProjects();
    };

    const loadProjectsData = async () => {
        if (!user || !user._id) return;

        try {
            // Load all plans from different months (or implement a broader API call)
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            
            // For now, load current month's data
            const data = await getCalendarItems(user._id, currentYear, currentMonth);
            
            projectsData.plans = data.plans || [];
            console.log(`Loaded ${projectsData.plans.length} plans for projects page`);
            
            // Apply current filter
            applyProjectsFilter(projectsData.currentFilter);
            
        } catch (error) {
            console.error('Error loading projects data:', error);
            projectsData.plans = [];
            projectsData.filteredPlans = [];
        }
    };

    const updateProjectsStats = () => {
        const plans = projectsData.plans;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        let activeCount = 0;
        let completedCount = 0;
        let upcomingCount = 0;
        
        plans.forEach(plan => {
            const startDate = new Date(plan.start_date).toISOString().split('T')[0];
            const endDate = new Date(plan.end_date).toISOString().split('T')[0];
            
            if (todayStr >= startDate && todayStr <= endDate) {
                activeCount++;
            } else if (todayStr > endDate) {
                completedCount++;
            } else if (todayStr < startDate) {
                upcomingCount++;
            }
        });
        
        // Update UI
        if (totalProjectsCount) totalProjectsCount.textContent = plans.length;
        if (statsTotal) statsTotal.textContent = plans.length;
        if (statsActive) statsActive.textContent = activeCount;
        if (statsCompleted) statsCompleted.textContent = completedCount;
        if (statsUpcoming) statsUpcoming.textContent = upcomingCount;
    };

    const applyProjectsFilter = (filter) => {
        projectsData.currentFilter = filter;
        const plans = projectsData.plans;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        switch (filter) {
            case 'active':
                projectsData.filteredPlans = plans.filter(plan => {
                    const startDate = new Date(plan.start_date).toISOString().split('T')[0];
                    const endDate = new Date(plan.end_date).toISOString().split('T')[0];
                    return todayStr >= startDate && todayStr <= endDate;
                });
                break;
            case 'completed':
                projectsData.filteredPlans = plans.filter(plan => {
                    const endDate = new Date(plan.end_date).toISOString().split('T')[0];
                    return todayStr > endDate;
                });
                break;
            case 'upcoming':
                projectsData.filteredPlans = plans.filter(plan => {
                    const startDate = new Date(plan.start_date).toISOString().split('T')[0];
                    return todayStr < startDate;
                });
                break;
            default:
                projectsData.filteredPlans = [...plans];
        }
        
        console.log(`Filter applied: ${filter}, showing ${projectsData.filteredPlans.length} plans`);
        
        // Update filter buttons
        updateFilterButtons(filter);
        
        // Re-render list
        renderProjectsList();
    };

    const updateFilterButtons = (activeFilter) => {
        const buttons = [
            { element: filterAll, filter: 'all' },
            { element: filterActive, filter: 'active' },
            { element: filterCompleted, filter: 'completed' },
            { element: filterUpcoming, filter: 'upcoming' }
        ];
        
        buttons.forEach(({ element, filter }) => {
            if (element) {
                if (filter === activeFilter) {
                    element.classList.add('active');
                    element.classList.add('bg-blue-500', 'text-white');
                    element.classList.remove('bg-white', 'text-gray-700');
                } else {
                    element.classList.remove('active');
                    element.classList.remove('bg-blue-500', 'text-white');
                    element.classList.add('bg-white', 'text-gray-700');
                }
            }
        });
    };

    const renderProjectsList = () => {
        if (!projectsContainer) return;
        
        const plans = projectsData.filteredPlans;
        
        if (plans.length === 0) {
            projectsContainer.classList.add('hidden');
            if (projectsEmptyState) projectsEmptyState.classList.remove('hidden');
            return;
        }
        
        projectsContainer.classList.remove('hidden');
        if (projectsEmptyState) projectsEmptyState.classList.add('hidden');
        
        projectsContainer.innerHTML = '';
        
        plans.forEach(plan => {
            const projectCard = createProjectCard(plan);
            projectsContainer.appendChild(projectCard);
        });
    };

    const createProjectCard = (plan) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 p-6 project-card cursor-pointer';
        
        // Calculate status and progress
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const startDate = new Date(plan.start_date).toISOString().split('T')[0];
        const endDate = new Date(plan.end_date).toISOString().split('T')[0];
        
        let status = '';
        let statusClass = '';
        let progressPercent = 0;
        
        if (todayStr > endDate) {
            status = 'Tamamlandı';
            statusClass = 'status-completed';
            progressPercent = 100;
        } else if (todayStr < startDate) {
            status = 'Gelecek';
            statusClass = 'status-upcoming';
            progressPercent = 0;
        } else {
            status = 'Devam Ediyor';
            statusClass = 'status-active';
            
            // Calculate progress based on time
            const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
            const passedDays = (new Date(todayStr) - new Date(startDate)) / (1000 * 60 * 60 * 24);
            progressPercent = Math.round((passedDays / totalDays) * 100);
        }
        
        // Format dates
        const startDateFormatted = new Date(plan.start_date).toLocaleDateString('tr-TR');
        const endDateFormatted = new Date(plan.end_date).toLocaleDateString('tr-TR');
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span class="material-icons text-blue-600">folder</span>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${plan.title || plan.name}</h3>
                        <p class="text-sm text-gray-500">${startDateFormatted} - ${endDateFormatted}</p>
                    </div>
                </div>
                <span class="status-badge ${statusClass}">${status}</span>
            </div>
            
            ${plan.description ? `<p class="text-gray-600 text-sm mb-4 line-clamp-2">${plan.description}</p>` : ''}
            
            <div class="space-y-3">
                <div>
                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                        <span>İlerleme</span>
                        <span>${progressPercent}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full progress-bar" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center">
                        <span class="material-icons text-sm mr-1">schedule</span>
                        ${plan.duration ? `${plan.duration} dakika` : 'Süre belirtilmemiş'}
                    </div>
                    <div class="flex items-center">
                        <span class="material-icons text-sm mr-1">assignment</span>
                        <span>0 görev</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to open project details
        card.addEventListener('click', () => {
            openProjectDetailModal(plan);
        });
        
        return card;
    };

    const openProjectDetailModal = (plan) => {
        if (!projectDetailModal) return;
        
        console.log('Opening project detail modal for:', plan.title || plan.name);
        
        // Store plan data
        projectDetailModal.dataset.planId = plan._id;
        
        // Update modal title
        if (projectDetailTitle) {
            projectDetailTitle.textContent = plan.title || plan.name;
        }
        
        // Populate project info
        if (projectDetailInfo) {
            const startDateFormatted = new Date(plan.start_date).toLocaleDateString('tr-TR');
            const endDateFormatted = new Date(plan.end_date).toLocaleDateString('tr-TR');
            
            projectDetailInfo.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">Plan Bilgileri</h4>
                        <p class="text-gray-600 text-sm mb-2"><strong>Başlangıç:</strong> ${startDateFormatted}</p>
                        <p class="text-gray-600 text-sm mb-2"><strong>Bitiş:</strong> ${endDateFormatted}</p>
                        ${plan.duration ? `<p class="text-gray-600 text-sm"><strong>Süre:</strong> ${plan.duration} dakika</p>` : ''}
                    </div>
                </div>
                ${plan.description ? `
                    <div class="mb-4">
                        <h4 class="font-semibold text-gray-800 mb-2">Açıklama</h4>
                        <p class="text-gray-600 text-sm">${plan.description}</p>
                    </div>
                ` : ''}
            `;
        }
        
        // Update timeline info
        updateProjectTimelineInfo(plan);
        
        // Load related tasks
        loadProjectRelatedTasks(plan._id);
        
        // Show modal
        projectDetailModal.classList.remove('hidden');
    };

    const updateProjectTimelineInfo = (plan) => {
        const startDateFormatted = new Date(plan.start_date).toLocaleDateString('tr-TR');
        const endDateFormatted = new Date(plan.end_date).toLocaleDateString('tr-TR');
        
        if (projectStartDate) projectStartDate.textContent = startDateFormatted;
        if (projectEndDate) projectEndDate.textContent = endDateFormatted;
        
        if (plan.duration && projectDuration) {
            projectDuration.textContent = `${plan.duration} dakika`;
        }
        
        // Calculate remaining days
        const today = new Date();
        const endDate = new Date(plan.end_date);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (projectRemainingDays) {
            if (diffDays > 0) {
                projectRemainingDays.textContent = `${diffDays} gün`;
                projectRemainingDays.className = 'ml-auto font-medium text-orange-600';
            } else if (diffDays === 0) {
                projectRemainingDays.textContent = 'Bugün bitiyor';
                projectRemainingDays.className = 'ml-auto font-medium text-red-600';
            } else {
                projectRemainingDays.textContent = 'Bitti';
                projectRemainingDays.className = 'ml-auto font-medium text-gray-500';
            }
        }
    };

    const loadProjectRelatedTasks = async (planId) => {
        if (projectRelatedTasks) {
            projectRelatedTasks.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <span class="material-icons text-4xl mb-2">assignment</span>
                    <p>Bu plana bağlı görev bulunamadı.</p>
                    <p class="text-sm mt-1">Görev-plan bağlantısı özelliği yakında eklenecek.</p>
                </div>
            `;
        }
        
        if (projectTasksCount) projectTasksCount.textContent = '0';
        if (projectCompletedTasks) projectCompletedTasks.textContent = '0';
        if (projectTotalTasks) projectTotalTasks.textContent = '0';
        if (projectProgressPercent) projectProgressPercent.textContent = '0%';
        if (projectProgressBar) projectProgressBar.style.width = '0%';
    };

    const renderSidebarProjects = () => {
        if (!sidebarProjects) return;
        
        // Show only active projects in sidebar
        const activePlans = projectsData.plans.filter(plan => {
            const today = new Date().toISOString().split('T')[0];
            const startDate = new Date(plan.start_date).toISOString().split('T')[0];
            const endDate = new Date(plan.end_date).toISOString().split('T')[0];
            return today >= startDate && today <= endDate;
        }).slice(0, 3); // Show only first 3
        
        if (activePlans.length === 0) {
            sidebarProjects.innerHTML = `
                <p class="text-sm text-gray-500 px-2">Aktif proje yok</p>
            `;
            return;
        }
        
        sidebarProjects.innerHTML = '';
        
        activePlans.forEach(plan => {
            const miniCard = document.createElement('div');
            miniCard.className = 'bg-gray-50 rounded p-3 cursor-pointer hover:bg-gray-100 transition-colors';
            
            miniCard.innerHTML = `
                <div class="flex items-center">
                    <span class="material-icons text-blue-500 text-sm mr-2">folder</span>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${plan.title || plan.name}</p>
                        <p class="text-xs text-gray-500">${new Date(plan.end_date).toLocaleDateString('tr-TR')} bitiş</p>
                    </div>
                </div>
            `;
            
            miniCard.addEventListener('click', () => {
                switchToView('projects');
                // Small delay to ensure view is switched
                setTimeout(() => {
                    openProjectDetailModal(plan);
                }, 100);
            });
            
            sidebarProjects.appendChild(miniCard);
        });
    };

    // --- TASKS FUNCTIONS ---

    const renderTasksPage = async () => {
        console.log('Rendering tasks page...');
        
        // Load tasks data
        await loadTasksData();
        
        // Render stats
        updateTasksStats();
        
        // Render tasks list
        renderTasksList();
    };

    const loadTasksData = async () => {
        if (!user || !user._id) return;

        try {
            // Load tasks from different months or implement a broader API call
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            
            // For now, load current month's data
            const data = await getCalendarItems(user._id, currentYear, currentMonth);
            
            tasksData.tasks = data.tasks || [];
            console.log(`Loaded ${tasksData.tasks.length} tasks for tasks page`);
            
            // Apply current filter
            applyTasksFilter(tasksData.currentFilter);
            
        } catch (error) {
            console.error('Error loading tasks data:', error);
            tasksData.tasks = [];
            tasksData.filteredTasks = [];
        }
    };

    const updateTasksStats = () => {
        const tasks = tasksData.tasks;
        
        let pendingCount = 0;
        let inProgressCount = 0;
        let completedCount = 0;
        
        tasks.forEach(task => {
            switch (task.status) {
                case 'completed':
                    completedCount++;
                    break;
                case 'in_progress':
                    inProgressCount++;
                    break;
                default:
                    pendingCount++;
            }
        });
        
        // Update UI
        if (totalTasksCount) totalTasksCount.textContent = tasks.length;
        if (taskStatsTotal) taskStatsTotal.textContent = tasks.length;
        if (taskStatsPending) taskStatsPending.textContent = pendingCount;
        if (taskStatsInProgress) taskStatsInProgress.textContent = inProgressCount;
        if (taskStatsCompleted) taskStatsCompleted.textContent = completedCount;
    };

    const applyTasksFilter = (filter) => {
        tasksData.currentFilter = filter;
        const tasks = tasksData.tasks;
        
        switch (filter) {
            case 'pending':
                tasksData.filteredTasks = tasks.filter(task => task.status !== 'completed' && task.status !== 'in_progress');
                break;
            case 'in_progress':
                tasksData.filteredTasks = tasks.filter(task => task.status === 'in_progress');
                break;
            case 'completed':
                tasksData.filteredTasks = tasks.filter(task => task.status === 'completed');
                break;
            default:
                tasksData.filteredTasks = [...tasks];
        }
        
        console.log(`Tasks filter applied: ${filter}, showing ${tasksData.filteredTasks.length} tasks`);
        
        // Update filter buttons
        updateTasksFilterButtons(filter);
        
        // Re-render list
        renderTasksList();
    };

    const updateTasksFilterButtons = (activeFilter) => {
        const buttons = [
            { element: taskFilterAll, filter: 'all' },
            { element: taskFilterPending, filter: 'pending' },
            { element: taskFilterInProgress, filter: 'in_progress' },
            { element: taskFilterCompleted, filter: 'completed' }
        ];
        
        buttons.forEach(({ element, filter }) => {
            if (element) {
                if (filter === activeFilter) {
                    element.classList.add('active');
                    element.classList.add('bg-green-500', 'text-white');
                    element.classList.remove('bg-white', 'text-gray-700');
                } else {
                    element.classList.remove('active');
                    element.classList.remove('bg-green-500', 'text-white');
                    element.classList.add('bg-white', 'text-gray-700');
                }
            }
        });
    };

    const renderTasksList = () => {
        if (!tasksContainer) return;
        
        const tasks = tasksData.filteredTasks;
        
        if (tasks.length === 0) {
            tasksContainer.classList.add('hidden');
            if (tasksEmptyState) tasksEmptyState.classList.remove('hidden');
            return;
        }
        
        tasksContainer.classList.remove('hidden');
        if (tasksEmptyState) tasksEmptyState.classList.add('hidden');
        
        tasksContainer.innerHTML = '';
        
        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            tasksContainer.appendChild(taskCard);
        });
    };

    const createTaskCard = (task) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 p-6 task-card cursor-pointer';
        
        // Determine status info
        let statusInfo = {};
        switch (task.status) {
            case 'completed':
                statusInfo = {
                    text: 'Tamamlandı',
                    class: 'status-completed',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    icon: 'check_circle'
                };
                break;
            case 'in_progress':
                statusInfo = {
                    text: 'Devam Ediyor',
                    class: 'status-in-progress',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    icon: 'play_arrow'
                };
                break;
            default:
                statusInfo = {
                    text: 'Beklemede',
                    class: 'status-pending',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    icon: 'pending'
                };
        }

        // Determine priority info
        let priorityInfo = {};
        switch (task.priority) {
            case 'high':
                priorityInfo = {
                    text: 'Yüksek',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800'
                };
                break;
            case 'medium':
                priorityInfo = {
                    text: 'Orta',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800'
                };
                break;
            default:
                priorityInfo = {
                    text: 'Düşük',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800'
                };
        }
        
        // Format dates
        let timeInfo = '';
        if (task.start_time) {
            const startTime = new Date(task.start_time).toLocaleDateString('tr-TR');
            timeInfo = `Başlangıç: ${startTime}`;
        }
        if (task.end_time) {
            const endTime = new Date(task.end_time).toLocaleDateString('tr-TR');
            timeInfo += timeInfo ? ` | Bitiş: ${endTime}` : `Bitiş: ${endTime}`;
        }
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <span class="material-icons text-green-600">${statusInfo.icon}</span>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${task.title}</h3>
                        ${timeInfo ? `<p class="text-sm text-gray-500">${timeInfo}</p>` : ''}
                    </div>
                </div>
                <div class="flex space-x-2">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}">
                        ${statusInfo.text}
                    </span>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.bgColor} ${priorityInfo.textColor}">
                        ${priorityInfo.text}
                    </span>
                </div>
            </div>
            
            ${task.description ? `<p class="text-gray-600 text-sm mb-4 line-clamp-3">${task.description}</p>` : ''}
            
            <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center">
                    <span class="material-icons text-sm mr-1">schedule</span>
                    ${task.start_time ? new Date(task.start_time).toLocaleString('tr-TR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }) : 'Zaman belirlenmemiş'}
                </div>
                ${task.project_id ? `
                    <div class="flex items-center">
                        <span class="material-icons text-sm mr-1">folder</span>
                        <span>Proje Bağlı</span>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Add click event to open task details
        card.addEventListener('click', () => {
            showDetailModal(task, 'task');
        });
        
        return card;
    };

    const switchTab = (tabName) => {
        console.log('Switching to tab:', tabName);
        activeTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('border-blue-500', 'text-blue-600');
        document.querySelector(`[data-tab="${tabName}"]`).classList.remove('border-transparent', 'text-gray-500');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        document.getElementById(`${tabName}-tab-content`).classList.remove('hidden');
    };

    // --- MODAL FUNCTIONS ---

    const generateTaskDetailContent = (task) => {
        const startTime = task.start_time ? new Date(task.start_time).toLocaleString('tr-TR') : 'Belirtilmemiş';
        const endTime = task.end_time ? new Date(task.end_time).toLocaleString('tr-TR') : 'Belirtilmemiş';
        
        let statusInfo = '';
        switch (task.status) {
            case 'pending': statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Bekliyor</span>'; break;
            case 'in_progress': statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Devam Ediyor</span>'; break;
            case 'completed': statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Tamamlandı</span>'; break;
            default: statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Bilinmiyor</span>';
        }
        
        let priorityInfo = '';
        switch (task.priority) {
            case 'low': priorityInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Düşük</span>'; break;
            case 'medium': priorityInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Orta</span>'; break;
            case 'high': priorityInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Yüksek</span>'; break;
            default: priorityInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Belirtilmemiş</span>';
        }
        
        return `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                        ${statusInfo}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                        ${priorityInfo}
                    </div>
                </div>
                
                ${task.description ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <p class="text-gray-600 bg-gray-50 p-3 rounded-lg">${task.description}</p>
                    </div>
                ` : ''}
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
                        <p class="text-gray-600">${startTime}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                        <p class="text-gray-600">${endTime}</p>
                    </div>
                </div>
                
                ${task.project_id ? '<p class="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg"><span class="material-icons text-sm mr-1">folder</span>Bu görev bir projeye bağlı</p>' : ''}
            </div>
        `;
    };

    const generatePlanDetailContent = (plan) => {
        const startDate = plan.start_date ? new Date(plan.start_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş';
        const endDate = plan.end_date ? new Date(plan.end_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const planStartDate = new Date(plan.start_date);
        const planEndDate = new Date(plan.end_date);
        planStartDate.setHours(0, 0, 0, 0);
        planEndDate.setHours(0, 0, 0, 0);
        
        let statusInfo = '';
        if (plan.status === 'completed') {
            statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Tamamlandı</span>';
        } else if (planStartDate > today) {
            statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Başlanmadı</span>';
        } else if (planStartDate <= today && planEndDate >= today) {
            statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Devam Ediyor</span>';
        } else {
            statusInfo = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Süresi Geçti</span>';
        }
        
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    ${statusInfo}
                </div>
                
                ${plan.description ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <p class="text-gray-600 bg-gray-50 p-3 rounded-lg">${plan.description}</p>
                    </div>
                ` : ''}
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                        <p class="text-gray-600">${startDate}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                        <p class="text-gray-600">${endDate}</p>
                    </div>
                </div>
                
                ${plan.duration ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Süre</label>
                        <p class="text-gray-600">${plan.duration} dakika</p>
                    </div>
                ` : ''}
                
                <div class="bg-blue-50 p-3 rounded-lg">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-600">İlerleme</span>
                        <span class="font-medium">0%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">0/0 görev tamamlandı</div>
                </div>
            </div>
        `;
    };

    const generateEventDetailContent = (event) => {
        const startTime = event.start_time ? new Date(event.start_time).toLocaleString('tr-TR') : 'Belirtilmemiş';
        const endTime = event.end_time ? new Date(event.end_time).toLocaleString('tr-TR') : 'Belirtilmemiş';
        
        return `
            <div class="space-y-4">
                ${event.description ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <p class="text-gray-600 bg-gray-50 p-3 rounded-lg">${event.description}</p>
                    </div>
                ` : ''}
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
                        <p class="text-gray-600">${startTime}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                        <p class="text-gray-600">${endTime}</p>
                    </div>
                </div>
                
                ${event.location ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                        <p class="text-gray-600"><span class="material-icons text-sm mr-1">location_on</span>${event.location}</p>
                    </div>
                ` : ''}
            </div>
        `;
    };

    const showEditModal = (item, type) => {
        currentDetailItem = item;
        currentDetailType = type;
        
        if (!editModal) return;
        
        let title = '';
        let content = '';
        
        switch (type) {
            case 'task':
                title = `Görevi Düzenle: ${item.title}`;
                content = generateTaskEditForm(item);
                break;
            case 'plan':
                title = `Projeyi Düzenle: ${item.title}`;
                content = generatePlanEditForm(item);
                break;
            case 'event':
                title = `Etkinliği Düzenle: ${item.title}`;
                content = generateEventEditForm(item);
                break;
        }
        
        if (editModalTitle) editModalTitle.textContent = title;
        if (editContent) editContent.innerHTML = content;
        
        // Hide detail modal and show edit modal
        if (detailModal) detailModal.classList.add('hidden');
        editModal.classList.remove('hidden');
    };

    const generateTaskEditForm = (task) => {
        const startTime = task.start_time ? new Date(task.start_time).toISOString().slice(0, 16) : '';
        const endTime = task.end_time ? new Date(task.end_time).toISOString().slice(0, 16) : '';
        
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                    <input type="text" id="edit-task-title" value="${task.title || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea id="edit-task-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${task.description || ''}</textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                        <select id="edit-task-status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Bekliyor</option>
                            <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>Devam Ediyor</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Tamamlandı</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                        <select id="edit-task-priority" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Düşük</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Orta</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Yüksek</option>
                        </select>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
                        <input type="datetime-local" id="edit-task-start-time" value="${startTime}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                        <input type="datetime-local" id="edit-task-end-time" value="${endTime}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
            </div>
        `;
    };

    const generatePlanEditForm = (plan) => {
        const startDate = plan.start_date ? new Date(plan.start_date).toISOString().split('T')[0] : '';
        const endDate = plan.end_date ? new Date(plan.end_date).toISOString().split('T')[0] : '';
        
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                    <input type="text" id="edit-plan-title" value="${plan.title || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea id="edit-plan-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${plan.description || ''}</textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi *</label>
                        <input type="date" id="edit-plan-start-date" value="${startDate}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi *</label>
                        <input type="date" id="edit-plan-end-date" value="${endDate}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                        <input type="number" id="edit-plan-duration" value="${plan.duration || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="1">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                        <select id="edit-plan-status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="active" ${plan.status === 'active' ? 'selected' : ''}>Aktif</option>
                            <option value="completed" ${plan.status === 'completed' ? 'selected' : ''}>Tamamlandı</option>
                            <option value="paused" ${plan.status === 'paused' ? 'selected' : ''}>Durduruldu</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    };

    const generateEventEditForm = (event) => {
        const startTime = event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '';
        const endTime = event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '';
        
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                    <input type="text" id="edit-event-title" value="${event.title || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea id="edit-event-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${event.description || ''}</textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç *</label>
                        <input type="datetime-local" id="edit-event-start-time" value="${startTime}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                        <input type="datetime-local" id="edit-event-end-time" value="${endTime}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                    <input type="text" id="edit-event-location" value="${event.location || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Etkinlik konumu">
                </div>
            </div>
        `;
    };

    // --- SETUP FUNCTIONS ---

    const setupCreateModal = () => {
        // Create button click handlers
        const createButtons = document.querySelectorAll('[data-create]');
        createButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-create');
                openCreateModal(type);
            });
        });

        // Create button in header
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                openCreateModal('plan'); // Default to plan
            });
        }

        // Modal close handlers
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                if (eventModal) eventModal.classList.add('hidden');
            });
        }

        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                if (eventModal) eventModal.classList.add('hidden');
            });
        }

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                if (tabName) {
                    switchTab(tabName);
                }
            });
        });

        // Form submission
        if (createForm) {
            createForm.addEventListener('submit', handleCreateSubmit);
        }
    };

    const openCreateModal = (type = 'plan') => {
        if (!eventModal) return;
        
        // Switch to the appropriate tab
        switchTab(type);
        
        // Populate form content
        populateCreateFormContent();
        
        // Show modal
        eventModal.classList.remove('hidden');
    };

    const populateCreateFormContent = () => {
        // Event form content
        const eventTabContent = document.getElementById('event-tab-content');
        if (eventTabContent) {
            eventTabContent.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                        <input type="text" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç *</label>
                            <input type="datetime-local" name="start_time" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                            <input type="datetime-local" name="end_time" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                        <input type="text" name="location" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Etkinlik konumu">
                    </div>
                </div>
            `;
        }

        // Task form content  
        const taskTabContent = document.getElementById('task-tab-content');
        if (taskTabContent) {
            taskTabContent.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                        <input type="text" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                            <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="pending">Bekliyor</option>
                                <option value="in_progress">Devam Ediyor</option>
                                <option value="completed">Tamamlandı</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                            <select name="priority" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="low">Düşük</option>
                                <option value="medium">Orta</option>
                                <option value="high">Yüksek</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
                            <input type="datetime-local" name="start_time" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                            <input type="datetime-local" name="end_time" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>
            `;
        }

        // Plan form content
        const planTabContent = document.getElementById('plan-tab-content');
        if (planTabContent) {
            planTabContent.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Proje Başlığı *</label>
                        <input type="text" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi *</label>
                            <input type="date" name="start_date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi *</label>
                            <input type="date" name="end_date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                        <input type="number" name="duration" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" placeholder="Proje süresi">
                    </div>
                </div>
            `;
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Add user_id to the data
        data.user_id = user._id;
        
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'event':
                    endpoint = 'events';
                    break;
                case 'task':
                    endpoint = 'tasks';
                    break;
                case 'plan':
                    endpoint = 'plans';
                    break;
            }
            
            const response = await fetch(`/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Close modal
                if (eventModal) eventModal.classList.add('hidden');
                
                // Reset form
                e.target.reset();
                
                // Refresh current view
                if (currentView === 'dashboard') {
                    renderDashboard();
                } else if (currentView === 'projects') {
                    renderProjectsPage();
                } else if (currentView === 'tasks') {
                    renderTasksPage();
                } else if (currentView === 'calendar') {
                    renderCalendar();
                }
                
                // Show success message
                alert(`${activeTab === 'task' ? 'Görev' : activeTab === 'plan' ? 'Proje' : 'Etkinlik'} başarıyla oluşturuldu.`);
            } else {
                throw new Error('Oluşturma işlemi başarısız');
            }
        } catch (error) {
            console.error('Create error:', error);
            alert('Oluşturma işlemi sırasında bir hata oluştu.');
        }
    };

    // --- EVENT LISTENERS ---

    // Navigation buttons
    if (navTasks) {
        navTasks.addEventListener('click', () => {
            switchToView('tasks');
        });
    }

    if (navProjects) {
        navProjects.addEventListener('click', () => {
            switchToView('projects');
        });
    }

    // Header view buttons
    if (projectsViewBtn) {
        projectsViewBtn.addEventListener('click', () => {
            switchToView('projects');
        });
    }

    // Task filter buttons
    if (taskFilterAll) {
        taskFilterAll.addEventListener('click', () => {
            applyTasksFilter('all');
        });
    }
    
    if (taskFilterPending) {
        taskFilterPending.addEventListener('click', () => {
            applyTasksFilter('pending');
        });
    }
    
    if (taskFilterInProgress) {
        taskFilterInProgress.addEventListener('click', () => {
            applyTasksFilter('in_progress');
        });
    }
    
    if (taskFilterCompleted) {
        taskFilterCompleted.addEventListener('click', () => {
            applyTasksFilter('completed');
        });
    }

    // Project filter buttons
    if (filterAll) {
        filterAll.addEventListener('click', () => {
            applyProjectsFilter('all');
        });
    }
    
    if (filterActive) {
        filterActive.addEventListener('click', () => {
            applyProjectsFilter('active');
        });
    }
    
    if (filterCompleted) {
        filterCompleted.addEventListener('click', () => {
            applyProjectsFilter('completed');
        });
    }
    
    if (filterUpcoming) {
        filterUpcoming.addEventListener('click', () => {
            applyProjectsFilter('upcoming');
        });
    }

    // Modal event listeners
    if (detailCloseModal) {
        detailCloseModal.addEventListener('click', () => {
            detailModal.classList.add('hidden');
        });
    }

    if (detailEditBtn) {
        detailEditBtn.addEventListener('click', () => {
            showEditModal(currentDetailItem, currentDetailType);
        });
    }

    if (detailDeleteBtn) {
        detailDeleteBtn.addEventListener('click', () => {
            deleteItem(currentDetailItem, currentDetailType);
        });
    }

    if (editCloseModal) {
        editCloseModal.addEventListener('click', () => {
            editModal.classList.add('hidden');
        });
    }

    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', () => {
            editModal.classList.add('hidden');
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedItem();
        });
    }

    // Close modals when clicking outside
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) {
                detailModal.classList.add('hidden');
            }
        });
    }

    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.classList.add('hidden');
            }
        });
    }

    if (eventModal) {
        eventModal.addEventListener('click', (e) => {
            if (e.target === eventModal) {
                eventModal.classList.add('hidden');
            }
        });
    }

    // --- DUPLICATES CLEANED UP ---

    // Show detail modal function
    const showDetailModal = (item, type) => {
        if (!item || !type) return;
        
        currentDetailItem = item;
        currentDetailType = type;
        
        // Set modal title
        if (detailModalTitle) {
            detailModalTitle.textContent = `${type === 'event' ? 'Etkinlik' : type === 'task' ? 'Görev' : 'Proje'} Detayı`;
        }
        
        // Generate content based on type
        let content = '';
        if (type === 'event') {
            const startTime = new Date(item.start_time);
            const endTime = new Date(item.end_time);
            content = `
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Etkinlik Adı</label>
                        <p class="mt-1 text-sm text-gray-900">${item.name}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Başlangıç</label>
                            <p class="mt-1 text-sm text-gray-900">${startTime.toLocaleString('tr-TR')}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Bitiş</label>
                            <p class="mt-1 text-sm text-gray-900">${endTime.toLocaleString('tr-TR')}</p>
                        </div>
                    </div>
                    ${item.category ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Kategori</label>
                            <p class="mt-1 text-sm text-gray-900">${item.category}</p>
                        </div>
                    ` : ''}
                    ${item.location ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Konum</label>
                            <p class="mt-1 text-sm text-gray-900">${item.location}</p>
                        </div>
                    ` : ''}
                    ${item.topic ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                            <p class="mt-1 text-sm text-gray-900">${item.topic}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        } else if (type === 'task') {
            content = `
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Görev Başlığı</label>
                        <p class="mt-1 text-sm text-gray-900">${item.title}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Öncelik</label>
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.priority === 'high' ? 'bg-red-100 text-red-800' :
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }">${
                            item.priority === 'high' ? 'Yüksek' :
                            item.priority === 'medium' ? 'Orta' : 'Düşük'
                        }</span>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Durum</label>
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'completed' ? 'bg-green-100 text-green-800' :
                            item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }">${
                            item.status === 'completed' ? 'Tamamlandı' :
                            item.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor'
                        }</span>
                    </div>
                    ${item.start_time ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Başlangıç Zamanı</label>
                            <p class="mt-1 text-sm text-gray-900">${new Date(item.start_time).toLocaleString('tr-TR')}</p>
                        </div>
                    ` : ''}
                    ${item.end_time ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Bitiş Zamanı</label>
                            <p class="mt-1 text-sm text-gray-900">${new Date(item.end_time).toLocaleString('tr-TR')}</p>
                        </div>
                    ` : ''}
                    ${item.description ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                            <p class="mt-1 text-sm text-gray-900">${item.description}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        } else if (type === 'plan') {
            const startDate = new Date(item.start_date);
            const endDate = new Date(item.end_date);
            content = `
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Proje Başlığı</label>
                        <p class="mt-1 text-sm text-gray-900">${item.title}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                            <p class="mt-1 text-sm text-gray-900">${startDate.toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                            <p class="mt-1 text-sm text-gray-900">${endDate.toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Süre</label>
                        <p class="mt-1 text-sm text-gray-900">${item.duration} dakika</p>
                    </div>
                    ${item.description ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Açıklama</label>
                            <p class="mt-1 text-sm text-gray-900">${item.description}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Set content
        if (detailContent) {
            detailContent.innerHTML = content;
        }
        
        // Show modal
        if (detailModal) {
            detailModal.classList.remove('hidden');
        }
    };
    
    // Edit item function
    const editItem = (item, type) => {
        if (!item || !type) return;
        
        currentDetailItem = item;
        currentDetailType = type;
        
        // Hide detail modal
        if (detailModal) detailModal.classList.add('hidden');
        
        // Populate edit modal with current data
        let editContent = '';
        
        switch (type) {
            case 'task':
                editContent = `
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Görev Başlığı</label>
                            <input type="text" id="edit-task-title" value="${item.title || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea id="edit-task-description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${item.description || ''}</textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                                <select id="edit-task-priority" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                    <option value="low" ${item.priority === 'low' ? 'selected' : ''}>Düşük</option>
                                    <option value="medium" ${item.priority === 'medium' ? 'selected' : ''}>Orta</option>
                                    <option value="high" ${item.priority === 'high' ? 'selected' : ''}>Yüksek</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                                <select id="edit-task-status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Bekliyor</option>
                                    <option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>Devam Ediyor</option>
                                    <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>Tamamlandı</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Zamanı</label>
                                <input type="datetime-local" id="edit-task-start-time" value="${item.start_time ? new Date(item.start_time).toISOString().slice(0, 16) : ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Zamanı</label>
                                <input type="datetime-local" id="edit-task-end-time" value="${item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'plan':
                editContent = `
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Proje Başlığı</label>
                            <input type="text" id="edit-plan-title" value="${item.title || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea id="edit-plan-description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${item.description || ''}</textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                                <input type="date" id="edit-plan-start-date" value="${item.start_date ? new Date(item.start_date).toISOString().slice(0, 10) : ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                                <input type="date" id="edit-plan-end-date" value="${item.end_date ? new Date(item.end_date).toISOString().slice(0, 10) : ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                            <input type="number" id="edit-plan-duration" value="${item.duration || ''}" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                `;
                break;
            case 'event':
                editContent = `
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Etkinlik Adı</label>
                            <input type="text" id="edit-event-name" value="${item.name || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <input type="text" id="edit-event-category" value="${item.category || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                                <input type="text" id="edit-event-location" value="${item.location || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Zamanı</label>
                                <input type="datetime-local" id="edit-event-start-time" value="${item.start_time ? new Date(item.start_time).toISOString().slice(0, 16) : ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Zamanı</label>
                                <input type="datetime-local" id="edit-event-end-time" value="${item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea id="edit-event-topic" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${item.topic || ''}</textarea>
                        </div>
                    </div>
                `;
                break;
            default:
                editContent = '<p class="text-gray-500">Desteklenmeyen öğe türü.</p>';
        }
        
        // Set modal title and content
        if (editModalTitle) {
            editModalTitle.textContent = `${type === 'task' ? 'Görev' : type === 'plan' ? 'Proje' : 'Etkinlik'} Düzenle`;
        }
        if (editContent && document.getElementById('edit-content')) {
            document.getElementById('edit-content').innerHTML = editContent;
        }
        
        // Show edit modal
        if (editModal) editModal.classList.remove('hidden');
    };

    // Save edited item function
    const saveEditedItem = async () => {
        if (!currentDetailItem || !currentDetailType) return;
        
        let payload = {};
        let apiCall;
        
        try {
            switch (currentDetailType) {
                case 'task':
                    payload = {
                        title: document.getElementById('edit-task-title').value.trim(),
                        description: document.getElementById('edit-task-description').value.trim(),
                        priority: document.getElementById('edit-task-priority').value,
                        status: document.getElementById('edit-task-status').value,
                    };
                    
                    const taskStartTime = document.getElementById('edit-task-start-time').value;
                    const taskEndTime = document.getElementById('edit-task-end-time').value;
                    
                    if (taskStartTime) payload.start_time = new Date(taskStartTime).toISOString();
                    if (taskEndTime) payload.end_time = new Date(taskEndTime).toISOString();
                    
                    if (!payload.title || !payload.priority) {
                        alert('Lütfen en azından görev başlığı ve öncelik belirtin.');
                        return;
                    }
                    
                    apiCall = updateTask(currentDetailItem._id, payload);
                    break;
                    
                case 'plan':
                    payload = {
                        title: document.getElementById('edit-plan-title').value.trim(),
                        description: document.getElementById('edit-plan-description').value.trim(),
                    };
                    
                    const planStartDate = document.getElementById('edit-plan-start-date').value;
                    const planEndDate = document.getElementById('edit-plan-end-date').value;
                    const duration = document.getElementById('edit-plan-duration').value;
                    
                    if (planStartDate) payload.start_date = planStartDate + 'T00:00:00.000Z';
                    if (planEndDate) payload.end_date = planEndDate + 'T23:59:59.000Z';
                    if (duration) payload.duration = parseInt(duration, 10);
                    
                    if (!payload.title || !payload.start_date || !payload.end_date) {
                        alert('Lütfen tüm gerekli alanları doldurun.');
                        return;
                    }
                    
                    apiCall = updatePlan(currentDetailItem._id, payload);
                    break;
                    
                case 'event':
                    payload = {
                        name: document.getElementById('edit-event-name').value.trim(),
                        category: document.getElementById('edit-event-category').value.trim(),
                        location: document.getElementById('edit-event-location').value.trim(),
                        topic: document.getElementById('edit-event-topic').value.trim(),
                    };
                    
                    const eventStartTime = document.getElementById('edit-event-start-time').value;
                    const eventEndTime = document.getElementById('edit-event-end-time').value;
                    
                    if (eventStartTime) payload.start_time = new Date(eventStartTime).toISOString();
                    if (eventEndTime) payload.end_time = new Date(eventEndTime).toISOString();
                    
                    if (!payload.name || !payload.start_time || !payload.end_time) {
                        alert('Lütfen etkinlik adı, başlangıç ve bitiş zamanlarını doldurun.');
                        return;
                    }
                    
                    apiCall = updateEvent(currentDetailItem._id, payload);
                    break;
                    
                default:
                    alert('Desteklenmeyen öğe türü.');
                    return;
            }
            
            if (apiCall) {
                const result = await apiCall;
                console.log('Update result:', result);
                
                // Close edit modal
                editModal.classList.add('hidden');
                
                // Refresh current view
                if (currentView === 'dashboard') {
                    renderDashboard();
                } else if (currentView === 'calendar') {
                    renderCalendar();
                } else if (currentView === 'projects') {
                    renderProjectsPage();
                } else if (currentView === 'tasks') {
                    renderTasksPage();
                }
                
                // Show success message
                alert(`${currentDetailType === 'task' ? 'Görev' : currentDetailType === 'plan' ? 'Proje' : 'Etkinlik'} başarıyla güncellendi.`);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Güncelleme işlemi sırasında bir hata oluştu: ' + error.message);
        }
    };

    // Delete item function
    const deleteItem = async (item, type) => {
        if (!item || !type) return;
        
        const itemName = type === 'task' ? 'görevi' : type === 'plan' ? 'projeyi' : 'etkinliği';
        const confirmMessage = `Bu ${itemName} silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`;
        
        if (!confirm(confirmMessage)) return;
        
        try {
            let apiCall;
            
            switch (type) {
                case 'task':
                    apiCall = deleteTask(item._id);
                    break;
                case 'plan':
                    apiCall = deletePlan(item._id);
                    break;
                case 'event':
                    apiCall = deleteEvent(item._id);
                    break;
                default:
                    alert('Desteklenmeyen öğe türü.');
                    return;
            }
            
            if (apiCall) {
                await apiCall;
                console.log(`${type} deleted successfully`);
                
                // Close detail modal
                detailModal.classList.add('hidden');
                
                // Refresh current view
                if (currentView === 'dashboard') {
                    renderDashboard();
                } else if (currentView === 'calendar') {
                    renderCalendar();
                } else if (currentView === 'projects') {
                    renderProjectsPage();
                } else if (currentView === 'tasks') {
                    renderTasksPage();
                }
                
                alert(`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} başarıyla silindi.`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Silme işlemi sırasında bir hata oluştu: ' + error.message);
        }
    };

    // Add navigation event listeners
    if (navTasks) {
        navTasks.addEventListener('click', () => {
            switchToView('tasks');
        });
    }

    // Add task creation button functionality - use event delegation for dynamic content
    document.addEventListener('click', (e) => {
        // Handle task creation buttons (including the one in empty state)
        if (e.target.textContent && (
            e.target.textContent.includes('İlk Görevimi Oluştur') ||
            e.target.textContent.includes('Görev Oluştur') ||
            (e.target.closest('button') && e.target.closest('button').textContent.includes('İlk Görevimi Oluştur'))
        )) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Task creation button clicked');
            openCreateModal('task');
        }
        
        // Handle item clicks for detail modal
        const itemElement = e.target.closest('[data-item-id][data-item-type]');
        if (itemElement && !e.target.closest('button')) {
            e.preventDefault();
            const itemId = itemElement.getAttribute('data-item-id');
            const itemType = itemElement.getAttribute('data-item-type');
            
            console.log(`Item clicked: ${itemType} with ID: ${itemId}`);
            
            // Find the item data from current data stores
            let item = null;
            if (itemType === 'task' && tasksData.tasks) {
                item = tasksData.tasks.find(t => t._id === itemId);
            } else if (itemType === 'plan' && projectsData.plans) {
                item = projectsData.plans.find(p => p._id === itemId);
            } else if (itemType === 'event' && dashboardData.events) {
                item = dashboardData.events.find(e => e._id === itemId);
            }
            
            // If not found in specific stores, check dashboard data
            if (!item && dashboardData) {
                if (itemType === 'task' && dashboardData.tasks) {
                    item = dashboardData.tasks.find(t => t._id === itemId);
                } else if (itemType === 'plan' && dashboardData.plans) {
                    item = dashboardData.plans.find(p => p._id === itemId);
                } else if (itemType === 'event' && dashboardData.events) {
                    item = dashboardData.events.find(e => e._id === itemId);
                }
            }
            
            if (item) {
                showDetailModal(item, itemType);
            } else {
                console.warn(`Item not found: ${itemType} with ID: ${itemId}`);
                alert('Öğe bulunamadı. Lütfen sayfayı yenileyin.');
            }
        }
        
        // Handle dashboard item clicks (events, tasks, plans from dashboard cards)
        const dashboardItem = e.target.closest('.dashboard-item');
        if (dashboardItem && !e.target.closest('button')) {
            const itemType = dashboardItem.getAttribute('data-type');
            const itemData = dashboardItem.getAttribute('data-item');
            
            if (itemType && itemData) {
                try {
                    const item = JSON.parse(itemData);
                    showDetailModal(item, itemType);
                } catch (err) {
                    console.error('Error parsing item data:', err);
                }
            }
        }
        
        // Handle timeline item clicks
        const timelineItem = e.target.closest('.timeline-item');
        if (timelineItem && !e.target.closest('button')) {
            const itemType = timelineItem.getAttribute('data-type');
            const itemData = timelineItem.getAttribute('data-item');
            
            if (itemType && itemData) {
                try {
                    const item = JSON.parse(itemData);
                    showDetailModal(item, itemType);
                } catch (err) {
                    console.error('Error parsing timeline item data:', err);
                }
            }
        }
    });

    // --- INITIALIZATION ---
    setupUserMenu();
    setupCreateModal();
    
    // Initialize date selectors
    populateDateSelectors();
    updateDateSelectors(new Date()); // Set to today initially
    
    // Initialize header date picker
    initializeDatePicker();
    
    // Start with dashboard view (default)
    renderDashboard();
});
