(function() {

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Create a safe reference to the Dispatch object for use below.
    var dispatch = function(obj) {
        if (obj instanceof dispatch) return obj;
        if (!(this instanceof dispatch)) return new dispatch(obj);
    };

    // Export the Dispatch object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `dispatch` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = dispatch;
        }
        exports.dispatch = dispatch;
    } else {
        root.dispatch = dispatch;
    }

    // Model Configurations
    var models = {
        'article': {
            'route': 'articles',
            'actions': ['GET', 'POST', 'DELETE'],
            'sub_routes': {
                'attachments': {
                    'actions': ['GET',]
                },
                'revision': {
                    'actions': ['GET',]
                },
                'publish': {
                    'actions': ['POST',]
                },
                'unpublish': {
                    'actions': ['POST',]
                }
            },
        },
        'tag': {
            'route': 'tags',
            'actions': ['GET', 'POST', 'DELETE'],
        },
        'image': {
            'route': 'images',
            'actions': ['GET', 'POST', 'DELETE'],
            'helpers': {
                'POST': 'upload',
            }
        },
        'attachment': {
            'route': 'attachments',
        },
        'gallery': {
            'route': 'galleries',
            'actions': ['GET', 'POST', 'DELETE'],
        },
        'person': {
            'route': 'people',
            'actions': ['GET', 'POST', 'DELETE'],
        },
        'section': {
            'route': 'sections',
            'actions': ['GET', 'POST', 'DELETE'],
        },
        'template': {
            'route': 'templates',
            'actions': ['GET']
        }
    }

    // Local Settings
    LOCAL_SETTINGS = {
        'base_url': 'http://localhost:8000/',
        'api_url': '/api/',
        'api_format': 'json',
    }

    PRODUCTION_SETTINGS = {
        'base_url': 'http://dev.ubyssey.ca/',
        'api_url': 'http://dev.ubyssey.ca/api/',
        'api_format': 'json',
    }

    dispatch.settings = PRODUCTION_SETTINGS;
    dispatch.version = '0.1.8';

    // Errors
    // --------------------

    var InvalidActionError = function(model){ return "InvalidActionError: That action can't be performed on the " + model + " model." },
        InvalidModelError = function(model){ return "InvalidModelError: \"" + model + "\" isn't a valid model."},
        InvalidSubRouteError = function(model, subRoute){ return "InvalidModelError: \"" + subRoute + "\" isn't a sub-route of " + model + "." };

    // Internal Functions
    // --------------------

    var validModel = function(model){
        return models.hasOwnProperty(model);
    }

    var validSubRoute = function(model, subRoute){
        return models[model].hasOwnProperty('sub_routes') && models[model].sub_routes.hasOwnProperty(subRoute);
    }

    var validAction = function(model, action){
        var pieces = model.split(".");
        if (!validModel(pieces[0])) throw InvalidModelError(pieces[0]);
        if (pieces.length > 1){
            if (!validSubRoute(pieces[0], pieces[1])) throw InvalidSubRouteError(pieces[0], pieces[1]);
            return models[pieces[0]].sub_routes[pieces[1]].actions.indexOf(action) !== -1;
        } else {
            return models[pieces[0]].actions.indexOf(action) !== -1;
        }
    }

    var getModelRoute = function(model, id){
        var pieces = model.split(".");
        var route = models[pieces[0]].route;

        if (typeof id !== 'undefined')
            route += "/" + id

        if (pieces.length > 1){
            route += "/" + pieces[1];
        }

        return route;
    }

    var hasModelHelper = function(model, action){
        return models[model].hasOwnProperty('helpers') && models[model].helpers.hasOwnProperty(action);
    }

    var getModelHelper = function(model, action){
        return dispatch[models[model].helpers[action]];
    }

    // Handy functions
    // --------------------
    dispatch.getModelURL = function(model){
        if (!validModel(model)) throw InvalidModelError(model);
        return dispatch.settings.api_url + getModelRoute(model) + '/';
    }

    // API Functions
    // --------------------

    dispatch.add = function(model, values, callback) {
        if (!validAction(model, 'POST')) throw InvalidActionError(model);
        if (hasModelHelper(model, 'POST')){
            return getModelHelper(model, 'POST')(getModelRoute(model), values, callback);
        }
        return dispatch.post(getModelRoute(model), values, callback);
    }

    dispatch.update = function(model, id, values, callback) {
        if (!validAction(model, 'POST')) throw InvalidActionError(model);
        return dispatch.patch(getModelRoute(model, id), values, callback);
    };

    dispatch.publish = function(model, id, published, callback) {
        var route = published ? 'publish' : 'unpublish';
        var model = model + '.' + route;
        if (!validAction(model, 'POST')) throw InvalidActionError(model);
        return dispatch.post(getModelRoute(model, id), {}, callback);
    }

    dispatch.remove = function(model, id, callback) {
        if (!validAction(model, 'DELETE')) throw InvalidActionError(model);
        return dispatch.delete(getModelRoute(model, id), callback);
    }

    dispatch.list = function(model, callback){
        if (!validAction(model, 'GET')) throw InvalidActionError(model);
        return dispatch.get(getModelRoute(model), {}, callback);
    }

    dispatch.search = function(model, values, callback) {
        if (!validAction(model, 'GET')) throw InvalidActionError(model);
        return dispatch.get(getModelRoute(model), values, callback);
    };

    dispatch.find = function(model, id, callback){
        if (!validAction(model, 'GET')) throw InvalidActionError(model);
        return dispatch.get(getModelRoute(model, id), {}, callback);
    }

    // Model-specific functions

    dispatch.article = function(id, values, callback){
        return dispatch.get(getModelRoute('article', id), values, callback);
    }

    dispatch.revision = function(model, parent_id, revision_id, callback){
        var model = model + '.revision';
        if (!validAction(model, 'GET')) throw InvalidActionError(model);
        return dispatch.get(getModelRoute(model, parent_id), {revision_id: revision_id}, callback);
    }

    // TODO: fix component routes
    dispatch.components = function(slug, callback){
        var url = 'components/' + slug;
        return dispatch.get(url, {}, callback);
    }

    dispatch.saveComponent= function(slug, component, spot, fields, callback){
        var url = 'components/' + slug;
        var data = {
            spot: spot,
            component: component,
            fields: fields,
        };
        return dispatch.post(url, data, callback);
    }

    // AJAX Functions
    // --------------------

    // Helper function to build AJAX URL
    var generateAjaxURL = function(url){
        return dispatch.settings.api_url + url + "/?format=" + dispatch.settings.api_format;
    }

    dispatch.post = function(url, values, callback) {
      return $.ajax({
        type: "POST",
        beforeSend: defaultBeforeSend,
        url: generateAjaxURL(url),
        data: values,
        success: callback
      });
    };

    dispatch.get = function(url, values, callback) {
      return $.ajax({
        type: "GET",
        beforeSend: defaultBeforeSend,
        url: generateAjaxURL(url),
        data: values,
        success: callback
      });
    };

    dispatch.patch = function(url, values, callback) {
      return $.ajax({
        type: "PATCH",
        beforeSend: defaultBeforeSend,
        data: values,
        url: generateAjaxURL(url),
        success: callback
      });
    };

    dispatch.delete = function(url, callback){
        return $.ajax({
            type: "DELETE",
            beforeSend: defaultBeforeSend,
            url: generateAjaxURL(url),
            success: callback
        });
    }

    dispatch.getNext = function(nextUrl, callback) {
      return $.ajax({
        type: "GET",
        beforeSend: defaultBeforeSend,
        url: nextUrl,
        success: callback
      });
    };

    dispatch.upload = function(url, data, callback) {
        return $.ajax({
            url: generateAjaxURL(url),
            type: 'POST',
            beforeSend: defaultBeforeSend,
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: callback
        });
    };

    // CSRF Functions

    var getCookie = function(name) {
      var cookie, cookieValue, cookies, findCookie, _i, _len;
      cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        cookies = document.cookie.split(';');
        findCookie = function(cookie) {
          cookie = $.trim(cookie);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            return cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          }
        };
        for (_i = 0, _len = cookies.length; _i < _len; _i++) {
          cookie = cookies[_i];
          findCookie(cookie);
        }
      }
      return cookieValue;
    };

    dispatch.getCSRFToken = function(){
        return getCookie('csrftoken');
    }

    var csrfSafeMethod = function(method) {
      return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
    };

    var defaultBeforeSend = function(xhr, settings) {
        var csrftoken = getCookie('csrftoken');
        if (!csrfSafeMethod(settings.type))
            return xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }

}).call(this);