#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DISPATCH_PROJECT_DIR", os.path.dirname(os.path.realpath(__file__)))
    os.environ.setdefault("DISPATCH_PROJECT_MODULE", "{{project}}")

    from dispatch.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
