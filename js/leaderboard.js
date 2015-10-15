function leaderBoard() {
  var ref = new Firebase("https://picmap.firebaseio.com/users");
  ref.orderByChild("score").on("child_added", function(snapshot) {
    $("#leaderboard").append("<tr>" +
                                "<td class='player'>"+snapshot.val().name+"</td>" +
                                "<td class='score'>"+snapshot.val().score+"</td>" +
                              "</tr>");
  });
};

$(document).ready(function() {
  leaderBoard();
});
