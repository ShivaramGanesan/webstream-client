var api = {}


api.post = function(url, body){
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function(data){
        return data.json()
    });
}

api.delete = function(url, body){
    return fetch(url, {
        method: "DELETE",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function(data){
        return data.json()
    });
}


api.get = function(url){
    return fetch(url).then(function(data){
        return data.json()
    });
}