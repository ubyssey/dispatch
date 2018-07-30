import os
from StringIO import StringIO
from tempfile import TemporaryFile

from libxmp import XMPMeta, XMPError
from PIL import Image as Img

# EXIF tag list: https://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/EXIF.html
EXIF_DESCRIPTION = 270
EXIF_ARTIST = 315

EXIF_FORMATS = '.(jpg|JPEG|jpeg|JPG|tiff|tif)'

XMP_TITLE = 'title'
XMP_DESCRIPTION = 'description'
XMP_SUBJECT = 'subject'
XMP_CREATOR = 'creator'

def get_extension(img):
    """Returns the extension of Django ImageField object."""

    ext = os.path.splitext(img.name)[1]
    if ext:
        # Remove period from extension
        return ext[1:]
    return ext

def parse_exif(img):
    """Extract EXIF portion of data from Django ImageField object."""

    image = Img.open(StringIO(img.read()))
    img.seek(0)
    metadata = {}

    # EXIF data is only read from files with TIFF or JPEG format, otherwise an error will occur
    if get_extension(img) in EXIF_FORMATS:
        exif = image._getexif()

        if exif is None:
            return metadata, authors

        metadata['description'] = exif.get(EXIF_DESCRIPTION)

        authors = set()

        author_name = exif.get(EXIF_ARTIST)
        if author_name is not None:
            authors.add(author_name)

        metadata['authors'] = authors

    return metadata

def parse_xmp(img, metadata={}):
    """Extract XMP portion of data from Django ImageField object."""

    buffer = img.read()
    img.seek(0)
    b = bytearray(buffer)

    with TemporaryFile() as f:
        f.write(b)
        f.seek(0)

        xmp_data = ''
        xmp_started = False

        for line in f:
            if not xmp_started:
                xmp_started = '<x:xmpmeta' in line
            if xmp_started:
                xmp_data += line
                if line.find('</x:xmpmeta') > -1:
                    break
        else:
            return metadata

        xmp_open_tag = xmp_data.find('<x:xmpmeta')
        xmp_close_tag = xmp_data.find('</x:xmpmeta>')
        xmp_str = xmp_data[xmp_open_tag:xmp_close_tag + 12]

        xmp = XMPMeta()
        xmp.parse_from_str(xmp_str)

    if xmp is None:
        return metadata

    try:
        ns = xmp.get_namespace_for_prefix('dc')

        title = xmp.get_array_item(ns, XMP_TITLE, 1)
        if title:
            metadata['title'] = title

        description = xmp.get_array_item(ns, XMP_DESCRIPTION, 1)
        if description:
            metadata['description'] = description

        tags = set()
        counter = 1
        tag_name = xmp.get_array_item(ns, XMP_SUBJECT, counter)
        while tag_name != '':
            tags.add(tag_name)
            counter += 1

            try:
                tag_name = xmp.get_array_item(ns, XMP_SUBJECT, counter)
            except XMPError:
                break

        metadata['tags'] = tags

        authors = metadata.get('authors', set())

        author_name = xmp.get_array_item(ns, XMP_CREATOR, 1)
        if author_name:
            authors.add(author_name)

        metadata['authors'] = authors

    except XMPError:
        pass

    return metadata

def parse_metadata(img):
    """Extract metadata from Django ImageField object."""

    metadata = parse_exif(img)

    # Overwrite EXIF keys with XMP data
    metadata = parse_xmp(img, metadata)

    return metadata
