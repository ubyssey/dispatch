from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.http import HttpResponse

from dispatch.apps.events.event_integrations import FacebookEvent, FacebookEventError, UBCEvent, UBCEventError, NoEventHandler, NoEventHandlerError
from dispatch.apps.events.forms import EventForm
from dispatch.apps.events.models import Event

def submit_landing(request):
    return render(request, 'events/submit/landing.html')

def submit_success(request):
    return render(request, 'events/submit/success.html')

def submit_form(request):
    event_url = request.POST.get('event_url')
    url_error = False

    if request.POST.get('url_import') and event_url is not None:

        handlers = {
            'calendar.events.ubc.ca': {
                'url_handler': UBCEvent,
                'url_handler_error': UBCEventError
            },
            'facebook.com/events/': {
                'url_handler': FacebookEvent,
                'url_handler_error': FacebookEventError
            }
        }

        url_handler = NoEventHandler
        url_handler_error = NoEventHandlerError

        for url_snippet, url_dict in handlers.items():
            if url_snippet in event_url:

                url_handler = url_dict['url_handler']
                url_handler_error = url_dict['url_handler_error']
                break

        try:
            event = url_handler(event_url)
            data = event.get_data()
            form = EventForm(initial=data)

        except url_handler_error:
            url_error = True
            form = EventForm()

    elif request.method == 'POST':
        form = EventForm(request.POST, request.FILES)

        if form.is_valid():
            form.is_submission = True
            form.save()

            return redirect(submit_success)
    else:
        form = EventForm()

    return render(request, 'events/submit/form.html', {'form': form, 'url_error': url_error})
