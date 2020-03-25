import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../../../../common/hocs/AsyncDataContainer';
import withHelp from '../../../../../common/hocs/HelpfulContainer';
import { fetchCreateFocusKeywordStories } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import TopicStoryTableContainer from '../../../../TopicStoryTableContainer';
import messages from '../../../../../../resources/messages';

const NUM_TO_SHOW = 20;

const localMessages = {
  title: { id: 'topic.summary.stories.title', defaultMessage: 'Sample Stories' },
  helpTitle: { id: 'topic.summary.stories.help.title', defaultMessage: 'About Matching Top Stories' },
};

const KeywordStoryPreviewContainer = (props) => {
  const { stories, helpButton } = props;
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
        {helpButton}
      </h2>
      <TopicStoryTableContainer stories={stories.slice(0, NUM_TO_SHOW)} />
    </DataCard>
  );
};

KeywordStoryPreviewContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  keywords: PropTypes.string.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  stories: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingStories.fetchStatus,
  stories: state.topics.selected.focalSets.create.matchingStories.stories,
});

const fetchAsyncData = (dispatch, { topicId, keywords }) => dispatch(fetchCreateFocusKeywordStories(topicId, { q: keywords, limit: NUM_TO_SHOW }));

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, messages.storiesTableHelpText)(
      withAsyncData(fetchAsyncData, ['keywords'])(
        KeywordStoryPreviewContainer
      )
    )
  )
);
