import StringIO

from PIL import Image as Img

from django.db.models import Model
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.storage import default_storage

class ImageSave(Model):
    """Class that contains logic for image manipulation"""

    def save_thumbnail(self, image, size, name, label, fileType):
        width, height = size
        (imw, imh) = image.size

        # If image is larger than thumbnail size, resize image
        if (imw > width) or (imh > height):
            image.thumbnail(size, Img.ANTIALIAS)

        # Attach new thumbnail label to image filename
        name = "%s-%s.%s" % (name, label, fileType)

        # Image.save format takes JPEG not jpg
        if fileType in self.JPG_FORMATS:
            fileType = 'JPEG'

        # Write new thumbnail to StringIO object
        image_io = StringIO.StringIO()
        image.save(image_io, format=fileType, quality=75)

        # Convert StringIO object to Django File object
        thumb_file = InMemoryUploadedFile(image_io, None, name, 'image/jpeg', image_io.len, None)

        # Save the new file to the default storage system
        default_storage.save(name, thumb_file)
