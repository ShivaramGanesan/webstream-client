var useCase = {}
var presenter = {}
var components = {}

useCase.socket = null;

useCase.boardId = null;


useCase.init = function(){
    // console.log("Hello");

    var currentUrl = window.location.href
    var ind = currentUrl.indexOf("#")
    var details = currentUrl.substring(ind+1).split("-");
    useCase.boardId = details[1];
    if(details[0] == 'join'){
        useCase.joinStream(localStorage.getItem("currentUserId"), useCase.boardId, false)
    }
    presenter.listUsers(useCase.boardId);
    // console.log("Current board : " + boardId);


    $("#startStreamButton").click(function(){
        useCase.startStream();
    });

    $("#addUserButton").click(function(){
        var userId = $("#userId").val();
        useCase.addUser(useCase.boardId, userId);
    })

    $("#removeUserButton").click(function(){
        var userId = $("#userId").val()
        useCase.removeUser(useCase.boardId, userId);
    })

    components.canvas = $("#canvas-default").drawpad({
        onStrokeEnd : function(path){
            // console.log("user onstroke end called")
            // console.log(path);
            if(useCase.isWsOpen()){
                useCase.socket.send(JSON.stringify(path))
            }
            else{
                // useCase.openSocket(localStorage.getItem("currentUserId"), useCase.boardId);
                console.log("Socket closed")
            }
        }
    });

    // components.copy = $("#canvas-copy").drawpad({
    // })

    // useCase.openSocket();
    // console.log(copy)
}

useCase.openSocket = function(userId, boardId, create=true){
    if(!useCase.isWsOpen()){
        useCase.socket = new WebSocket("ws://localhost:8080/streampath?userId="+userId+"&boardId="+boardId + "&create="+create);
        useCase.socket.onopen = function(){
            console.log("socket opened")
        }

        useCase.socket.onclose = function(event){
            console.log("connection has been closed")
            console.log(event)
        }
        
        useCase.socket.onmessage = function(event){
            // console.log("message from server :: " + event.data)
            // console.log(event.data);
            try{
                console.log(event.data);
                useCase.addPath(JSON.parse(event.data));
            }
            catch(err){
                console.log(err)
            }
            
        }
    }
    
}

useCase.addPath = function(path){

    components.canvas.addPath(path)
}

useCase.isWsOpen = function(){
    return useCase.socket && useCase.socket.readyState === useCase.socket.OPEN
}


useCase.startStream = function(){
    useCase.openSocket(localStorage.getItem("currentUserId"), useCase.boardId);
}

useCase.addUser = function(boardId, userId){
    api.post(constants.SERVER_DOMAIN+"/board/"+boardId+"/users", [{
        id: userId
    }]).then(function(data){
        console.log(data);
        presenter.listUsers(useCase.boardId);
    })
}

useCase.removeUser = function(boardId, userId){
    api.delete(constants.SERVER_DOMAIN+"/board/"+boardId+"/users", [{
        id: userId
    }]).then(function(data){
        console.log(data)
        presenter.listUsers(useCase.boardId);
    })
}

useCase.getUsers = function(boardId){
    return api.get(constants.SERVER_DOMAIN+"/board/"+boardId+"/users").then(function(data){
        return data;
    })
}

presenter.listUsers = function(boardId){
    useCase.getUsers(boardId).then(function(data){
        $(".boardUsers").children().remove();
        var list = $(".boardUsers")
        for(let i = 0;i<data.length;i++){
            if(data[i].admin){
                list.append("<li>" + data[i].name + ":" + data[i].id +" (admin)</li>");
            }
            else{
                list.append("<li>" + data[i].name + ":" + data[i].id +"</li>");
            }
            
        }
    })
}

useCase.closeSocket = function(){
    if(useCase.socket){
        useCase.socket.close();
    }
}

useCase.joinStream = function(userId, boardId){
    useCase.closeSocket();
    useCase.openSocket(userId, boardId);

}