(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewProvisioningCategoryController: function (scope, routeParams, resourceFactory, location, $uibModal) {
            scope.charge = [];
            scope.choice = 0;
            resourceFactory.provisioningcategory.get({categoryId: routeParams.categoryId}, function (data) {
                scope.categoryname = data.categoryName ;
                scope.categorydescription = data.categoryDescription ;
                scope.categoryId = data.id ;
            });

            scope.deleteProvisionigCategory = function () {
                $uibModal.open({
                    templateUrl: 'deletech.html',
                    controller: categoryDeleteCtrl
                });
            };


            var categoryDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.provisioningcategory.delete({criteriaId: scope.criteriaId}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/viewallprovisioningcategories/');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewProvisioningCategoryController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', mifosX.controllers.ViewProvisioningCategoryController]).run(function ($log) {
        $log.info("ViewProvisioningCategoryController initialized");
    });
}(mifosX.controllers || {}));
