Q: How do I run tests?
* Navigate to the top-level dispatch folder and in the terminal type: `dispatch-admin test`
  If you don't want to run every test file, you can type `dispatch-admin test tests.test_whatever_module_name`

Q: It's been awhile since I did a `git pull` now I'm getting migration errors and tables are messing from the SQL database
* Navigate to the ubyssey-theme repository (Where manage.py lives) and run these commands
```
python manage.py makemigrations core
python manage.py makemigrations content
python manage.py makemigrations frontend
```