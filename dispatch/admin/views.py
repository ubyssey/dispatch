from datetime import datetime
from django.contrib.auth.decorators import permission_required
from django.conf import settings

from django.shortcuts import render, redirect
from django.contrib.auth.models import Group

from dispatch.models import Invite
from dispatch.admin.forms import SignUpForm
from django.utils import timezone

from django.http import Http404

def signup(request):
    url = request.get_full_path()
    uuid = url.rsplit('/',1)[1]

    invites = Invite.objects.all()
    invites = invites.filter(url=uuid)

    try:
        email = invites.first().email
        person = invites.first().person
        permissions = invites.first().permissions
        expiration_date = invites.first().expiration_date
    except AttributeError:
        raise Http404("This page does not exist.")

    if expiration_date < timezone.now():
        raise Http404("This page does not exist")

    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)

            user.email = email
            user.person = person

            user.save()

            if permissions == 'admin':
                group = Group.objects.get(name='Admin')
                user.groups.add(group)

            invites.delete()

            return redirect('dispatch-admin')
        else:
            return render(request, 'registration/signup.html', {'form' : form, 'email': email})

    else:
        form = SignUpForm()

    return render(request, 'registration/signup.html', {'form' : form, 'email': email})
