class WidgetException(Exception):
    """Base class for all widget exceptions"""
    pass

class ZoneException(Exception):
    """Base class for all zone exceptions"""
    pass

class TemplateException(Exception):
    """Base class for all template exceptions"""
    pass

class InvalidWidget(WidgetException):
    pass

class InvalidZone(ZoneException):
    pass

class WidgetNotFound(WidgetException):
    pass

class ZoneNotFound(ZoneException):
    pass

class TemplateNotFound(TemplateException):
    pass

class InvalidField(Exception):
    pass