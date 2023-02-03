$(document).ready(function () {
    $('#generate-receipts').click(function (e) {
        e.preventDefault();
        $('#receipts-container').html("<h5>Hello</h5>");
    })

    $('#save-as-pdf').on('click', function (e) {
        e.preventDefault();
        getPDF($('#receipts-container').html(), "Goutham");
    })

    function getPDF(sourceHTML, fileName) {
        var pageWidth = 210;
        var pageHeight = 297;

        html2canvas($("#receipts-container")[0]).then(function (canvas) {
            var pdf = new jsPDF();
            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pageWidth, pageHeight);
            pdf.save("invoice.pdf");
        });
    }
});