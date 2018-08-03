from datetime import datetime

from django.utils import timezone
from django.shortcuts import render, redirect

from rest_framework.generics import get_object_or_404

from django.contrib.auth.models import Group
from dispatch.models import Invite
from dispatch.admin.forms import SignUpForm

from django.http import Http404

def signup(request, uuid=None):
    """Handles requests to the user signup page."""

    invite = get_object_or_404(Invite.objects.all(), id=uuid)

    if invite.expiration_date < timezone.now():
        invite.delete()
        raise Http404('This page does not exist.')

    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)

            user.email = invite.email
            user.person = invite.person

            user.save()

            if invite.permissions == 'admin':
                group = Group.objects.get(name='Admin')
                user.groups.add(group)

            invite.delete()

            return redirect('dispatch-admin')
        else:
            return render(
                request,
                'registration/signup.html',
                {
                    'form': form,
                    'email': invite.email
                }
            )

    else:
        form = SignUpForm()

    return render(
        request,
        'registration/signup.html',
        {
            'form': form,
            'email': invite.email
        }
    )
