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
    RenderPage(pdf_container, i, CurrentPage);
    CurrentPage++;
  }
}

function RenderPage(pdf_container, num, currentPage) {
  pdfDoc.getPage(num).then(function (page) {
    // Tạo Canvas và Text Layer container
    var canvas = document.createElement("canvas");
    canvas.classList.add("PDF");
    var textLayerDiv = document.createElement("div");

    canvas.id = "pdf-" + currentPage;
    textLayerDiv.className = "textLayer";
    textLayerDiv.classList.add("PDF");
    textLayerDiv.style.height = "auto";
    textLayerDiv.style.width = "auto";
    textLayerDiv.style.position = "absolute";

    var ctx = canvas.getContext("2d");
    pdf_container.appendChild(canvas);
    pdf_container.appendChild(textLayerDiv);

    var scale = pdf_container.clientWidth / page.getViewport({scale: 1}).width;
    // Set kích thước Canvas dựa trên ViewPort và Scale
    var viewport = page.getViewport({scale: scale});
    canvas.height = resolution * viewport.height;
    canvas.width = resolution * viewport.width;
    textLayerDiv.style.height = canvas.height + "px";
    textLayerDiv.style.width = canvas.width + "px";
    textLayerDiv.style.top = canvas.offsetTop + "px";
    textLayerDiv.style.left = canvas.offsetLeft + "px";

    // Render trang PDF
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page
      .render(renderContext)
      .promise.then(function () {
        // Render lớp văn bản
        return page.getTextContent();
      })
      .then(function (textContent) {
        pdfjsLib.renderTextLayer({
          textContentSource: textContent,
          container: textLayerDiv,
          viewport: viewport,
          textDivs: [],
        });
      });
  });
}
