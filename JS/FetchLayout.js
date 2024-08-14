function FetchComponent(elements, mycallback) {
  elements.each(function () {
    $(this).load($(this).attr("data-include"), function () {
      $(this)
        .find("script")
        .each(function () {
          this.defer = true;
          if ($(this).html()) {
            $(this).appendTo($("body"));
          } else {
            $.getScript(this.src);
          }
        });
      $(this).find("link").appendTo(document.head);
      if ($(this).find("[data-include]").length > 0)
        FetchComponent($(this).find("[data-include]"));
      else mycallback();
      var newContent = $(this).contents();
      $(this).replaceWith(newContent);
    });
  });
}

$(document).ready(function () {
  FetchComponent($("[data-include]"), function () {
    //Callback
    if (
      $("#Main_Nav").length > 0 &&
      $("#Sub_Nav").length > 0 &&
      $("#MyBody").length > 0 &&
      $("footer").length > 0
    )
      SetMarginTop("Main_Nav", "Sub_Nav", "MyBody");
  });

  $("#MyBody").css("display", "block");
});

async function FetchKhoahoc() {
  const data = await GetListLesson();
  const fragment = document.createDocumentFragment();

  data.forEach(item => {
    const colDiv = document.createElement("div");
    colDiv.className = "mx-4 my-3 Listlesson-box card";
    colDiv.setAttribute("id", item.id);

    colDiv.innerHTML = `
      
        <div class="placeholder placeholder-wave card-img-top"></div>
        <img loading="lazy" class="card-img-top" alt="" src="${item.img}">
        <div class="card-body">
          <p class="card-text">${item.title}</p>
        </div>
    `;

    const img = colDiv.querySelector("img");
    const placeholderDiv = colDiv.querySelector(".placeholder");

    img.addEventListener("load", function () {
      placeholderDiv.remove();
    });

    $(colDiv).on("click", async function (event) {
      event.preventDefault();
      var id = (await GetFirstLessonbyListId(item.id)).id;
      if (id !== 0) location.href = `../View/BaiHoc.html?Id=${id}`;
      else location.href = `../View/Error.html`;
    });

    fragment.appendChild(colDiv);
  });

  document
    .querySelector(".Container_ListLesson>.ListLessons")
    .appendChild(fragment);
}
async function renderPagination(totalPages, currentPage) {
  var maxVisiblePages = 5;
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  // Previous button
  const prevItem = document.createElement("li");
  prevItem.className = "page-item" + (currentPage === 1 ? " disabled" : "");
  const prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = "../View/Thuvien.html?page=" + (currentPage - 1);
  prevLink.innerHTML = '<i class="fa-solid fa-backward"></i>';

  prevItem.appendChild(prevLink);
  paginationContainer.appendChild(prevItem);
  // Page numbers
  let startPage, endPage;
  if (totalPages <= maxVisiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrentPage = Math.floor(maxVisiblePages / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxVisiblePages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // Add leading "..." if needed
  if (startPage > 1) {
    const firstPageItem = document.createElement("li");
    firstPageItem.className = "page-item";
    const firstPageLink = document.createElement("a");
    firstPageLink.className = "page-link";
    firstPageLink.href = "../View/Thuvien.html?page=" + 1;
    firstPageLink.innerText = "1";

    firstPageItem.appendChild(firstPageLink);
    paginationContainer.appendChild(firstPageItem);

    if (startPage > 2) {
      const dotsItem = document.createElement("li");
      dotsItem.className = "page-item disabled";
      const dotsLink = document.createElement("a");
      dotsLink.className = "page-link";
      dotsLink.href = "#";
      dotsLink.innerText = "...";
      dotsItem.appendChild(dotsLink);
      paginationContainer.appendChild(dotsItem);
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item" + (i === currentPage ? " active" : "");
    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "../View/Thuvien.html?page=" + i;
    pageLink.innerText = i;

    pageItem.appendChild(pageLink);
    paginationContainer.appendChild(pageItem);
  }

  // Add trailing "..." if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dotsItem = document.createElement("li");
      dotsItem.className = "page-item disabled";
      const dotsLink = document.createElement("a");
      dotsLink.className = "page-link";
      dotsLink.href = "#";
      dotsLink.innerText = "...";
      dotsItem.appendChild(dotsLink);
      paginationContainer.appendChild(dotsItem);
    }

    const lastPageItem = document.createElement("li");
    lastPageItem.className = "page-item";
    const lastPageLink = document.createElement("a");
    lastPageLink.className = "page-link";
    lastPageLink.href = "../View/Thuvien.html?page=" + totalPages;
    lastPageLink.innerText = totalPages;

    lastPageItem.appendChild(lastPageLink);
    paginationContainer.appendChild(lastPageItem);
  }

  // Next button
  const nextItem = document.createElement("li");
  nextItem.className =
    "page-item" + (currentPage === totalPages ? " disabled" : "");
  const nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = "../View/Thuvien.html?page=" + (currentPage + 1);
  nextLink.innerHTML = '<i class="fa-solid fa-forward"></i>';

  nextItem.appendChild(nextLink);
  paginationContainer.appendChild(nextItem);
}
async function FetchThuVien(data) {
  var desk = document.querySelector(".Container_ListLesson>.ListLessons");
  desk.innerHTML = "";
  const fragment = document.createDocumentFragment();

  data.data.forEach(item => {
    const colDiv = document.createElement("div");
    colDiv.className = "mx-4 my-3 Listlesson-box card";
    colDiv.setAttribute("id", item.id);

    colDiv.innerHTML = `
      
        <div class="placeholder placeholder-wave card-img-top"></div>
        <img loading="lazy" class="card-img-top" alt="" src="${item.pdf}">
        <div class="card-body">
          <p class="card-text">${item.title}</p>
        </div>
    `;

    const img = colDiv.querySelector("img");
    const placeholderDiv = colDiv.querySelector(".placeholder");

    img.addEventListener("load", function () {
      placeholderDiv.remove();
    });
    $(colDiv).on("click", async function (event) {
      event.preventDefault();
      location.href = `../View/Tailieu.html?Id=${item.id}`;
    });

    fragment.appendChild(colDiv);
  });

  desk.appendChild(fragment);
}
