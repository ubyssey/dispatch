# Dispatch API Specification (v 0.1)

###Articles###

```GET /articles/``` returns status code: ```200``` Content: ```application/json```
Format:
```
{
    "count": <N>,
    "next": null,
    "previous": null,
    "results": [
        {
            "url": "http://<URL>/articles/1/",
            "headline": "TEXT",
            "mobile_headline": "TEXT",
            "content": "TEXT"
        }
    ]
}
```

###Users###
```GET /users/``` returns status code ```200``` Content: ```application/json```
Format:
```
{
    "count": <N>,
    "next": null,
    "previous": null,
    "results": [
        {
            "url": "http://<URL>/users/1/",
            "username": "TEXT",
            "email": "TEXT",
            "groups": [],
            "password_hash": TEXT
        }
    ]
}
```