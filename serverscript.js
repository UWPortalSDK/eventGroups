// Retreive data from the database
function getEvents() {
    var queryResult = db.Execute('SELECT * FROM events');
    try {
	    var rows = JSON.parse(queryResult);
    } catch (e) {
    	console.log(e);   
    }
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
    var curUsername = user.Username;
    console.log(groupId);
    console.log(user);
    console.log(curUsername);
    var err = db.Execute('INSERT INTO events (groupId, title, description, startTimestamp, endTimestamp, capacity, createdBy) VALUES (@groupId, @title, @description, @startTimestamp, @endTimestamp, @capacity, @curUsername)');
	console.log(err);
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