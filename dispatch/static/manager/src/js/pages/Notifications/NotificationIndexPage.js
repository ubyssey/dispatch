import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { humanizeDatetime } from '../../util/helpers'

import ItemIndexPage from '../ItemIndexPage'
import notificationsActions from '../../actions/NotificationsActions'
import subscriptionsActions from '../../actions/SubscriptionsActions'
import { Line as LineChart } from 'react-chartjs'
require('../../../styles/components/subscription_chart.scss')

const chartOptions = {
  scaleGridLineColor : 'rgba(0,0,0,.05)',
  responsive: true,
  maintainAspectRatio: false
}
class NotificationsPageComponent extends React.Component {

  componentDidMount() {
    this.props.getSubscriptionCounts(this.props.token)
  }

  renderChart() {
    let dates = []
    let counts = []

    for (var subscriptionCount in this.props.subscriptionCounts) {
      dates.push(humanizeDatetime(this.props.subscriptionCounts[subscriptionCount].date))
      counts.push(this.props.subscriptionCounts[subscriptionCount].count)
    }

    let chartData = {
      labels: dates,
      datasets: [
        {
          label: 'Subscriptions',
          fillColor: 'rgba(3,113,201,0.2)',
          strokeColor: 'rgba(3,113,201,0.8)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#0371C9',
          pointHighlightFill: '#0371C9',
          pointHighlightStroke: 'rgba(3,113,201,1)',
          data: counts
        }
      ]
    }


    return (
      <div className='c-subscription-chart-container'>
        <h1>Subscriptions</h1>
        <LineChart data={chartData} options={chartOptions} />
      </div>
    )
  }

  render() {
    return (
      <div className='c-item-list'>
        <ItemIndexPage
          typeSingular='notification'
          typePlural='notifications'
          displayColumn='article_headline'
          pageTitle='Notifications'
          headers={['Headline', 'Push time']}
          extraColumns={[
            item => humanizeDatetime(item.scheduled_push_time, true)
          ]}
          {... this.props} />
          {this.props.subscriptionCounts ? this.renderChart() : null}

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.notifications.list,
    entities: {
      listItems: state.app.entities.notifications
    },
    subscriptionCounts: state.app.entities.subscriptions,
    state: state.app
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(notificationsActions.list(token, query))
    },
    toggleListItem: (notificationId) => {
      dispatch(notificationsActions.toggle(notificationId))
    },
    toggleAllListItems: (notificationIds) => {
      dispatch(notificationsActions.toggleAll(notificationIds))
    },
    clearSelectedListItems: () => {
      dispatch(notificationsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(notificationsActions.clearAll())
    },
    deleteListItems: (token, notificationIds, goDownPage) => {
      dispatch(notificationsActions.deleteMany(token, notificationIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/notifications/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(notificationsActions.search(query))
    },
    getSubscriptionCounts: (token) => {
      dispatch(subscriptionsActions.list(token, null))
    }
  }
}

const NotificationsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsPageComponent)

export default NotificationsPage
