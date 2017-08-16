import re

from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.http import HttpResponse

from dispatch.apps.events.sources import FacebookEvent, UBCEvent, NoEventHandler, EventError
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

        sources = {
            'calendar.events.ubc.ca': UBCEvent,
            'facebook.com': FacebookEvent
        }

        hostname = get_host_from_url(event_url)

        if hostname in sources:
            handler = sources[hostname]
        else:
            handler = NoEventHandler

        try:
            event = handler(event_url)
            data = event.get_data()
            data['event_type'] = event.event_type
            form = EventForm(initial=data)
        except EventError:
            url_error = True
            form = EventForm()

    elif request.method == 'POST':
        form = EventForm(request.POST, request.FILES)

        if form.is_valid():

            event = form.save(commit=False)
            event.is_submission = True
            event.save()
            return redirect(submit_success)
    else:
        form = EventForm()

    return render(request, 'events/submit/form.html', {'form': form, 'url_error': url_error})

def get_host_from_url(url):
    """Parses URL against regex to pull out the hostname"""

    # Match numbers that is the event id from the url and return them
    m = re.search('.*(facebook\.com|calendar\.events\.ubc\.ca)+.*', url)

    if m:
        return m.group(1)
    else:
        raise EventError('URL provided is not a valid Facebook event or UBC event url')
