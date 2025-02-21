import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // 检查Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: '请先登录以访问此资源' });
    }

    try {
      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 检查用户是否仍然存在
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({ message: '此token所属用户不存在' });
      }

      // 将用户信息添加到请求对象
      req.user = currentUser;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'token无效或已过期' });
    }
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 检查用户角色权限
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: '您没有权限执行此操作'
      });
    }
    next();
  };
}; 