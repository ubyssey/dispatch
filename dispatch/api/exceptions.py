from rest_framework.exceptions import APIException
from rest_framework import status

class InvalidFilename(APIException):
    status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    default_detail = 'Invalid filename'

class InvalidGalleryAttachments(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid gallery data'
