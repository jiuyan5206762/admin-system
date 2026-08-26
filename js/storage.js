/**
 * Storage - LocalStorage 封装 + 模拟数据生成
 */
const Storage = (function() {
    const PREFIX = 'admin_';

    function get(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            if (raw === null) return defaultValue;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Storage get error:', e);
            return defaultValue;
        }
    }

    function set(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Storage set error:', e);
            return false;
        }
    }

    function remove(key) {
        localStorage.removeItem(PREFIX + key);
    }

    function clear() {
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(PREFIX)) localStorage.removeItem(k);
        });
    }

    return { get, set, remove, clear };
})();

/**
 * MockData - 初始化模拟数据
 */
const MockData = {
    // 初始化所有模拟数据
    init() {
        if (!Storage.get('initialized')) {
            Storage.set('users', this.generateUsers());
            Storage.set('articles', this.generateArticles());
            Storage.set('orders', this.generateOrders());
            Storage.set('activities', this.generateActivities());
            Storage.set('initialized', true);
        }
    },

    // 用户数据
    generateUsers() {
        const names = ['张伟', '李娜', '王芳', '刘洋', '陈静', '杨帆', '黄敏', '周强',
                       '吴丽', '徐磊', '孙婷', '马云', '朱琳', '胡军', '林峰', '何婷婷'];
        const departments = ['技术部', '产品部', '运营部', '市场部', '财务部', '人事部'];
        const roles = ['管理员', '编辑', '运营', '访客'];
        const statuses = ['online', 'offline', 'busy', 'away'];

        const users = [];
        for (let i = 1; i <= 36; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            users.push({
                id: i,
                name: name,
                email: `user${i}@example.com`,
                phone: `138${String(10000000 + Math.floor(Math.random() * 89999999)).slice(0, 8)}`,
                department: departments[Math.floor(Math.random() * departments.length)],
                role: roles[Math.floor(Math.random() * roles.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: this.randomDate(new Date(2024, 0, 1), new Date()).toISOString().slice(0, 10),
                lastLogin: this.randomDate(new Date(2026, 0, 1), new Date()).toISOString().slice(0, 16).replace('T', ' ')
            });
        }
        return users;
    },

    // 文章数据
    generateArticles() {
        const titles = [
            '如何高效管理团队',
            '2026年产品趋势分析',
            '从零开始学习编程',
            '设计师必备的工具集',
            '运营增长的底层逻辑',
            '远程协作最佳实践',
            '数据可视化入门指南',
            '用户体验设计的五个原则',
            '敏捷开发流程优化',
            '如何写出好文档',
            '微服务架构实践',
            '云原生技术展望',
            '代码审查的十条军规',
            '前端性能优化技巧',
            'TypeScript 高级用法'
        ];
        const categories = ['技术', '产品', '运营', '设计', '管理'];
        const authors = ['张伟', '李娜', '王芳', '刘洋', '陈静'];
        const statuses = [
            { value: 'published', label: '已发布', type: 'success' },
            { value: 'draft', label: '草稿', type: 'default' },
            { value: 'pending', label: '待审核', type: 'warning' },
            { value: 'rejected', label: '已驳回', type: 'danger' }
        ];

        const articles = [];
        for (let i = 1; i <= 25; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            articles.push({
                id: i,
                title: titles[Math.floor(Math.random() * titles.length)] + `（第 ${i} 期）`,
                category: categories[Math.floor(Math.random() * categories.length)],
                author: authors[Math.floor(Math.random() * authors.length)],
                status: status.value,
                statusLabel: status.label,
                statusType: status.type,
                views: Math.floor(Math.random() * 10000),
                likes: Math.floor(Math.random() * 500),
                comments: Math.floor(Math.random() * 100),
                createdAt: this.randomDate(new Date(2025, 0, 1), new Date()).toISOString().slice(0, 10)
            });
        }
        return articles;
    },

    // 订单数据
    generateOrders() {
        const products = ['VIP 月卡', '高级会员年卡', '课程包', '工具集', '咨询服务'];
        const statuses = [
            { value: 'paid', label: '已支付', type: 'success' },
            { value: 'pending', label: '待支付', type: 'warning' },
            { value: 'shipped', label: '已发货', type: 'info' },
            { value: 'completed', label: '已完成', type: 'success' },
            { value: 'cancelled', label: '已取消', type: 'danger' },
            { value: 'refunded', label: '已退款', type: 'default' }
        ];

        const orders = [];
        for (let i = 1; i <= 50; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const product = products[Math.floor(Math.random() * products.length)];
            const amount = Math.floor(Math.random() * 9900 + 100) / 100;
            orders.push({
                id: 'ORD' + String(Date.now()).slice(-6) + String(i).padStart(4, '0'),
                product: product,
                amount: amount,
                customer: '用户' + Math.floor(Math.random() * 10000),
                status: status.value,
                statusLabel: status.label,
                statusType: status.type,
                createdAt: this.randomDate(new Date(2026, 6, 1), new Date()).toISOString().slice(0, 10)
            });
        }
        return orders;
    },

    // 活动日志
    generateActivities() {
        return [
            { id: 1, type: 'primary', icon: 'user', text: '新用户「张伟」注册成功', time: '5 分钟前' },
            { id: 2, type: 'success', icon: 'check', text: '订单 #ORD202608001 已完成支付', time: '12 分钟前' },
            { id: 3, type: 'warning', icon: 'edit', text: '文章《2026年产品趋势》被更新', time: '30 分钟前' },
            { id: 4, type: 'info',    icon: 'mail', text: '系统发送了 12 封通知邮件', time: '1 小时前' },
            { id: 5, type: 'success', icon: 'check', text: '数据库自动备份完成', time: '2 小时前' },
            { id: 6, type: 'danger',  icon: 'alert', text: '检测到 3 次异常登录尝试', time: '3 小时前' },
            { id: 7, type: 'primary', icon: 'user', text: '管理员「admin」修改了权限配置', time: '5 小时前' }
        ];
    },

    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    // 重置所有数据
    reset() {
        ['users', 'articles', 'orders', 'activities', 'initialized'].forEach(k => Storage.remove(k));
        this.init();
    }
};

// 生成商品数据
MockData.generateProducts = function() {
    const names = ['iPhone 15 Pro', 'MacBook Pro 14', 'iPad Air', 'AirPods Pro', 'Apple Watch 9',
                   '小米 14 Pro', '华为 Mate 60', 'ThinkPad X1', 'Surface Pro 9', 'Sony WH-1000XM5',
                   'Kindle Oasis', 'Switch OLED', 'PS5 Slim', 'Dyson V15', 'DJI Mini 4'];
    const categories = ['手机', '电脑', '平板', '耳机', '智能穿戴', '游戏', '家电', '配件'];
    const statuses = [
        { value: 'on_sale',  label: '在售',  type: 'success' },
        { value: 'off_sale', label: '下架',  type: 'default' },
        { value: 'low_stock',label: '库存不足', type: 'warning' },
        { value: 'out_stock',label: '缺货',  type: 'danger' }
    ];
    const products = [];
    for (let i = 1; i <= 30; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const price = Math.floor(Math.random() * 9990 + 99);
        products.push({
            id: 'P' + String(i).padStart(4, '0'),
            name: names[Math.floor(Math.random() * names.length)],
            category: cat,
            price: price,
            stock: Math.floor(Math.random() * 200),
            status: status.value,
            statusLabel: status.label,
            statusType: status.type,
            createdAt: this.randomDate(new Date(2025, 0, 1), new Date()).toISOString().slice(0, 10)
        });
    }
    return products;
};

// 生成消息数据
MockData.generateMessages = function() {
    const senders = ['系统', '张伟', '李娜', '客服-小王', '运营小李', '财务-刘', '技术支持'];
    const subjects = [
        '欢迎加入！', '订单确认', '账户安全提醒', '新功能上线通知',
        '系统维护通知', '重要：密码更新', '本月数据报告', '客户反馈',
        '退款申请', '合作邀请', '版本更新 v2.1.0', '节日活动'
    ];
    const types = [
        { value: 'system',  label: '系统', type: 'info' },
        { value: 'user',    label: '用户', type: 'primary' },
        { value: 'order',   label: '订单', type: 'success' },
        { value: 'warning', label: '警告', type: 'warning' }
    ];
    const messages = [];
    for (let i = 1; i <= 40; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const read = Math.random() > 0.4;
        messages.push({
            id: i,
            sender: senders[Math.floor(Math.random() * senders.length)],
            subject: subjects[Math.floor(Math.random() * subjects.length)] + ` (#${i})`,
            preview: '这是一条模拟消息的预览内容，用于展示列表效果...',
            type: type.value,
            typeLabel: type.label,
            typeType: type.type,
            read: read,
            createdAt: this.randomDate(new Date(2026, 6, 1), new Date()).toISOString().slice(0, 16).replace('T', ' ')
        });
    }
    return messages;
};

// 修改 init 加入 products/messages
MockData.init = function() {
    if (!Storage.get('initialized')) {
        Storage.set('users',     this.generateUsers());
        Storage.set('articles',  this.generateArticles());
        Storage.set('orders',    this.generateOrders());
        Storage.set('activities',this.generateActivities());
        Storage.set('products',  this.generateProducts());
        Storage.set('messages',  this.generateMessages());
        Storage.set('initialized',true);
    }
};

// 初始化模拟数据
MockData.init();

/**
 * Mock - list.js 期望的简化数据接口
 * ListPage.render(Mock.users()) 等用法
 */
const Mock = {
    users:    () => Storage.get('users', []),
    articles: () => Storage.get('articles', []),
    orders:   () => Storage.get('orders', []),
    products: () => Storage.get('products', []),
    messages: () => Storage.get('messages', []),
    reset:    () => MockData.reset()
};
