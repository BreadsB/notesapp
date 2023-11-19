$(document).ready(function () {

    var htmlBody = $('body');
    var apiRoot = window.location.origin + "/api/notes/";
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
    var pageNumberGlobal;

    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        jqXHR.setRequestHeader('X-CSRF-Token', token);
    });

    $('#logoutLink').on('click', function(e) {
        e.preventDefault();
        document.logoutForm.submit();
    });

    function getMessageBodyButton(button, messageBody) {
        var closeBodyText = 'Close body';

        if (button.text() == getBodyText) {
            button.text(closeBodyText);
        } else {
            button.text(getBodyText);
        }

        messageBody.slideToggle(1000);
    };

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
                showError("Error creating new note", xhr);
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

    function updateMessage(button, title, body, id) {
        body.slideDown();

        var connectionURL = apiRoot;
        var titleText = title.text();
        var bodyText = body.text();
        var messageId = id;

        var titleInput = $('<input>').addClass('titleInputBlock block').val(titleText);
        title.text('');
        title.append(titleInput);
        title.addClass('white');

        var bodyInput = $('<textarea>').addClass('bodyInputBlock block').val(bodyText);
        body.text('');
        body.append(bodyInput);
        body.addClass('white');

        button.on('click', function () {
            var newTitle = titleInput.val();
            var newBody = bodyInput.val();

            $.ajax({
                url: connectionURL + messageId,
                method: 'PUT',
                processData: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "title": newTitle,
                    "body": newBody
                }),
                success: function (response) {
                    replaceInputWithText(titleInput, bodyInput, title, body);
                    afterUpdate(button);
                },
                error: function (xhr, textStatus, errorThrown) {
                    showError("Error - could not update data", xhr);
                }
            });
        })
    }

    function afterUpdate(button) {
        button.on('click', updateMessage);
        Modals.showAlert("UPDATED", "Message has been updated", getAllMessages);
        LoadPage.loadPage(pageNumberGlobal);
    }

    function replaceInputWithText(titleInput, bodyInput, title, body) {
        title.text(titleInput.val());
        body.text(bodyInput.val());
        titleInput.remove();
        bodyInput.remove();
        title.removeClass('white');
        body.removeClass('white');
    }

    function confirmDelete(message, messageId) {
        var connectionURL = apiRoot;
        var deleteText = "Are you sure you want to delete message?";
        $('<div></div>').appendTo('body')
            .html('<div><h6>' + deleteText + "</h6></div>")
            .dialog({
                modal: true,
                title: 'Delete message',
                zIndex: 1000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    Yes: function () {
                        
                        $.ajax({
                            url: connectionURL + messageId,
                            method: 'DELETE',
                            success: function () {
                                message.remove();
                                Modals.showConfirm();
                            },
                            error: function (xhr) {
                                Modals.showError("Error - could not delete message", xhr);
                            }
                        });
                        $(this).dialog("close");
                    },
                    No: function () {
                        $(this).dialog("close");
                    }
                }
            });
    }

    filterButton.on("click", function () {
        var pickedDate = datePicker.val();
        var connectionURL = apiRoot + "by-date/";

        if (pickedDate !== "") {
            var requestData = {
                timestamp: pickedDate + "T00:00:00"
            }

            $.ajax({
                url: connectionURL,
                method: "GET",
                contentType: "application/json",
                data: requestData,
                success: LoadPage.loadPage(pageNumberGlobal),
                error: function (xhr, textStatus, errorThrown) {
                    showError("Error at filtering data", xhr);
                }
            })
        } else {
            $.ajax({
                url: apiRoot,
                method: "GET",
                contentType: "application/json",
                success: getMessages,
                error: function (xhr, textStatus, errorThrown) {
                    showError("Error at filtering data", xhr);
                }
            })
        }
    });

    sortingBlock.change(function () {
        messagesList.empty();
        LoadPage.loadPage(pageNumberGlobal);
    });

    LoadPage.getTotalPages();
    LoadPage.loadPage(1);
});
