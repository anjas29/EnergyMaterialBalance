﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


var tree = "";

var data = {
    error: null,
    message: null,
    selectedResource: null,
    bgroups: null,
    selectedBGroup: null,
    points: null,
    selectedPoint: null,
    sources: null,
    periods: null,
    tags: null,
    formula: null,
    parameters: null
};

// getting all bgroups by selected Resource
//todo: add messages for error

async function GetBGroups(resourceId) {
    const response = await fetch("main/getBGroups/" + resourceId, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const result = await response.json();
        console.log(result);
        fillSelect(result.selectedResource);
        fillTreeView(result.bgroups);
        buttonDisabled('#btnCreateBGroupModal', false);
        buttonDisabled('#btnDeleteBGroupModal', true);
        buttonDisabled('#btnUpdateBGroupModal', true);
    }
    else {
        console.log("Cannot get BGroups for selected Resource!");
    }
}

// getting all points by selected BGroup
//todo: add messages for error

async function GetPoints(bgroupId) {
    const response = await fetch("main/getPoints/" + bgroupId, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const result = await response.json();
        clearTableView();
        fillTableView(result.points);
        fillValidDisbalance(result.selectedBGroup);
    }
    else {
        console.log("Cannot get Points for selected BGroup!");
    }
}
}

// function for setting selected Resource

function fillSelect(selectedResource) {
    selectElement('resources', selectedResource.resourceId);
    data.selectedResource = selectedResource;
}

// creating tree view component with BGroups

function fillTreeView(bgroups) {
    data.bgroups = bgroups;
    tree = $('#tree').tree({
        uiLibrary: 'bootstrap4',
        primaryKey: 'bgroupId',
        textField: 'bgroupName',
        childrenField: "inverseBgroupIdparentNavigation",
        select: function (e, node, id) {
            GetPoints(id);
            buttonDisabled('#btnDeleteBGroupModal', false);
            buttonDisabled('#btnUpdateBGroupModal', false);

        },
        unselect: function (e, node, id) {
            clearTableView();
            clearValidDisbalance();
            buttonDisabled('#btnDeleteBGroupModal', true);
            buttonDisabled('#btnUpdateBGroupModal', true);
        }
    });

    tree.render(bgroups);
}

// setting selected Resource

function selectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

// setting valid disbalance for selected BGroup

function fillValidDisbalance(selectedBGroup) {
    data.selectedBGroup = selectedBGroup;
    $('#validDisbalance').text(selectedBGroup.validDisbalance);
}

// creating table view component (tbody) with Points

function fillTableView(points) {
    data.points = points;
    var tableView = document.getElementById('tableView');
    var rows = tableView.getElementsByTagName('tbody')[0];
    points.forEach((point, i) => {
        rows.append(row(point, i));
    });
}

// deleting table view component 

function clearTableView() {
    data.points = null;
    $('#tableView tbody > tr').remove();

}

// deleting valid disbalance 

function clearValidDisbalance() {
    data.selectedBGroup = null;
    $('#validDisbalance').text("");
}

// deleting tree view component 

function clearTreeView() {
    data.bgroups = null;
    fillTreeView([]);
}

//setting points' data in table view component

function row(point, i) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-rowid', point.pointId);
    tr.className = 'd-flex';
    const trData = [
        {
            col: 'col-1',
            data: i + 1
        },

        {
            col: 'col-3',
            data: point.pointName
        },

        {
            col: 'col-2',
            data: point.direction
        },

        {
            col: 'col-1',
            data: point.tagname
        },

        {
            col: 'col-2',
            data: point.period.periodName
        },

        {
            col: 'col-1',
            data: point.validMistake
        },

        {
            col: 'col-2',
            data: point.source.sourceName
        },

    ];
    trData.forEach((tdData) => {
        const td = document.createElement('td');
        td.append(tdData.data);
        td.className = tdData.col;
        tr.append(td);
    });
    return tr;
}

//setting buttons disabled

function buttonDisabled(button, state) {
    $(button).prop('disabled', state);
}
function showUpdateBGroupModal() {
    $('#updateBGroupId').val(data.selectedBGroup.bgroupId);
    $('#updateBGroupName').val(data.selectedBGroup.bgroupName);
    $('#updateValidDisbalance').val(data.selectedBGroup.validDisbalance);
}
function showMessage(error, message) {
    if (!error) 
        $("#message").addClass('alert-success');
    else
        $("#message").addClass('alert-warning');
    $("#message").text(message);
    $("#message").show().delay(5000).fadeOut();

}
// update selected BGroup
//todo: add validation, show error messages from the server in modal window, select updated BGroup,
//show it in the tree view

async function UpdateBGroup() {
    bGroupNameVal = $("#updateBGroupName").val();
    validDisbalanceVal = $("#updateValidDisbalance").val();
    bgroupsIdVal = $("#updateBGroupId").val();

    console.log(bgroupsIdVal);
    $.post("/main/UpdateBGroup/", {
        bgroupId: bgroupsIdVal,
        bgroupName: bGroupNameVal,
        validDisbalance: validDisbalanceVal
    }).done(function (result) {
        console.log(result);
        $('#updateBGroupModal').modal('hide');
        GetBGroups(result.selectedBGroup.resourceId);
        clearTableView();
        clearValidDisbalance();
        showMessage(result.error, result.message);
    }).fail(function (result) {
        console.log("error!")
    });
}

$(document).ready(function () {
    $('#tableView').delegate('tr', 'click', function () {
        var selected = $(this).hasClass('highlight');

        $('#tableView tr').removeClass('highlight');
        if (!selected)
            $(this).addClass('highlight');
    });

    $('#resources').change(function () {
        if ($(this).val() === '') {
            clearTreeView();
            buttonDisabled('#btnCreateBGroupModal', true);
            buttonDisabled('#btnDeleteBGroupModal', true);
            buttonDisabled('#btnUpdateBGroupModal', true);
        }
        else {
            GetBGroups($(this).val());
        }
        clearTableView();
        clearValidDisbalance();
    });

});
    $('#btnUpdateBGroupModal').click(function () {
        showUpdateBGroupModal();
    });
    $('#updateBGroupForm').on('submit', function (e) {
        console.log("Submit Update");
        e.preventDefault();
        UpdateBGroup();
    });
    

});


