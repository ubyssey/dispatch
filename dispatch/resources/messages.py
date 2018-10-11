import dispatch

DISPATCH_ADMIN_HELP_TEXT = """
Dispatch Admin """+ dispatch.__version__ + """

Usage: 
    dispatch-admin <OPTION> <ARGUMENT>

 Options:
    test            Run tests
    coverage        Run coverage
    report          Generate coverage report
    report_html     Generate html coverage report
   -h, --help       Print this help message and exit
   --version        Print product version and exit

See https://github.com/ubyssey/dispatch for more details
"""