var pageNumberGlobal;

$(document).ready(function () {

    var htmlBody = $('body');
    var apiRoot = window.location.origin + "/api/notes";
    var messagesList = $('[data-messages-list]');
    var getBodyText = 'Get body';
    var sortingBlock = $('[_sortingBlock]');
    var datePicker = $('[_datePicker]');
    var filterButton = $('[_dateFilter]');
    var createMessageButton = $('#createMessageButton');
    var cancelCreationButton = $('#cancelButton');
    var noteForm = $('[data-note-add-form]');
    var modal = $('.modal');
    var inputTitle = $('#inputTitle');
    var inputText = $('#inputText');
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    CreateMessage.pageNumberGlobal = pageNumberGlobal;

    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        jqXHR.setRequestHeader('X-CSRF-Token', token);
    });

    $('#logoutLink').on('click', function(e) {
        e.preventDefault();
        document.logoutForm.submit();
    });

    createMessageButton.on('click', function () {
        modal.show();
    }); 

    cancelCreationButton.on('click', function () {
        modal.hide();
    })

    function postData(event) {
        event.preventDefault();

        var inputTitleValue = $('#inputTitle').val();
        var inputTextValue = $('#inputText').val();
        var requestUrl = apiRoot;

        var noteData = {
            title: inputTitleValue,
            body: inputTextValue
        };

        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(noteData),
            success: function (response) {
                if (response.status === 201) {
                    Modals.showConfirm();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                Modals.showError("Error creating new note", xhr);
            },
            complete: function () {
                modal.hide();
                LoadPage.loadPage(pageNumberGlobal);
                Modals.showConfirm();
            }
        });

        cleanData(inputTitle);
        cleanData(inputText);

    }

    function cleanData(element) {
        element.val('');
    }

    noteForm.on('submit', postData);

    filterButton.on("click", LoadPage.filterData);

    sortingBlock.change(function () {
        messagesList.empty();
        LoadPage.loadPage(pageNumberGlobal);
    });

    LoadPage.getTotalPages();
    LoadPage.loadPage(1);
});
