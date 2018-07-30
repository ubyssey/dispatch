from setuptools import setup, find_packages

setup(name='dispatch',
    version='0.4.20',
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
        'python-xmp-toolkit',
    ],
    extras_require={
        'dev': [
            'coverage'
        ]
    },
    zip_safe=False)
