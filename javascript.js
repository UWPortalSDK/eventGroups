angular.module('portalApp')

// Widget controller - runs every time widget is shown
.controller('eventGroupsCtrl', ['$scope', '$http', '$q', 'eventGroupsFactory', function ($scope, $http, $q, eventGroupsFactory) {

    // Import variables and functions from service
    $scope.data = eventGroupsFactory.data;
	$scope.items = eventGroupsFactory.items;
	$scope.detailsItem = eventGroupsFactory.detailsItem;
	
    // initialize the service
    eventGroupsFactory.init($scope);
    
    console.log("test");

	// Show main view in the first column
	$scope.portalHelpers.showView('eventGroupsMain.html', 1);
	
	// This function gets called when user clicks an item in the list
	$scope.showDetails = function(item){
		// Make the item that user clicked available to the template
		$scope.detailsItem.value = item;		
		$scope.portalHelpers.showView('eventGroupsDetails.html', 2);
	}
	
}])
// Factory maintains the state of the widget
.factory('eventGroupsFactory', ['$http', '$rootScope', '$filter', '$q', function ($http, $rootScope, $filter, $q) {
		
	var initialized = {value: false};

	// Your variable declarations
	var data = {value: null};
	var detailsItem = {value:null};
	// mock data
	var items = {value: null};
	
	var init = function ($scope) {
		if (initialized.value)
			return;
		
		initialized.value = true;

		// Place your init code here:
		data.value={message:"Welcome to Portal SDK!"};
		items.value = [
			{
				title:'Item 1',
				tags: ['tag A', 'tag B', 'tag C'],
				details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
			},
			{
				title:'Item 2',
				tags: ['tag D', 'tag E', 'tag F'],
				details: 'Mauris cursus, sapien et malesuada ultrices, purus sapien iaculis tellus, quis semper magna est at leo.'
			},
			{
				title:'Item 3',
				tags: ['tag A', 'tag H'],
				details: 'Donec id quam eu odio feugiat sagittis. Duis a tempus neque. Praesent elementum quis ante quis commodo. Sed tincidunt aliquet dolor sit amet laoreet. '
			},
			{
				title:'Item 4',
				tags: ['tag I'],
				details: 'Proin sem quam, rutrum id ante id, scelerisque tempor quam. Curabitur pharetra turpis at sem placerat, non vehicula ligula tincidunt.'
			},
			{
				title:'Item 5',
				tags: ['tag C', 'tag K', 'tag B'],
				details: 'Mauris nec ultricies metus. Cras et dictum justo. Nam a ullamcorper dolor. Cras fringilla metus vel facilisis vehicula.'
			},
			{
				title:'Item 6',
				tags: ['tag A', 'tag B', 'tag C'],
				details: 'Curabitur scelerisque lorem risus, in luctus orci hendrerit non. Praesent quis tellus dapibus dolor consectetur volutpat.'
			}
		];
	}


	// Expose init(), and variables
	return {
		init: init,
		data: data,
		detailsItem: detailsItem,
		items: items
	};

}])
// Custom directive example
.directive('eventGroupsDirectiveName', ['$http', function ($http) {
	return {
		link: function (scope, el, attrs) {

		}
	};
}])
// Custom filter example
.filter('eventGroupsFilterName', function () {
	return function (input, arg1, arg2) {
		// Filter your output here by iterating over input elements
		var output = input;
		return output;
	}
});