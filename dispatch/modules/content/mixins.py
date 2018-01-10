from itertools import groupby

class AuthorMixin(object):
    def save_authors(self, authors, is_publishable=False):
        if not is_publishable:
            self.authors.clear()

        # Create a new author for each person in list
        # Use `n` to save authors in correct order
        for n, author in enumerate(authors):
            if 'type' in author:
                author_instance = self.AuthorModel.objects.create(
                    person_id=author['person'],
                    type=author['type'],
                    order=n)
            else:
                author_instance = self.AuthorModel.objects.create(
                    person_id=author['person'],
                    order=n)
            self.authors.add(author_instance)

        if is_publishable:
            self.save(revision=False)
        else:
            self.save()

    def get_author_string(self, links=False):
        saved_args = locals()
        saved_args = saved_args['links']
        """Returns list of authors as a comma-separated
        string (with 'and' before last author)."""

        def format_author(author):
            if links and author.person.slug:
                return '<a href="/authors/%s/">%s</a>' % (author.person.slug, author.person.full_name)
            return author.person.full_name

        if links == True or links == False:
            authors = map(format_author, self.authors.all())
        else:
            authors = map(format_author, saved_args)

        if not authors:
            return ""
        elif len(authors) == 1:
            # If this is the only author, just return author name
            return authors[0]

        return ", ".join(authors[0:-1]) + " and " + authors[-1]

    def get_author_type_string(self):
        """Returns list of authors as a comma-separated string
        sorted by author type (with 'and' before last author)."""

        authorTypeString = ''
        aStringA = ''
        aStringB = ''
        aStringC = ''
        aStringD = ''

        authors = dict((k, list(v)) for k, v in groupby(self.authors.all(), lambda a: a.type))
        for author in authors:
            if author == 'author':
                aStringA += 'Written by ' + self.get_author_string(authors['author'])
            if author == 'photographer':
                aStringB += 'Photos by ' + self.get_author_string(authors['photographer'])
            if author == 'illustrator':
                aStringC += 'Illustrations by ' + self.get_author_string(authors['illustrator'])
            if author == 'videographer':
                aStringD += 'Videos by ' + self.get_author_string(authors['videographer'])
        if aStringA != '':
            authorTypeString += aStringA
        if aStringB != '':
            authorTypeString += ', ' + aStringB
        if aStringC != '':
            authorTypeString += ', ' + aStringC
        if aStringD != '':
            authorTypeString += ', ' + aStringD
        return authorTypeString

    def get_author_url(self):
        """Returns list of authors (including hyperlinks) as a
        comma-separated string (with 'and' before last author)."""
        return self.get_author_string(True)
