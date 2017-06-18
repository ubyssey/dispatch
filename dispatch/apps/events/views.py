from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.http import HttpResponse

from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.forms import EventForm
from dispatch.apps.events.models import Event

def success(request):

    return HttpResponse('Your event has been created')

def submit(request):

    facebook_url = request.POST.get('facebook_url')

    if request.POST.get('submit_facebook') and facebook_url:

        event = FacebookEvent(facebook_url)

        event_data = event.get_data()

        form = EventForm(initial=event_data)

    elif request.POST.get('submit_event'):

        form = EventForm(request.POST, request.FILES)

        if form.is_valid():

            form.save()

            return redirect(success)

    else:
        form = EventForm()

    return render(request, 'submit.html', {'form': form})
