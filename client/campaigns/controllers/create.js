/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').controller('CreateCampaignCtrl', ['$scope', '$meteor', '$location',
	function($scope, $meteor, $location){

		$scope.campaigns = $meteor.collection(Campaigns).subscribe('Campaigns');

		$scope.create = function() {
			$scope.newCa.stats = {
				hours: [],
				clicks: [],
				opens: [],
				spam: [],
				unsub: [],
				bounces: []
			};

			$scope.campaigns.save($scope.newCa).then(function (res) {
					console.log('success: ' + res[0]._id);
						$location.path('/overview');
			},
			function (err) {
				console.log(err);
			});
		};

	}]);
