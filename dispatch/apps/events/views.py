from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.http import HttpResponse

from dispatch.apps.events.facebook import FacebookEvent, FacebookEventError
from dispatch.apps.events.forms import EventForm
from dispatch.apps.events.models import Event

def submit_landing(request):
    return render(request, 'events/submit/landing.html')

def submit_success(request):
    return render(request, 'events/submit/success.html')

def submit_form(request):
    facebook_url = request.POST.get('facebook_url')
    facebook_error = False

    if request.POST.get('facebook_import') and facebook_url is not None:
        try:
            event = FacebookEvent(facebook_url)
            data = event.get_data()
            form = EventForm(initial=data)
        except FacebookEventError:
            facebook_error = True
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

    return render(request, 'events/submit/form.html', {'form': form, 'facebook_error': facebook_error})
