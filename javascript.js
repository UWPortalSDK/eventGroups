angular.module('portalApp')
.controller('eventGroupsCtrl', function ($scope, $http, $q) {
	const API = createAPI($scope);
    
    $scope.events = [];
    
    // API.getCurrentUser().then((user) => {
    // 	return API.subscribeToGroup({
    //     	username: user.Username,
    //         groupId: 1,
    //     });
    // }).then(log('subscribe success'), log('subscribe failure'));
    
    API.getEvents().then((events) => {
        console.log(events);
    	$scope.events = events;
    }).catch(console.error);
	
    API.createEvent({
        title: 'Horse',
        groupId: 1,
        description: 'Watch horses do horse stuff',
        startTimestamp: toTimestamp(new Date()),
        endTimestamp: toTimestamp(new Date()),
        capacity: 24,
    }).then(console.log);
    
    API.createGroup({
    	title: 'SE380',
        description: 'Feedback',
    }).then(console.log);
    
    // API.subscribeToGroup({
    //     groupId: 1
    // }).then((x) => console.log('subscribe to group', x));
    // console.log('MAAZ: cur user', user);
    // initialize the service

	// Show main view in the first column
	$scope.portalHelpers.showView('eventGroupsMain.html');
	
	// This function gets called when user clicks an item in the list
	$scope.showDetails = function(item){
		// Make the item that user clicked available to the template
		$scope.detailsItem.value = item;		
		$scope.portalHelpers.showView('eventGroupsDetails.html', 2);
	}
	
})
.component('eventCard', {
	bindings: {
    	event: '>'
    },
    controller: class Ctrl {
    	constructor() {
			console.log('creating events');
		}
		viewEvent() {
			console.log(this.event);
		}
	},
    template: `
		<widget-row clickable ng-click="$ctrl.viewEvent()">
			{{$ctrl.event.title}}
		</widget-row>
	`
});


function createAPI($scope) {
    return new Proxy({}, {
    	get(cache, property) {
            if (! cache[property]) {
        		cache[property] = $scope.portalHelpers.invokeServerFunction.bind($scope.portalHelpers, property);
            }
            
            console.log(cache[property]);
            
            return cache[property];
        }
    });
}

function partial(fn, ...args) {
	return (...innerArgs) => fn(...args, ...innerArgs);
}

function toTimestamp(date) {
	return date.toISOString().slice(0, 19).replace('T', ' ');
}