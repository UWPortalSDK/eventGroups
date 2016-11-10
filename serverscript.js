// Retreive data from the database
function getEvents() {
    console.log('getting events');
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
    var err;
	if (args.Get("username") == user.Username) {
		err = db.Execute('INSERT INTO events (groupId, title, description, startTimestamp, endTimestamp, capacity, createdBy) VALUES (@groupId, @title, @description, @startTimestamp, @endTimestamp, @capacity, @username)');
	} else {
        err = "Given username doesn't match with currently logged in user";
    }
	return err;
}

// Create group
function createGroup() {
    var title = args.Get("title");
    var description = args.Get("description");
    var err;
    if (user.Username == args.get("username")) {
		err = db.Execute('INSERT INTO groups (title, description) VALUES (@title, @description)');
    } else {
        err = "Given username doesn't match with currently logged in user";
    }
	return err;
}

function subscribeToGroup() {
    var groupId = args.Get("groupId");
    var err;
    if (args.Get('username') == user.Username) {
    	err = db.Execute('INSERT INTO user_groups (groupId, userId) VALUES (@groupId, @username)');
    } else {
        err = "Given username doesn't match with currently logged in user";
    }
    return err;
}

function expressInterestInEvent() {
	var eventId = args.Get("eventId");
	var type = args.Get("type");
    var err;
   	if (type != "Going" || type != "Maybe") {
        err = "Wrong type";
        return err;
    }
    
    if (args.get("Username") == user.Username) {
        err = "Given username doesn't match with currently logged in user";
        return err;
    }
    
    err = db.Execute('INSERT INTO user_events (eventId, userId, type) VALUES (@eventId, @username, @type)');
    return err;
}

function getCurrentUser() {
	return user;   
}