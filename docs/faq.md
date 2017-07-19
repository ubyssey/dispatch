# Frequently Asked Questions
---

Q: How do I run tests?
* Navigate to the top-level dispatch folder (`cd ubyssey-dev/dispatch`) and in the terminal type: `dispatch-admin test`.
  If you don't want to run every test file, you can type `dispatch-admin test tests.test_whatever_module_name`

Q: It's been a while since I've done a `git pull` now I'm getting migration errors and tables are messing from the SQL database
* Navigate to the ubyssey-theme repository (`cd ubyssey-dev/ubyssey-dispatch-theme`, where manage.py lives) and run these commands:
```
python manage.py makemigrations core
python manage.py makemigrations content
python manage.py makemigrations frontend
python manage.py makemigrations events

python manage.py migrate core
python manage.py migrate content
python manage.py migrate frontend
python manage.py migrate events
```
