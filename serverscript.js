// Retreive data from the database
function getEvents() {
    console.log('getting events');
    var queryResult = db.Execute(`
		SELECT *
		FROM events
		WHERE startTimestamp > GETDATE()
	`);
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
    if (user.Username == args.Get("username")) {
		err = db.Execute('INSERT INTO groups (title, description, createdBy) VALUES (@title, @description, @username)');
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
    
    if (args.Get("Username") == user.Username) {
        err = "Given username doesn't match with currently logged in user";
        return err;
    }
   
    if (type == "Going") {
       err = db.Execute('UPDATE events SET goingCount = goingCount + 1 WHERE id = @eventId');
    } else if (type == "Maybe") {
       err = db.Execute('UPDATE events SET maybeCount = maybeCount + 1 WHERE id = @eventId');
    }
        
    
    err = db.Execute('INSERT INTO user_events (eventId, userId, type) VALUES (@eventId, @username, @type)');
    return err;
}

function searchGroups() {
	var queryResult = db.Execute("SELECT * FROM groups WHERE title CONTAINS(title,'@query')");
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    
    return queryResult;
}

function getCurrentUser() {
	return user;   
}