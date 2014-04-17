'use strict';

Bahmni.Clinical.OrderGroup = function(){};

Bahmni.Clinical.OrderGroup.prototype.group = function(orders, groupingParameter) {
    var getGroupingFunction = function (groupingParameter) {
        if (groupingParameter == 'date') {
            return function (order) {
                return order.dateCreated.substring(0, 10);
            };
        }
        return function (order) {
            return order[groupingParameter];
        }
    };

    groupingParameter = groupingParameter || 'date';
    var groupingFunction = getGroupingFunction(groupingParameter);
    var groupedOrders = new Bahmni.Clinical.ResultGrouper().group(orders, groupingFunction, 'orders', groupingParameter);
    var mappedGroupedOrders = groupedOrders.map(function (order) {
        return {
            accessionUuid:order.accessionUuid,
            orders:order.orders,
            date: new Date(order.date)
        }
    });
    return Bahmni.Common.Util.ArrayUtil.sortInReverseOrderOfField(mappedGroupedOrders, 'date')
};

Bahmni.Clinical.OrderGroup.prototype.create = function (encounterTransactions, ordersName, filterFunction, groupingParameter) {
    var filteredOrders = this.flatten(encounterTransactions, ordersName, filterFunction);
    var group = this.group(filteredOrders, groupingParameter);
    return group;
};

Bahmni.Clinical.OrderGroup.prototype.flatten = function (encounterTransactions, ordersName, filterFunction) {
    filterFunction = filterFunction || function(){return true;}
    var setOrderProvider = function (encounter) { 
        encounter[ordersName].forEach(function(order) {
            order.provider = encounter.providers[0];
            order.accessionUuid = encounter.encounterUuid;
        });
    };
    encounterTransactions.forEach(setOrderProvider);
    var flattenedOrders = encounterTransactions.reduce(function(orders, encounter) { return orders.concat(encounter[ordersName]) }, []);
    return flattenedOrders.filter(filterFunction);
};