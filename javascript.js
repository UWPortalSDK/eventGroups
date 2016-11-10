angular
    .module('portalApp')
	.controller('eventGroupsCtrl', function ($scope, $http, $q, portalHelpers) {
    	const sf = $scope.portalHelpers.invokeServerFunction;
        $scope.events = [];

       	sf('getEvents')
            .then((events) => $scope.events = events)
            .catch(console.error);
    
    	sf('createGroup', {
        	username: 'rsnara',
            title: 'SE349',
            description: 'This is a really good group',
        }).then(console.log, console.error);;

        // sf('createEvent', {
        //     username: 'rsnara',
        //     title: 'Horse',
        //     groupId: 1,
        //     description: 'Watch horses do horse stuff',
        //     startTimestamp: toTimestamp(new Date()),
        //     endTimestamp: toTimestamp(new Date()),
        //     capacity: 24,
        // }).then(console.log);

        // API.createGroup({
        // 	title: 'SE380',
        //     description: 'Feedback',
        // }).then(console.log);

        // API.subscribeToGroup({
        //     groupId: 1
        // }).then((x) => console.log('subscribe to group', x));
        // console.log('MAAZ: cur user', user);
        // initialize the service

        // Show main view in the first column
        $scope.portalHelpers.showView('eventGroupsMain.html', 1);

        // This function gets called when user clicks an item in the list
        $scope.showDetails = function(item){
            // Make the item that user clicked available to the template
            $scope.detailsItem.value = item;		
            $scope.portalHelpers.showView('eventGroupsDetails.html', 2);
        }

    })
    .component('eventCard', {
        bindings: {
            event: '<'
        },
        controller: class Ctrl {
			constructor(portalHelpers) {
				this.ph = portalHelpers;
			}
            
            viewElement() {
				
			}
		},
        template: `
            <widget-row clickable ng-click="$ctrl.viewEvent()" class="bg-black">
				<uib-accordion class="pb0">
                    <div uib-accordion-group is-open="true">
                        <uib-accordion-heading>
                            {{$ctrl.event.title}}
                        </uib-accordion-heading>
						{{$ctrl.event.description}}
                    </div>
				<uib-accordion>
            </widget-row>
        `
    });

const DEPS = [
	'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.22.1/ramda.min.js'
];

deps.forEach(injectDep);

(() => {
    var basscssAddons = [
        'responsive-margin', 'responsive-padding', 'forms', 'btn',
        'btn-outline', 'btn-primary', 'btn-sizes', 'colors',
        'background-colors', 'background-images', 'border-colors', 'darken',
        'lighten', 'input-range', 'progress', 'all', 'media-object',
        'highlight', 'highlight-dark', 'border-colors'
    ];
    function createBasscssAddonLink(addon) {
        if (['forms'].includes(addon)) {
            return `https://npmcdn.com/basscss-${addon}/index.css`;
        }
        return 'https://npmcdn.com/basscss-' + addon + '/css/' + addon + '.css';
    }
    function fetchCSS(link) {
        return fetch(link).then((response) => response.text());
    }
    function createDOMElement(name, props) {
        return Object.assign(document.createElement(name), props);
    }
    function createStyleElement(css) {
        return createDOMElement('style', {
            type: 'text/css',
            innerHTML: css,
        });
    }
    function fetchBasscssWithAddons() {
        var links = [
            'https://npmcdn.com/basscss/css/basscss.min.css',
            ...basscssAddons.map(createBasscssAddonLink)
        ];
        return Promise
            .all(links.map(fetchCSS))
            .then((css) => css.join('\n'));
    }
    function injectCSS(css) {
        document.head.appendChild(createStyleElement(css));
    }
    document.addEventListener('DOMContentLoaded', () => {
        fetchBasscssWithAddons()
            .then(injectCSS)
            .then(
            () => console.log('Loaded Basscss!'),
            (error) => console.error('Failed to load Basscss!', error)
        );
    });
})();

function injectDep(src) {
	const script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
}

function toTimestamp(date) {
	return date.toISOString().slice(0, 19).replace('T', ' ');
}