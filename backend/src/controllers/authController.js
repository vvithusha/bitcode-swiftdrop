const authService = require('../services/authService');
const AppError = require('../middleware/appError');

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt
});

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  });
};

const register = async (req, res, next) => {
  try {
    const { email, displayName, password } = req.body;
    if (!email || !displayName || !password) {
      throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
    }

    const user = await authService.register({ email, displayName, password });
    res.status(201).json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Missing credentials', 400, 'VALIDATION_ERROR');
    }

    const { user, token } = await authService.login({ email, password });
    setAuthCookie(res, token);
    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout({
      token: req.token,
      exp: req.user?.exp
    });
    res.clearCookie('accessToken');
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
    }

    await authService.changePassword({
      userId: req.user.id,
      currentPassword,
      newPassword
    });

    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  changePassword
};
