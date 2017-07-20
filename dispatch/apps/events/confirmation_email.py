import smtplib

class EmailError(Exception):
    pass

class ConfirmationEmail(object):
    """Class to send confirmation emails"""

    def __init__(self, form_data):
        self.form_data = form_data
        self.smtp_object = self._initialize()


    def _initialize(self):
        smtp_obj = smtplib.SMTP('noreply@ubyssey.ca', 587)

        if smtp_obj.ehlo()[0] == 250:
            # If port actually is 587:
            # smtp_obj.starttls() - 220 response code says that the server is ready
            return smtp_obj

        else:
            raise EmailError('Error connecting to email server')

    def login(self):
        
