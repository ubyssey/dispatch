from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.http import HttpResponse

from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.forms import EventForm
from dispatch.apps.events.models import Event

def success(request):

    return render(request, 'success.html')

def submit(request):

    facebook_url = request.POST.get('facebook_url')

    if request.POST.get('submit_facebook') and facebook_url:

        event = FacebookEvent(facebook_url)

        event_data = event.get_data()

        form = EventForm(initial=event_data)

        return render(request, 'form.html', {'form': form})

    elif request.GET.get('submit_manually'):

        form = EventForm()

        return render(request, 'form.html', {'form': form})

    elif request.POST.get('submit_event'):

        form = EventForm(request.POST, request.FILES)

        if form.is_valid():

            form.is_submission = True

            form.save()

            return redirect(success)

    else:
        return render(request, 'submit.html')
