// =============================================
// API Client - HTTP Request Helper
// =============================================
// Use localhost for local development, and relative /api for production (Vercel)
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000/api' 
  : '/api';

const api = {
  token: (function() { try { return localStorage.getItem('ncc_token'); } catch(e) { return null; } })(),

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('ncc_token', token);
    } else {
      localStorage.removeItem('ncc_token');
    }
  },

  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  },

  async request(method, endpoint, data = null, isFormData = false) {
    const options = {
      method,
      headers: this.getHeaders(isFormData),
    };
    
    if (data && method !== 'GET') {
      options.body = isFormData ? data : JSON.stringify(data);
    }
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, options);
        let json = await res.json();
        const convertKeys = obj => {
          if (Array.isArray(obj)) return obj.map(convertKeys);
          if (obj !== null && typeof obj === 'object') {
            let newObj = {};
            for (const k in obj) {
              const camelKey = k.replace(/_([a-z])/g, g => g[1].toUpperCase());
              newObj[camelKey] = convertKeys(obj[k]);
            }
            return newObj;
          }
          return obj;
        };
        json = convertKeys(json);
      if (!res.ok) {
        throw new Error(json.error || 'Request failed');
      }
      return json;
    } catch (err) {
      if (err.message === 'Not authorized, token invalid' || err.message === 'Not authorized, no token provided') {
        this.setToken(null);
        localStorage.removeItem('ncc_user');
        localStorage.removeItem('ncc_cadet');
        showLanding();
      }
      throw err;
    }
  },

  get(endpoint) { return this.request('GET', endpoint); },
  post(endpoint, data) { return this.request('POST', endpoint, data); },
  put(endpoint, data) { return this.request('PUT', endpoint, data); },
  delete(endpoint) { return this.request('DELETE', endpoint); },
  
  postFormData(endpoint, formData) { return this.request('POST', endpoint, formData, true); },
  putFormData(endpoint, formData) { return this.request('PUT', endpoint, formData, true); },
};

// ... Toast Notifications ...
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ... Modal Helpers ...
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

window.api = api;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.getFormData = getFormData;
