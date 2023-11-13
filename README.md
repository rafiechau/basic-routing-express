# Basic Express

Basic express.js project with basic routes:
* Express
* Joi
* Fs

---

## URL

_Server_
```
http://localhost:3000
```
---


## Global Response

_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```
---


## RESTful endpoints

### POST /create/:priority

> Create todolist

_Request Params_
```
/<priority>
```

_Request Header_
```
not needed
```

_Request Body_
```
{
  "name" : "<name>",
  "status": <status>(only receive done, progress, todo status - in case sensitive), 
  "description" : "<description>"
}
```

_Response (200)_
```
{
    "data": [<data_todolist>],
    "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
    "status": "Validation Failed",
    "message": "\"description\" is required"
}
```
```
{
    "message": "Data Already Existed"
}
```
```
{
    "status": "Validation Failed",
    "message": "Invalid status value"
}
```
---

### POST /add-to-favorite/:priority/:title
> add todolist to favorites

_Request Params_
```
/<priority>/<title>
```

 _Request Header_
```
not needed
```

_Request Body_
```
not needed}
```
_Response (200)_
```
{
    message: "Item Added to Favorites"
    "favorites": [
        <item_favorites>
    ],
}
```
_Response (400 - Validation Error)_
```
{
    "message": "Item Already in Favorites"
}
```

_Response (400 - Validation Error)_
```
{
    "message": "URL Not Found"
}
```
```
{
    "message": "Item Not Found"
}
```

---

### GET /all

> Get all data todolist

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{

    "data": {
        "<data_type>": [
	        <data_todolist_item>
	       ]
        },

    "status": "Success"

}
```

---

### GET /all/:priority


 > Get by priority

_Request Params_
```
/<priority>
```

_Request Params_

```
/<priority_name>(high/medium/low)

```

_Request Header_

```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{

    "data": [
        "title": "<title>",
        "status": "<status>"
        "description": "<description>"
    ],

    "status": "Success"

}
```

_Response (404)_
```
{
    "message": "URL NOT FOUND"
}
```

---

---

### GET /pagination/:priority

 > Get by priority and there's pagination

_Request Params_

```
/<priority_name>/<page>(nullable)/<limit>(nullable)

```

_Request Header_

```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{

    "data": [
        "title": "<title>",
        "status": "<status>"
        "description": "<description>"
    ],

    "status": "Success"

}
```

_Response (404)_
```
{
    "message": "URL NOT FOUND"
}
```

---

### GET /all/:priority/:title

 > Get data todolist by title

_Request Params_

```
/<priority_name>/<title>(in case sensitive)

```

_Request Header_

```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{

    "data": [
        "title": "<title>",
        "status": "<status>"
        "description": "<description>"
    ],

    "status": "Success"

}
```

_Response (404)_
```
{
    "message": "No Matching Data Found"
}
```

---

### GET /all/:priority/:title

 > Get all data favorites

_Request Params_

```
/<priority_name>/<title>(in case sensitive)

```

_Request Header_

```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{

    "data": [
        "title": "<title>",
        "status": "<status>"
        "description": "<description>"
    ],

    "status": "Success"

}
```

_Response (404)_
```
{
    "message": "No Favorites Found"
}
```

---

---
### PUT /all/:priority/:title

> Update by name

_Request Params_
```
/<priority>/<title>
```

_Request Header_
```
not needed
```

_Request Body_
```
{
  "name": "<name>",
  "status": "<status>"
  "description": "<description>",
}
```

_Response (200)_
```
{
    "data": [
        "title": "<title>",
        "status": "<status>"
        "description": "<description>"
    ],
    "message": "Success"
}
```

_Response (400 - Validation Error)_
```
{
    "status": "Validation Failed",
    "message": "\"name\" length must be at least 3 characters long"
}
```
```
{
    "status": "Invalid status value",
}
```

_Response (404 - Error Not Found)_
```
{
    "message": "Data Not Found"
}
```

---

### DELETE /:priority/:title

> Delete by title from todolist

_Request Params_
```
/<priority>/<title>
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "data": [
      <data_todolist_item>
    ],
    "message": "Success"
}
```


_Response (404 - Error Not Found)_
```
{
    "status": "Data Not Found" 
    "message": "Data tidak ditemukan"
}
```
```
{
    "message": "URL Not Found"
}
```

---


### DELETE /favorites/delete/:title

> Delete by title from favorites

_Request Params_
```
/<priority>/<title>
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "data": [
      <data_todolist_item>
    ],
    "message": "Item Removed from Favorites"
}
```


_Response (404 - Error Not Found)_
```
{
    "message": "Item Not Found in Favorites"
}
```
```
{
    "message": "No Favorites Found"
}
```

---
