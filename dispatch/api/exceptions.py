from rest_framework.exceptions import APIException
from rest_framework import status

class InvalidFilename(APIException):
    status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    default_detail = 'Invalid filename'
    default_code = 'Invalid filename'
