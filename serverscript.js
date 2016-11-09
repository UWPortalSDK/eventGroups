// Retreive data from the database
function getEvents() {
    var queryResult = db.Execute('SELECT * FROM events');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    return queryResult;
}