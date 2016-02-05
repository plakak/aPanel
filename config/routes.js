module.exports = function(app) {

    var aPanelMainRoutes = require('./routes/apanel-main').router;
    var aPanelTasksRoutes = require('./routes/apanel-tasks').router;
    var publicRoutes = require('./routes/public-routes').router;


    app.use('/aPanel/tasks', aPanelTasksRoutes);
    app.use('/aPanel', aPanelMainRoutes);
    app.use('/', publicRoutes);

};