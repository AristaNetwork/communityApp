(function (module) {
    mifosX.controllers = _.extend(module, {
        EditProvisioningCriteriaController: function (scope, resourceFactory, routeParams, location, dateFilter, translate) {
            scope.available = [];
            scope.selected = [];
            scope.template = [];
            scope.formData = {};
            scope.translate = translate;
            scope.criteriadefinitions = [];

            resourceFactory.provisioningcriteria.get({criteriaId: routeParams.criteriaId, template:'true'}, function (data) {
                scope.selectedloanproducts = data.selectedLoanProducts;
                scope.allloanproducts = data.loanProducts ;
                scope.criteriadefinitions = scope.criteriadefinitions.concat(data.definitions);
                scope.definitions = data.templateDefinitions;
                scope.criteriaName = data.criteriaName;
                scope.criteriaId = data.criteriaId;
                scope.liabilityaccounts = data.glAccounts;
                scope.expenseaccounts = data.glAccounts;
            });

            resourceFactory.configurationResourceByName.get({configName:'Use-Assets-instead-of-liability-accounts-for-provisioning'},function (data) {
                if(data.enabled)
                    scope.useAssetsInsteadOfLiabilities = true;
            });

            scope.addLoanProduct = function () {
                for (var i in this.available) {
                    for (var j in scope.allloanproducts) {
                        if (scope.allloanproducts[j].id == this.available[i]) {
                            var temp = {};
                            temp.id = this.available[i];
                            temp.name = scope.allloanproducts[j].name;
                            temp.includeInBorrowerCycle = scope.allloanproducts[j].includeInBorrowerCycle;
                            scope.selectedloanproducts.push(temp);
                            scope.allloanproducts.splice(j, 1);
                        }
                    }
                }
            };
            scope.removeLoanProduct = function () {
                for (var i in this.selected) {
                    for (var j in scope.selectedloanproducts) {
                        if (scope.selectedloanproducts[j].id == this.selected[i]) {
                            var temp = {};
                            temp.id = this.selected[i];
                            temp.name = scope.selectedloanproducts[j].name;
                            temp.includeInBorrowerCycle = scope.selectedloanproducts[j].includeInBorrowerCycle;
                            scope.allloanproducts.push(temp);
                            scope.selectedloanproducts.splice(j, 1);
                        }
                    }
                }
            };

            scope.removeDefinition = function(index){
                scope.criteriadefinitions.splice(index,1);
            }
            scope.addDefinition = function(){
                if(scope.criteriadefinitions.length !== scope.definitions.length)
                    scope.criteriadefinitions.push({});
            }
            scope.definitionSelected = function(provisioningcategory, indexprovisioningcategory){
                //console.log(indexprovisioningcategory, provisioningcategory);
                for (let index = 0; index < scope.criteriadefinitions.length; index++) {
                    const element = scope.criteriadefinitions[index];
                    if(index !== indexprovisioningcategory){
                        console.log("index " + index);
                        if(element.categoryId === provisioningcategory.categoryId){
                            console.log("category " + element.categoryId);
                            provisioningcategory.categoryId = "";
                        }
                    }
                }

            }

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.criteriaId = scope.criteriaId ;
                this.formData.criteriaName = scope.criteriaName ;
                this.formData.loanProducts = scope.selectedloanproducts ;
                this.formData.definitions = scope.criteriadefinitions ;
                resourceFactory.provisioningcriteria.put({criteriaId: routeParams.criteriaId}, this.formData, function (data) {
                    location.path('/viewprovisioningcriteria/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditProvisioningCriteriaController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', '$translate', mifosX.controllers.EditProvisioningCriteriaController]).run(function ($log) {
        $log.info("EditProvisioningCriteriaController initialized");
    });
}(mifosX.controllers || {}));
