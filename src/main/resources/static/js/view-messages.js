$(document).ready(function () {

    var htmlBody = $('body');
    var apiRoot = window.location.origin + "/api/notes/";
    var getButton = $('[name="getAllMessages"]');
    var messagesList = $('[data-messages-list]');
    var itemsPerPage = 10;
    var getBodyText = 'Get body';
    var sortingBlock = $('[_sortingBlock]');
    var datePicker = $('[_datePicker]');
    var filterButton = $('[_dateFilter]');
    var createMessageButton = $('#createMessageButton');
    var cancelCreationButton = $('#cancelButton');
    var clearButton = $('#clearButton');
    var sendButton = $('#sendButton');
    var noteForm = $('[data-note-add-form]');
    var modal = $('.modal');
    var inputTitle = $('#inputTitle');
    var inputText = $('#inputText');
    var fetchedMessagesList;
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    var paginationMenu = $('#paginationMenu');
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
                    showConfirm();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                showError("Error creating new note", xhr);
            },
            complete: function () {
                modal.hide();
                loadPage(pageNumberGlobal);
                showConfirm();
            }
        });

        cleanData(inputTitle);
        cleanData(inputText);

    }

    function cleanData(element) {
        element.val('');
    }

    noteForm.on('submit', postData);

    function createMessage(element) {
        var message = $('<li>').addClass('message');
        var messageHint = $('<div>').addClass('message-hint');
        var messageTitle = $('<div>').addClass('messageTitleBlock block').text(element.title);

        var dc = new Date(element.createdAt);
        var messageDate = $('<div>')
            .addClass('messageDateBlock block')
            .text(
                dc.getHours() + ":" +
                dc.getMinutes() + ":" +
                dc.getSeconds() + "." +
                dc.getMilliseconds() + "  " +
                dc.getDate() + "/" +
                (dc.getMonth() + 1) + "/" +
                dc.getFullYear()
            );

        var messageButton = $('<div>').addClass('messageButtonBlock');
        var messageBody = $('<div>').addClass('messageBody scrollbar').text(element.body);
        var getBodyButton = $('<button>').addClass('getMessageBodyButton messageButton').text(getBodyText).on('click', function () {
            getMessageBodyButton(getBodyButton, messageBody);
        });
        var updateMessageButton = $('<button>').addClass('updateMessageButton messageButton').text('Update').on('click', function () {
            updateMessage(updateMessageButton, messageTitle, messageBody, element.id);
        });
        var deleteMessageButton = $('<button>').addClass('deleteMessageButton messageButton').text('Delete').on('click', function () {
            confirmDelete(message, element.id);
        })

        messageButton.append(getBodyButton);
        var buttonsBlock = $('<div>').addClass('restButtons');
        buttonsBlock.append(updateMessageButton);
        buttonsBlock.append(deleteMessageButton);
        messageButton.append(buttonsBlock)
        messageHint.append(messageTitle, messageDate, messageButton);
        message.append(messageHint, messageBody);

        return message;
    }

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
        showAlert("UPDATED", "Message has been updated", getAllMessages);
//        sortMessageList();
        loadPage(pageNumberGlobal);
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
                                showConfirm();
                            },
                            error: function (xhr) {
                                showError("Error - could not delete message", xhr);
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
                success: getMessages,
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

    function showAlert(messageTitle, alertMessage, functionToRun) {
        $('<div></div>').appendTo('body')
            .html('<div><h6>' + alertMessage + "</h6></div>")
            .dialog({
                modal: true,
                title: messageTitle,
                zIndex: 1000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    Confirm: function () {
                        functionToRun();
                        $(this).dialog("close");
                    }
                }
            });
    }

    function sortMessageList() {
        var actualSelectedOption = sortingBlock.val();
        var listItems = messagesList.children("li").get();

        listItems.sort(function (a, b) {
            var aTitle = $(a).find(".messageTitleBlock").text();
            var bTitle = $(b).find(".messageTitleBlock").text();
            var aDateTime = $(a).find(".messageDateBlock").text();
            var bDateTime = $(b).find(".messageDateBlock").text();

            var aDate = aDateTime[0];
            var bDate = bDateTime[0];
            var aTime = aDateTime[1];
            var bTime = bDateTime[1];

            switch (actualSelectedOption) {
                case 'sortDateUp':
                    var dateComparison = aDate.localeCompare(bDate);
                    if (dateComparison === 0) {
                        return aTime.localeCompare(bTime);
                    }
                    return dateComparison;
                case 'sortDateDown':
                    var dateComparison = bDate.localeCompare(aDate);
                    if (dateComparison === 0) {
                        return bTime.localeCompare(aTime);
                    }
                    return dateComparison;
                case 'sortTitleUp':
                    return aTitle.localeCompare(bTitle);
                case 'sortTitleDown':
                    return bTitle.localeCompare(aTitle);
            }
        });

        $.each(listItems, function (i, li) {
            messagesList.append(li);
        });
    }

    function showConfirm() {
        var confirmDiv = $('<div>').attr('id', 'toast').addClass('show').addClass('success').text("Success");
        htmlBody.append(confirmDiv);

        setTimeout(function () {
            confirmDiv.toggleClass('show');
        }, 3000);
    }

    function showError(message, xhr) {
        if (xhr.status == "429") {
            message = "Too many requests";
        }
        var confirmDiv = $('<div>').attr('id', 'toast').addClass('show').addClass('error').text(message);
        htmlBody.append(confirmDiv);

        setTimeout(function () {
            confirmDiv.toggleClass('show');
        }, 3000);
    }

//    SORTING DATA ALGORITHM
    sortingBlock.change(function () {
        messagesList.empty();
        loadPage(pageNumberGlobal);
    });

//    GET PAGINATED MESSAGES: -------------------------------------------------------------------------------
    function getAllMessages(event) {
        var connectionUrl = apiRoot;
        generatePagination();
        $.ajax({
            url: connectionUrl,
            method: "GET",
            dataType: 'json',
            success: getMessages,
            error: function (xhr) {
                showError("Error at fetching all data from server", xhr);
            }
        });
    }

    function displayData(data) {
        messagesList.empty();
        var actualSelectedOption = sortingBlock.val();
        data.forEach(function (element) {
            createMessage(element).appendTo(messagesList);
        });
    }

    function getMessages(messages) {
        fetchedMessagesList = messages;
        displayData(messages);
        messagesList.removeClass('hidden');
        sortingBlock.removeClass('hidden');
        datePicker.removeClass('hidden');
        filterButton.removeClass('hidden');
        messagesList.slideDown(1000);
    }

    function getData(pageNumber, sortingType) {
        var link = apiRoot + 'page';
        $.ajax({
            url: link,
            method: "GET",
            contentType: "application/json",
            data: {
                page: (pageNumber-1),
                size: itemsPerPage,
                sort: sortingType
            },
            success: function(data) {
                getMessages(data.content);
            },
            error: function (xhr, textStatus, errorThrown) {
                showError("Error at filtering data", xhr);
            }
        });
    }

        function loadPage(i) {
            var sortingType;
            var chosenSorting = sortingBlock.val();
            pageNumberGlobal = i;
            switch (chosenSorting) {
                case 'sortDateUp':
                    sortingType = 'createdAt,asc';
                    getData(i, sortingType);
                    break;
                case 'sortDateDown':
                    sortingType = 'createdAt,desc';
                    getData(i, sortingType);
                    break;
                case 'sortTitleUp':
                    sortingType = 'title,asc';
                    getData(i, sortingType);
                    break;
                case 'sortTitleDown':
                    sortingType = 'title,desc';
                    getData(i, sortingType);
                    break;
            }
        }

    function generatePagination(data) {
        paginationMenu.empty();
        var countedPages = data;
        for (let i = 1; i <= countedPages; i++) {
            var page = $('<button>').addClass('page-link').text(i).on('click', function() {
                loadPage(i);
            });
            paginationMenu.append(page);
        }
    }

    function getTotalPages() {
        var src = apiRoot + "page/count";
        $.ajax({
            url: src,
            method: "GET",
            contentType: "application/json",
            success: generatePagination,
            error: function (xhr, textStatus, errorThrown) {
                showError("Error at filtering data", xhr);
            }
        });
    }

    getTotalPages();
    loadPage(1);
});
