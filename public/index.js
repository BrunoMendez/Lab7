function post() {
    let d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var date = day + '/' +  month + '/' + d.getFullYear();

    let post = {
        title: $('#title').val(),
        content: $('#content').val(),
        author: $('#author').val(),
        publishDate: date
    }

    let fetchSettings = {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    }

    fetch("http://localhost:8080/blog-posts", fetchSettings)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error (response.statusText);
        })
        .then(responseJSON => {
            location.reload();
            console.log(responseJSON);
            $('#title').val("");
            $('#content').val("");
            $('#author').val("");
        })
        .catch(error => {
            console.log(error);
        });
}

function deletePost() {
    let id = $('#deleteId').val();
    let fetchSettings = {
        method: "delete",
    }
    fetch("http://localhost:8080/blog-posts/" + id, fetchSettings)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error (response.statusText);
    })
    .then(responseJSON => {
        location.reload();
        $('#deleteId').val("");
    })
    .catch(error => {
        console.log(error);
    });
}

function updatePost() {
    let id = $('#updateId').val();
    let title = $('#updateTitle').val();
    let content = $('#updateContent').val();
    let author = $('#updateAuthor').val();
    let d = new Date();
    var month = d.getMonth()+1;
    var date = d.getDate() + '/' +  month + '/' + d.getFullYear();

    let post = {
        id: id,
        title: title,
        content: content,
        author: author,
        publishDate: date
    }

    let fetchSettings = {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    }

    fetch("http://localhost:8080/blog-posts/" + id, fetchSettings)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error (response.statusText);
    })
    .then(responseJSON => {
        location.reload();
        $('#updateId').val("");
        $('#updateTitle').val("");
        $('#updateAuthor').val("");
        $('#updateContent').val("");
    })
    .catch(error => {
        console.log(error);
    });

}

function init() {
    fetch("http://localhost:8080/blog-posts")
        .then( response => {
            console.log("@@@");
            if ( response.ok ) {
                return response.json();
            }
            throw new Error (response.statusText);
        })
        .then( posts => {
            for (let i = 0; i< posts.length; i++) {
                $("#posts").append(`
                                    <li class="title"><h3>${posts[i].title}</h3></li>
                                    <li class="content">${posts[i].content}</li>
                                    <li class="author">${posts[i].author}</li>
                                    <li class="publishDate">${posts[i].publishDate}</li>
                                    <li class="id">${posts[i].id}</li>
                                    `)
            }
        })
        .catch (err => {
            console.log( err );
        });
     $('#createPost').on("submit", function (event) {
         event.preventDefault();
         post();
     });
     $('#deletePost').on("submit", function (event) {
         event.preventDefault();
         deletePost();
     });
     $('#updatePost').on("submit", function (event) {
         event.preventDefault();
         updatePost();
     })
}

init();