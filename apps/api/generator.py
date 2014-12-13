__author__ = 'Steven Richards'

from time import time
from hashlib import sha512
from os import urandom

#Future home of API key generation/validation

class KeyPair():
    
    def __init__(self, username):
        self.user = username

    def generate_key(self):
        return True

    def validate_key(self):
        return True
