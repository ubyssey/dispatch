from dispatch.apps.api.exceptions import InvalidFilename

def all_ascii(s):
    return all(ord(c) < 128 for c in s)

def ValidFilename(value):
    if not all_ascii(value.name):
        raise InvalidFilename('The filename cannot contain non-ASCII characters')
