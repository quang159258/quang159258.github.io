const LinkScript =
  "https://script.google.com/macros/s/AKfycby9xE4VW_YsF-uWMB5G3Y8vBN5OB1B5BKa4iIlApwFGi4P0cSf4kPs3JcZ9cjy0FR1U/exec";
async function GetListLesson() {
  const respone = await fetch(LinkScript + "?action=GetListLesson");
  var data = await respone.json();
  return data;
}

async function GetAllLessonbyListId(id) {
  const respone = await fetch(
    LinkScript + "?action=GetAllLessonbyListId&Listid=" + id
  );
  var data = await respone.json();
  return data;
}
async function fetchPdfDataFromDrive(DriveId, start, end) {
  const respone = await fetch(
    LinkScript +
      "?action=StreamingPDF&pdfid=" +
      DriveId +
      "&s=" +
      start +
      "&e=" +
      end
  );
  const data = (await respone.json()).result;
  return data;
}
async function GetEventCalendar() {
  const respone = await fetch(LinkScript + "?action=GetEventCalendar");
  const data = await respone.json();
  return data;
}
async function fetchPdfDataFromDrive(DriveId) {
  const respone = await fetch(
    LinkScript + "?action=StreamingPDF&pdfid=" + DriveId
  );
  const data = (await respone.json()).result;
  return data;
}
async function GetLessonbyId(id) {
  const respone = await fetch(
    LinkScript + "?action=GetLessonbyID&Lessonid=" + id
  );
  var data = await respone.json();
  return data;
}

async function GetFirstLessonbyListId(ListId) {
  const respone = await fetch(
    LinkScript + "?action=GetFirstLessonbyListId&Listid=" + ListId
  );
  var data = await respone.json();
  return data;
}
async function GetMaterials(offset) {
  const respone = await fetch(
    LinkScript + "?action=GetMaterials&offset=" + offset
  );
  var data = await respone.json();
  return data;
}
async function GetMaterialbyId(id) {
  const respone = await fetch(LinkScript + "?action=GetMaterialbyId&Id=" + id);
  var data = await respone.json();
  return data;
}
