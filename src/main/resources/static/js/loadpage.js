var LoadPage = ( function() {

    var apiRoot = window.location.origin + "/api/notes/";
    var messagesList = $('[data-messages-list]');
    var sortingBlock = $('[_sortingBlock]');
    var datePicker = $('[_datePicker]');
    var filterButton = $('[_dateFilter]');
    var paginationMenu = $('#paginationMenu');
    var pageNumberGlobal;
    var itemsPerPage = 10;

    return {

        displayData: function(data) {
            messagesList.empty();
            data.forEach(function (element) {
                CreateMessage.createMessage(element).appendTo(messagesList);
            });
        },

        getMessages: function(messages) {
            fetchedMessagesList = messages.content;
            this.displayData(fetchedMessagesList);
            messagesList.removeClass('hidden');
            sortingBlock.removeClass('hidden');
            datePicker.removeClass('hidden');
            filterButton.removeClass('hidden');
            messagesList.slideDown(1000);
        },

        getData: function(pageNumber, sortingType) {
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
                success: (data) => this.getMessages(data),
                error: function (xhr, textStatus, errorThrown) {
                    Modals.showError("Error at filtering data", xhr);
                }
            });
        },

        loadPage: function(i) {
            var sortingType;
            var chosenSorting = sortingBlock.val();
            pageNumberGlobal = i;
            switch (chosenSorting) {
                case 'sortDateUp':
                    sortingType = 'createdAt,asc';
                    this.getData(pageNumberGlobal, sortingType);
                    break;
                case 'sortDateDown':
                    sortingType = 'createdAt,desc';
                    this.getData(pageNumberGlobal, sortingType);
                    break;
                case 'sortTitleUp':
                    sortingType = 'title,asc';
                    this.getData(pageNumberGlobal, sortingType);
                    break;
                case 'sortTitleDown':
                    sortingType = 'title,desc';
                    this.getData(pageNumberGlobal, sortingType);
                    break;
            }
        },

        generatePagination: function(data) {
            paginationMenu.empty();
            var countedPages = data;
            for (let i = 1; i <= countedPages; i++) {
                var page = $('<button>').addClass('page-link').text(i).on('click', () => this.loadPage(i));
                paginationMenu.append(page);
            }
        },

        getTotalPages: function() {
            var src = apiRoot + "page/count";
            $.ajax({
                url: src,
                method: "GET",
                contentType: "application/json",
                success: this.generatePagination.bind(this),
                error: function (xhr, textStatus, errorThrown) {
                    Modals.showError("Error at filtering data", xhr);
                }
            });
        },

        getAllMessages: function(event) {
            var connectionUrl = apiRoot;
            this.generatePagination();
            $.ajax({
                url: connectionUrl,
                method: "GET",
                dataType: 'json',
                success: this.getMessages.bind(this),
                error: function (xhr) {
                    Modals.showError("Error at fetching all data from server", xhr);
                }
            });
        }
    }
})();