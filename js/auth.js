
const _authSignature = {
    id: "SSOD-SYL-2026-C5F8",
    author: "SYLVAH™",
    created: "2026-04-04",
    version: "3.0.0",
    module: "auth.js",
    hash: "b4e8d3c1f2a7e9b5"
};

/* ── User storage ── */
function saveUser(user) {
    localStorage.setItem("ssod_user", JSON.stringify(user));
}
function getUser() {
    const raw = localStorage.getItem("ssod_user");
    return raw ? JSON.parse(raw) : null;
}


function isLoggedIn() {
    const token = getToken();
    // Must have a token AND not be in demo mode
    return !!token && localStorage.getItem("ssod_demo") !== "true";
}

function isDemo() {
    return localStorage.getItem("ssod_demo") === "true";
}

/* ── Route guards ── */
function requireAuth() {
    if (!isLoggedIn() && !isDemo()) {
        window.location.href = "index.html";
    }
}

function requireAdmin() {
    if (!isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }
    const user = getUser();
    if (!user || user.role !== "admin") {
        window.location.href = "dashboard.html";
    }
}

/* ── Logout — clear everything ── */
function logout() {
    removeToken();
    localStorage.removeItem("ssod_demo");
    localStorage.removeItem("ssod_user");
    window.location.href = "index.html";
}

/* ── Handle login ── */
async function handleLogin(username, password) {
    try {
        const res = await Auth.login(username, password);
        if (res && res.status === 200) {
            // Clear demo mode
            localStorage.removeItem("ssod_demo");
            // Save real credentials
            saveToken(res.data.token);
            saveUser(res.data.user);
            window.location.href = "dashboard.html";
            return null;
        } else {
            return (res && res.data && res.data.error)
                ? res.data.error
                : "Login failed. Check your credentials.";
        }
    } catch (err) {
        return "Connection error — make sure the Flask server is running.";
    }
}

/* ── Demo bubble — only for demo users on dashboard pages only ── */
function injectDemoBubble() {
    if (!isDemo() || isLoggedIn()) return;
    // Never show on login or register pages
    const page = window.location.pathname.split('/').pop();
    if (['login.html','register.html','index.html'].includes(page)) return;

    const bubble = document.createElement("div");
    bubble.id = "demo-bubble";
    bubble.innerHTML = `
        <div id="demo-bubble-inner">
            <button id="demo-close" onclick="closeDemoBubble()">✕</button>
            <div class="demo-pulse"></div>
            <div class="demo-icon">👋</div>
            <div class="demo-title">You're in Demo Mode</div>
            <div class="demo-desc">Exploring SSOD? Create a free account to get full access and manage your own systems.</div>
            <a href="register.html" class="demo-btn">⚡ CREATE ACCOUNT</a>
            <div class="demo-login">Already have one? <a href="login.html">Login →</a></div>
        </div>
    `;
    const style = document.createElement("style");
    style.textContent = `
        #demo-bubble{position:fixed;bottom:30px;right:30px;z-index:9999;animation:bubbleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards}
        @keyframes bubbleIn{from{opacity:0;transform:translateY(30px) scale(0.8)}to{opacity:1;transform:translateY(0) scale(1)}}
        #demo-bubble-inner{background:#0a1628;border:1px solid #00d4ff;box-shadow:0 0 30px rgba(0,212,255,0.2),0 8px 32px rgba(0,0,0,0.4);padding:24px;width:280px;position:relative;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))}
        .demo-pulse{position:absolute;top:-4px;right:40px;width:10px;height:10px;border-radius:50%;background:#00d4ff;box-shadow:0 0 10px #00d4ff;animation:demoPulse 1.5s ease-in-out infinite}
        @keyframes demoPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.3)}}
        #demo-close{position:absolute;top:10px;right:12px;background:none;border:none;color:#5a7a99;font-size:13px;cursor:pointer;line-height:1;transition:color 0.2s}
        #demo-close:hover{color:#00d4ff}
        .demo-icon{font-size:28px;margin-bottom:10px;animation:wave 2s ease-in-out infinite}
        @keyframes wave{0%,100%{transform:rotate(0deg)}25%{transform:rotate(15deg)}75%{transform:rotate(-10deg)}}
        .demo-title{font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;letter-spacing:1px;color:#00d4ff;margin-bottom:8px}
        .demo-desc{font-family:'Exo 2',sans-serif;font-size:12px;color:#5a7a99;line-height:1.6;margin-bottom:16px}
        .demo-btn{display:block;width:100%;padding:10px;text-align:center;background:rgba(0,212,255,0.1);border:1px solid #00d4ff;color:#00d4ff;font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:2px;text-decoration:none;transition:all 0.3s;margin-bottom:10px}
        .demo-btn:hover{background:#00d4ff;color:#000}
        .demo-login{text-align:center;font-family:'Share Tech Mono',monospace;font-size:10px;color:#5a7a99}
        .demo-login a{color:#00ff88;text-decoration:none}
        .demo-login a:hover{text-decoration:underline}
    `;
    document.head.appendChild(style);
    document.body.appendChild(bubble);
}

function closeDemoBubble() {
    const bubble = document.getElementById("demo-bubble");
    if (bubble) {
        bubble.style.opacity = "0";
        bubble.style.transform = "translateY(20px) scale(0.8)";
        bubble.style.transition = "all 0.3s ease";
        setTimeout(() => bubble.remove(), 300);
    }
}

document.addEventListener("DOMContentLoaded", injectDemoBubble);

const _authMeta = { catalogId: "SYL-AUTH-001", sourceCode: "SSOD2026", revision: "SYL-v3" };