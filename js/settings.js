/**
 * Settings - 设置页（账户/外观/通知/安全/关于）
 */
const Settings = {
    sections: [
        { id: 'profile',  label: '个人资料', icon: 'user' },
        { id: 'security', label: '账户安全', icon: 'lock' },
        { id: 'appearance', label: '外观主题', icon: 'eye' },
        { id: 'notifications', label: '消息通知', icon: 'bell' },
        { id: 'about',   label: '关于系统', icon: 'info' }
    ],

    active: 'profile',
    profile: {
        name: '管理员',
        email: 'admin@example.com',
        phone: '138****8888',
        bio: '系统管理员',
        avatar: '管'
    },
    prefs: {
        theme: 'light',
        primaryColor: '#4f46e5',
        sidebarCollapsed: false,
        enableNotif: true,
        enableSound: false,
        enableEmail: true
    },
    notifSettings: [
        { key: 'newUser',     label: '新用户注册',  desc: '当有新用户注册时通知我', enabled: true },
        { key: 'newOrder',    label: '新订单提醒',  desc: '当有新订单时通知我',     enabled: true },
        { key: 'systemError', label: '系统错误',    desc: '当系统发生错误时通知我', enabled: true },
        { key: 'lowStock',    label: '库存预警',    desc: '当商品库存不足时通知我', enabled: false },
        { key: 'weeklyReport',label: '周报推送',    desc: '每周一推送数据周报',     enabled: true }
    ],

    render() {
        this.load();
        const html = `
            <div class="page-header">
                <h1 class="page-title">系统设置</h1>
                <p class="page-subtitle">管理你的账户、偏好和系统配置</p>
            </div>
            <div class="settings-layout">
                <nav class="settings-nav">
                    ${this.sections.map(s => `
                        <div class="settings-nav-item ${s.id === this.active ? 'active' : ''}" data-section="${s.id}">
                            <span style="display:flex">${Icons[s.icon] || ''}</span>
                            <span>${s.label}</span>
                        </div>
                    `).join('')}
                </nav>
                <div class="settings-content" id="settingsContent">${this.renderSection(this.active)}</div>
            </div>
        `;
        document.getElementById('content').innerHTML = html;
        this.bindNav();
    },

    bindNav() {
        const self = this;
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.addEventListener('click', function() {
                self.active = this.dataset.section;
                document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('settingsContent').innerHTML = self.renderSection(self.active);
                self.bindSection();
            });
        });
        this.bindSection();
    },

    bindSection() {
        const self = this;
        if (this.active === 'profile') {
            const saveBtn = document.getElementById('btnSaveProfile');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    self.profile.name = document.getElementById('pf_name').value.trim();
                    self.profile.email = document.getElementById('pf_email').value.trim();
                    self.profile.phone = document.getElementById('pf_phone').value.trim();
                    self.profile.bio = document.getElementById('pf_bio').value.trim();
                    self.save();
                    Toast.success('个人资料已保存');
                });
            }
            const avatarInput = document.getElementById('avatarInput');
            if (avatarInput) {
                avatarInput.addEventListener('change', e => {
                    const f = e.target.files[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = ev => {
                        self.profile.avatar = `<img src="${ev.target.result}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
                        document.getElementById('profileAvatar').innerHTML = self.profile.avatar;
                        self.save();
                    };
                    reader.readAsDataURL(f);
                });
            }
        }
        if (this.active === 'security') {
            const pwdBtn = document.getElementById('btnChangePwd');
            if (pwdBtn) {
                pwdBtn.addEventListener('click', () => {
                    const oldPwd = document.getElementById('sec_oldPwd').value;
                    const newPwd = document.getElementById('sec_newPwd').value;
                    const cfmPwd = document.getElementById('sec_cfmPwd').value;
                    if (!oldPwd || !newPwd) return Toast.error('请填写完整');
                    if (newPwd !== cfmPwd) return Toast.error('两次新密码不一致');
                    if (newPwd.length < 6) return Toast.error('密码至少 6 位');
                    Toast.success('密码修改成功（演示）');
                    ['sec_oldPwd','sec_newPwd','sec_cfmPwd'].forEach(id => document.getElementById(id).value = '');
                });
            }
        }
        if (this.active === 'appearance') {
            document.querySelectorAll('.theme-card').forEach(card => {
                card.addEventListener('click', function() {
                    const t = this.dataset.theme;
                    self.prefs.theme = t;
                    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    document.documentElement.setAttribute('data-theme', t === 'light' ? '' : (t === 'dark' ? 'dark' : ''));
                    document.documentElement.setAttribute('data-theme-mode', t);
                    self.save();
                });
            });
            document.querySelectorAll('.color-swatch').forEach(sw => {
                sw.addEventListener('click', function() {
                    const c = this.dataset.color;
                    self.prefs.primaryColor = c;
                    document.documentElement.style.setProperty('--primary', c);
                    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    self.save();
                });
            });
        }
        if (this.active === 'notifications') {
            document.querySelectorAll('[data-notif-toggle]').forEach(tg => {
                tg.addEventListener('change', function() {
                    const k = this.dataset.notifToggle;
                    const item = self.notifSettings.find(n => n.key === k);
                    if (item) item.enabled = this.checked;
                    self.save();
                });
            });
        }
        if (this.active === 'about') {
            const btnClear = document.getElementById('btnClearAll');
            if (btnClear) {
                btnClear.addEventListener('click', () => {
                    Modal.confirm('确定要清空所有数据吗？此操作不可恢复。', () => {
                        Storage.clear();
                        Mock.reset();
                        Toast.success('已清空所有数据');
                        setTimeout(() => location.reload(), 600);
                    }, { title: '危险操作确认', confirmText: '确认清空' });
                });
            }
        }
    },

    renderSection(id) {
        if (id === 'profile') {
            return `
                <div class="settings-section">
                    <div class="settings-section-header">
                        <div class="settings-section-title">个人资料</div>
                        <div class="settings-section-desc">更新你的公开信息和头像</div>
                    </div>
                    <div class="settings-section-body">
                        <div class="settings-row">
                            <div class="settings-row-info">
                                <div class="settings-row-title">头像</div>
                                <div class="settings-row-desc">支持 JPG、PNG 格式，建议 200×200</div>
                            </div>
                            <div class="settings-row-control">
                                <div class="avatar-uploader">
                                    <div class="avatar" id="profileAvatar">${this.profile.avatar}</div>
                                    <div class="avatar-actions">
                                        <label class="btn btn-secondary btn-sm" style="cursor:pointer">
                                            <span>更换头像</span>
                                            <input type="file" id="avatarInput" accept="image/*" style="display:none">
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-item"><label class="form-label">姓名</label><input class="form-control" id="pf_name" value="${this.profile.name}"></div>
                        <div class="form-item"><label class="form-label">邮箱</label><input class="form-control" id="pf_email" type="email" value="${this.profile.email}"></div>
                        <div class="form-item"><label class="form-label">手机</label><input class="form-control" id="pf_phone" value="${this.profile.phone}"></div>
                        <div class="form-item"><label class="form-label">简介</label><textarea class="form-control" id="pf_bio" rows="3">${this.profile.bio}</textarea></div>
                        <div style="margin-top:16px;display:flex;gap:8px">
                            <button class="btn btn-primary" id="btnSaveProfile">保存修改</button>
                            <button class="btn btn-secondary" onclick="Settings.render()">取消</button>
                        </div>
                    </div>
                </div>
            `;
        }
        if (id === 'security') {
            return `
                <div class="settings-section">
                    <div class="settings-section-header">
                        <div class="settings-section-title">修改密码</div>
                        <div class="settings-section-desc">定期修改密码可以提高账户安全性</div>
                    </div>
                    <div class="settings-section-body">
                        <div class="form-item"><label class="form-label">当前密码</label><input class="form-control" type="password" id="sec_oldPwd"></div>
                        <div class="form-item"><label class="form-label">新密码</label><input class="form-control" type="password" id="sec_newPwd"></div>
                        <div class="form-item"><label class="form-label">确认新密码</label><input class="form-control" type="password" id="sec_cfmPwd"></div>
                        <div style="margin-top:16px">
                            <button class="btn btn-primary" id="btnChangePwd">修改密码</button>
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <div class="settings-section-header">
                        <div class="settings-section-title">登录设备</div>
                        <div class="settings-section-desc">已登录的设备列表</div>
                    </div>
                    <div class="settings-section-body">
                        <div class="settings-row">
                            <div class="settings-row-info">
                                <div class="settings-row-title">当前设备 · Windows 11 · Chrome</div>
                                <div class="settings-row-desc">上次登录：刚刚 · IP: 127.0.0.1</div>
                            </div>
                            <span class="badge badge-success">活跃</span>
                        </div>
                    </div>
                </div>
            `;
        }
        if (id === 'appearance') {
            const themes = [
                { id: 'light', name: '浅色' },
                { id: 'dark',  name: '深色' },
                { id: 'auto',  name: '跟随系统' }
            ];
            const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
            return `
                <div class="settings-section">
                    <div class="settings-section-header">
                        <div class="settings-section-title">外观主题</div>
                        <div class="settings-section-desc">选择你喜欢的界面风格</div>
                    </div>
                    <div class="settings-section-body">
                        <div class="theme-grid">
                            ${themes.map(t => `
                                <div class="theme-card theme-${t.id} ${this.prefs.theme === t.id ? 'active' : ''}" data-theme="${t.id}">
                                    <div class="theme-preview">
                                        <div class="theme-preview-sidebar"></div>
                                        <div class="theme-preview-main"></div>
                                    </div>
                                    <div class="theme-name">${t.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <div class="settings-section-header">
                        <div class="settings-section-title">主题色</div>
                        <div class="settings-section-desc">选择界面的主色调</div>
                    </div>
                    <div class="settings-section-body">
                        <div class="color-picker">
                            ${colors.map(c => `<div class="color-swatch ${this.prefs.primaryColor === c ? 'active' : ''}" data-color="${c}" style="background:${c}"></div>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        if (id === 'notifications') {
            return `
                <div class="settings-section">
                    <div class="settings-section-header">
                        <div class="settings-section-title">通知设置</div>
                        <div class="settings-section-desc">选择你希望接收的通知类型</div>
                    </div>
                    <div class="settings-section-body">
                        ${this.notifSettings.map(n => `
                            <div class="settings-row">
                                <div class="settings-row-info">
                                    <div class="settings-row-title">${n.label}</div>
                                    <div class="settings-row-desc">${n.desc}</div>
                                </div>
                                <div class="settings-row-control">
                                    <label class="switch">
                                        <input type="checkbox" data-notif-toggle="${n.key}" ${n.enabled ? 'checked' : ''}>
                                        <span class="switch-slider"></span>
                                    </label>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        if (id === 'about') {
            return `
                <div class="settings-section">
                    <div class="settings-section-header">
                        <div class="settings-section-title">关于系统</div>
                    </div>
                    <div class="settings-section-body">
                        <div class="settings-row">
                            <div class="settings-row-info"><div class="settings-row-title">系统名称</div></div>
                            <div class="settings-row-control" style="color:var(--text-2)">管理后台 v1.0.0</div>
                        </div>
                        <div class="settings-row">
                            <div class="settings-row-info"><div class="settings-row-title">技术栈</div></div>
                            <div class="settings-row-control" style="color:var(--text-2)">纯 HTML + CSS + JS（无依赖）</div>
                        </div>
                        <div class="settings-row">
                            <div class="settings-row-info"><div class="settings-row-title">存储</div></div>
                            <div class="settings-row-control" style="color:var(--text-2)">localStorage（演示）</div>
                        </div>
                        <div class="settings-row">
                            <div class="settings-row-info"><div class="settings-row-title">UI 设计</div></div>
                            <div class="settings-row-control" style="color:var(--text-2)">现代化、响应式、可定制</div>
                        </div>
                    </div>
                </div>
                <div class="settings-section danger-zone">
                    <div class="settings-section-header">
                        <div class="settings-section-title">危险操作</div>
                        <div class="settings-section-desc">以下操作不可恢复，请谨慎</div>
                    </div>
                    <div class="settings-section-body">
                        <div class="settings-row">
                            <div class="settings-row-info">
                                <div class="settings-row-title">清空所有数据</div>
                                <div class="settings-row-desc">清空 localStorage 中的所有业务数据</div>
                            </div>
                            <button class="btn btn-danger" id="btnClearAll">清空数据</button>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    load() {
        try {
            const data = JSON.parse(localStorage.getItem('admin_settings') || '{}');
            if (data.profile) this.profile = { ...this.profile, ...data.profile };
            if (data.prefs) this.prefs = { ...this.prefs, ...data.prefs };
            if (data.notifSettings) this.notifSettings = data.notifSettings;
        } catch (e) {}
        document.documentElement.style.setProperty('--primary', this.prefs.primaryColor);
        document.documentElement.setAttribute('data-theme-mode', this.prefs.theme);
    },

    save() {
        localStorage.setItem('admin_settings', JSON.stringify({
            profile: this.profile,
            prefs: this.prefs,
            notifSettings: this.notifSettings
        }));
    }
};