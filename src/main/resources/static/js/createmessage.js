var CreateMessage = (function() {

    var getBodyText = 'Get body';
    var apiRoot = window.location.origin + "/api/notes";
    var self = this;
    var pageNumberGlobal;

    function afterUpdate(button) {
        button.on('click', CreateMessage.updateMessage);
        Modals.showAlert("UPDATED", "Message has been updated", LoadPage.getAllMessages);
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

    function getMessageBodyButton(button, messageBody) {
        var closeBodyText = 'Close body';

        if (button.text() == getBodyText) {
            button.text(closeBodyText);
        } else {
            button.text(getBodyText);
        }

        messageBody.slideToggle(1000);
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
                url: connectionURL + "/" + messageId,
                method: 'PUT',
                processData: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    "title": newTitle,
                    "body": newBody
                }),
                success: function() {
                    replaceInputWithText(titleInput, bodyInput, title, body);
//                    afterUpdate(button);
                },
                error: function (xhr, textStatus, errorThrown) {
                    Modals.showError("Error - could not update data", xhr);
                }
            })
            .done(afterUpdate(button));
        });
    }

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
            var getBodyButton = $('<button>').addClass('getMessageBodyButton messageButton').text(getBodyText).on('click', () => CreateMessage.getMessageBodyButton(getBodyButton, messageBody));
            var updateMessageButton = $('<button>').addClass('updateMessageButton messageButton').text('Update').on('click', () => CreateMessage.updateMessage(updateMessageButton, messageTitle, messageBody, element.id));
            var deleteMessageButton = $('<button>').addClass('deleteMessageButton messageButton').text('Delete').on('click', () => CreateMessage.confirmDelete(message, element.id));

            messageButton.append(getBodyButton);
            var buttonsBlock = $('<div>').addClass('restButtons');
            buttonsBlock.append(updateMessageButton);
            buttonsBlock.append(deleteMessageButton);
            messageButton.append(buttonsBlock)
            messageHint.append(messageTitle, messageDate, messageButton);
            message.append(messageHint, messageBody);

            return message;
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
                                url: connectionURL + "/" + messageId,
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

    return {
        afterUpdate: afterUpdate,
        replaceInputWithText: replaceInputWithText,
        getMessageBodyButton: getMessageBodyButton,
        updateMessage: updateMessage,
        createMessage: createMessage,
        confirmDelete: confirmDelete
    };

})();
