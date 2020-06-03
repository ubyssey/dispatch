FROM keeganlandrigan/ubyssey-django:latest

WORKDIR /workspaces/dispatch
RUN pip install -e .[dev]
RUN python setup.py develop
WORKDIR /workspaces/dispatch/dispatch/static/manager
RUN rm -rf node_modules
RUN npm install
RUN npm run-script dev

#WORKDIR /workspaces/ubyssey.ca/
#RUN python manage.py migrate

WORKDIR /workspaces/
ENTRYPOINT ["/workspaces/ubyssey.ca/manage.py", "runserver", "0.0.0.0:8000"]