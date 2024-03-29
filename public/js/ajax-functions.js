$(document).ready(function () {
    // Handle profile picture change event
    $("#profile_pic").on("change", function (e) {
        $("#fileName").text(e.target.files[0].name);
    });

    $("#path").on("change", function (e) {
        $("#fileName").text(e.target.files[0].name);
    });

    // Handle input change event for validation
    $(".check").on("change", function (e) {
        e.preventDefault();
        var formData = $(this).val();
        var errorMessage = $(".error-empty");

        var fieldType = $(this).data("field");
        var data = {};
        data[fieldType] = formData;
        $.ajax({
            url: "/users/checkregister",
            method: "POST",
            data: { formData: data },
            success: function (response) {
                if (response.message != null) {
                    errorMessage.text(response.message);
                    errorMessage.addClass("error");
                } else {
                    errorMessage.text("");
                    errorMessage.removeClass("error");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting form data:", error);
            },
        });
    });

    // Handle input user edit
    $(".check-edit").on("change", function (e) {
        e.preventDefault();
        var formData = $(this).val();
        var errorMessage = $(".error-empty");

        $.ajax({
            url: "/users/check",
            method: "POST",
            data: { formData: formData },
            success: function (response) {
                if (response.message != null) {
                    errorMessage.text(response.message);
                    errorMessage.addClass("error");
                } else {
                    errorMessage.text("");
                    errorMessage.removeClass("error");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting form data:", error);
            },
        });
    });

    //Handle user following
    $(".follow-button").on("click", function () {
        const user_id = $(this).data("userid");
        $.ajax({
            url: "/users/follow",
            method: "POST",
            data: { user_id: user_id },
            success: function (response) {
                if (response.success) {
                    const button = $(".follow-button");
                    if (response.userHasFollowed) {
                        button.text("Unfollow");
                    } else {
                        button.text("Follow");
                    }
                    $(".followers").text(response.followers_count);
                }
            },
            error: function (xhr, status, error) {
                console.log("Error:");
            },
        });
    });

    // Handle comment creation
    $(`.comment-send`).on("click", function (e) {
        e.preventDefault();
        const post_id = $(this).data("postid");
        const user_id = currId;
        const commentText = $("#comment-" + post_id);
        const comment = commentText.val();
        var $this = $(this);
        $.ajax({
            url: "/comments/create",
            method: "POST",
            data: { post_id: post_id, user_id: user_id, comment: comment },
            success: function (response) {
                if (response.success) {
                    var modalContent = $this.closest(".myModal");
                    var togglemodal = modalContent.prev(".toggleModal");
                    var commentCount = modalContent.find(".comm_count");
                    var commentCountFeed = togglemodal.find(`#comm_count-${post_id}`);
                    var loop = modalContent.find(".comments-loop");
                    var modal = $this.closest(".myModal").prev();
                    var hoverComments = modal.find(".hover-comms");
                    commentCountFeed.text(response.comments_count);
                    commentCount.text(response.comments_count);
                    hoverComments.text(response.comments_count);
                    var commentsN = response.commentsNew;
                    commentText.val("");
                    var commentHtml = "";

                    for (var j = 0; j < commentsN.length; j++) {
                        commentHtml += ` <div class="post-text first"> <img style="opacity: 0" class="small_profile_pic" src="" />`;
                        commentHtml += `<div class="comm-cont" id="comment-${commentsN[j].comm_id}">
               <div class="horizontal-flex">
                                     <p>
                                         <span class="userName">${commentsN[j].user_name}</span> ${commentsN[j].comment}
                                     </p>`;

                        if (response.currentUser_id == commentsN[j].user_id) {
                            commentHtml += `<i class="fa-regular fa-square-minus delete-comment-btn" data-commid="${commentsN[j].comm_id}"></i></div>`;
                            console.log(commentsN[j].comm_id);
                        } else {
                            commentHtml += `</div>`;
                        }
                        const postDateString = commentsN[j].comm_created;
                        const postDate = new Date(postDateString);
                        const options = {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        };
                        let formattedDate = postDate.toLocaleString("en-US", options);

                        commentHtml += `<p class="small-text">${formattedDate}</p>
                             </div></div>`;
                    }
                    loop.html(commentHtml);
                }
            },
        });
    });

    // Handle search
    $("#searchInput").on("input", function () {
        searchUsers();
    });

    function searchUsers() {
        var searchValue = $("#searchInput").val().toLowerCase();
        if (searchValue === "") {
            $("#searchResults").empty();
            return;
        }
        var userObjects = $("#userObjects").data("users");
        var filteredUsers = userObjects.filter(function (user) {
            return user.user_name.toLowerCase().includes(searchValue);
        });
        console.log(filteredUsers);
        displaySearchResults(filteredUsers);
    }

    function displaySearchResults(results) {
        var searchResultsContainer = $("#searchResults, #searchMobileRes");
        searchResultsContainer.empty();
        results.forEach(function (user) {
            var link = $("<a>")
                .attr("href", "/users/" + user.user_id)
                .text(user.user_name);
            searchResultsContainer.append(link).append("<br>");
        });
    }

    // Handle likes
    $(".like-icon").on("click", function () {
        const post_id = $(this).data("postid");
        const user_id = currId;
        const $this = $(this);

        $.ajax({
            url: "/posts/like",
            method: "POST",
            data: { post_id: post_id, user_id: user_id },
            success: function (response) {
                if (response.success) {

                    // Update self
                    $this
                        .closest(".likes-comments-box")
                        .find(".likes")
                        .text(response.like_count)

                    // Update likes count in modal
                    var modalfeed = $this.closest(".toggleModal").next()
                    var likesModal = modalfeed.find(".likes");
                    likesModal.text(response.like_count);
                    var heartModalFeed = likesModal.siblings(".like-icon")

                    // Update likes count in hover likes
                    var modalContent = $this.closest(".myModal").prev();
                    var hoverLikes = modalContent.find(".hover-likes");
                    hoverLikes.text(response.like_count);

                    // Update likes count in main feed
                    var modalContentBig = $this.closest(".myModal");
                    var togglemodal = modalContentBig.prev(".toggleModal");
                    var likeCountFeed = togglemodal.find(".likes");
                    likeCountFeed.text(response.like_count);
                    var heartModal = likeCountFeed.siblings(".like-icon")

                    // Toggle like icon class
                    if (response.liked === 0) {
                        $this.removeClass("fa-solid").addClass("fa-regular");
                        heartModalFeed.removeClass("fa-solid").addClass("fa-regular");
                        heartModal.removeClass("fa-solid").addClass("fa-regular");
                    } else {
                        $this.removeClass("fa-regular").addClass("fa-solid");
                        heartModalFeed.removeClass("fa-regular").addClass("fa-solid");
                        heartModal.removeClass("fa-regular").addClass("fa-solid");
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log("Error:");
            },
        });
    });
});

//Handle delete comment
$(document).on("click", ".delete-comment-btn", function (e) {
    e.preventDefault();
    const comm_id = $(this).data("commid");
    var $this = $(this);
    $.ajax({
        url: "/comments/delete",
        method: "POST",
        data: { comm_id: comm_id },
        success: function (response) {
            if (response.success) {
                var modalContent = $this.parents(".modal-content");
                var modalContentBig = $this.parents(".myModal");
                var togglemodal = modalContentBig.prev(".toggleModal");
                var commentCountFeed = togglemodal.find(`.comm_count`);
                var loop = modalContent.find(".comments-loop");
                var commentCount = modalContent.find(".comm_count");
                var modal = $this.closest(".myModal").prev();
                var hoverComments = modal.find(".hover-comms");
                commentCountFeed.text(response.comments_count);
                commentCount.text(response.comments_count);
                hoverComments.text(response.comments_count);
                var commentsN = response.commentsNew;
                var commentHtml = "";
                for (var j = 0; j < commentsN.length; j++) {
                    commentHtml += ` <div class="post-text first"> <img style="opacity: 0" class="small_profile_pic" src="" />`;
                    commentHtml += `<div class="comm-cont" id="comment-${commentsN[j].comm_id}">
              <div class="horizontal-flex">
                                    <p>
                                        <span class="userName">${commentsN[j].user_name}</span> ${commentsN[j].comment}
                                    </p>`;

                    if (response.currentUser_id == commentsN[j].user_id) {
                        commentHtml += `<i class="fa-regular fa-square-minus delete-comment-btn" data-commid="${commentsN[j].comm_id}" id="delete-${commentsN[j].comm_id}"></i></div>`;
                    } else {
                        commentHtml += `</div>`;
                    }
                    const postDateString = commentsN[j].comm_created;
                    const postDate = new Date(postDateString);
                    const options = {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    };
                    let formattedDate = postDate.toLocaleString("en-US", options);

                    commentHtml += `<p class="small-text">${formattedDate}</p>
                            </div></div>`;
                }
                loop.html(commentHtml);
            }
        },
    });
});
