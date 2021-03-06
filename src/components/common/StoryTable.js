import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import { storyPubDateToTimestamp, STORY_PUB_DATE_UNDATEABLE } from '../../lib/dateUtil';
import { googleFavIconUrl, storyDomainName } from '../../lib/urlUtil';
import { trimToMaxLength } from '../../lib/stringUtil';

const localMessages = {
  undateable: { id: 'story.publishDate.undateable', defaultMessage: 'undateable' },
  foci: { id: 'story.foci.list', defaultMessage: 'List of Subtopics {list}' },
};

export const safeStoryDate = (story, intl) => {
  let dateToShow = null; // need to handle undateable stories
  let dateStyle = '';
  if (!story.publish_date) {
    dateToShow = intl.formatMessage(messages.unknown);
    dateStyle = 'story-date-undateable';
  } else if (story.publish_date === STORY_PUB_DATE_UNDATEABLE) {
    dateToShow = intl.formatMessage(localMessages.undateable);
    dateStyle = 'story-date-undateable';
  } else {
    dateToShow = intl.formatDate(storyPubDateToTimestamp(story.publish_date));
    dateStyle = (story.date_is_reliable === 0) ? 'story-date-unreliable' : 'story-date-reliable';
    if (story.date_is_reliable === 0) {
      dateToShow += '?';
    }
  }
  return {
    style: dateStyle,
    text: dateToShow,
  };
};

const StoryTable = (props) => {
  const { stories, maxTitleLength, selectedStory, extraColumns, extraHeaderColumns, intl } = props;
  return (
    <div className="story-table">
      <table>
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.storyTitle} /></th>
            <th><FormattedMessage {...messages.media} /></th>
            <th><FormattedMessage {...messages.storyDate} /></th>
            { extraHeaderColumns}
          </tr>
          {stories.map((story, idx) => {
            const domain = storyDomainName(story);
            const title = maxTitleLength !== undefined ? `${trimToMaxLength(story.title, maxTitleLength)}` : story.title;
            const isSelected = selectedStory === story.stories_id ? ' selected' : ' ';
            const dateDisplay = safeStoryDate(story, intl);
            return (
              <tr key={`${story.stories_id}${idx}`} className={(idx % 2 === 0) ? `even${isSelected}` : `odd${isSelected}`}>
                <td>
                  <a href={story.url} target="_blank" rel="noopener noreferrer">{title}</a>
                </td>
                <td>
                  <a href={story.media_url} rel="noopener noreferrer" target="_blank">
                    <img className="google-icon" src={googleFavIconUrl(domain)} alt={domain} />
                  </a>
                  <a href={story.media_url} rel="noopener noreferrer" target="_blank">{story.media_name}</a>
                </td>
                <td><span className={`story-date ${dateDisplay.style}`}>{dateDisplay.text}</span></td>
                {extraColumns && extraColumns(story, idx)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

StoryTable.propTypes = {
  stories: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
  extraColumns: PropTypes.func,
  extraHeaderColumns: PropTypes.object,
  sortedBy: PropTypes.string,
  maxTitleLength: PropTypes.number,
  selectedStory: PropTypes.number,
};

export default injectIntl(StoryTable);
