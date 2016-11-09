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
    var err;
	if (args.Get("username") == user.Username)
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

function getCurrentUser() {
	return user;   
}