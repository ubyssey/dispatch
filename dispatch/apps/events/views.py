from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import render, redirect
from django.http import HttpResponse

from dispatch.apps.events.facebook import FacebookEvent
from dispatch.apps.events.forms import EventForm
from dispatch.apps.events.models import Event

def submit(request):

    if request.POST.get('submit_facebook'):

        facebook_url = request.POST.get('facebook_url')

        event = FacebookEvent(facebook_url)

        event_data = event.get_data()

        form = EventForm(initial=event_data)

        print 'woo 1'

        return redirect('form.html')
        # , {'form':form}

    elif request.GET.get('submit_manually'):

        form = EventForm()

        print 'woo 2'

        return redirect(request, 'form.html', {'form': form})

    else:

        print 'woo 3'

        return render(request, 'submit.html')

def form(request):

    if request.POST.get('submit_event'):

        form = EventForm(request.POST, request.FILES)

        print 'woo4'

        if form.is_valid():

            form.is_submission = True

            print 'woo 5'

            form.save()

            return redirect(request, 'success.html')

    else:

        form = EventForm()

        print 'woo 6'


        return render(request, 'form.html', {'form': form})

def success(request):

    print 'woo 7'

    return render(request, 'success.html')
