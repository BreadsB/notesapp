var LoadPage = ( function() {

    var apiRoot = window.location.origin + "/api/notes";
    var messagesList = $('[data-messages-list]');
    var sortingBlock = $('[_sortingBlock]');
    var datePicker = $('[_datePicker]');
    var filterButton = $('[_dateFilter]');
    var paginationMenu = $('#paginationMenu');
    var itemsPerPage = 10;

    function displayData(messages) {
        messagesList.empty();
        messages.forEach(function (element) {
            CreateMessage.createMessage(element).appendTo(messagesList);
        });
    }

    function getMessages(messages) {
        messagesList.removeClass('hidden');
        sortingBlock.removeClass('hidden');
        datePicker.removeClass('hidden');
        filterButton.removeClass('hidden');
        messagesList.slideDown(1000);
        if ($.isArray(messages)) {
            displayData(messages);
        } else if ( typeof messages === 'object') {
            displayData(messages.content);
        }
    }

    function getData(pageNumber, sortingType) {
        var link = apiRoot + '/page';
        $.ajax({
            url: link,
            method: "GET",
            contentType: "application/json",
            data: {
                page: (pageNumber-1),
                size: itemsPerPage,
                sort: sortingType
            },
            success: (data) => LoadPage.getMessages(data),
            error: function (xhr, textStatus, errorThrown) {
                Modals.showError("Error at filtering data", xhr);
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
                LoadPage.getData(pageNumberGlobal, sortingType);
                break;
            case 'sortDateDown':
                sortingType = 'createdAt,desc';
                LoadPage.getData(pageNumberGlobal, sortingType);
                break;
            case 'sortTitleUp':
                sortingType = 'title,asc';
                LoadPage.getData(pageNumberGlobal, sortingType);
                break;
            case 'sortTitleDown':
                sortingType = 'title,desc';
                LoadPage.getData(pageNumberGlobal, sortingType);
                break;
        }
    }

    function generatePagination(data) {
        paginationMenu.empty();
        var countedPages = data;
        for (let i = 1; i <= countedPages; i++) {
            var page = $('<button>').addClass('page-link').text(i).on('click', () => LoadPage.loadPage(i));
            paginationMenu.append(page);
        }
    }

    function getTotalPages() {
        var src = apiRoot + "/page/count";
        $.ajax({
            url: src,
            method: "GET",
            contentType: "application/json",
            success: LoadPage.generatePagination,
            error: function (xhr, textStatus, errorThrown) {
                Modals.showError("Error at filtering data", xhr);
            }
        });
    }

    function filterData() {
        var pickedDate = datePicker.val();
        var connectionURL = apiRoot + "/by-date";

        if (pickedDate !== "") {
            $.ajax({
                url: connectionURL,
                method: "GET",
                contentType: "application/json",
                data: {
                    timestamp: pickedDate + "T00:00:00"
                },
                success: function(data) {
                    LoadPage.getMessages(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    Modals.showError("Error at filtering data", xhr);
                }
            })
        } else {
            $.ajax({
                url: apiRoot,
                method: "GET",
                contentType: "application/json",
                success: (data) => LoadPage.getMessages(data),
                error: function (xhr, textStatus, errorThrown) {
                    Modals.showError("Error at filtering data", xhr);
                }
            })
        }
    }

    return {
        displayData: displayData,
        getMessages: getMessages,
        getData: getData,
        loadPage: loadPage,
        generatePagination: generatePagination,
        getTotalPages: getTotalPages,
        filterData: filterData
    };
})();