export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 添加显示动画
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300); // 等待隐藏动画完成
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-times-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
} 