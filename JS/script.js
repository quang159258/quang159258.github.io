function ShowSlidebar(id) {
  var myelement = document.getElementById(id);
  if (window.getComputedStyle(myelement).display === "none") {
    myelement.style.display = "flex";
  } else {
    myelement.style.display = "none";
  }
  for (i = 1; i <= 5; i++) {
    var id1 = "selection" + i;
    myelement = document.getElementById(id1);
    if (window.getComputedStyle(myelement).display === "flex") {
      myelement.style.display = "none";
    }
  }
}
function display_selection(id, amount) {
  var myelement = document.getElementById(id);
  var check = 0;
  for (i = 1; i <= amount; i++) {
    var id1 = "selection" + i;
    myelement = document.getElementById(id1);
    if (window.getComputedStyle(myelement).display === "flex") {
      myelement.style.display = "none";
      if (id1 == id) check = 1;
    }
  }
  myelement = document.getElementById(id);
  if (window.getComputedStyle(myelement).display === "none" && check == 0) {
    myelement.style.display = "flex";
  } else {
    myelement.style.display = "none";
  }
}
function Link_index(id) {
  document.getElementById(id).addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn chuyển hướng mặc định
    window.location.href = "index.html"; // Điều hướng đến trang index.html
  });
}
function Print_Product(title, teacher, student, rate, price) {}
