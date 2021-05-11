from setuptools import setup, find_packages

setup(name='dispatch',
    description='A publishing platform for modern newspapers',
    version='2.0.3',
    url='https://github.com/ubyssey/dispatch',
    author='Peter Siemens',
    author_email='peterjsiemens@gmail.com',
    license='GPL',
    packages=find_packages(),
    scripts=['dispatch/bin/dispatch-admin'],
    include_package_data=True,
    install_requires=[
        'django == 3.1.8',
        'djangorestframework == 3.12.2',
        'pillow',
        'requests',
        'jsonfield',
        'docopt == 0.6.2'
    ],
    extras_require={
        'dev': [
            'coverage'
        ]
    },
    zip_safe=False)
