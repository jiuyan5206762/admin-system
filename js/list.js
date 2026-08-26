/**
 * ListPage - 通用列表管理（支持用户、文章、订单）
 */
const ListPage = {
    // 各类型列表配置
    configs: {
        users: {
            menuId: 'users',
            title: '用户管理',
            storageKey: 'users',
            searchFields: ['name', 'email', 'phone'],
            filters: [
                { key: 'department', label: '全部部门', options: ['技术部', '产品部', '运营部', '市场部', '财务部', '人事部'] },
                { key: 'role',       label: '全部角色', options: ['管理员', '编辑', '运营', '访客'] },
                { key: 'status',     label: '全部状态', options: [
                    { value: 'online',  label: '在线' },
                    { value: 'offline', label: '离线' },
                    { value: 'busy',    label: '忙碌' },
                    { value: 'away',    label: '离开' }
                ]}
            ],
            columns: [
                { key: 'name',       label: '姓名', render: r => renderUserCell(r) },
                { key: 'email',      label: '邮箱' },
                { key: 'phone',      label: '手机' },
                { key: 'department', label: '部门' },
                { key: 'role',       label: '角色', render: r => `<span class="badge badge-info">${r.role}</span>` },
                { key: 'status',     label: '状态', render: r => renderStatus(r.status) },
                { key: 'lastLogin',  label: '最后登录' },
                { key: 'createdAt',  label: '注册日期' }
            ],
            formFields: [
                { key: 'name',       label: '姓名',     type: 'text',     required: true, placeholder: '请输入姓名' },
                { key: 'email',      label: '邮箱',     type: 'email',    required: true, placeholder: 'user@example.com' },
                { key: 'phone',      label: '手机',     type: 'tel',      required: true, placeholder: '11位手机号' },
                { key: 'department', label: '部门',     type: 'select',   required: true, options: ['技术部', '产品部', '运营部', '市场部', '财务部', '人事部'] },
                { key: 'role',       label: '角色',     type: 'select',   required: true, options: ['管理员', '编辑', '运营', '访客'] },
                { key: 'status',     label: '状态',     type: 'select',   required: true, options: [
                    { value: 'online',  label: '在线' },
                    { value: 'offline', label: '离线' },
                    { value: 'busy',    label: '忙碌' },
                    { value: 'away',    label: '离开' }
                ]},
                { key: 'bio',        label: '简介',     type: 'textarea', required: false, placeholder: '可选' }
            ]
        },

        articles: {
            menuId: 'articles',
            title: '文章管理',
            storageKey: 'articles',
            searchFields: ['title', 'author', 'category'],
            filters: [
                { key: 'category', label: '全部分类', options: ['技术', '产品', '运营', '设计', '管理'] },
                { key: 'status',   label: '全部状态', options: [
                    { value: 'published', label: '已发布' },
                    { value: 'draft',     label: '草稿' },
                    { value: 'pending',   label: '待审核' },
                    { value: 'rejected',  label: '已驳回' }
                ]}
            ],
            columns: [
                { key: 'id',       label: 'ID',       width: 60 },
                { key: 'title',    label: '标题' },
                { key: 'category', label: '分类' },
                { key: 'author',   label: '作者' },
                { key: 'status',   label: '状态', render: r => `<span class="badge badge-${r.statusType}">${r.statusLabel}</span>` },
                { key: 'views',    label: '浏览',     render: r => r.views.toLocaleString() },
                { key: 'likes',    label: '点赞',     render: r => r.likes.toLocaleString() },
                { key: 'comments', label: '评论',     render: r => r.comments },
                { key: 'createdAt', label: '发布日期' }
            ],
            formFields: [
                { key: 'title',    label: '标题',   type: 'text',     required: true },
                { key: 'category', label: '分类',   type: 'select',   required: true, options: ['技术', '产品', '运营', '设计', '管理'] },
                { key: 'author',   label: '作者',   type: 'text',     required: true },
                { key: 'status',   label: '状态',   type: 'select',   required: true, options: [
                    { value: 'published', label: '已发布' },
                    { value: 'draft',     label: '草稿' },
                    { value: 'pending',   label: '待审核' }
                ]},
                { key: 'content',  label: '内容',   type: 'textarea', required: true, rows: 6 }
            ]
        },

        orders: {
            menuId: 'orders',
            title: '订单管理',
            storageKey: 'orders',
            searchFields: ['id', 'product', 'customer'],
            filters: [
                { key: 'status', label: '全部状态', options: [
                    { value: 'paid',      label: '已支付' },
                    { value: 'pending',   label: '待支付' },
                    { value: 'shipped',   label: '已发货' },
                    { value: 'completed', label: '已完成' },
                    { value: 'cancelled', label: '已取消' },
                    { value: 'refunded',  label: '已退款' }
                ]}
            ],
            columns: [
                { key: 'id',       label: '订单号',  width: 180 },
                { key: 'product',  label: '商品' },
                { key: 'customer', label: '客户' },
                { key: 'amount',   label: '金额',   render: r => `<strong>¥${r.amount.toFixed(2)}</strong>` },
                { key: 'status',   label: '状态',   render: r => `<span class="badge badge-${r.statusType}">${r.statusLabel}</span>` },
                { key: 'createdAt', label: '日期' }
            ],
            formFields: [
                { key: 'product',  label: '商品',   type: 'text',     required: true },
                { key: 'customer', label: '客户',   type: 'text',     required: true },
                { key: 'amount',   label: '金额',   type: 'number',   required: true, step: '0.01' },
                { key: 'status',   label: '状态',   type: 'select',   required: true, options: [
                    { value: 'paid',      label: '已支付' },
                    { value: 'pending',   label: '待支付' },
                    { value: 'shipped',   label: '已发货' },
                    { value: 'completed', label: '已完成' },
                    { value: 'cancelled', label: '已取消' }
                ]},
                { key: 'remark',   label: '备注',   type: 'textarea', required: false }
            ]
        },

        settings: {
            menuId: 'settings',
            title: '系统设置',
            storageKey: 'settings',
            searchFields: ['key'],
            filters: [],
            columns: [
                { key: 'key',   label: '配置项' },
                { key: 'value', label: '值' },
                { key: 'desc',  label: '说明' }
            ],
            formFields: [
                { key: 'key',   label: '配置项', type: 'text',     required: true },
                { key: 'value', label: '值',     type: 'text',     required: true },
                { key: 'desc',  label: '说明',   type: 'textarea', required: false }
            ]
        },

        products: {
            menuId: 'products',
            title: '商品管理',
            storageKey: 'products',
            searchFields: ['id', 'name', 'category'],
            filters: [
                { key: 'category', label: '全部分类', options: ['手机', '电脑', '平板', '耳机', '智能穿戴', '游戏', '家电', '配件'] },
                { key: 'status',   label: '全部状态', options: [
                    { value: 'on_sale',   label: '在售' },
                    { value: 'off_sale',  label: '下架' },
                    { value: 'low_stock', label: '库存不足' },
                    { value: 'out_stock', label: '缺货' }
                ]}
            ],
            columns: [
                { key: 'id',       label: '编号',    width: 100 },
                { key: 'name',     label: '商品名称' },
                { key: 'category', label: '分类' },
                { key: 'price',    label: '价格',   render: r => `<strong>¥${r.price.toFixed(2)}</strong>` },
                { key: 'stock',    label: '库存',   render: r => r.stock < 10 ? `<span class="text-danger">${r.stock}</span>` : r.stock },
                { key: 'status',   label: '状态',   render: r => `<span class="badge badge-${r.statusType}">${r.statusLabel}</span>` },
                { key: 'createdAt',label: '上架日期' }
            ],
            formFields: [
                { key: 'name',     label: '商品名称', type: 'text',   required: true },
                { key: 'category', label: '分类',     type: 'select', required: true, options: ['手机', '电脑', '平板', '耳机', '智能穿戴', '游戏', '家电', '配件'] },
                { key: 'price',    label: '价格',     type: 'number', required: true, step: '0.01' },
                { key: 'stock',    label: '库存',     type: 'number', required: true },
                { key: 'status',   label: '状态',     type: 'select', required: true, options: [
                    { value: 'on_sale',   label: '在售' },
                    { value: 'off_sale',  label: '下架' },
                    { value: 'low_stock', label: '库存不足' },
                    { value: 'out_stock', label: '缺货' }
                ]},
                { key: 'desc',     label: '描述',     type: 'textarea', required: false, rows: 4 }
            ]
        },

        messages: {
            menuId: 'messages',
            title: '消息中心',
            storageKey: 'messages',
            searchFields: ['sender', 'subject'],
            filters: [
                { key: 'type', label: '全部类型', options: [
                    { value: 'system',  label: '系统' },
                    { value: 'user',    label: '用户' },
                    { value: 'order',   label: '订单' },
                    { value: 'warning', label: '警告' }
                ]},
                { key: 'read', label: '状态',    options: [
                    { value: 'true',  label: '已读' },
                    { value: 'false', label: '未读' }
                ]}
            ],
            columns: [
                { key: 'id',        label: 'ID',       width: 60 },
                { key: 'sender',    label: '发件人' },
                { key: 'subject',   label: '主题',     render: r => r.read ? r.subject : `<strong>● ${r.subject}</strong>` },
                { key: 'type',      label: '类型',     render: r => `<span class="badge badge-${r.typeType}">${r.typeLabel}</span>` },
                { key: 'read',      label: '状态',     render: r => r.read ? '<span class="badge badge-default">已读</span>' : '<span class="badge badge-warning">未读</span>' },
                { key: 'createdAt', label: '时间' }
            ],
            formFields: [
                { key: 'sender',  label: '发件人', type: 'text',   required: true },
                { key: 'subject', label: '主题',   type: 'text',   required: true },
                { key: 'content', label: '内容',   type: 'textarea', required: true, rows: 6 },
                { key: 'type',    label: '类型',   type: 'select', required: true, options: [
                    { value: 'system',  label: '系统' },
                    { value: 'user',    label: '用户' },
                    { value: 'order',   label: '订单' },
                    { value: 'warning', label: '警告' }
                ]}
            ]
        }
    },

    getConfig(type) {
        return this.configs[type] ? { ...this.configs[type], type: type } : null;
    },

    /**
     * 渲染列表
     */
    render(config) {
        const state = {
            config: config,
            data: Storage.get(config.storageKey, []),
            page: 1,
            pageSize: 10,
            search: '',
            filters: {},
            selected: new Set(),
            editing: null
        };

        // 把 settings 类型的 mock 数据
        if (config.type === 'settings' && state.data.length === 0) {
            state.data = [
                { id: 1, key: 'site_name',     value: '管理后台', desc: '系统名称' },
                { id: 2, key: 'site_logo',     value: '/logo.png', desc: '站点 Logo' },
                { id: 3, key: 'theme',         value: 'light',  desc: '默认主题（light/dark）' },
                { id: 4, key: 'page_size',     value: '10',     desc: '默认分页大小' },
                { id: 5, key: 'allow_register', value: 'false', desc: '是否允许用户注册' }
            ];
            Storage.set('settings', state.data);
        }

        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">${config.title}</h1>
                <p class="page-subtitle">管理和维护所有${config.title}数据</p>
            </div>

            <div class="list-toolbar">
                <div class="toolbar-left">
                    <div class="search-box">
                        <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-3);display:flex;pointer-events:none">${Icons.search}</span>
                        <input class="form-control" type="text" id="searchInput" placeholder="搜索...">
                    </div>
                    ${config.filters.map(f => renderFilter(f)).join('')}
                </div>
                <div class="toolbar-right">
                    <button class="btn btn-secondary btn-sm" id="btnRefresh" title="刷新">${Icons.refresh}<span>刷新</span></button>
                    <button class="btn btn-secondary btn-sm" id="btnExport" title="导出">${Icons.download}<span>导出</span></button>
                    <button class="btn btn-primary btn-sm" id="btnAdd">${Icons.plus}<span>新增${config.title.slice(0, 2)}</span></button>
                </div>
            </div>

            <div class="bulk-bar hidden" id="bulkActions">
                <span>已选择 <span class="selected-count" id="selectedCount">0</span> 项</span>
                <button class="btn btn-sm btn-secondary" id="btnBulkDelete">批量删除</button>
                <span class="spacer"></span>
                <button class="btn btn-sm btn-ghost" id="btnClearSel">取消</button>
            </div>

            <div class="list-table">
                <table>
                    <thead>
                        <tr>
                            <th style="width:40px"><input type="checkbox" id="checkAll"></th>
                            ${config.columns.map(c => `<th>${c.label}</th>`).join('')}
                            <th style="width:160px">操作</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody"></tbody>
                </table>
            </div>

            <div class="pagination">
                <div class="page-info" id="pageInfo"></div>
                <div class="page-controls" id="pageControls"></div>
                <div class="page-size">
                    每页
                    <select id="pageSizeSel">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    条
                </div>
            </div>
        `;

        this.bindEvents(state);
        this.refresh(state);
    },

    bindEvents(state) {
        const self = this;

        // 搜索
        document.getElementById('searchInput').addEventListener('input', function() {
            state.search = this.value.trim();
            state.page = 1;
            self.refresh(state);
        });

        // 筛选
        state.config.filters.forEach(f => {
            const el = document.getElementById('filter_' + f.key);
            if (el) {
                el.addEventListener('change', function() {
                    state.filters[f.key] = this.value;
                    state.page = 1;
                    self.refresh(state);
                });
            }
        });

        // 刷新
        document.getElementById('btnRefresh').addEventListener('click', function() {
            state.data = Storage.get(state.config.storageKey, []);
            self.refresh(state);
            Toast.success('已刷新');
        });

        // 导出
        document.getElementById('btnExport').addEventListener('click', function() {
            self.exportData(state);
        });

        // 新增
        document.getElementById('btnAdd').addEventListener('click', function() {
            self.openForm(state, null);
        });

        // 全选
        document.getElementById('checkAll').addEventListener('change', function() {
            const checked = this.checked;
            state.selected.clear();
            document.querySelectorAll('.row-check').forEach(cb => {
                cb.checked = checked;
                if (checked) state.selected.add(parseInt(cb.dataset.id));
            });
            self.updateBulkUI(state);
        });

        // 取消选择
        document.getElementById('btnClearSel').addEventListener('click', function() {
            state.selected.clear();
            document.querySelectorAll('.row-check').forEach(cb => cb.checked = false);
            document.getElementById('checkAll').checked = false;
            self.updateBulkUI(state);
        });

        // 批量删除
        document.getElementById('btnBulkDelete').addEventListener('click', function() {
            if (state.selected.size === 0) return;
            Modal.confirm(`确定要删除选中的 ${state.selected.size} 项吗？此操作不可恢复。`, function() {
                state.data = state.data.filter(d => !state.selected.has(d.id));
                Storage.set(state.config.storageKey, state.data);
                state.selected.clear();
                self.refresh(state);
                Toast.success('批量删除成功');
            }, { title: '批量删除', confirmText: '删除' });
        });

        // 每页大小
        const pageSizeSel = document.getElementById('pageSizeSel');
        if (pageSizeSel) {
            pageSizeSel.value = state.pageSize;
            pageSizeSel.addEventListener('change', function() {
                state.pageSize = parseInt(this.value) || 10;
                state.page = 1;
                self.refresh(state);
            });
        }
    },

    /**
     * 刷新表格
     */
    refresh(state) {
        // 应用搜索 + 筛选
        let filtered = state.data.slice();

        if (state.search) {
            const kw = state.search.toLowerCase();
            filtered = filtered.filter(item =>
                state.config.searchFields.some(f => String(item[f] || '').toLowerCase().includes(kw))
            );
        }
        Object.keys(state.filters).forEach(key => {
            const val = state.filters[key];
            if (!val) return;
            filtered = filtered.filter(item => {
                // 兼容 boolean 与字符串（如 messages.read）
                if (typeof item[key] === 'boolean') {
                    return String(item[key]) === val;
                }
                return item[key] === val;
            });
        });

        // 分页
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
        if (state.page > totalPages) state.page = totalPages;
        const start = (state.page - 1) * state.pageSize;
        const pageData = filtered.slice(start, start + state.pageSize);

        // 渲染表格
        const tbody = document.getElementById('tableBody');
        if (pageData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${state.config.columns.length + 2}">
                <div class="empty-state">
                    <div class="empty-state-title">暂无数据</div>
                    <div class="empty-state-desc">试试调整筛选条件或新增数据</div>
                </div>
            </td></tr>`;
        } else {
            tbody.innerHTML = pageData.map(row => {
                const checked = state.selected.has(row.id);
                const cells = state.config.columns.map(col => {
                    const val = col.render ? col.render(row) : escapeHtml(String(row[col.key] ?? ''));
                    return `<td>${val}</td>`;
                }).join('');
                return `<tr>
                    <td><input type="checkbox" class="row-check" data-id="${row.id}" ${checked ? 'checked' : ''}></td>
                    ${cells}
                    <td>
                        <div class="actions">
                            <button class="btn btn-sm btn-ghost btn-icon" data-action="view" data-id="${row.id}" title="查看">${Icons.eye}</button>
                            <button class="btn btn-sm btn-ghost btn-icon" data-action="edit" data-id="${row.id}" title="编辑">${Icons.edit}</button>
                            <button class="btn btn-sm btn-ghost btn-icon" data-action="delete" data-id="${row.id}" title="删除">${Icons.trash}</button>
                        </div>
                    </td>
                </tr>`;
            }).join('');
        }

        // 绑定行内事件
        tbody.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const action = btn.dataset.action;
                const row = state.data.find(r => r.id === id);
                if (!row) return;
                if (action === 'view') this.openView(state, row);
                else if (action === 'edit') this.openForm(state, row);
                else if (action === 'delete') {
                    Modal.confirm(`确定要删除「${row.name || row.title || row.id}」吗？此操作不可恢复。`, () => {
                        state.data = state.data.filter(d => d.id !== id);
                        state.selected.delete(id);
                        Storage.set(state.config.storageKey, state.data);
                        this.refresh(state);
                        Toast.success('删除成功');
                    }, { title: '删除确认', confirmText: '删除' });
                }
            });
        });

        tbody.querySelectorAll('.row-check').forEach(cb => {
            cb.addEventListener('change', () => {
                const id = parseInt(cb.dataset.id);
                if (cb.checked) state.selected.add(id);
                else state.selected.delete(id);
                this.updateBulkUI(state);
            });
        });

        // 渲染分页
        this.renderPagination(state, total, totalPages);
    },

    updateBulkUI(state) {
        const count = state.selected.size;
        const bulk = document.getElementById('bulkActions');
        const counter = document.getElementById('selectedCount');
        if (count > 0) {
            bulk.classList.remove('hidden');
            counter.textContent = count;
        } else {
            bulk.classList.add('hidden');
        }
    },

    renderPagination(state, total, totalPages) {
        document.getElementById('pageInfo').textContent = `共 ${total} 条，当前第 ${state.page} / ${totalPages} 页`;

        const start = (state.page - 1) * state.pageSize + 1;
        const end = Math.min(state.page * state.pageSize, total);
        const html = [
            `<button class="page-btn" data-action="first" ${state.page === 1 ? 'disabled' : ''}>${Icons.chevronLeft}${Icons.chevronLeft}</button>`,
            `<button class="page-btn" data-action="prev" ${state.page === 1 ? 'disabled' : ''}>${Icons.chevronLeft}</button>`
        ];
        // 页码
        let pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (state.page <= 4) pages = [1,2,3,4,5,'...',totalPages];
            else if (state.page >= totalPages - 3) pages = [1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages];
            else pages = [1,'...',state.page-1,state.page,state.page+1,'...',totalPages];
        }
        pages.forEach(p => {
            if (p === '...') html.push(`<span class="page-ellipsis">…</span>`);
            else html.push(`<button class="page-btn ${p === state.page ? 'active' : ''}" data-page="${p}">${p}</button>`);
        });
        html.push(`<button class="page-btn" data-action="next" ${state.page === totalPages ? 'disabled' : ''}>${Icons.chevronRight}</button>`);
        html.push(`<button class="page-btn" data-action="last" ${state.page === totalPages ? 'disabled' : ''}>${Icons.chevronRight}${Icons.chevronRight}</button>`);

        const controls = document.getElementById('pageControls');
        controls.innerHTML = html.join('');

        controls.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                const action = btn.dataset.action;
                const page = btn.dataset.page;
                if (action === 'first') state.page = 1;
                else if (action === 'prev') state.page = Math.max(1, state.page - 1);
                else if (action === 'next') state.page = Math.min(totalPages, state.page + 1);
                else if (action === 'last') state.page = totalPages;
                else if (page) state.page = parseInt(page);
                this.refresh(state);
            });
        });
    },

    /**
     * 打开表单（新增或编辑）
     */
    openForm(state, row) {
        const isEdit = !!row;
        const data = row ? { ...row } : {};
        const title = isEdit ? `编辑${state.config.title.slice(0, 2)}` : `新增${state.config.title.slice(0, 2)}`;

        const formHtml = `
            <form id="dataForm">
                ${state.config.formFields.map(f => this.renderField(f, data[f.key])).join('')}
            </form>
        `;

        const self = this;
        const m = Modal.open({
            title: title,
            body: formHtml,
            confirmText: '保存',
            width: 560,
            onConfirm: function() {
                return self.saveForm(state, row, isEdit);
            }
        });
    },

    renderField(f, value) {
        const req = f.required ? '<span class="required">*</span>' : '';
        if (f.type === 'select') {
            const opts = f.options.map(o => {
                const v = typeof o === 'object' ? o.value : o;
                const l = typeof o === 'object' ? o.label : o;
                return `<option value="${escapeAttr(v)}" ${value === v ? 'selected' : ''}>${escapeHtml(l)}</option>`;
            }).join('');
            return `<div class="form-item">
                <label class="form-label">${req}${f.label}</label>
                <select class="form-control" name="${f.key}" ${f.required ? 'required' : ''}>${opts}</select>
            </div>`;
        }
        if (f.type === 'textarea') {
            return `<div class="form-item">
                <label class="form-label">${req}${f.label}</label>
                <textarea class="form-control" name="${f.key}" rows="${f.rows || 3}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>${escapeHtml(value || '')}</textarea>
            </div>`;
        }
        return `<div class="form-item">
            <label class="form-label">${req}${f.label}</label>
            <input class="form-control" type="${f.type}" name="${f.key}" value="${escapeAttr(value || '')}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} ${f.step ? 'step="' + f.step + '"' : ''}>
        </div>`;
    },

    saveForm(state, row, isEdit) {
        const form = document.getElementById('dataForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        const fd = new FormData(form);
        const obj = {};
        fd.forEach((v, k) => obj[k] = v);

        // 数字字段处理
        state.config.formFields.forEach(f => {
            if (f.type === 'number') obj[f.key] = parseFloat(obj[f.key]) || 0;
        });

        if (isEdit) {
            Object.assign(row, obj);
            Toast.success('修改成功');
        } else {
            obj.id = Date.now();
            obj.createdAt = new Date().toISOString().slice(0, 10);
            state.data.unshift(obj);
            Toast.success('新增成功');
        }
        Storage.set(state.config.storageKey, state.data);
        this.refresh(state);
        return true;
    },

    /**
     * 打开查看详情
     */
    openView(state, row) {
        const fields = state.config.columns.map(c => {
            const v = c.render ? c.render(row) : escapeHtml(String(row[c.key] ?? '-'));
            return `<div class="detail-row"><span class="detail-label">${c.label}：</span><span class="detail-value">${v}</span></div>`;
        }).join('');
        Modal.open({
            title: '查看详情',
            body: `<div class="detail-view">${fields}</div>`,
            showCancel: false,
            confirmText: '关闭',
            width: 560
        });
    },

    /**
     * 导出 CSV
     */
    exportData(state) {
        const headers = state.config.columns.map(c => c.label);
        const keys = state.config.columns.map(c => c.key);
        const rows = state.data.map(r => keys.map(k => {
            let v = r[k];
            if (typeof v === 'string') v = v.replace(/"/g, '""');
            return `"${v}"`;
        }).join(','));
        const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // 加 BOM 让 Excel 识别 UTF-8

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.config.title}_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        Toast.success('已导出 CSV');
    }
};

/**
 * 工具函数
 */
function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '\u0026amp;')
        .replace(/</g, '\u0026lt;')
        .replace(/>/g, '\u0026gt;')
        .replace(/"/g, '\u0026quot;')
        .replace(/'/g, '\u0026#39;');
}
function escapeAttr(s) {
    if (s == null) return '';
    return String(s).replace(/"/g, '\u0026quot;');
}
function renderFilter(f) {
    const opts = f.options.map(o => {
        const v = typeof o === 'object' ? o.value : o;
        const l = typeof o === 'object' ? o.label : o;
        return `<option value="${escapeAttr(v)}">${escapeHtml(l)}</option>`;
    }).join('');
    return `<select class="form-control filter-select" id="filter_${f.key}" style="width:auto">
        <option value="">${f.label}</option>${opts}
    </select>`;
}
function renderUserCell(r) {
    const initial = r.name ? r.name[0] : '?';
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
    const color = colors[(r.id || 0) % colors.length];
    return `<div class="user-cell">
        <div class="avatar" style="background:${color}">${initial}</div>
        <div>
            <div style="font-weight:600">${escapeHtml(r.name)}</div>
            <div style="font-size:12px;color:var(--text-3)">ID: ${r.id}</div>
        </div>
    </div>`;
}
function renderStatus(s) {
    const map = {
        online:  { label: '在线', cls: 'success' },
        offline: { label: '离线', cls: 'default' },
        busy:    { label: '忙碌', cls: 'warning' },
        away:    { label: '离开', cls: 'info' }
    };
    const m = map[s] || { label: s, cls: 'default' };
    return `<span class="status-dot status-${m.cls}"></span><span style="margin-left:4px">${m.label}</span>`;
}