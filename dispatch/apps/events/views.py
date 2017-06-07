from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.http import HttpResponse

from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.forms import EventForm
from dispatch.apps.events.models import Event

def success(request):

    return HttpResponse('Your event has been created')

def submit(request):

    if request.POST.get("submit_facebook") and (request.POST.get('facebook_url') is not None):
        # show form with facebook event data

        event = FacebookEvent(request.POST.get('facebook_url'))

        event_data = event.get_json()
        event_data['facebook_url'] = request.POST.get('facebook_url')
        event_data['facebook_image_url'] = event.get_image()

        form = EventForm(initial=event_data)

    elif request.POST.get("submit_event"):

        form = EventForm(request.POST, request.FILES)

        if form.is_valid():

            event = form.save(commit=False)

            event.is_submission = True

            print '\nImage before facebook caching: ' + str(event.image)
            print 'Facebook image url: ' + str(event.facebook_image_url)

            if event.facebook_image_url and not event.image:
                event.cacheimage()
                print 'Caching image!'

            event.save()

            print 'Is Submitted: ' + str(event.is_submission)
            print 'Is Published: ' + str(event.is_published)
            print 'Image: ' + str(event.image) + '\n'

            return redirect(success)

        else:
            print "ERRORS: " + str(form.errors)
            return HttpResponse('Invalid event data: Try again')

        print form.errors

    else:
        form = EventForm()

    return render(request, 'submit.html', {'form': form})
