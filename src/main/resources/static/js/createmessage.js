var CreateMessage = (function() {

    var getBodyText = 'Get body';

    return {
        createMessage: function(element) {
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
    }
})();
