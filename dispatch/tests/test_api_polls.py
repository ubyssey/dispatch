from collections import OrderedDict
from rest_framework import status

from django.urls import reverse

from dispatch.tests.cases import DispatchAPITestCase
from dispatch.tests.helpers import DispatchTestHelpers
from dispatch.models import Poll, PollAnswer, PollVote


class PollsTests(DispatchAPITestCase):
    """Class to test the poll API methods"""

    def test_poll_creation(self):
        """Test simple poll creation, checks the response and database"""

        response = DispatchTestHelpers.create_poll(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        answers = [ OrderedDict([('id',1), ('name','answer1'), ('vote_count',0)]), OrderedDict([('id',2), ('name','answer2'), ('vote_count',0)]) ]
        # Check data
        self.assertEqual(response.data['name'], 'test name')
        self.assertEqual(response.data['question'], 'test question')
        self.assertEqual(response.data['is_open'], True)
        self.assertEqual(response.data['show_results'], True)
        self.assertEqual(response.data['answers'], answers)

        poll = Poll.objects.get(pk=response.data['id'])
        self.assertEqual(poll.name, 'test name')
        self.assertEqual(poll.question, 'test question')
        self.assertTrue(poll.is_open)
        self.assertTrue(poll.show_results)

    def test_poll_update(self):
        """Test updating a poll works, check the response and database"""

        # Create original poll
        response = DispatchTestHelpers.create_poll(self.client)

        # Update this poll
        url = reverse('api-polls-detail', args=[response.data['id']])
        updated_answers = [{'id':1,'name':'updated answer'}]
        data = {
            'name': 'updated name',
            'answers_json': updated_answers
        }
        answers = [ OrderedDict([('id',1), ('name','updated answer'), ('vote_count',0)]) ]
        response = self.client.patch(url, data, format='json')

        # Check data
        self.assertEqual(response.data['name'], 'updated name')
        self.assertEqual(response.data['question'], 'test question')
        self.assertEqual(response.data['is_open'], True)
        self.assertEqual(response.data['show_results'], True)
        self.assertEqual(response.data['answers'], answers)

        poll = Poll.objects.get(pk=response.data['id'])
        self.assertEqual(poll.name, 'updated name')
        self.assertEqual(poll.question, 'test question')
        self.assertTrue(poll.is_open)
        self.assertTrue(poll.show_results)

    def test_unauthorized_poll_creation(self):
        """Create poll should fail with unauthenticated request"""

        # Clear authentication credentials
        self.client.credentials()

        response = DispatchTestHelpers.create_poll(self.client)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_poll_update(self):
        """Updating a poll should fail with unauthenticated request"""

        # Create original poll
        response = DispatchTestHelpers.create_poll(self.client)

        # Clear authentication credentials
        self.client.credentials()

        # Attempt to update this poll
        url = reverse('api-polls-detail', args=[response.data['id']])
        data = {
            'name': 'updated name'
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_poll(self):
        """Simple poll deletion test and throw error if trying to delete item
        does not exist"""

        # Create original poll
        response = DispatchTestHelpers.create_poll(self.client)
        poll_id = response.data['id']
        url = reverse('api-polls-detail', args=[poll_id])

        # Successful deletion should return 204
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Poll.objects.filter(id=poll_id).exists())
        self.assertFalse(PollAnswer.objects.filter(poll_id=poll_id).exists())

        # Can't delete a poll that has already been deleted
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_poll_deletion(self):
        """Unauthorized deletion of a poll isn't allowed"""

        response = DispatchTestHelpers.create_poll(self.client)

        # Generate detail URL
        url = reverse('api-polls-detail', args=[response.data['id']])

        # Clear authentication credentials
        self.client.credentials()

        # Attempt to delete the poll
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_hide_poll_results(self):
        """Unauthorized request should not be able to see results on polls
        where show results is false"""

        # Create a poll to vote in
        response = DispatchTestHelpers.create_poll(self.client, show_results=False)

        poll = Poll.objects.get(pk=response.data['id'])
        answer1 = PollAnswer.objects.filter(poll_id=poll.id).first()
        answer2 = PollAnswer.objects.filter(poll_id=poll.id).last()
        # Clear credentials
        self.client.credentials()

        url = reverse('api-polls-vote', args=[poll.id])

        data = {
            'answer_id': answer1.id
        }

        # Vote in the poll
        response = self.client.post(url, data, format='json')
        # Confirm the vote was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = {
            'answer_id': answer2.id
        }

        # Vote in the poll
        response = self.client.post(url, data, format='json')
        # Confirm the vote was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = reverse('api-polls-detail', args=[poll.id])

        response = self.client.get(url, format='json')
        self.assertEqual(response.data['total_votes'], 0)
        self.assertEqual(response.data['answers'][0]['vote_count'], 0)
        self.assertEqual(response.data['answers'][1]['vote_count'], 0)


    def test_poll_search(self):
        """Should be able to search poll by name and question"""

        poll_1 = DispatchTestHelpers.create_poll(self.client, name='Poll 1', question='question 1')
        poll_2 = DispatchTestHelpers.create_poll(self.client, name='Poll 1 and 2', question='question 1 and 2')
        poll_3 = DispatchTestHelpers.create_poll(self.client, name='Poll 3', question='question 3')

        url = '%s?q=%s' % (reverse('api-polls-list'), 'Poll 1')
        response = self.client.get(url, format='json')

        self.assertEqual(response.data['results'][0]['name'], 'Poll 1')
        self.assertEqual(response.data['results'][1]['name'], 'Poll 1 and 2')
        self.assertEqual(response.data['count'], 2)

    def test_poll_vote(self):
        """Any user should be able to vote in a poll"""

        # Create a poll to vote in
        response = DispatchTestHelpers.create_poll(self.client, show_results=False)

        poll_id = response.data['id']
        answer = PollAnswer.objects.filter(poll_id=poll_id).first()

        # Clear credentials
        url = reverse('api-polls-vote', args=[poll_id])

        data = {
            'answer_id': answer.id
        }

        response = self.client.post(url, data, format='json')

        # Check that the vote was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = reverse('api-polls-detail', args=[poll_id])

        response = self.client.get(url)

        # Check that the results are correct
        self.assertEqual(response.data['total_votes'], 1)
        self.assertEqual(response.data['answers'][0]['vote_count'], 1)

    def test_poll_change_vote(self):
        """A user should be able to change their vote"""

        # Create a poll to vote in
        response = DispatchTestHelpers.create_poll(self.client)

        poll_id = response.data['id']
        answer_1 = PollAnswer.objects.filter(poll_id=poll_id).first()
        answer_2 = PollAnswer.objects.filter(poll_id=poll_id).last()

        url = reverse('api-polls-vote', args=[poll_id])

        data = {
            'answer_id': answer_1.id
        }

        response = self.client.post(url, data, format='json')
        vote_id = response.data['id']

        # Check that the vote was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = {
            'answer_id': answer_2.id,
            'vote_id': vote_id
        }

        response = self.client.post(url, data, format='json')

        # Check that the vote change was successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], vote_id)

        # Get the poll
        url = reverse('api-polls-detail', args=[poll_id])

        response = self.client.get(url)

        # Check that the results are correct
        self.assertEqual(response.data['total_votes'], 1)
        self.assertEqual(response.data['answers'][0]['vote_count'], 0)
        self.assertEqual(response.data['answers'][1]['vote_count'], 1)

    def test_poll_vote_invalid_answer(self):
        """A user should not be able to vote for an answer that is not
        valid for the poll"""

        # Create polls to vote in
        response = DispatchTestHelpers.create_poll(self.client, is_open=True)

        poll_1_id = response.data['id']
        poll_1 = Poll.objects.get(id=poll_1_id)
        answer_poll_1 = PollAnswer.objects.filter(poll_id=poll_1_id).first()

        response = DispatchTestHelpers.create_poll(self.client, is_open=True)

        poll_2_id = response.data['id']
        poll_2 = Poll.objects.get(id=poll_2_id)
        answer_poll_2 = PollAnswer.objects.filter(poll_id=poll_2_id).first()

        url = reverse('api-polls-vote', args=[poll_1_id])

        data = {
            'answer_id': answer_poll_2.id
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_poll_vote_closed(self):
        """A user should not be able to vote in a closed poll"""

        # Create a poll to vote in
        response = DispatchTestHelpers.create_poll(self.client, is_open=False)

        poll_id = response.data['id']
        answer = PollAnswer.objects.filter(poll_id=poll_id).first()

        url = reverse('api-polls-vote', args=[poll_id])

        data = {
            'answer_id': answer.id
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Get the poll
        url = reverse('api-polls-detail', args=[poll_id])

        response = self.client.get(url)

        # Check that the results are correct
        self.assertEqual(response.data['total_votes'], 0)
        self.assertEqual(response.data['answers'][0]['vote_count'], 0)
        self.assertEqual(response.data['answers'][1]['vote_count'], 0)
