$(document).ready(function () {
    var pages = [];
    var receipts = [];

    $('#generate-receipts').click(function (e) {
        receipts = [];
        e.preventDefault();
        const currentPage = pages[pages.length - 1];

        getPDF(getReceipts());
    })

    function getPDF(formData) {
        const formDataJson = JSON.parse(formData)[0];
        var receipts = [];
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var startDate = new Date(formDataJson.startDate);
        var endDate = new Date(formDataJson.endDate);

        while (startDate <= endDate) {
            var month = startDate.getMonth();
            var year = startDate.getFullYear();
            var receipt = {};


            receipt["id"] = month;
            receipt["tenantName"] = formDataJson.tenantName;
            receipt["houseAddress"] = formDataJson.houseAddress;
            receipt["rent"] = formDataJson.rent;
            receipt["monthAndYear"] = monthNames[month] + " " + year;
            receipt["ownersName"] = formDataJson.ownersName;
            receipt["ownersPan"] = formDataJson.ownersPan;
            receipt["paymentMode"] = getPaymentModestring(formDataJson.paymentMode);


            receipts.push(receipt);
            startDate.setMonth(startDate.getMonth() + 1);
        }

        showPDF(JSON.stringify(receipts), "#receipts-container");
    }


    function showPDF(formData, target) {
        const formDataJson = JSON.parse(formData);
        var docDefinition = {
            info: {
                title: 'Rent receipt document by gtmtools.github.io',
                author: 'gtmtools.github.io',
                subject: 'Rent receipt document',
                keywords: 'Rent receipt document by gtmtools.github.io',
            },
            content: [],
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    margin: [0, 0, 0, 0],
                    color: '#2C50C9'
                },
                description: {
                    margin: [0, 15, 0, 15]
                },
                paymentMode: {
                    margin: [0, 0, 0, 15]
                },
                signature: {
                    alignment: 'right'
                },
                separator: {
                    margin: [0, 40, 0, 40],
                    color: '#a5a5a5'

                },
            }
        };



        $.each(formDataJson, function (index, receipt) {
            var separator = {
                text: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -",
                style: 'separator'
            };

            docDefinition.content.push([
                {
                    text: 'Rent receipt',
                    style: 'header'
                },
                {
                    text: formDataJson[index].monthAndYear,
                    style: 'monthAndYear'
                },

                {
                    text: [
                        "Received sum of ",
                        { text: "Rs. " + formDataJson[index].rent, bold: true },
                        " from ",
                        { text: formDataJson[index].tenantName, bold: true },
                        " for the rent of property situated at ",
                        { text: formDataJson[index].houseAddress, bold: true },
                        " for the month of ",
                        { text: formDataJson[index].monthAndYear + ".", bold: true },


                    ],
                    style: 'description',
                },
                {
                    text: [
                        "Payment mode: ",
                        { text: formDataJson[index].paymentMode }
                    ],
                    style: 'paymentMode'
                },


                {
                    columns: [
                        {
                            text: [
                                "Owner's name: ",
                                { text: formDataJson[index].ownersName + "\n", bold: true },
                                "Owner's PAN: ",
                                { text: formDataJson[index].ownersPan, bold: true }
                            ]
                        },
                        {
                            text: [
                                "______________________\n",
                                "(Signature of landlord) "
                            ],
                            style: 'signature'
                        }
                    ]
                },
                separator
            ]);

        });





        var pdfDocGenerator = pdfMake.createPdf(docDefinition);

        pdfDocGenerator.getDataUrl(function (dataUrl) {
            var targetContainer = document.querySelector(target);
            var iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.src = dataUrl;
            targetContainer.innerHTML = "";
            targetContainer.appendChild(iframe);
        });


        $('#save-as-pdf').on('click', function () {
            pdfMake.createPdf(docDefinition).download(formDataJson[0].tenantName+"-[gtmpai.github.io].pdf");
        });



    }

    function getPaymentModestring(paymentModeId) {
        var PaymentModestring = "";
        switch (paymentModeId) {
            case "1":
                PaymentModestring = "Cash"
                break;
            case "2":
                PaymentModestring = "Credit/Debit card"
                break;
            case "3":
                PaymentModestring = "UPI"
                break;
            case "4":
                PaymentModestring = "Money order"
                break;

            default:
                PaymentModestring = "Other"
                break;
        }
        return PaymentModestring;
    }



    function getReceipts() {

        const tenantName = $('#tenantName').val();
        const houseAddress = $('#houseAddress').val();
        const rent = $('#rent').val();
        const startDate = new Date($('#receipt-start-date').val());
        const endDate = new Date($('#receipt-end-date').val());
        const ownersName = $('#ownerName').val();
        const ownersPan = $('#ownersPan').val();
        const paymentMode = $('#paymentMode').val();



        const formData = {
            tenantName,
            houseAddress,
            rent,
            startDate,
            endDate,
            ownersName,
            ownersPan,
            paymentMode
        };
        return JSON.stringify([formData]);


        // while (startDate <= endDate) {
        //    

        //     const receipt = $('<div class="receipt pb-5 mt-2" id="receipt' + (receipts.length + 1) + '"><div class="row">' +
        //         '<div class="col-md-6"><h4 style="color: var(--theme-sky-blue);">Rent receipt</h4></div>' +
        //         '<div class="col-md-6"><div class="d-flex justify-content-end">' + monthNames[month] + " " + year + '</div></div></div>' +
        //         '<div class="col-md-9 my-4"><p>Received a sum of <strong>Rs. ' + rent + '</strong> from <strong>' + tenantName + '</strong>' +
        //         ' for the rent of property situated at <strong>' + houseAddress + '</strong> for the month <strong>' + monthNames[month] + " " + year + '</strong></p>' +
        //         '<div class="col-md-12"><p>Payment mode: <span>' + paymentMode + ' </span></p></div></div>' +
        //         '<div class="col-md-12"><div class="row"><div class="col-md-6">' +
        //         '<div class="col-md-12">Owner"s name: <span>' + ownersName + '</span></div>' +
        //         '<div class="col-md-12">PAN:  <span>' + ownersPan + '</span></div></div>' +
        //         '<div class="col-md-6"><div class="col-md-12 d-flex justify-content-end">______________________</div>' +
        //         '<div class="col-md-12 d-flex justify-content-end">(Signature of owner)</div>' +
        //         '</div></div></div></div><div>----------------------------------------------------------------------------------------------------------------</div>');

        //     receipts.push(receipt);
        //     startDate.setMonth(startDate.getMonth() + 1);
        // }
    }


});