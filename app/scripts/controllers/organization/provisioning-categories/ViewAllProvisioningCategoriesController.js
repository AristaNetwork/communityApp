(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewAllProvisoningCategoriesController: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.template = [];
            scope.formData = {};
            scope.first = {};
            scope.isCollapsed = true;
            scope.showdatefield = false;
            scope.repeatEvery = false;
            scope.first.date = new Date();
            scope.translate = translate;
            scope.provisioningcategories = [];

            scope.routeTo = function (id) {
                location.path('/viewprovisioningcategory/' + id);
            };

            if (!scope.searchCriteria.criterias) {
                scope.searchCriteria.criterias = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.criterias || '';

            scope.onFilter = function () {
                scope.searchCriteria.criterias = scope.filterText;
                scope.saveSC();
            };

            scope.ProvisioningPerPage = 15;
            resourceFactory.provisioningcategory.getAll(function (data) {
                scope.provisioningcategories = data;
            });
        }
    });
    mifosX.ng.application.controller('ViewAllProvisoningCategoriesController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.ViewAllProvisoningCategoriesController]).run(function ($log) {
        $log.info("ViewAllProvisoningCategoriesController initialized");
    });
}(mifosX.controllers || {}));
