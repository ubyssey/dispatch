from setuptools import setup, find_packages

setup(name='dispatch',
    version='0.2.21',
    description='A publishing platform for modern newspapers',
    url='https://github.com/ubyssey/dispatch',
    author='Peter Siemens',
    author_email='peterjsiemens@gmail.com',
    license='GPL',
    packages=find_packages(),
    scripts=['dispatch/bin/dispatch-admin'],
    include_package_data=True,
    install_requires=[
        'django == 1.11',
        'djangorestframework == 3.6.2',
        'pillow',
        'requests == 2.6.0',
        'jsonfield',
        'django-phonenumber-field == 1.3.0',
        'beautifulsoup4'
    ],
    extras_require={
        'dev': [
            'coverage'
        ]
    },
    zip_safe=False)
