$(document).ready(function () {
    var pages = [];
    var receipts = [];
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    $(document).keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault();
            $('#save-as-pdf').click();
        }
    });

    $('#save-as-pdf').attr('disabled', true);


    $('input').on('keyup change', function () {
        $(this).removeClass('is-invalid');
    })
    $('select').on('change', function () {
        $(this).removeClass('is-invalid');
    })

    $('textarea').on('keyup', function () {
        $(this).removeClass('is-invalid');
    })

    $('#generate-receipts').click(function (e) {
        receipts = [];
        e.preventDefault();
        const currentPage = pages[pages.length - 1];

        getPDF(getReceipts());
    })

    $('.numOnly').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('.caps').on('keyup', function () {
        return this.value.toUpperCase();
    });

    function getPDF(formData) {
        const formDataJson = JSON.parse(formData)[0];


        const tenantName = formDataJson.tenantName;
        const houseAddress = formDataJson.houseAddress;
        const rent = formDataJson.rent;
        var startDate = new Date(formDataJson.startDate);
        var endDate = new Date(formDataJson.endDate);
        const ownersName = formDataJson.ownersName;
        const ownersPan = formDataJson.ownersPan;
        const paymentMode = formDataJson.paymentMode;

        var isErrorExist = false;

        if (tenantName === null || tenantName === "") {
            $('#tenantName').addClass('is-invalid');
            isErrorExist = true;
        } else {
            $('#tenantName').removeClass('is-invalid');
        }


        if (houseAddress === null || houseAddress === "" || houseAddress.length > 256) {
            $('#houseAddress').addClass('is-invalid');
            isErrorExist = true;
        } else {
            $('#houseAddress').removeClass('is-invalid');
        }


        if (rent === null || rent === "") {
            $('#rent').addClass('is-invalid');
            isErrorExist = true;
        } else {
            $('#rent').removeClass('is-invalid');
        }

        if (!formDataJson.startDate) {
            $('#receipt-start-date').addClass('is-invalid');
            isErrorExist = true;
        } else {
            $('#receipt-start-date').removeClass('is-invalid');
        }

        if (!formDataJson.endDate) {
            $('#receipt-end-date').addClass('is-invalid');
            isErrorExist = true;
        } else if (endDate < startDate) {
            $('#receipt-end-date').addClass('is-invalid');
            isErrorExist = true;
        } else {
            $('#receipt-end-date').removeClass('is-invalid');
        }

        if (ownersName === null || ownersName === "") {
            $('#ownerName').addClass('is-invalid');
            isErrorExist = true;
        } else {
            $('#ownerName').removeClass('is-invalid');
        }

        if (paymentMode === null || paymentMode === "-1" || paymentMode === -1) {
            $('#paymentMode').addClass('is-invalid');
            isErrorExist = true;
        } else {
            $('#paymentMode').removeClass('is-invalid');
        }





        if (!isErrorExist) {

            var receipts = [];
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


            while (startDate <= endDate) {
                var month = startDate.getMonth();
                var year = startDate.getFullYear();
                var receipt = {};


                receipt["id"] = month;
                receipt["tenantName"] = tenantName;
                receipt["houseAddress"] = houseAddress;
                receipt["rent"] = rent;
                receipt["monthAndYear"] = monthNames[month] + " " + year;
                receipt["ownersName"] = ownersName;
                receipt["ownersPan"] = ownersPan;
                receipt["paymentMode"] = getPaymentModestring(paymentMode);


                receipts.push(receipt);
                startDate.setMonth(startDate.getMonth() + 1);
            }

            try {
                showPDF(JSON.stringify(receipts), "#receipts-container");
                $('#save-as-pdf').attr('disabled', false);
            } catch (error) {
                console.log(error);
            }
        } else {
            showToast("Details required", "Please enter all required to generate receipts.", 5000);
        }

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
                monthAndYear: {
                    alignment: 'right',
                    fontSize: 15,
                    bold: true,
                    color: '#BBBBBB'
                },
                description: {
                    margin: [0, 15, 0, 15],
                    height: 40
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


            var ownerDetails = {};
            if (formDataJson[index].ownersPan === null || formDataJson[index].ownersPan === "") {
                ownerDetails =
                    [
                        "\n\nOwner's name: ",
                        { text: formDataJson[index].ownersName, bold: true }
                    ]

            } else {
                ownerDetails =
                    [
                        "\nOwner's name: ",
                        { text: formDataJson[index].ownersName, bold: true },
                        "\nOwner's PAN: ",
                        { text: formDataJson[index].ownersPan, bold: true }
                    ]

            }

            docDefinition.content.push([
                {
                    columns: [
                        {
                            text: 'Rent receipt',
                            style: 'header'
                        },

                        {
                            text: formDataJson[index].monthAndYear,
                            style: 'monthAndYear'
                        }
                    ],

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
                            text: ownerDetails
                        },
                        {
                            text: [
                                "\n",
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
            pdfMake.createPdf(docDefinition).download(formDataJson[0].tenantName + "-[gtmpai.github.io].pdf");
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
            case "5":
                PaymentModestring = "Cheque"
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
        const ownersPan = $('#ownersPan').val().toUpperCase();
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
    }


    function showToast(subject, message, duration) {
        $('#toastBodySubject').html(subject);
        $('#toastBodyText').html(message);
        const toast = new bootstrap.Toast($('#liveToast'));
        toast.show();
    }

});