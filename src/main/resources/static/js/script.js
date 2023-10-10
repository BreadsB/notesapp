$(document).ready(function () {

    var apiUrl = "http://localhost:8080/api/notes/";

    fetchMessages();

    function fetchMessages() {
        $.get(apiUrl, function (data) {
            var messageList = $(".listContent");
            var textOpen = "Open";
            var textClose = "Close";

            //            var list = sortListByDate(data);
            var list = sortListByTitle(data);

            $.each(list, function (i, element) {
                var messageTitleText = element.title;
                var messageDateText = element.createdAt;
                var messageBodyText = element.body;

                var newMessage = $('<div>').addClass('message');
                var messageHeadline = $('<div>').addClass('messageHeadline');
                var messageTitle = $('<div>').addClass('messageTitle').text(messageTitleText);
                var messageDate = $('<div>').addClass('messageDate').text(messageDateText);
                var messageButtons = $('<div>').addClass("messageButtons");
                var messageBody = $('<div>').addClass("messageBody").text(messageBodyText);

                var buttonOpen = $('<button>').text(textOpen).on('click', function () {
                    messageBody.toggle();
                    if ($(this).text() === textOpen) {
                        $(this).text(textClose);
                    } else {
                        $(this).text(textOpen);
                    }
                });
                var buttonUpdate = $('<button>').text('Update').on('click', function () {
                    console.log('updating');
                });
                var buttonDelete = $('<button>').text('Delete').on('click', function () {
                    newMessage.remove();
                    console.log('deleting');
                });

                var buttonOpenDiv = $('<div>').addClass('buttons buttonOpen').append(buttonOpen);
                var buttonUpdateDiv = $('<div>').addClass('buttons buttonUpdate').append(buttonUpdate);
                var buttonDeleteDiv = $('<div>').addClass('buttons buttonDelete').append(buttonDelete);

                messageButtons.append(buttonOpenDiv).append(buttonUpdateDiv).append(buttonDeleteDiv);
                messageHeadline.append(messageTitle).append(messageDate).append(messageButtons);
                newMessage.append(messageHeadline).append(messageBody);
                messageList.append(newMessage);
            });
        });
    }

    function sortListByDate(data) {
        data.sort(function (a, b) {
            var aDate = new Date(a.createdAt);
            var bDate = new Date(b.createdAt);

            if (aDate < bDate) {
                return -1;
            } else if (aDate > bDate) {
                return 1;
            } else {
                var aTime = aDate.getTime();
                var bTime = bDate.getTime();

                if (aTime < bTime) {
//                    return 1;
                    return -1;
                } else if (aTime > bTime) {
//                    return -1;
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        return data;
    }

    function sortListByTitle(data) {
        data.sort(function (a, b) {
            var aTitle = a.title;
            var bTitle = b.title;

            if (aTitle > bTitle) {
                return 1;
//                return -1;
            } else if (aTitle < bTitle) {
                return -1;
//                return 1;
            } else {
                return 0;
            }
        });
        return data;
    }
    
    
});
