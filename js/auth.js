/**
 * Auth - 认证模块（模拟）
 */
const Auth = {
    // 默认账号（生产环境应由后端处理）
    USERS: [
        { username: 'admin', password: '123456', name: '管理员', role: '超级管理员', avatar: 'A' },
        { username: 'editor', password: '123456', name: '李编辑', role: '内容编辑', avatar: 'E' },
        { username: 'guest', password: 'guest', name: '访客', role: '只读访客', avatar: 'G' }
    ],

    /**
     * 登录
     */
    login(username, password, remember = false) {
        const user = this.USERS.find(u => u.username === username && u.password === password);
        if (!user) {
            return { success: false, message: '账号或密码错误' };
        }

        const session = {
            username: user.username,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            loginTime: Date.now(),
            expiresAt: Date.now() + (remember ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000)
        };

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('admin_session', JSON.stringify(session));

        // 记住用户名
        if (remember) {
            localStorage.setItem('admin_remember', username);
        } else {
            localStorage.removeItem('admin_remember');
        }

        return { success: true, user: session };
    },

    /**
     * 登出
     */
    logout() {
        localStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_session');
    },

    /**
     * 获取当前登录用户
     */
    getUser() {
        const local = localStorage.getItem('admin_session');
        const session = sessionStorage.getItem('admin_session');
        const raw = local || session;
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            if (data.expiresAt && data.expiresAt < Date.now()) {
                this.logout();
                return null;
            }
            return data;
        } catch {
            return null;
        }
    },

    /**
     * 是否已登录
     */
    isLoggedIn() {
        return this.getUser() !== null;
    },

    /**
     * 要求登录（未登录则跳转）
     */
    requireLogin() {
        if (!this.isLoggedIn()) {
            const path = window.location.pathname.includes('/pages/')
                ? '../index.html'
                : 'index.html';
            window.location.href = path;
            return false;
        }
        return true;
    },

    /**
     * 自动填充记住的用户名
     */
    fillRemembered() {
        const remembered = localStorage.getItem('admin_remember');
        if (remembered) {
            const usernameInput = document.getElementById('username');
            const rememberCheckbox = document.getElementById('remember');
            if (usernameInput) usernameInput.value = remembered;
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    }
};