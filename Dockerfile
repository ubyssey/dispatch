# At the moment, this Dockerfile is purely intended for use for VSC development containers
FROM ubyssey/ubyssey.ca:latest

# copy Dispatch files into the container
WORKDIR /workspaces/
COPY . ./dispatch/
WORKDIR /workspaces/dispatch

# setup Dispatch into "development mode"
RUN pip install -e .[dev]
RUN python setup.py develop
WORKDIR /workspaces/dispatch/dispatch/static/manager
RUN rm -rf node_modules
RUN npm install
RUN npm run-script dev

#WORKDIR /workspaces/ubyssey.ca/
#RUN python manage.py migrate

# make "main directory" in container contain both Dispatch and Ubyssey repos for git
WORKDIR /workspaces/
#ENTRYPOINT ["/workspaces/ubyssey.ca/manage.py", "runserver", "0.0.0.0:8000"]
