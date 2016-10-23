from setuptools import setup, find_packages

setup(name='dispatch',
      version='0.2.26',
      description='A publishing platform for modern newspapers',
      url='https://github.com/ubyssey/dispatch',
      author='Peter Siemens',
      author_email='peterjsiemens@gmail.com',
      license='GPL',
      packages=find_packages(),
      scripts=['dispatch/bin/dispatch-admin'],
      include_package_data=True,
      install_requires=[
        'django == 1.9.4',
        'djangorestframework == 3.2.4',
        'pillow'
      ],
      zip_safe=False)
