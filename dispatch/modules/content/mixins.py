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
            return author.person.full_name

        authors = map(format_author, self.authors.all())

        if not authors:
            return ""
        elif len(authors) == 1:
            # If this is the only author, just return author name
            return authors[0]

        return ", ".join(authors[:-1]) + " and " + authors[-1]

    def get_author_type_string(self, links=False):
        def author_type(author):
            ArticleAuthors = []
            ArticlePhotographers = []
            ArticleIllustrators = []
            ArticleVideographers = []
            if links and author.person.slug:
                return '<a href="/authors/%s/">%s</a>' % (author.person.slug, author.person.full_name)
            for author in self.authors.all():
                if author.type == 'author':
                    ArticleAuthors.append(author.person.full_name)
                    if self.authors.all().filter(type='author').count() == 1:
                        ArticleAuthorsStr = "Written by " + ArticleAuthors[0]
                    elif self.authors.all().filter(type='author').count() > 1:
                        ArticleAuthorsStr = "Written by " + ArticleAuthors[0] + ", ".join(ArticleAuthors[1:-1]) + " and " + ArticleAuthors[-1]
                if author.type == 'photographer':
                    ArticlePhotographers.append(author.person.full_name)
                    if self.authors.all().filter(type='photographer').count() == 1:
                        ArticlePhotographersStr = "Photos by " + ArticlePhotographers[0]
                    elif self.authors.all().filter(type='photographer').count() > 1:
                        ArticlePhotographersStr = "Photos by " + ArticlePhotographers[0] + ", ".join(ArticlePhotographers[0:-1]) + " and " + ArticlePhotographers[-1]
                if author.type == 'illustrator':
                    ArticleIllustrators.append(author.person.full_name)
                    if self.authors.all().filter(type='illustrator').count() == 1:
                        ArticleIllustratorsStr = "Illustrated by " + ArticleIllustrators[0]
                    elif self.authors.all().filter(type='illustrator').count() > 1:
                        ArticleIllustratorsStr = "Illustrated by "+ ArticleIllustrators[0] + ", ".join(ArticleIllustrators[1:-1]) + " and " + ArticleIllustrators[-1]
                if author.type ==  'videographer':
                    ArticleVideographers.append(author.person.full_name)
                    if self.authors.all().filter(type='videographer').count() == 1:
                        ArticleVideographersStr = "Videos by " + ArticleVideographers[0]
                    elif self.authors.all().filter(type='videographer').count() > 1:
                        ArticleVideographersStr = "Videos by "+ ArticleVideographers[0] + ", ".join(ArticleVideographers[1:-1]) + " and " + ArticleVideographers[-1]

            AuthorTypeString = ""
            if ArticleAuthors:
                AuthorTypeString = AuthorTypeString + ArticleAuthorsStr
            if ArticlePhotographers:
                AuthorTypeString = AuthorTypeString + ", " + ArticlePhotographersStr
            if ArticleIllustrators:
                AuthorTypeString = AuthorTypeString + ", " + ArticleIllustratorsStr
            if ArticleVideographers:
                AuthorTypeString = AuthorTypeString + ", " + ArticleVideographersStr
            return AuthorTypeString

        return author_type(self.authors.all())

    def get_author_url(self):
        """Returns list of authors (including hyperlinks) as a
        comma-separated string (with 'and' before last author)."""
        return self.get_author_string(True)
