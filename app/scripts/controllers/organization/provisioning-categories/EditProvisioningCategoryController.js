(function (module) {
    mifosX.controllers = _.extend(module, {
        EditProvisioningCategoryController: function (scope, resourceFactory, routeParams, location, dateFilter, translate) {
        
            scope.formData = {};
            resourceFactory.provisioningcategory.get({categoryId: routeParams.categoryId}, function (data) {
                scope.formData = data;
            });

            scope.submit = function () {
                let jsonData = {
                    categoryname: scope.formData.categoryName,
                    categorydescription: scope.formData.categoryDescription
                };
                resourceFactory.provisioningcategory.put({categoryId: routeParams.categoryId}, jsonData, function (data) {
                    location.path('/viewprovisioningcategory/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditProvisioningCategoryController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', '$translate', mifosX.controllers.EditProvisioningCategoryController]).run(function ($log) {
        $log.info("EditProvisioningCategoryController initialized");
    });
}(mifosX.controllers || {}));
