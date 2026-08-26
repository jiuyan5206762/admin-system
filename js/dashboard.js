/**
 * Dashboard - 数据看板
 * 包含：欢迎卡片、KPI、柱状图、饼图、活动流、快捷入口
 */
const Dashboard = {
    // 月度数据（演示）
    monthlyData: [
        { month: '1月', users: 220, orders: 180 },
        { month: '2月', users: 280, orders: 220 },
        { month: '3月', users: 350, orders: 290 },
        { month: '4月', users: 410, orders: 340 },
        { month: '5月', users: 480, orders: 410 },
        { month: '6月', users: 520, orders: 460 },
        { month: '7月', users: 610, orders: 520 }
    ],
    // 流量来源（演示）
    trafficData: [
        { label: '直接访问', value: 320, color: '#4f46e5' },
        { label: '搜索引擎', value: 280, color: '#10b981' },
        { label: '社交媒体', value: 180, color: '#f59e0b' },
        { label: '外部链接', value: 120, color: '#ef4444' },
        { label: '邮件营销', value: 80,  color: '#3b82f6' }
    ],
    // 活动流
    activities: [
        { icon: 'user',  title: '新用户 张三 注册了账号',   meta: '系统 · 2 分钟前' },
        { icon: 'check', title: '订单 #20240825-001 已完成', meta: '订单 · 15 分钟前' },
        { icon: 'edit',  title: '管理员 更新了「系统设置」',  meta: '设置 · 1 小时前' },
        { icon: 'mail',  title: '5 条用户反馈等待处理',     meta: '消息 · 2 小时前' },
        { icon: 'alert', title: '商品库存预警：iPhone 15',   meta: '商品 · 3 小时前' },
        { icon: 'user',  title: '新用户 李四 注册了账号',   meta: '系统 · 5 小时前' },
        { icon: 'check', title: '订单 #20240825-002 已支付', meta: '订单 · 6 小时前' }
    ],

    render() {
        const user = Auth.getUser();
        const hour = new Date().getHours();
        const greet = hour < 6 ? '凌晨好' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

        document.getElementById('content').innerHTML = `
            <div class="welcome-card">
                <div class="welcome-content">
                    <div class="welcome-title">${greet}，${user.name} 👋</div>
                    <div class="welcome-subtitle">今天是 ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}，祝你有美好的一天</div>
                </div>
                <div class="welcome-stats">
                    <div class="welcome-stat">
                        <div class="welcome-stat-num">2,847</div>
                        <div class="welcome-stat-label">总用户数</div>
                    </div>
                    <div class="welcome-stat">
                        <div class="welcome-stat-num">1,256</div>
                        <div class="welcome-stat-label">总订单数</div>
                    </div>
                    <div class="welcome-stat">
                        <div class="welcome-stat-num">¥ 89.6K</div>
                        <div class="welcome-stat-label">月营收</div>
                    </div>
                </div>
            </div>

            <div class="stat-grid">
                ${this.renderKPI('总用户数', '2,847', '+12.5%', 'up', 'user', 'primary')}
                ${this.renderKPI('订单总数', '1,256', '+8.2%', 'up', 'order', 'success')}
                ${this.renderKPI('月营收', '¥ 89,623', '-2.4%', 'down', 'article', 'warning')}
                ${this.renderKPI('待处理事项', '23', '+5', 'up', 'mail', 'danger')}
            </div>

            <div class="chart-row">
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">数据趋势</div>
                            <div class="card-subtitle">近 7 个月用户与订单对比</div>
                        </div>
                        <div class="chart-legend">
                            <div class="legend-item"><span class="legend-dot primary"></span>新增用户</div>
                            <div class="legend-item"><span class="legend-dot success"></span>订单数</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">${this.renderBarChart()}</div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">流量来源</div>
                            <div class="card-subtitle">本月访问分布</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="pie-container">${this.renderPieChart()}</div>
                    </div>
                </div>
            </div>

            <div class="chart-row">
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">最近活动</div>
                            <div class="card-subtitle">系统最新动态</div>
                        </div>
                        <button class="btn btn-sm btn-ghost">查看全部</button>
                    </div>
                    <div class="card-body">
                        <div class="activity-list">
                            ${this.activities.map(a => `
                                <div class="activity-item">
                                    <div class="activity-icon ${a.icon}">${Icons[a.icon] || ''}</div>
                                    <div class="activity-content">
                                        <div class="activity-title">${a.title}</div>
                                        <div class="activity-meta">${a.meta}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">快捷操作</div>
                            <div class="card-subtitle">常用功能入口</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="quick-grid">
                            <a class="quick-item" href="#/users">
                                <div class="quick-icon">${Icons.user}</div>
                                <div class="quick-label">用户管理</div>
                            </a>
                            <a class="quick-item" href="#/orders">
                                <div class="quick-icon">${Icons.order}</div>
                                <div class="quick-label">订单管理</div>
                            </a>
                            <a class="quick-item" href="#/products">
                                <div class="quick-icon">${Icons.dashboard}</div>
                                <div class="quick-label">商品管理</div>
                            </a>
                            <a class="quick-item" href="#/articles">
                                <div class="quick-icon">${Icons.article}</div>
                                <div class="quick-label">内容管理</div>
                            </a>
                            <a class="quick-item" href="#/messages">
                                <div class="quick-icon">${Icons.mail}</div>
                                <div class="quick-label">消息中心</div>
                            </a>
                            <a class="quick-item" href="#/settings">
                                <div class="quick-icon">${Icons.setting}</div>
                                <div class="quick-label">系统设置</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderKPI(label, value, trend, dir, icon, type) {
        const arrow = dir === 'up' ? Icons.arrowUp : Icons.arrowDown;
        return `
            <div class="stat-card ${type}">
                <div class="stat-header">
                    <div class="stat-label">${label}</div>
                    <div class="stat-icon">${Icons[icon] || ''}</div>
                </div>
                <div class="stat-value">${value}</div>
                <div class="stat-trend ${dir}">
                    <span class="trend-arrow">${arrow}</span>
                    较上月 ${trend}
                </div>
            </div>
        `;
    },

    renderBarChart() {
        const max = Math.max(...this.monthlyData.flatMap(d => [d.users, d.orders]));
        return `<div class="bar-chart">${this.monthlyData.map(d => `
            <div class="bar-group">
                <div class="bar-pair">
                    <div class="bar primary" style="height:${(d.users / max) * 100}%">
                        <span class="bar-value">${d.users}</span>
                    </div>
                    <div class="bar success" style="height:${(d.orders / max) * 100}%">
                        <span class="bar-value">${d.orders}</span>
                    </div>
                </div>
                <div class="bar-label">${d.month}</div>
            </div>
        `).join('')}</div>`;
    },

    renderPieChart() {
        const total = this.trafficData.reduce((s, d) => s + d.value, 0);
        const size = 160, r = 60, cx = size/2, cy = size/2;
        const C = 2 * Math.PI * r;
        let offset = 0;
        const segments = this.trafficData.map(d => {
            const len = (d.value / total) * C;
            const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="22"
                stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
            offset += len;
            return seg;
        }).join('');
        return `
            <div class="pie-chart">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${segments}</svg>
                <div class="pie-center">
                    <div class="pie-center-num">${total}</div>
                    <div class="pie-center-label">总访问</div>
                </div>
            </div>
            <div class="pie-legend">
                ${this.trafficData.map(d => `
                    <div class="pie-legend-item">
                        <div class="left">
                            <span class="color-dot" style="background:${d.color}"></span>
                            <span>${d.label}</span>
                        </div>
                        <span class="value">${d.value} (${Math.round(d.value/total*100)}%)</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
};