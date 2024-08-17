var pdfjsLib = window["pdfjs-dist/build/pdf"];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
var pdfDoc = null;
var CurrentPage = 1;
var resolution = 1;

async function LoadPdfFromUrl(DriveId) {
  const rawData = await fetchPdfDataFromDrive(DriveId);
  const pdfData = rawData;
  pdfjsLib.getDocument({data: pdfData}).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    var pdf_container = document.getElementById("pdf_container");
    pdf_container.style.display = "block";

    RenderPages(
      pdf_container,
      CurrentPage,
      Math.min(CurrentPage + 2, pdfDoc.numPages)
    );
  });
}

async function LoadPdfFromUrl(DriveId, start, end) {
  const rawData = await fetchPdfDataFromDrive(DriveId, start, end);
  const pdfData = rawData;
  pdfjsLib.getDocument({data: pdfData}).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    var pdf_container = document.getElementById("pdf_container");
    pdf_container.style.display = "block";

    RenderPages(
      pdf_container,
      CurrentPage,
      Math.min(CurrentPage + 2, pdfDoc.numPages)
    );
  });
}
function RenderPages(pdf_container, start, end) {
  for (var i = start; i <= end && i <= pdfDoc.numPages; i++) {
    RenderPage(pdf_container, i);
    CurrentPage++;
  }
}
function RenderPage(pdf_container, num) {
  pdfDoc.getPage(num).then(function (page) {
    // Create Canvas
    var canvas = document.createElement("canvas");
    canvas.classList.add("PDF");
    canvas.id = "pdf-" + num;

    var ctx = canvas.getContext("2d");
    pdf_container.appendChild(canvas);

    // Calculate the scale based on the container width
    var scale = pdf_container.clientWidth / page.getViewport({scale: 1}).width;

    // Set Canvas dimensions based on the scaled viewport
    var viewport = page.getViewport({scale: scale});
    canvas.height = resolution * viewport.height;
    canvas.width = resolution * viewport.width;

    // Render the PDF page onto the canvas
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    page.render(renderContext);
  });
}
