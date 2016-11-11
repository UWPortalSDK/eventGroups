const trace = (name) => (arg) => (console.log(name, arg), arg);

angular
    .module('portalApp')
	.controller('eventGroupsCtrl', function ($scope, $http, $q, portalHelpers) {
    	const sf = $scope.portalHelpers.invokeServerFunction;
        $scope.events = [];
    	$scope.groups = [];
    	$scope.myGroups = [];

    	sf('getCurrentUser').then(init, trace('getCurrentUser failure'));
    
    	function init(user) {
        	$scope.getEvents = getEvents;
            $scope.createGroup = createGroup;
            $scope.searchForGroup = searchForGroup;
            $scope.subscribeToGroup = subscribeToGroup;
            $scope.getMyGroups = getMyGroups;
            $scope.createEvent = createEvent;
            
            getEvents();
            
            function createEvent(event) {
            	return sf('createEvent', Object.assign({username: user.Username}, event))
                	.then(trace('createEvent'));
            }
            
            function getEvents() {
            	return sf('getEvents')
            		.then(trace('getEvents'))
                	.then(events => $scope.events = events);
            }
            
            function createGroup(group) {
            	return sf('createGroup', {
                            username: user.Username,
                            title: group.title,
                            description: group.description,
                        })
                    .then(trace('createGroup'));
            }
            
            function searchForGroup(query) {
            	return sf('searchGroups', {
                    username: user.Username,
                    query: `%${query}%`,
                })
                    .then(trace('searchGroup'))
                    .then((groups) => $scope.groups = groups);
            }
                
            function subscribeToGroup(group) {
                console.log('subscribingToGroup', group);
            	return sf('subscribeToGroup', {
                    username: user.Username,
                    groupId: group.id,
                }).then(trace('subscribeToGroup'));
            }
            
            function getMyGroups() {
                console.log('getting my groups');
            	return sf('getMyGroups', {username: user.Username})
                	.then(trace('getMyGroups'))
                	.then((groups) => $scope.myGroups = groups);
            }
        }

        // Show main view in the first column
        $scope.portalHelpers.showView('eventGroupsMain.html', 1);

        // This function gets called when user clicks an item in the list
        $scope.showDetails = function(item){
            // Make the item that user clicked available to the template
            $scope.detailsItem.value = item;		
            $scope.portalHelpers.showView('eventGroupsDetails.html', 2);
        }
        
        $scope.toggleEventDetails = function(event) {
            console.log('toggling event', event);
            if (event == $scope.selectedEvent) {
               	$scope.showEventDetails = !$scope.showEventDetails;
            } else {
            	$scope.showEventDetails = true;
            }
            $scope.selectedEvent = event;
        }
    })
    .component('eventCard', {
        bindings: {
            event: '<',
            onClick: '&',
        },
        controller: class Ctrl {
			constructor(portalHelpers) {
				this.ph = portalHelpers;
			}
               
            formatDate(date) {
    			const time = Number(date.match(/\/Date\((\d+)\)\//)[1]);
				return moment(time).format('LLLL');
			}
		},
        template: `
            <widget-row clickable ng-click="$ctrl.onClick({event: $ctrl.event})" class="flex items-center">
				<div class="flex-auto">
                    <div>
                        {{ $ctrl.event.title }}
                    </div>
                    <div>
                        {{ $ctrl.formatDate($ctrl.event.startTimestamp) }}
                    </div>
				</div>
				<div>
					<i class="glyphicon glyphicon-chevron-right"></i>
				</div>
            </widget-row>
        `
    })
    .component('groupCreatorForm', {
    	bindings: {
        	onSubmit: '&',
        },
        controller: class Ctrl {
    		submit($event) {
        		this.onSubmit({
    				group: {
    					title: this.title,
        				description: this.description,
    				},
    			});
				$event.preventDefault();
				this.title = '';
				this.description = '';
    		}	
    	},
        template: `
			<form class="flex flex-column" ng-submit="$ctrl.submit($event)">
                <label>
                	<span class="sr-only">Title</span>
                	<input  ng-model="$ctrl.title"
                            type="text"
                            class="input"
                            style="margin-bottom:0"
                            placeholder="Title"/>
                </label>
                <label>
                    <span class="sr-only">Description</span>
                    <input 	ng-model="$ctrl.description"
                            type="text"
                            class="input"
                            style="margin-bottom:0"
                            placeholder="Description"/>
                </label>

                <button type="submit" class="btn btn-default">Create group</button>
            </form>
		`
    })
    .component('searchForm', {
    	bindings: {
        	onSearch: '&',
            placeholder: '@',
        },
        controller: class Ctrl {
    		submit($event) {
    			$event.preventDefault();
        		this.onSearch({
    				query: this.query,
    			});
    		}
    	},
        template: `
			<form class="flex" ng-submit="$ctrl.submit($event)">
                <input
					ng-model="$ctrl.query"
					type="text"
					class="input flex-auto"
					style="margin-bottom:0"
					placeholder="{{$ctrl.placeholder}}"/>
                <button class="btn btn-default" type="submit">
                	<i class="glyphicon glyphicon-search"></i>
                </button>
            </form>
		`
    })
    .component('groupCard', {
    	bindings: {
        	group: '<',
            onClick: '&',
        },
        template: `
			<widget-row clickable ng-click="$ctrl.onClick({ group: $ctrl.group })">
				<div class="bold">{{$ctrl.group.title}}</div>
				<div>{{$ctrl.group.description}}</div>
			</widget-row>
		`
    })
    .component('expandableGroupCard', {
    	bindings: {
        	group: '<',
            onCreateEvent: '&',
        },
        controller: class Ctrl {
    		submit(event) {
    			event.preventDefault();
        		this.onCreateEvent({
        			event: {
                        groupID: this.group.id,
                        title: this.eventTitle,
                        description: this.eventDescription,
                        startTimestamp: toTimestamp(this.eventStartDate),
                        endTimestamp: toTimestamp(this.eventEndDate),
        				capacity: this.eventCapacity,
    				}
        		});
    		}
    	},
        template: `
			<widget-row ng-click="$ctrl.onClick({ group: $ctrl.group })">
				<div class="flex space-between">
                    <div class="flex-auto">
                        <div class="bold">{{$ctrl.group.title}}</div>
                        <div>{{$ctrl.group.description}}</div>
                    </div>
                    <button class="btn btn-primary" ng-click="$ctrl.open = !$ctrl.open">+</button>
				</div>
				<div class="py1" ng-if="$ctrl.open">
					<form class="flex flex-column p1 bg-gray" ng-submit="$ctrl.submit($event)">
                        <label>
                            <span class="sr-only">Title</span>
                            <input  ng-model="$ctrl.eventTitle"
                                    type="text"
                                    class="input"
                                    style="margin-bottom:0"
                                    placeholder="Title"/>
                        </label>
                        <label>
                            <span class="sr-only">Description</span>
                            <input 	ng-model="$ctrl.eventDescription"
                                    type="text"
                                    class="input"
                                    style="margin-bottom:0"
                                    placeholder="Description"/>
                        </label>
						<label>
							<span class="sr-only">Capacity</span>
							<input type="number" placeholder="Capacity" class="input" style="margin-bottom:0" ng-model="$ctrl.eventCapacity">
						</label>
						<label>
							<span class="white">Start:</span>
							<input type="datetime-local" class="input gray" style="margin-bottom:0" ng-model="$ctrl.eventStartDate">
						</label>
						<label>
							<span class="white">End:</span>
							<input type="datetime-local" class="input gray" style="margin-bottom:0" ng-model="$ctrl.eventEndDate">
						</label>
                        <button type="submit" class="btn btn-default">Create event</button>
                    </form>
				</div>
			</widget-row>
		`
    });

const DEPS = [
	'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.22.1/ramda.min.js',
    'http://momentjs.com/downloads/moment.min.js',
];

deps.forEach(injectDep);

function injectDep(src) {
	const script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
}

function toTimestamp(date) {
	return date.toISOString().slice(0, 19).replace('T', ' ');
}