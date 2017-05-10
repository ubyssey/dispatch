from rest_framework.exceptions import APIException
from rest_framework import status

class InvalidFilename(APIException):
    status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    default_detail = 'Invalid filename'

class ProtectedResourceError(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'Cannot delete MODEL because it is PROTECTED'