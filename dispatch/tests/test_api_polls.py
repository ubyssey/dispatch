from os.path import join
from rest_framework import status

from django.core.urlresolvers import reverse
from django.conf import settings

from dispatch.tests.cases import DispatchAPITestCase, DispatchMediaTestMixin
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Poll, PollAnswer, PollVote


class PollsTests(DispatchAPITestCase):
    """Class to test the poll API methods"""

    def test_poll_creation(self):
        """Test simple poll creation, checks the response and database"""

        pass

    def test_poll_update(self):
        """Test updating a poll works, check the response and database"""

        pass

    def test_unauthorized_poll_creation(self):
        """Create poll should fail with unauthenticated request"""

        pass

    def test_unauthorized_poll_update(self):
        """Updating a poll should fail with unauthenticated request"""

        pass

    def test_delete_poll(self):
        """Simple poll deletion test and throw error if trying to delete item
        does not exist"""

        pass

    def test_unauthorized_poll_deletion(self):
        """Unauthorized deletion of a poll isn't allowed"""

        pass

    def test_hide_poll_results(self):
        """Unauthorized request should not be able to see results on polls
        where show results is false"""

        pass

    def test_poll_search(self):
        """Should be able to search poll by name and question"""

        pass

    def test_poll_vote(self):
        """Any user should be able to vote in a poll"""

        pass

    def test_poll_change_vote(self):
        """A user should be able to change their vote"""

        pass

    def test_poll_closed_vote(self):
        """A user should not be able to vote in a closed poll"""

        pass
