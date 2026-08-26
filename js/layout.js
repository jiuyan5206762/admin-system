/**
 * Layout - 主布局组件（侧边栏 + 顶栏）
 * 支持 SPA（hash 路由）+ 多页面两种用法
 */
const Layout = {
    MENU: [
        {
            section: '工作台',
            items: [
                { id: 'dashboard', text: '数据看板', icon: 'dashboard', hash: '#/dashboard' }
            ]
        },
        {
            section: '内容管理',
            items: [
                { id: 'users',     text: '用户管理', icon: 'users',   hash: '#/users' },
                { id: 'articles',  text: '文章管理', icon: 'article', hash: '#/articles' },
                { id: 'orders',    text: '订单管理', icon: 'order',   hash: '#/orders' },
                { id: 'products',  text: '商品管理', icon: 'database',hash: '#/products' },
                { id: 'messages',  text: '消息中心', icon: 'mail',    hash: '#/messages' }
            ]
        },
        {
            section: '系统',
            items: [
                { id: 'settings',  text: '系统设置', icon: 'setting', hash: '#/settings' }
            ]
        }
    ],

    /**
     * 渲染布局。两种调用：
     *  1) Layout.render()                       -> 用于 SPA index.html
     *  2) Layout.render(activeMenuId, breadcrumb) -> 用于多页面 list.html
     */
    render() {
        if (!Auth.getUser()) return '';
        // 参数兼容
        let activeMenuId = '';
        let breadcrumb = [];
        if (arguments.length === 1) activeMenuId = arguments[0];
        else if (arguments.length >= 2) { activeMenuId = arguments[0]; breadcrumb = arguments[1]; }
        if (!activeMenuId) {
            const hash = (location.hash || '#/dashboard').replace(/^#\/?/, '');
            activeMenuId = hash;
        }

        const user = Auth.getUser();
        const self = this;

        const menuHtml = this.MENU.map(function(section) {
            const itemsHtml = section.items.map(function(item) {
                const isActive = item.id === activeMenuId;
                return '<a class="menu-item' + (isActive ? ' active' : '') + '" href="' + item.hash + '">' +
                    '<span class="menu-icon">' + (Icons[item.icon] || '') + '</span>' +
                    '<span class="menu-text">' + item.text + '</span>' +
                '</a>';
            }).join('');
            return '<div class="menu-section">' +
                '<div class="menu-section-title">' + section.section + '</div>' +
                itemsHtml +
            '</div>';
        }).join('');

        const breadcrumbHtml = this.renderBreadcrumb(breadcrumb);

        return '' +
        '<aside class="sidebar" id="sidebar">' +
            '<div class="sidebar-header">' +
                '<div class="sidebar-logo">' +
                    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">' +
                        '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>' +
                    '</svg>' +
                '</div>' +
                '<div class="sidebar-title">管理后台</div>' +
            '</div>' +
            '<nav class="sidebar-menu">' + menuHtml + '</nav>' +
            '<div class="sidebar-footer">' +
                '<div class="user-card">' +
                    '<div class="avatar">' + user.avatar + '</div>' +
                    '<div class="user-info">' +
                        '<div class="user-name">' + user.name + '</div>' +
                        '<div class="user-role">' + user.role + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</aside>' +
        '<div class="sidebar-mask" id="sidebarMask"></div>' +
        '<div class="main-wrapper">' +
            '<header class="header">' +
                '<button class="header-toggle" id="toggleDesktop" aria-label="折叠菜单">' +
                    Icons.menu +
                '</button>' +
                '<button class="header-toggle mobile-only" id="toggleMobile" aria-label="打开菜单">' +
                    Icons.menu +
                '</button>' +
                '<nav class="breadcrumb">' + breadcrumbHtml + '</nav>' +
                '<div class="header-actions">' +
                    '<button class="header-icon-btn" id="refreshBtn" title="刷新">' +
                        Icons.refresh +
                    '</button>' +
                    '<button class="header-icon-btn" title="通知">' +
                        Icons.bell +
                        '<span class="badge-dot"></span>' +
                    '</button>' +
                    '<div class="user-dropdown">' +
                        '<button class="user-trigger" id="userTrigger">' +
                            '<div class="avatar">' + user.avatar + '</div>' +
                            '<span class="user-trigger-name">' + user.name + '</span>' +
                        '</button>' +
                        '<div class="dropdown-menu" id="userDropdown">' +
                            '<div class="dropdown-item" data-action="profile">' +
                                Icons.user + '<span>个人资料</span>' +
                            '</div>' +
                            '<div class="dropdown-item" data-action="settings">' +
                                Icons.setting + '<span>账户设置</span>' +
                            '</div>' +
                            '<div class="dropdown-divider"></div>' +
                            '<div class="dropdown-item danger" data-action="logout">' +
                                Icons.logout + '<span>退出登录</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</header>' +
            '<main class="content" id="content"></main>' +
        '</div>';
    },

    /**
     * 兼容方法：mount() / bind() —— 实际不做 DOM 写入
     * 三种调用：
     *  1) Layout.mount(menuId, breadcrumb)        // SPA
     *  2) Layout.mount(container, menuId, breadcrumb) // 多页面 list.html
     *  3) Layout.mount()                          // 旧多页面 list.html 调用
     */
    mount() {
        // 旧 API：Layout.mount(container, menuId, breadcrumb)
        if (arguments[0] && typeof arguments[0] === 'object' && arguments[0].nodeType === 1) {
            // 第一参数是 DOM 节点，则按旧 API：写布局
            const container = arguments[0];
            const menuId = arguments[1] || '';
            const breadcrumb = arguments[2] || [];
            container.innerHTML = this.render(menuId, breadcrumb);
            this.bind();
            return;
        }
        // 新 API：只绑定
        if (!Auth.getUser()) {
            location.href = 'login.html';
            return;
        }
        this.bind();
    },

    /**
     * 兼容方法：bind() —— 绑定顶栏/侧边栏交互
     */
    bind() {
        this.bindEvents();
    },

    renderBreadcrumb(items) {
        const homeIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
        let html = '<a href="#/dashboard" class="breadcrumb-link">' + homeIcon + '<span>首页</span></a>';
        (items || []).forEach(function(item, idx) {
            html += '<span class="sep">/</span>';
            if (item.url && idx < items.length - 1) {
                html += '<a href="' + item.url + '">' + item.text + '</a>';
            } else {
                html += '<span class="current">' + item.text + '</span>';
            }
        });
        return html;
    },

    bindEvents() {
        const sidebar = document.getElementById('sidebar');
        const toggleDesktop = document.getElementById('toggleDesktop');
        const toggleMobile = document.getElementById('toggleMobile');
        const mask = document.getElementById('sidebarMask');
        const userTrigger = document.getElementById('userTrigger');
        const userDropdown = document.getElementById('userDropdown');
        const refreshBtn = document.getElementById('refreshBtn');

        if (toggleDesktop) {
            toggleDesktop.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
            });
        }
        if (toggleMobile) {
            toggleMobile.addEventListener('click', function(e) {
                e.stopPropagation();
                sidebar.classList.add('mobile-open');
            });
        }
        if (mask) {
            mask.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
            });
        }
        if (userTrigger) {
            userTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('open');
            });
        }
        document.addEventListener('click', function() {
            if (userDropdown) userDropdown.classList.remove('open');
        });
        if (userDropdown) {
            userDropdown.querySelectorAll('.dropdown-item').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const action = item.getAttribute('data-action');
                    if (action === 'logout') {
                        Modal.confirm('确定要退出登录吗？', function() {
                            Auth.logout();
                            location.href = 'login.html';
                        }, { title: '退出确认' });
                    } else if (action === 'profile') {
                        location.hash = '#/settings';
                    } else if (action === 'settings') {
                        location.hash = '#/settings';
                    }
                });
            });
        }
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                const icon = refreshBtn.querySelector('svg');
                if (icon) icon.style.animation = 'spin 0.6s linear';
                setTimeout(function() {
                    if (typeof router === 'function') router();
                    else location.reload();
                }, 300);
            });
        }
    }
};

(function() {
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
})();