function SetMarginTop(id, id2, body) {
  var x = $("#" + id);
  var y = $("#" + id2);
  var z = $("#" + body);
  if (x && y && z) {
    var h = x.outerHeight(false);
    var h2 = y.outerHeight(false);
    z.css("margin-top", h2 + "px");
    y.css("margin-top", h + "px");
  }
}
function ChangeFixedNav2() {
  var ele = $("#Sub_Nav");
  var top_nav = $("#Main_Nav");
  if (
    document.body.scrollTop > top_nav.outerHeight(true) / 2 ||
    document.documentElement.scrollTop > top_nav.outerHeight(true) / 2
  ) {
    ele.css("margin-top", 0);
    top_nav.css("opacity", 0);
  } else {
    top_nav.css("opacity", 1);
    ele.css("margin-top", top_nav.outerHeight(true));
  }
}
function GetDayOff(events) {
  var a = [];
  for (var i = 0; i < events.length; i++) {
    var item = events[i];
    if (item.extendedProps && item.extendedProps.description === "Tạm ngưng") {
      a.push({title: item.title, dayoff: item.dayoff});
      events.splice(i, 1);
      i--;
    }
  }
  return a;
}
function isDayOffInRange(startRecur, endRecur, dayoff) {
  const startDate = new Date(startRecur);
  const endDate = endRecur ? new Date(endRecur) : new Date("2040-12-31");
  const dayOffDate = new Date(dayoff);

  return startDate <= dayOffDate && dayOffDate <= endDate;
}
function DivideEvent(events, dayoffs) {
  var start, end;
  while (dayoffs.length != 0) {
    for (var i = 0; i < dayoffs.length; i++) {
      for (var j = 0; j < events.length; j++) {
        if (
          dayoffs[i].title === events[j].title &&
          isDayOffInRange(
            events[j].startRecur,
            events[j].endRecur,
            dayoffs[i].dayoff
          ) == true
        ) {
          var endRecurDate = new Date(dayoffs[i].dayoff);
          endRecurDate.setDate(endRecurDate.getDate() - 1);

          var beforeEvent = {...events[j]};
          beforeEvent.endRecur = endRecurDate.toISOString().split("T")[0];

          var startRecurDate = new Date(dayoffs[i].dayoff);
          startRecurDate.setDate(startRecurDate.getDate() + 1);

          var afterEvent = {...events[j]};
          afterEvent.startRecur = startRecurDate.toISOString().split("T")[0];

          var dayoffEvent = {...events[j]};
          dayoffEvent.color = "red";
          dayoffEvent.startRecur = endRecurDate.toISOString().split("T")[0];
          dayoffEvent.endRecur = startRecurDate.toISOString().split("T")[0];
          var extendedProps = {};
          extendedProps.description = "Tạm ngưng";
          dayoffEvent.extendedProps = extendedProps;
          events.splice(j, 1);
          events.push(dayoffEvent);
          events.push(beforeEvent);
          events.push(afterEvent);
          dayoffs.splice(i, 1);
          i--;
          break;
        }
      }
    }
  }

  return events;
}
$(window).on("scroll", ChangeFixedNav2);
var calendar;
async function LoadCalendar() {
  var eventarray = await GetEventCalendar();
  var dayoffs = GetDayOff(eventarray);
  eventarray = DivideEvent(eventarray, dayoffs);
  var calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    aspectRatio: 16 / 9,
    themeSystem: "bootstrap5",
    locale: "vi",
    firstDay: 1,
    headerToolbar: {
      center: "",
      left: "",
    },
    buttonText: {
      today: "Hôm nay",
      month: "Tháng",
      week: "Tuần",
      day: "Ngày",
      list: "Danh sách",
    },
    buttonHints: {
      today: "Hôm nay",
      prev: "$0 trước",
      next: "$0 sau",
    },
    events: eventarray,
    nowIndicator: true,
    slotMinTime: "17:00:00",
    slotMaxTime: "21:45:00",
    slotDuration: "00:30:00",
    allDaySlot: false, // Ẩn phần sự kiện cả ngày
    eventTextColor: "#0c4162",
    eventDidMount: function (info) {
      var e = info.el.querySelector(".fc-event-title-container");
      var descriptionElement = document.createElement("div");
      descriptionElement.innerHTML = info.event.extendedProps.description;
      descriptionElement.style.fontSize = "0.8rem";
      e.appendChild(descriptionElement);
    },
  });

  calendar.render();
  window.dispatchEvent(new Event("resize"));
  center = document.querySelectorAll(".fc-toolbar-chunk")[0];
  var h2Element = document.createElement("div");
  h2Element.className = "container-md ListLesson_Title my-3 ms-3 ps-5";
  h2Element.id = "fc-dom-1";
  h2Element.textContent = "Lịch học hàng tuần";
  center.appendChild(h2Element);
}
