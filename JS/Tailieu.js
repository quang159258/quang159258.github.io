$(document).ready(async function () {
  var Id = new URLSearchParams(window.location.search).get("Id");
  if (Id) {
    var Material = await GetMaterialbyId(Id);
    $("title").html(Material.title);
    LoadPdfFromUrl(Material.pdf);
    window.addEventListener("scroll", checkScroll);
  } else {
    location.href = "../View/Error.html";
  }
});

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const checkScroll = debounce(() => {
  ScrollButton();
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 300
  ) {
    if (CurrentPage <= pdfDoc.numPages) {
      RenderPages(
        pdf_container,
        CurrentPage,
        Math.min(CurrentPage + 2, pdfDoc.numPages)
      );
    } else {
      window.removeEventListener("scroll", debouncedCheckScroll);
    }
  }
}, 100);
const debouncedCheckScroll = checkScroll;
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function ScrollButton() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
let mybutton = document.getElementById("myFixedBtn");
