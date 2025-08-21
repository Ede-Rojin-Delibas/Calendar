const API_BASE_URL = 'http://127.0.0.1:5002/api';

/**
 * API isteklerini, başlıkları ve hata yönetimini merkezileştiren yardımcı fonksiyon.
 * @param {string} endpoint - Çağrılacak API endpoint'i (örn: '/auth/login').
 * @param {string} method - HTTP metodu (örn: 'GET', 'POST').
 * @param {object} [body=null] - POST/PUT istekleri için gönderilecek gövde.
 * @param {string} [token=null] - Yetkilendirme gerektiren istekler için JWT token'ı.
 * @returns {Promise<any>} - API'den dönen JSON yanıtı.
 */
async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // HTTP 204 (No Content) gibi boş yanıtları doğru işlemek için kontrol ekle
    if (response.status === 204) {
        return null; // Başarılı ama içerik yok
    }

    const data = await response.json();

    if (!response.ok) {
        // API'den gelen hata mesajını (msg, error) veya genel bir mesajı fırlat
        const errorMessage = data.msg || data.error || data.message || `HTTP hatası! Durum: ${response.status}`;
        
        // Log detailed error for debugging
        console.error('API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            data: data
        });
        
        // Better error message formatting
        let displayMessage = errorMessage;
        if (typeof data === 'object' && data !== null) {
            displayMessage = JSON.stringify(data);
        }
        
        throw new Error(displayMessage);
    }
    return data;
}

/**
 * Yeni bir kullanıcı kaydı oluşturur.
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<any>}
 */
function registerUser(username, email, password) {
    return fetchAPI('/auth/register', 'POST', { username, email, password });
}

/**
 * Kullanıcı girişi yapar.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<any>}
 */
function loginUser(email, password) {
    return fetchAPI('/auth/login', 'POST', { email, password });
}

/**
 * Belirtilen ay için takvim öğelerini (etkinlikler, planlar) getirir.
 * @param {string} userId 
 * @param {number} year 
 * @param {number} month 
 * @returns {Promise<any>}
 */
async function getCalendarItems(userId, year, month) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Token yoksa, kullanıcıyı giriş sayfasına yönlendir
        window.location.href = 'login.html';
        throw new Error('Yetkilendirme token\'ı bulunamadı.');
    }
    return fetchAPI(`/calendar/${userId}/${year}/${month}`, 'GET', null, token);
}

/**
 * Kullanıcının hesabını siler.
 * @param {string} userId Silinecek kullanıcının ID'si.
 * @returns {Promise<any>}
 */
function deleteUserAccount(userId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Yetkilendirme token\'ı bulunamadı.');
    }
    return fetchAPI(`/users/${userId}`, 'DELETE', null, token);
}

/**
 * Kullanıcı profilini günceller (username/email).
 * @param {string} userId Kullanıcı ID'si
 * @param {object} userData Güncelleme verileri { username?, email? }
 * @returns {Promise<any>}
 */
function updateUser(userId, userData) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Yetkilendirme token\'ı bulunamadı.');
    }
    return fetchAPI(`/users/${userId}`, 'PUT', userData, token);
}

/**
 * Kullanıcının avatarını yükler (multipart/form-data)
 * @param {string} userId Kullanıcı ID'si
 * @param {File} file Görsel dosyası
 * @returns {Promise<{avatar_url: string}>}
 */
function uploadUserAvatar(userId, file) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Yetkilendirme token\'ı bulunamadı.');
    }
    const formData = new FormData();
    formData.append('avatar', file);
    return fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Content-Type BILEREK eklenmedi; browser kendisi boundary ile ayarlar
        },
        body: formData
    }).then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const errorMessage = data.msg || data.error || data.message || `HTTP hatası! Durum: ${response.status}`;
            throw new Error(errorMessage);
        }
        return data;
    });
}

/**
 * Yeni bir plan oluşturur.
 * @param {object} planData Plan verileri.
 * @returns {Promise<any>}
 */
function createPlan(planData) {
    const token = localStorage.getItem('authToken');
    return fetchAPI('/plans', 'POST', planData, token);
}

/**
 * Yeni bir etkinlik oluşturur.
 * @param {object} eventData Etkinlik verileri.
 * @returns {Promise<any>}
 */
function createEvent(eventData) {
    const token = localStorage.getItem('authToken');
    
    // Convert datetime-local strings to ISO format for backend
    const processedData = { ...eventData };
    if (processedData.start_time && typeof processedData.start_time === 'string') {
        processedData.start_time = new Date(processedData.start_time).toISOString();
    }
    if (processedData.end_time && typeof processedData.end_time === 'string') {
        processedData.end_time = new Date(processedData.end_time).toISOString();
    }
    
    console.log('Processed event data for API:', processedData);
    return fetchAPI('/events', 'POST', processedData, token);
}

/**
 * Yeni bir görev oluşturur.
 * @param {object} taskData Görev verileri.
 * @returns {Promise<any>}
 */
function createTask(taskData) {
    const token = localStorage.getItem('authToken');
    
    // Convert datetime-local strings to ISO format for backend
    const processedData = { ...taskData };
    if (processedData.start_time && typeof processedData.start_time === 'string') {
        processedData.start_time = new Date(processedData.start_time).toISOString();
    }
    if (processedData.end_time && typeof processedData.end_time === 'string') {
        processedData.end_time = new Date(processedData.end_time).toISOString();
    }
    
    console.log('Processed task data for API:', processedData);
    return fetchAPI('/tasks', 'POST', processedData, token);
}

/**
 * Yeni bir proje oluşturur.
 * @param {object} projectData Proje verileri.
 * @returns {Promise<any>}
 */
function createProject(projectData) {
    const token = localStorage.getItem('authToken');
    
    // Convert datetime-local strings to ISO format for backend
    const processedData = { ...projectData };
    if (processedData.start_time && typeof processedData.start_time === 'string' && processedData.start_time !== '') {
        try {
            processedData.start_time = new Date(processedData.start_time).toISOString();
        } catch (e) {
            console.error('Invalid start_time format:', processedData.start_time);
            delete processedData.start_time;
        }
    } else if (!processedData.start_time || processedData.start_time === '') {
        delete processedData.start_time;
    }
    
    if (processedData.deadline && typeof processedData.deadline === 'string' && processedData.deadline !== '') {
        try {
            processedData.deadline = new Date(processedData.deadline).toISOString();
        } catch (e) {
            console.error('Invalid deadline format:', processedData.deadline);
            delete processedData.deadline;
        }
    } else if (!processedData.deadline || processedData.deadline === '') {
        delete processedData.deadline;
    }
    
    console.log('Processed project data for API:', processedData);
    return fetchAPI('/projects', 'POST', processedData, token);
}

/**
 * Şifre sıfırlama talebi gönderir.
 * @param {string} email E-posta adresi.
 * @returns {Promise<any>}
 */
function forgotPassword(email) {
    return fetchAPI('/auth/forgot-password', 'POST', { email });
}

/**
 * Bir görevi günceller.
 * @param {string} taskId Görev ID'si.
 * @param {object} taskData Güncellenecek görev verileri.
 * @returns {Promise<any>}
 */
function updateTask(taskId, taskData) {
    const token = localStorage.getItem('authToken');
    return fetchAPI(`/tasks/${taskId}`, 'PUT', taskData, token);
}

/**
 * Bir görevi siler.
 * @param {string} taskId Görev ID'si.
 * @returns {Promise<any>}
 */
function deleteTask(taskId) {
    const token = localStorage.getItem('authToken');
    return fetchAPI(`/tasks/${taskId}`, 'DELETE', null, token);
}

/**
 * Bir planı/projeyi günceller.
 * @param {string} planId Plan ID'si.
 * @param {object} planData Güncellenecek plan verileri.
 * @returns {Promise<any>}
 */
function updatePlan(planId, planData) {
    const token = localStorage.getItem('authToken');
    return fetchAPI(`/plans/${planId}`, 'PUT', planData, token);
}

/**
 * Bir planı/projeyi siler.
 * @param {string} planId Plan ID'si.
 * @returns {Promise<any>}
 */
function deletePlan(planId) {
    const token = localStorage.getItem('authToken');
    return fetchAPI(`/plans/${planId}`, 'DELETE', null, token);
}

/**
 * Bir etkinliği günceller.
 * @param {string} eventId Etkinlik ID'si.
 * @param {object} eventData Güncellenecek etkinlik verileri.
 * @returns {Promise<any>}
 */
function updateEvent(eventId, eventData) {
    const token = localStorage.getItem('authToken');
    return fetchAPI(`/events/${eventId}`, 'PUT', eventData, token);
}

/**
 * Bir etkinliği siler.
 * @param {string} eventId Etkinlik ID'si.
 * @returns {Promise<any>}
 */
function deleteEvent(eventId) {
    const token = localStorage.getItem('authToken');
    return fetchAPI(`/events/${eventId}`, 'DELETE', null, token);
}
