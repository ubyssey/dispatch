from rest_framework.exceptions import APIException
from rest_framework import status

class InvalidFilename(APIException):
    status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    default_detail = 'Invalid filename'

class ProtectedResourceError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Deletion failed because resource is a member of a protected relationship'

class InvalidGalleryAttachments(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid gallery data'

class BadCredentials(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid user credentials'

class PollClosed(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Poll closed'

class InvalidPoll(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid poll'

class UnpermittedActionError(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'You do not have permission to perform this action'
