const noteRoutes = require('./note_routes');
const timeRoutes = require('./time_noutes');

module.exports = function(app, db) {
    noteRoutes(app, db);
    timeRoutes(app, db);
};