function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

function hasRole(roles) {
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.role)) {
            return next();
        }
        res.status(403).send('Access denied');
    };
}

module.exports = { isAuthenticated, hasRole };