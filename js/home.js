var homeUseCase = {}

homeUseCase.init = function(){

    $("#joinBoard").click(function(){
        var userid = $("#userid").val()
        var boardid = $("#board_id").val();
        homeUseCase.joinBoard(userid, boardid);
    });
    $("#createBoard").click(function(){
        var userid = $("#userid").val()
        var boardname = $("#board_name").val();
        homeUseCase.createBoard(userid, boardname)
    });
    
}

homeUseCase.createBoard = function(userid, boardname){
    api.post(constants.SERVER_DOMAIN + "/board", {name: boardname, user: userid}).then(function(data){
        if(data.status == "success"){
            var boardId = data.id

            var currentUserId = $("#userid").val();
            localStorage.setItem("currentUserId", currentUserId);
            window.location.href = "/board.html#create-"+boardId;
        }
        
    })
}

homeUseCase.joinBoard = function(){
    var currentUserId = $("#userid").val();
    var boardId = $("#board_id").val();
    localStorage.setItem("currentUserId", currentUserId);
    window.location.href = "/board.html#join-"+boardId;
    
}

