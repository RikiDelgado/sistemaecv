//backend/middlewares/role.middleware.js
export default function roleMiddleware(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        error: "No tenés permisos",
      });
    }
    next();
  };
}
