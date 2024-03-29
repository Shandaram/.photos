$(document).ready(function () {
  $(".menu-trigger").click(function () {
    $(this).next(".dropdown-cont").addClass("flex");
  });

  $(".close-menu").click(function () {
    $(this).closest(".dropdown-cont").removeClass("flex");
  });
  $(".toggleModal .post_pic").click(function () {
    $(this).closest(".toggleModal").next(".myModal").addClass("flex");
  });

  $(".close").click(function () {
    $(this).closest(".myModal").removeClass("flex");
  });

  $(".close-alert").click(function () {
    $(this).closest(".delete-alert").removeClass("flex");
    $(this)
      .closest(".delete-alert")
      .siblings(".dark-delete")
      .css("opacity", "0");
  });

  $(".delete-alert-trigger").click(function () {
    $(this).closest(".edit-buttons").next(".delete-alert").toggleClass("flex");
    $(this)
      .closest(".edit-buttons")
      .prev(".dark-delete")
      .css("opacity", function (i, value) {
        return value == "0.8" ? "0" : "0.8";
      });
  });
  $(".edit-trigger").click(function () {
    var modalContent = $(this).closest(".modal-content");
    var postText = modalContent.find(".edit-toggle");
    var editText = modalContent.find(".edit-post");

    postText.toggle();
    editText.toggle();

    if (postText.is(":visible")) {
      editText.hide();
    } else {
      editText.show();
    }
  });

  $(".edit-close").click(function () {
    var editText = $(this).closest(".edit-post");
    var postText = editText.siblings(".edit-toggle");

    editText.hide();

    if (!editText.is(":visible")) {
      postText.show();
    }
  });

  // Function to toggle dark theme
  function toggleDarkTheme() {
    $(":root").toggleClass("dark-theme");

    var isDarkTheme = $(":root").hasClass("dark-theme");
    localStorage.setItem("darkThemeEnabled", isDarkTheme);
  }

  var darkThemeEnabled = localStorage.getItem("darkThemeEnabled");
  if (darkThemeEnabled === "true") {
    $(":root").addClass("dark-theme");
  }

  $(".toggleButton").click(function () {
    toggleDarkTheme();
  });

  var isToggled = false;

  $(".toggleButton").click(function () {
    if (isToggled) {
      $(".circle.light").css("left", "0");
    } else {
      var width = $(this).width();
      $(".circle.light").css("left", width - 17 + "px");
    }
    isToggled = !isToggled;
  });
});
