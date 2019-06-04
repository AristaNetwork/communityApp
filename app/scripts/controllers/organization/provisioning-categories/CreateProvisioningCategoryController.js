(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateProvisioningCategoryController: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.available = [];
            scope.selected = [];
            scope.selectedloanproducts = [] ;
            scope.template = [];
            scope.formData = {};
            scope.translate = translate;
            scope.isRequired = false ;

            scope.submit = function () {
                this.isRequired = true ;
                resourceFactory.provisioningcategory.post(this.formData, function (data) {
                    location.path('/viewprovisioningcategory/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateProvisioningCategoryController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.CreateProvisioningCategoryController]).run(function ($log) {
        $log.info("CreateProvisioningCategoryController initialized");
    });
}(mifosX.controllers || {}));
