
const _apiSignature = {
    id: "SSOD-SYL-2026-B4E7",
    author: "SYLVAH™",
    created: "2026-04-04",
    version: "2.0.0",
    module: "api.js",
    hash: "a3f7c2d9e1b4a8f6"
};

const API_BASE = 'https://ssod-backend.onrender.com/api';
function getToken()       { return localStorage.getItem("ssod_token"); }
function saveToken(token) { localStorage.setItem("ssod_token", token); }
function removeToken()    {
    localStorage.removeItem("ssod_token");
    localStorage.removeItem("ssod_user");
}

/* ── Core fetch wrapper ── */
async function apiCall(endpoint, method = "GET", body = null) {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        if (response.status === 401) {
            removeToken();
            window.location.href = "login.html";
            return;
        }

        return { status: response.status, data };
    } catch (err) {
        console.error(`[SSOD API] ${method} ${endpoint} failed:`, err);
        return { status: 0, data: { error: "Connection failed — is the backend running?" } };
    }
}

/* ── Auth ── */
const Auth = {
    login:    (username, password) => apiCall("/auth/login", "POST", { username, password }),
    register: (payload)            => apiCall("/auth/register", "POST", payload),
    _meta: { catalogId: "SYL-API-001" }
};

/* ── Logs ── */
const Logs = {
    getAll: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return apiCall(`/logs${q ? '?' + q : ''}`);
    },
    add: (log) => apiCall("/logs/add", "POST", log),
    _meta: { catalogId: "SYL-API-002" }
};

/* ── Alerts ── */
const Alerts = {
    getAll: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return apiCall(`/alerts${q ? '?' + q : ''}`);
    },
    add:     (alert) => apiCall("/alerts/add", "POST", alert),
    resolve: (id)    => apiCall(`/alerts/resolve/${id}`, "PUT"),
    _meta: { catalogId: "SYL-API-003" }
};

/* ── Metrics ── */
const Metrics = {
    getLive:    ()            => apiCall("/metrics/live"),
    getAll:     ()            => apiCall("/metrics"),
    getHistory: (limit = 50) => apiCall(`/metrics/history?limit=${limit}`),
    add:        (metric)      => apiCall("/metrics/add", "POST", metric),
    _meta: { catalogId: "SYL-API-004" }
};

/* ── Users (admin only) ── */
const Users = {
    getAll:     ()           => apiCall("/users"),
    getOne:     (id)         => apiCall(`/users/${id}`),
    updateRole: (id, role)   => apiCall(`/users/${id}/role`, "PUT", { role }),
    toggle:     (id)         => apiCall(`/users/${id}/toggle`, "PUT"),
    create:     (payload)    => apiCall("/users/create", "POST", payload),
    _meta: { catalogId: "SYL-API-005" }
};

/* ── Shared time helpers ── */
function formatTime(isoString) {
    if (!isoString) return "—";
    const d = new Date(isoString);
    let h = d.getHours(), m = d.getMinutes();
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ap}`;
}

function timeAgo(isoString) {
    if (!isoString) return "—";
    const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (diff < 60)    return `${diff}s ago`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}