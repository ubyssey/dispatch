class Dispatch

  api: "http://localhost:8000/api/"
  api_format: "json"
  models: [
      "tag",
      "topic",
      "image",
      "attachment"
    ]

  constructor: ->
    # Setup CSRF token for AJAX calls
    @csrfSetup()

  add: (model, values, callback) ->
    if(@._hasModel(model))
      url = model + "/"
      this.post(url, values, callback)

  remove: (model, id, callback) ->
    if(@._hasModel(model))
      url = model + "/" + id + "/"
      this.delete(url, callback)

  search: (model, values, callback) ->
    if(@._hasModel(model))
      url = model + "/"
      this.get(url, values, callback)

  get: (url, values, callback) ->
    $.ajax({
          type: "GET",
          url: @api+url+"?format="+@api_format,
          data: values,
          success: callback,
        })

  post: (url, values, callback) ->
    $.ajax({
      type: "POST",
      url: @api+url+"?format="+@api_format,
      data: values,
      success: callback,
    })

  delete: (url, callback) ->
    $.ajax({
      type: "DELETE",
      url: @api+url+"?format="+@api_format,
      success: callback,
    })

  upload: (data, callback) ->
    $.ajax({
        url: 'http://localhost:8000/api/image/?format=json',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: callback,
    })

  articleAttachments: (article_id, callback) ->
    @get('article/attachments/', {
        'article': article_id,
      },
      callback
    )

  _hasModel: (modelName) ->
    return @models.indexOf(modelName) != -1

  # CSRF stuff for Django

  getCookie: (name) ->
    cookieValue = null
    if (document.cookie && document.cookie != '')
      cookies = document.cookie.split(';')
      findCookie = (cookie) ->
        cookie = jQuery.trim(cookie)
        # Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '='))
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
      findCookie cookie for cookie in cookies
    return cookieValue

  csrfSafeMethod: (method) ->
      # these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method))

  csrfSetup: =>
    $.ajaxSetup({
        beforeSend: (xhr, settings) =>
          csrftoken = @getCookie('csrftoken')
          if (!@csrfSafeMethod(settings.type) && !@.crossDomain)
            xhr.setRequestHeader("X-CSRFToken", csrftoken)
    })

  window.Dispatch = Dispatch