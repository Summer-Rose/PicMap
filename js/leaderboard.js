function leaderBoard() {
  var ref = new Firebase("https://picmap.firebaseio.com/users");
  ref.orderByChild("score").on("child_added", function(snapshot) {
    $("#leaderboard").append("<tr>" +
                                "<td>"+snapshot.val().name+"</td>" +
                                "<td>"+snapshot.val().score+"</td>" +
                              "</tr>");
  });
};

$(document).ready(function() {
  leaderBoard();
});
