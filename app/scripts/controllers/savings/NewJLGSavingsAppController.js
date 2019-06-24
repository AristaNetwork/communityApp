(function (module) {
    mifosX.controllers = _.extend(module, {
        NewJLGSavingsAppController: function (scope, rootScope, routeParams, resourceFactory, location, dateFilter) {

            scope.response = {success:[],failed:[]};
            scope.group = {};
            scope.group.selectedclients = [];
            scope.group.id = routeParams.groupId;
            scope.staffInSelectedOfficeOnly = true;
            scope.requestIdentifier = "clientId";
            scope.inparams = { resourceType: 'template', templateType: 'jlgbulk' };
            scope.selectedProduct = {};
            scope.savingApplicationCommonData = {};  // user set common data for all the loan applications
            scope.savingApplicationCommonData.submittedOnDate = new Date();
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData = {};
            scope.formDat = {};
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.tempDataTables = [];
            scope.isAllClientSelected = false;

            if (scope.group.id) {
                scope.inparams.groupId = scope.group.id;
            }

            // Fetch loan products for initital product drop-down
            resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                scope.savings = data.productOptions;
                scope.group.name = data.groupName;
            });

            resourceFactory.groupResource.get({groupId: routeParams.groupId, associations: 'all'}, function (data) {
                scope.group = data;
            });


            scope.savingsProductChange = function (savingsProductId) {
                scope.inparams.productId = savingsProductId;
                resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {

                    scope.productDetails = data;
                    console.log('scope', scope.productDetails);
                    scope.charges = data.charges;
                    scope.group.clientMembers = scope.group.clientMembers.map(function(client) {
                        client.charges = data.charges.map(function(charge){
                            charge.isDeleted = false; 
                            return _.clone(charge);});
                        // return was returing the reference, instead the value, so added _.clone
                        return client; 
                    });

                    for (var i in scope.charges) {
                        if (scope.charges[i].chargeTimeType.value === "Annual Fee" && scope.charges[i].feeOnMonthDay) {
                            scope.charges[i].feeOnMonthDay.push('2013');
                            scope.charges[i].feeOnMonthDay = new Date(dateFilter(scope.charges[i].feeOnMonthDay, scope.df));
                        }
                    }
                    scope.fieldOfficers = data.fieldOfficerOptions;
                    scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
                    scope.formData.minRequiredOpeningBalance = data.minRequiredOpeningBalance;
                    scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
                    /* FIX-ME: uncomment annualFeeAmount when datepicker avialable, because it depends on the date field 'annualFeeOnMonthDay'*/
                    //scope.formData.annualFeeAmount = data.annualFeeAmount;
                    scope.formData.withdrawalFeeAmount = data.withdrawalFeeAmount;
                    scope.formData.withdrawalFeeForTransfers = data.withdrawalFeeForTransfers;
                    scope.formData.allowOverdraft = data.allowOverdraft;
                    scope.formData.overdraftLimit = data.overdraftLimit;
                    scope.formData.nominalAnnualInterestRateOverdraft = data.nominalAnnualInterestRateOverdraft;
                    scope.formData.minOverdraftForInterestCalculation = data.minOverdraftForInterestCalculation;
                    scope.formData.enforceMinRequiredBalance = data.enforceMinRequiredBalance;
                    scope.formData.minRequiredBalance = data.minRequiredBalance;
                    scope.formData.withHoldTax = data.withHoldTax;

                    if (data.interestCompoundingPeriodType) scope.formData.interestCompoundingPeriodType = data.interestCompoundingPeriodType.id;
                    if (data.interestPostingPeriodType) scope.formData.interestPostingPeriodType = data.interestPostingPeriodType.id;
                    if (data.interestCalculationType) scope.formData.interestCalculationType = data.interestCalculationType.id;
                    if (data.interestCalculationDaysInYearType) scope.formData.interestCalculationDaysInYearType = data.interestCalculationDaysInYearType.id;
                    if (data.lockinPeriodFrequencyType) scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                    if (data.withdrawalFeeType) scope.formData.withdrawalFeeType = data.withdrawalFeeType.id;
                    scope.datatables = data.datatables;
                    scope.handleDatatables(scope.datatables);
                    scope.disabled = false;
                });
            };

            scope.handleDatatables = function (datatables) {
                if (!_.isUndefined(datatables) && datatables.length > 0) {
                    scope.formData.datatables = [];
                    scope.formDat.datatables = [];
                    scope.noOfTabs = datatables.length + 1;
                    angular.forEach(datatables, function (datatable, index) {
                        scope.updateColumnHeaders(datatable.columnHeaderData);
                        angular.forEach(datatable.columnHeaderData, function (colHeader, i) {
                            if (_.isEmpty(scope.formDat.datatables[index])) {
                                scope.formDat.datatables[index] = {data: {}};
                            }

                            if (_.isEmpty(scope.formData.datatables[index])) {
                                scope.formData.datatables[index] = {
                                    registeredTableName: datatable.registeredTableName,
                                    data: {locale: scope.optlang.code}
                                };
                            }

                            if (datatable.columnHeaderData[i].columnDisplayType == 'DATETIME') {
                                scope.formDat.datatables[index].data[datatable.columnHeaderData[i].columnName] = {};
                            }
                        });
                    });
                }
            };

            scope.updateColumnHeaders = function(columnHeaderData) {
                var colName = columnHeaderData[0].columnName;
                if (colName == 'id') {
                    columnHeaderData.splice(0, 1);
                }

                colName = columnHeaderData[0].columnName;
                if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                    columnHeaderData.splice(0, 1);
                }
            };

            //return input type
            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

            scope.toggleCharge = function (clientIndex, chargeIndex) {

                // scope.group.clientMembers[clientIndex].charges.splice(chargeIndex,1);
                if(scope.group.clientMembers[clientIndex].charges[chargeIndex].isDeleted){
                    scope.group.clientMembers[clientIndex].charges[chargeIndex].isDeleted = false;
                }
                else{
                    scope.group.clientMembers[clientIndex].charges[chargeIndex].isDeleted = true;
                }

            };

            scope.checkerInboxAllCheckBoxesClicked = function() {
                scope.isAllClientSelected = !scope.isAllClientSelected;
                if(!angular.isUndefined(scope.group.clientMembers)) {
                    for (var i in scope.group.clientMembers) {
                        scope.group.clientMembers[i].isSelected = scope.isAllClientSelected;
                    }
                }
            }

            scope.checkerInboxAllCheckBoxesMet = function() {
                if(!angular.isUndefined(scope.group.clientMembers)) {
                    var count = 0;
                    for (var i in scope.group.clientMembers) {
                        if(scope.group.clientMembers[i].isSelected){
                            count++;
                        }
                    }
                    scope.isAllClientSelected = (scope.group.clientMembers.length==count);
                    return scope.isAllClientSelected;
                }
            }

            /* Submit button action */
            scope.submit = function () {
                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    angular.forEach(scope.datatables, function (datatable, index) {
                        scope.columnHeaders = datatable.columnHeaderData;
                        angular.forEach(scope.columnHeaders, function (colHeader, i) {
                            scope.dateFormat = scope.df + " " + scope.tf
                            if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName])) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName],
                                        scope.dateFormat);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            } else if (scope.columnHeaders[i].columnDisplayType == 'DATETIME') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date) && !_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time)) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date, scope.df)
                                        + " " + dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time, scope.tf);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            }
                        });
                    });
                } else {
                    delete scope.formData.datatables;
                }

                this.batchRequests = [];
                for (var i in scope.group.clientMembers) {
                    if( scope.group.clientMembers[i].isSelected ){

                        var savingsApplication = {};

                        savingsApplication.submittedOnDate = dateFilter(scope.savingApplicationCommonData.submittedOnDate, scope.df);
                        savingsApplication.locale = scope.optlang.code;
                        savingsApplication.dateFormat = scope.df;
                        savingsApplication.monthDayFormat = "dd MMM";
                        savingsApplication.charges = scope.group.clientMembers[i].charges;
                        savingsApplication.clientId = scope.group.clientMembers[i].id;
                        savingsApplication.groupId = scope.group.id;
                        //savingsApplication.centerId = scope.group.centerId;
                        savingsApplication.productId = scope.productDetails.savingsProductId;
                        savingsApplication.nominalAnnualInterestRate = scope.productDetails.nominalAnnualInterestRate;
                        savingsApplication.withdrawalFeeForTransfers = scope.productDetails.withdrawalFeeForTransfers;
                        savingsApplication.allowOverdraft = scope.productDetails.allowOverdraft;
                        savingsApplication.enforceMinRequiredBalance = scope.productDetails.enforceMinRequiredBalance;
                        savingsApplication.withHoldTax = scope.productDetails.withHoldTax;
                        savingsApplication.interestCompoundingPeriodType = scope.productDetails.interestCompoundingPeriodType.id;
                        savingsApplication.interestPostingPeriodType = scope.productDetails.interestPostingPeriodType.id;
                        savingsApplication.interestCalculationType = scope.productDetails.interestCalculationType.id;
                        savingsApplication.interestCalculationDaysInYearType = scope.productDetails.interestCalculationDaysInYearType.id;
                        savingsApplication.fieldOfficerId = scope.formData.fieldOfficerId;
        
                        if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                            angular.forEach(scope.datatables, function (datatable, index) {
                                scope.columnHeaders = datatable.columnHeaderData;
                                angular.forEach(scope.columnHeaders, function (colHeader, i) {
                                    scope.dateFormat = scope.df + " " + scope.tf
                                    if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                                        if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName])) {
                                            savingsApplication.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName],
                                                scope.dateFormat);
                                                savingsApplication.datatables[index].data.dateFormat = scope.dateFormat;
                                        }
                                    } else if (scope.columnHeaders[i].columnDisplayType == 'DATETIME') {
                                        if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date) && !_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time)) {
                                            savingsApplication.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date, scope.df)
                                                + " " + dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time, scope.tf);
                                            savingsApplication.datatables[index].data.dateFormat = scope.dateFormat;
                                        }
                                    }
                                });
                            });
                        } else {
                            delete savingsApplication.datatables;
                        }

                        this.batchRequests.push({requestId: i, relativeUrl: "savingsaccounts",
                            method: "POST", body: JSON.stringify(savingsApplication)});

                    }

                }

                resourceFactory.batchResource.post(this.batchRequests, function (data) {

                        for (var i = 0; i < data.length; i++) {
                                if(data[i].statusCode == 200 ) 
                                    scope.response.success.push(data[i]);
                                else
                                    scope.response.failed.push(data[i]);

                            }   

                        if(scope.response.failed.length === 0 ){
                            location.path('/viewgroup/' + scope.group.id);    
                        }

                });

                
            }; 

            /* Cancel button action */
            scope.cancel = function () {
                if (scope.group.id) {
                    location.path('/viewgroup/' + scope.group.id);
                }
            };             


        } // End of NewJLGSavingsAppController

    });
    mifosX.ng.application.controller('NewJLGSavingsAppController', ['$scope', '$rootScope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.NewJLGSavingsAppController]).run(function ($log) {
        $log.info("NewJLGSavingsAppController initialized");
    });
}(mifosX.controllers || {}));