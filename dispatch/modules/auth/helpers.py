import datetime
def get_expiration_date():
    return datetime.datetime.now() + datetime.timedelta(days=1)
