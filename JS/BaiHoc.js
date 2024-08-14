let mybutton = document.getElementById("myFixedBtn");

function ScrollButton() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

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
async function AddAllLessontoOffCanvas(Lesson) {
  $.ajax({
    type: "GET",
    url: LinkScript,
    dataType: "json",
    data: {action: "GetAllLessonbyListId", Listid: "" + Lesson.listlessonid},
    success: function (data) {
      $.each(data, function (i, item) {
        var row =
          '<li class="lesson-item" id="' +
          item.id +
          '"><a href="../View/BaiHoc.html?Id=' +
          item.id +
          '">' +
          item.title +
          "</a></li>";
        $(".lesson").append(row);
      });
      $("#" + Lesson.id).addClass("active-lesson");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching lessons: ", textStatus, errorThrown);
    },
  });
}
$(document).ready(async function () {
  var Id = new URLSearchParams(window.location.search).get("Id");
  if (Id) {
    var Lesson = await GetLessonbyId(Id);
    $("title").html(Lesson.title);
    LoadPdfFromUrl(Lesson.pdf);
    var y = $("#Main_Nav").offset().top + 10;
    $("#myListBtn").css("top", y + "px");
    var data = await GetAllLessonbyListId(Lesson.listlessonid);
    AddAllLessontoOffCanvas(Lesson);
    window.addEventListener("scroll", checkScroll);
  } else {
    location.href = "../View/Error.html";
  }
});
