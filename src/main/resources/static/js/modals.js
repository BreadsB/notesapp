var Modals = (function() {

    var htmlBody = $('body');

    return {
        showConfirm: function() {
            var confirmDiv = $('<div>').attr('id', 'toast').addClass('show').addClass('success').text("Success");
            htmlBody.append(confirmDiv);

            setTimeout(function () {
                confirmDiv.toggleClass('show');
            }, 3000);
        },

        showError: function(message, xhr) {
            if (xhr.status == "429") {
                message = "Too many requests";
            }
            var confirmDiv = $('<div>').attr('id', 'toast').addClass('show').addClass('error').text(message);
            htmlBody.append(confirmDiv);

            setTimeout(function () {
                confirmDiv.toggleClass('show');
            }, 3000);
        },

        showAlert: function(messageTitle, alertMessage, functionToRun) {
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
    }
})();