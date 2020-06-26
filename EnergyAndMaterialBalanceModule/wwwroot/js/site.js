// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


var tree;
var createBGroupFormValidator;
var updateBGroupFormValidator;

var data = {
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

// getting all BGroups by selected Resource

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
        var resource = $('#resources option:selected').text();
        showMessage(true, "Не удалось получить список балансовых групп для ресурса '" + resource + "'!");
        selectElement('resources', '');
    }
}

// getting all Points by selected BGroup

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
        buttonDisabled('#btnDeleteBGroupModal', false);
        buttonDisabled('#btnUpdateBGroupModal', false);
    }
    else {
        var selections = tree.getSelections();
        var node = tree.getNodeById(selections[0]);
        var bgroup = node.find('span')[2].innerText;
        showMessage(true, "Не удалось получить список точек учета и допустимый дисбаланс для группы '" + bgroup + "'!");
        tree.unselectAll();
    }
}

// deleting selected BGroup

async function DeleteBGroup() {
    bgroupId = $("#deleteBGroupId").val();
    const response = await fetch("/main/deleteBGroup/" + bgroupId, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const result = await response.json();
        showMessage(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно удалена!");
        removeNode(result.seletedBGroup);
        buttonDisabled('#btnCreateBGroupModal', false);
        buttonDisabled('#btnDeleteBGroupModal', true);
        buttonDisabled('#btnUpdateBGroupModal', true);
    }
    else {
        showMessage(true, "Не удалось удалить балансовую группу '" + data.selectedBGroup.bgroupName + "'!");
    }
    $('#deleteBGroupModal').modal('hide');
}

// creating new BGroup

async function CreateBGroup() {
    bgroupNameVal = $("#createBGroupName").val();
    validDisbalanceVal = $("#createValidDisbalance").val();
    resourceIdVal = $("#createResourceId").val();
    bgroupIdParentVal = $('input:radio[name="createBGroupIdParent"]:checked').val();
    const response = await fetch("/main/CreateBGroup", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            bgroupName: bgroupNameVal,
            validDisbalance: validDisbalanceVal,
            resourceId: parseInt(resourceIdVal),
            bgroupIdparent: bgroupIdParentVal
        })
    });
    if (response.ok === true) {
        clearModalMessage('#createMessage');
        const result = await response.json();
        $('#createBGroupModal').modal('hide');
        addNode(result.selectedBGroup);
        showMessage(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно добавлена!");
    }
    else {
        fillModalMessage('#createMessage', "Не удалось создать балансовую группу!");
    }
}

// updating selected BGroup

async function UpdateBGroup() {
    bgroupNameVal = $("#updateBGroupName").val();
    validDisbalanceVal = $("#updateValidDisbalance").val();
    bgroupIdVal = $("#updateBGroupId").val();

    const response = await fetch("/main/UpdateBGroup", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            bgroupId: bgroupIdVal,
            bgroupName: bgroupNameVal,
            validDisbalance: validDisbalanceVal
        })
    });

    if (response.ok === true) {
        clearModalMessage('#updateMessage');
        const result = await response.json();
        $('#updateBGroupModal').modal('hide');
        updateNode(result.selectedBGroup);
        showMessage(false, "Балансовая группа '" + result.selectedBGroup.bgroupName + "' была успешно обновлена!");
    }
    else {
        fillModalMessage('#updateMessage', "Не удалось изменить балансовую группу!");
    }
}

// removing deleted BGroup node 

function removeNode(deletedBGroup) {
    var node = tree.getNodeById(deletedBGroup.bgroupId);
    tree.unselect(node);
    tree.removeNode(node);
}

// adding new created BGroup node

function addNode(createdBGroup) {
    var parent = tree.getNodeById(createdBGroup.bgroupIdparent);
    tree.off('dataBound');
    tree.addNode(createdBGroup, parent);
    var node = tree.getNodeById(createdBGroup.bgroupId);
    tree.unselectAll();
    tree.select(node);
}

// updating BGroup node

function updateNode(updateBGroup) {
    tree.updateNode(updateBGroup.bgroupId, updateBGroup);
    var node = tree.getNodeById(updateBGroup.bgroupId);
    tree.unselectAll();
    tree.select(node);
}

// setting selected Resource

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

// removing table view component 

function clearTableView() {
    data.points = null;
    $('#tableView tbody > tr').remove();

}

// removing valid disbalance

function clearValidDisbalance() {
    data.selectedBGroup = null;
    $('#validDisbalance').text("");
}

// removing tree view component

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

//setting create BGroup form

function showCreateBGroupModal() {
    clearModalMessage('#createMessage');
    createBGroupFormValidator.resetForm();

    $("#createBGroupName").val("");
    $("#createValidDisbalance").val("");
    $('#createResourceId').val(data.selectedResource.resourceId);

    if (data.selectedBGroup != null) {
        $('#asChild').val(data.selectedBGroup.bgroupId);
        $('#sameLevel').val(data.selectedBGroup.bgroupIdparent);
        $('#asChild').prop('disabled', false);
        $('#asChild').prop('checked', false);
        $('#sameLevel').prop('checked', false);
        $('#sameLevel').prop('disabled', false);
    }
    else {
        $('#sameLevel').val(null);
        $('#asChild').val(null);
        $('#asChild').prop('disabled', true);
        $('#asChild').prop('checked', false);
        $('#sameLevel').prop('checked', true);
        $('#sameLevel').prop('disabled', true);
    }
}

// setting BGroup form

function showUpdateBGroupModal() {
    clearModalMessage('#updateMessage');
    updateBGroupFormValidator.resetForm();

    $('#updateBGroupId').val(data.selectedBGroup.bgroupId);
    $('#updateBGroupName').val(data.selectedBGroup.bgroupName);
    $('#updateValidDisbalance').val(data.selectedBGroup.validDisbalance);
}

// setting delete BGroup form

function showDeleteBGroupModal() {
    var selectedBGroup = data.selectedBGroup;
    $('#deleteBGroupName').text(selectedBGroup.bgroupName);
    $('#deleteBGroupChildren').hide();
    var hasChildren = selectedBGroup.inverseBgroupIdparentNavigation.length;
    if (hasChildren > 0)
        $('#deleteBGroupChildren').show();
    $('#deleteBGroupId').val(selectedBGroup.bgroupId);
}

// setting success or error message (Index view)

function showMessage(error, message) {
    if (!error)
        $("#message").addClass('alert-success');
    else
        $("#message").addClass('alert-warning');
    $("#message").text(message);
    $("#message").show().delay(8000).fadeOut();

}

// setting error message (Modal window)

function fillModalMessage(element, message) {
    $(element).show();
    $(element).text(message);
}

// removing error message (Modal window)

function clearModalMessage(element) {
    $(element).text("");
    $(element).hide();
}

// setting jQuery validation

$.validator.setDefaults({
    errorElement: 'span',
    errorClass: 'invalid-feedback',
    highlight: function (element, errorClass) {
        $(element).addClass(this.settings.errorElementClass).removeClass(errorClass);
    },
    unhighlight: function (element, errorClass) {
        $(element).removeClass(this.settings.errorElementClass).removeClass(errorClass);
    },
    errorPlacement: function (error, element) {
        if (element.attr("name") == "createBGroupIdParent") {
            error.insertAfter("#level");
        } else {
            error.insertAfter(element);
        }
    }
});


$(document).ready(function () {

    // setting selected Point

    $('#tableView').delegate('tr', 'click', function () {
        var selected = $(this).hasClass('highlight');

        $('#tableView tr').removeClass('highlight');
        if (!selected)
            $(this).addClass('highlight');
    });

    // setting selected Resource

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

    $('#btnDeleteBGroupModal').on('click', function () {
        showDeleteBGroupModal();
    });

    $('#btnCreateBGroupModal').click(function () {
        showCreateBGroupModal();
    });

    $('#btnUpdateBGroupModal').click(function () {
        showUpdateBGroupModal();
    });

    $('#createBGroupForm').on('submit', function (e) {
        if ($("#createBGroupForm").valid()) {
            e.preventDefault();
            CreateBGroup();
        }
    });

    $('#updateBGroupForm').on('submit', function (e) {
        if ($("#updateBGroupForm").valid()) {
            e.preventDefault();
            UpdateBGroup();
        }
    });

    $('#deleteBGroupForm').on('submit', function (e) {
        e.preventDefault();
        DeleteBGroup();
    });

    updateBGroupFormValidator = $("#updateBGroupForm").validate({
        rules: {
            updateBGroupName: {
                required: true,
                maxlength: 255
            },
            updateValidDisbalance: {
                required: true,
                number: true
            },
        },
        messages: {
            updateBGroupName: {
                required: "Укажите имя балансовой группы, это поле не может быть пустым!",
                maxlength: "Название группы должно содержать меньше 255 символов!"
            },
            updateValidDisbalance: {
                required: "Укажите допустимый дисбаланс, это поле не может быть пустым!",
                number: "Укажите допустимый дисбаланс в правильном формате!",
            },
        }

    });

    
    createBGroupFormValidator = $("#createBGroupForm").validate({
        rules: {
            createBGroupName: {
                required: true,
                maxlength: 255
            },
            createValidDisbalance: {
                required: true,
                number: true
            },
            createBGroupIdParent: {
                required: true,
            }
        },
        messages: {
            createBGroupName: {
                required: "Укажите имя балансовой группы, это поле не может быть пустым!",
                maxlength: "Название группы должно содержать меньше 255 символов!"
            },
            createValidDisbalance: {
                required: "Укажите допустимый дисбаланс, это поле не может быть пустым!",
                number: "Укажите допустимый дисбаланс в правильном формате!",
            },
            createBGroupIdParent: {
                required: "Укажите уровень, это поле не может быть пустым!",
            }
        },
    });
});


