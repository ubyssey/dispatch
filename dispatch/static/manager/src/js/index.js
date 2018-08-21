import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'

// Base CSS styles
require('../styles/admin.scss')

import { store, history } from './store'
import * as Pages from './pages'
import * as Containers from './containers'

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Containers.App}>

        <Route component={Containers.Main}>
          <IndexRoute component={Pages.Dashboard} />

          <Route path='sections'>
            <IndexRoute component={Pages.Sections.Index} />
            <Route path='new' component={Pages.Sections.NewSection} />
            <Route path=':sectionId' component={Pages.Sections.Section} />
          </Route>

          <Route path='articles'>
            <IndexRoute component={Pages.Articles.Index} />
            <Route path='new' component={Pages.Articles.NewArticle} />
            <Route path=':articleId' component={Pages.Articles.Article} />
          </Route>

          <Route path='pages'>
            <IndexRoute component={Pages.Pages.Index} />
            <Route path='new' component={Pages.Pages.New} />
            <Route path=':pageId' component={Pages.Pages.Page} />
          </Route>

          <Route path='subsections'>
            <IndexRoute component={Pages.Subsections.Index} />
            <Route path='new' component={Pages.Subsections.NewSubsection} />
            <Route path=':subsectionId' component={Pages.Subsections.Subsection} />
          </Route>

          <Route path='files' component={Pages.Files} />

          <Route path='images'>
            <IndexRoute component={Pages.Images.Index} />
            <Route path=':imageId' component={Pages.Images.EditImage} />
          </Route>

          <Route path='profile' component={Pages.Profile} />

          <Route path='tags'>
            <IndexRoute component={Pages.Tags.Index} />
            <Route path='new' component={Pages.Tags.NewTag} />
            <Route path=':tagId' component={Pages.Tags.Tag} />
          </Route>

          <Route path='issues'>
            <IndexRoute component={Pages.Issues.Index} />
            <Route path='new' component={Pages.Issues.NewIssue} />
            <Route path=':issueId' component={Pages.Issues.Issue} />
          </Route>

          <Route path='topics'>
            <IndexRoute component={Pages.Topics.Index} />
            <Route path='new' component={Pages.Topics.NewTopic} />
            <Route path=':topicId' component={Pages.Topics.Topic} />
          </Route>

          <Route path='galleries'>
            <IndexRoute component={Pages.Galleries.Index} />
            <Route path='new' component={Pages.Galleries.NewGallery} />
            <Route path=':galleryId' component={Pages.Galleries.Gallery} />
          </Route>

          <Route path='zones'>
            <IndexRoute component={Pages.Zones.Index} />
            <Route path=':zoneId' component={Pages.Zones.Zone} />
          </Route>

          <Route path='persons'>
            <IndexRoute component={Pages.Persons.Index} />
            <Route path='new' component={Pages.Persons.NewPerson} />
            <Route path=':personId' component={Pages.Persons.Person} />
          </Route>

          <Route path='events'>
            <IndexRoute component={Pages.Events.Index} />
            <Route path='new' component={Pages.Events.NewEvent} />
            <Route path='audit' component={Pages.Events.Audit} />
            <Route path=':eventId' component={Pages.Events.Event} />
          </Route>

          <Route path='videos'>
            <IndexRoute component={Pages.Videos.Index} />
            <Route path='new' component={Pages.Videos.NewVideo} />
            <Route path=':videoId' component={Pages.Videos.Video} />
          </Route>

          <Route path='polls'>
            <IndexRoute component={Pages.Polls.Index} />
            <Route path='new' component={Pages.Polls.NewPoll} />
            <Route path=':pollId' component={Pages.Polls.Poll} />
          </Route>

          <Route path='podcasts'>
            <IndexRoute component={Pages.Podcasts.Index} />
            <Route path='new' component={Pages.Podcasts.NewPodcast} />
            <Route path=':podcastId' component={Pages.Podcasts.Podcast} />
            <Route path=':podcastId/episodes' component={Pages.Podcasts.EpisodeIndex} />
            <Route path=':podcastId/episodes/new' component={Pages.Podcasts.NewEpisode} />
            <Route path=':podcastId/episodes/:episodeId' component={Pages.Podcasts.Episode} />

          </Route>

        </Route>

        <Route component={Containers.Basic}>
          <Route path='/login' component={Pages.Login} />
          <Route path='/logout' component={Pages.Logout} />
        </Route>

      </Route>
    </Router>
  </Provider>
), document.getElementById('container'))
