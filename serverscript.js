// Retreive data from the database
function getEvents() {
    var queryResult = db.Execute('SELECT * FROM events');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    return queryResult;
}

// Create an event
function createEvent() {
	var groupId = args.Get("groupId");
    var title = args.Get("title");
    var description = args.Get("description");
    var startTimestamp = args.Get("startTimestamp");
    var endTimestamp = args.Get("endTimestamp");
    var capacity = args.Get("capacity");
    console.log(groupId);
    
    db.Execute('INSERT INTO events VALUES(@groupId, @title, @description, @startTimestamp, @endTimestamp, @capacity, @currentUser');
    return getData();
}

// Create group
function createGroup() {
	var groupId = args.Get("groupId");
    var title = args.Get("title");
    var description = args.Get("description");
    var startTimestamp = args.Get("startTimestamp");
    var endTimestamp = args.Get("endTimestamp");
    var capacity = args.Get("capacity");
    console.log(groupId);
}