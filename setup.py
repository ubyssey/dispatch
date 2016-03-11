from setuptools import setup

setup(name='dispatch',
      version='0.1',
      description='A publishing platform for modern newspapers',
      url='http://github.com/ubyssey/dispatch',
      author='Peter Siemens',
      author_email='peterjsiemens@gmail.com',
      license='GPL',
      packages=['dispatch'],
      scripts=['dispatch/bin/dispatch-admin'],
      install_requires=[
        'mysql-python == 1.2.5',
        'django == 1.8.2',
        'djangorestframework == 3.2.4',
        'pillow'
      ],
      zip_safe=False)
