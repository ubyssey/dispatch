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
        """Returns list of authors as a comma-separated
        string (with 'and' before last author)."""

        def format_author(author):
            if links and author.person.slug:
                return '<a href="/authors/%s/">%s</a>' % (author.person.slug, author.person.full_name)
            return " %s, %s" % (author.person.full_name,author.type)

        authors = map(format_author, self.authors.all())

        if not authors:
            return ""
        elif len(authors) == 1:
            # If this is the only author, just return author name
            return authors[0]

        return ", ".join(authors[:-1]) + " and " + authors[-1]

    def get_author_url(self):
        """Returns list of authors (including hyperlinks) as a
        comma-separated string (with 'and' before last author)."""
        return self.get_author_string(True)
