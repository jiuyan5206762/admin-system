/**
 * Toast - 全局提示
 */
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;

        const icons = {
            success: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
            error:   '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info:    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = (icons[type] || icons.info) + '<span>' + message + '</span>';
        this.container.appendChild(toast);

        setTimeout(function() {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(function() { toast.remove(); }, 300);
        }, duration);
    },

    success: function(msg, d) { this.show(msg, 'success', d); },
    error:   function(msg, d) { this.show(msg, 'error',   d); },
    warning: function(msg, d) { this.show(msg, 'warning', d); },
    info:    function(msg, d) { this.show(msg, 'info',    d); }
};

/**
 * Modal - 模态框
 */
const Modal = {
    open: function(options) {
        const opts = options || {};
        const title = opts.title || '提示';
        const body = opts.body || '';
        const showCancel = opts.showCancel !== false;
        const confirmText = opts.confirmText || '确定';
        const cancelText = opts.cancelText || '取消';
        const onConfirm = opts.onConfirm || null;
        const width = opts.width || 560;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML =
            '<div class="modal" style="max-width:' + width + 'px">' +
                '<div class="modal-header">' +
                    '<div class="modal-title">' + title + '</div>' +
                    '<button class="modal-close" type="button" aria-label="关闭">' +
                        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                    '</button>' +
                '</div>' +
                '<div class="modal-body">' + body + '</div>' +
                '<div class="modal-footer">' +
                    (showCancel ? '<button class="btn btn-secondary" data-action="cancel">' + cancelText + '</button>' : '') +
                    '<button class="btn btn-primary" data-action="confirm">' + confirmText + '</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);

        function close() {
            overlay.style.animation = 'fadeIn 0.2s reverse';
            setTimeout(function() { overlay.remove(); }, 200);
        }

        overlay.querySelector('.modal-close').addEventListener('click', close);
        var cancelBtn = overlay.querySelector('[data-action="cancel"]');
        if (cancelBtn) cancelBtn.addEventListener('click', close);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) close();
        });

        var confirmBtn = overlay.querySelector('[data-action="confirm"]');
        confirmBtn.addEventListener('click', function() {
            if (onConfirm) {
                var result = onConfirm();
                if (result === false) return;
            }
            close();
        });

        return { close: close, overlay: overlay };
    },

    confirm: function(message, onConfirm, options) {
        var opts = options || {};
        return this.open({
            title: opts.title || '确认操作',
            body: '<p style="color:var(--text-2);font-size:14px;line-height:1.6">' + message + '</p>',
            confirmText: opts.confirmText || '确定',
            cancelText: opts.cancelText || '取消',
            onConfirm: onConfirm,
            width: opts.width || 420
        });
    }
};