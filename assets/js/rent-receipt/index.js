$(document).ready(function () {
    var pages = [];
    var receipts = [];

    $('#generate-receipts').click(function (e) {
        receipts = [];
        e.preventDefault();
        const currentPage = pages[pages.length - 1];

        getReceipts();
        displaReceipts(receipts);
    })

    $('#save-as-pdf').on('click',function(){
        const tenantName = $('#tenantName').val();
        getPDF("#receipts-container", tenantName);
    })

    function getPDF(target, fileName) {
        html2canvas($('#receipts-container')[0]).then(function(canvas){
            const pdf = new jsPDF();
            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 211, 298);
            pdf.save("invoice.pdf");
        
        })
    }



    function getReceipts() {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const tenantName = $('#tenantName').val();
        const houseAddress = $('#houseAddress').val();
        const rent = $('#rent').val();
        const startDate = new Date($('#receipt-start-date').val());
        const endDate = new Date($('#receipt-end-date').val());

        const ownersName = $('#ownerName').val();
        const ownersPan = $('#ownersPan').val();
        const paymentMode = $('#paymentMode').val();


        while (startDate <= endDate) {
            var month = startDate.getMonth();
            var year = startDate.getFullYear();

            const receipt = $('<div class="receipt pb-5 mt-2" id="receipt' + (receipts.length + 1) + '"><div class="row">' +
                '<div class="col-md-6"><h4 style="color: var(--theme-sky-blue);">Rent receipt</h4></div>' +
                '<div class="col-md-6"><div class="d-flex justify-content-end">' + monthNames[month] + " " + year + '</div></div></div>' +
                '<div class="col-md-9 my-4"><p>Received a sum of <strong>Rs. ' + rent + '</strong> from <strong>' + tenantName + '</strong>' +
                ' for the rent of property situated at <strong>' + houseAddress + '</strong> for the month <strong>' + monthNames[month] + " " + year + '</strong></p>' +
                '<div class="col-md-12"><p>Payment mode: <span>' + paymentMode + ' </span></p></div></div>' +
                '<div class="col-md-12"><div class="row"><div class="col-md-6">' +
                '<div class="col-md-12">Owner"s name: <span>' + ownersName + '</span></div>' +
                '<div class="col-md-12">PAN:  <span>' + ownersPan + '</span></div></div>' +
                '<div class="col-md-6"><div class="col-md-12 d-flex justify-content-end">______________________</div>' +
                '<div class="col-md-12 d-flex justify-content-end">(Signature of owner)</div>' +
                '</div></div></div></div><div>----------------------------------------------------------------------------------------------------------------</div>');

            receipts.push(receipt);
            startDate.setMonth(startDate.getMonth() + 1);
        }
    }

    function addPage() {
        const page = $('<div>').addClass('a4').attr('id', `page${pages.length + 1}`)
        pages.push(page);
    }

    function displayPages(pages, target) {
        pages.forEach(function (page, index) {
            $(target).append(page);
        });
    }

    function displaReceipts(receipts) {
        var itemsPerPage = 3;
        var currentPage = 1;
        var itemCounter = 0;
        plotPages(receipts, itemsPerPage);


        $.each(receipts, function(index, receipt) {
            itemCounter++;
            if (itemCounter > itemsPerPage) {
                currentPage++;
                itemCounter=1;
        
            }
            receipt.appendTo($('#page' + currentPage));

        });
    }





    function plotPages(receipts, itemsPerPage) {
        pages = [];
        $("#receipts-container").html('');
        var numOfPages = Math.ceil(receipts.length / itemsPerPage);

        if(numOfPages < 1){
            numOfPages = 1;
        }

        for (let i = 0; i < numOfPages; i++) {
            addPage();
        }
        displayPages(pages, "#receipts-container");
    }


});