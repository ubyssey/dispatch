from tempfile import TemporaryFile

from libxmp import XMPMeta

def parse_xmp(buffer):
    """Extract XMP portion of data from image file buffer."""

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
            return None

        xmp_open_tag = xmp_data.find('<x:xmpmeta')
        xmp_close_tag = xmp_data.find('</x:xmpmeta>')
        xmp_str = xmp_data[xmp_open_tag:xmp_close_tag + 12]

        meta = XMPMeta()
        meta.parse_from_str(xmp_str)

        return meta
