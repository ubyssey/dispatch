from dispatch import __version__

def static(request):
    return {
        'version': __version__,
    }