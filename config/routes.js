module.exports = function (app) {
  
  const aPanelMainRoutes = require('./routes/apanel-main').router;
  const aPanelTasksRoutes = require('./routes/apanel-tasks').router;
  const publicRoutes = require('./routes/public-routes').router;
  
  
  app.use('/aPanel/tasks', aPanelTasksRoutes);
  app.use('/aPanel', aPanelMainRoutes);
  app.use('/', publicRoutes);
  
  app.get('*', function (req, res, next) {
    const err = new Error();
    err.status = 404;
    next(err);
  });
};
