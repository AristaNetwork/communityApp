(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateProvisioningCriteriaController: function (scope, resourceFactory, location, dateFilter, translate) {
            scope.available = [];
            scope.selected = [];
            scope.selectedloanproducts = [] ;
            scope.template = [];
            scope.formData = {};
            scope.translate = translate;
            scope.isRequired = false ;
            scope.criteriadefinitions = [];

            resourceFactory.provisioningcriteria.template({criteriaId:'template'},function (data) {
                scope.template = data;
                scope.allloanproducts = data.loanProducts ;
                scope.definitions = data.definitions;
                scope.criteriadefinitions = scope.criteriadefinitions.concat(scope.definitions);
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
                this.isRequired = true ;
                this.formData.locale = scope.optlang.code;
                this.formData.loanProducts = scope.selectedloanproducts ;
                this.formData.definitions = scope.criteriadefinitions ;
                resourceFactory.provisioningcriteria.post(this.formData, function (data) {
                    location.path('/viewprovisioningcriteria/' + data.resourceId);
                });
            };

            scope.doFocus = function(index) {
                if(index > 0 && !scope.criteriadefinitions[index].minAge) {
                    scope.criteriadefinitions[index].minAge = parseInt(scope.criteriadefinitions[index-1].maxAge)+1 ;
                }
            }

            scope.doBlur = function(index) {
                //console.log("Blur") ;
            }
        }
    });
    mifosX.ng.application.controller('CreateProvisioningCriteriaController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$translate', mifosX.controllers.CreateProvisioningCriteriaController]).run(function ($log) {
        $log.info("CreateProvisioningCriteriaController initialized");
    });
}(mifosX.controllers || {}));
