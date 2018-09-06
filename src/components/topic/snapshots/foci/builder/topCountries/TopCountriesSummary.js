import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  intro: { id: 'focus.create.confirm.retweet.intro', defaultMessage: 'We will create n subtopics:' },
};

const TopCountriesSummary = (props) => {
  const { counts } = props;
  return (
    <div className="focus-create-cofirm-retweet-partisanship">
      <p><FormattedMessage {...localMessages.intro} /></p>
      <ul>
        {counts.map(ctry => <li>{ctry.label}</li>)}
      </ul>
    </div>
  );
};

TopCountriesSummary.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  formValues: PropTypes.object.isRequired,
  counts: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.topCountriesStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.topCountriesStoryCounts.story_counts,
});

export default
injectIntl(
  connect(mapStateToProps)(
    TopCountriesSummary
  )
);
