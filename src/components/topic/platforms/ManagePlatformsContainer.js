import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import AppButton from '../../common/AppButton';
import PlatformTable from '../../common/PlatformTable';
import messages from '../../../resources/messages';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { deleteTopicPlatform, setTopicNeedsNewSnapshot, fetchPlatformsInTopicList, selectPlatform } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import NewVersionPlatformComparisonContainer from './NewVersionPlatformComparisonContainer';
import NeedsNewVersionWarning from '../versions/NeedsNewVersionWarning';
import LinkWithFilters from '../LinkWithFilters';
import { filteredLinkTo } from '../../util/location';

const localMessages = {
  listTitle: { id: 'platform.list.title', defaultMessage: 'Platform Details' },
  platformManageAbout: { id: 'platform.manage.about',
    defaultMessage: 'empty' },
  removePlatform: { id: 'platform.manage.remove', defaultMessage: 'Remove Platform' },
  removeOk: { id: 'platform.manage.remove.ok', defaultMessage: 'Remove It' },
  removePlatformSucceeded: { id: 'platform.manage.remove.succeeded', defaultMessage: 'Removed the Platform' },
  removePlatformFailed: { id: 'platform.manage.remove.failed', defaultMessage: 'Sorry, but removing the platform failed :-(' },
  backToTopic: { id: 'backToTopic', defaultMessage: 'back to the topic' },
};

class ManagePlatformsContainer extends React.Component {
  state = {
    removeDialogOpen: false,
    // idToEdit: null,
    idToRemove: null,
  };

  onCancelDeletePlatform = () => {
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  onDeletePlatform = () => {
    const { topicId, handleDeletePlatform } = this.props;
    handleDeletePlatform(topicId, this.state.idToRemove);
    this.setState({ removeDialogOpen: false, idToRemove: null });
  }

  onEditPlatform = (platformId) => {
    const { topicId, filters, handleSelectPlatform } = this.props;
    // filteredLinkTo link to edit wizard
    // in edit, we will find latest topic_seed_query for this platform
    handleSelectPlatform(platformId, filteredLinkTo(`/topics/${topicId}/platforms/${platformId}/edit`, filters));
  }

  onNewPlatform = () => {
    // filteredLinkTo link to edit wizard
  }

  handleDelete = (platformId) => {
    this.setState({ removeDialogOpen: true, idToRemove: platformId });
  }

  render() {
    const { topicId, platforms } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <NeedsNewVersionWarning />
        <div className="manage-focal-sets">
          <Grid>
            <Row>
              <Col lg={10} xs={12}>
                <p>
                  <FormattedMessage {...messages.managePlatforms} />
                </p>
              </Col>
            </Row>
            <PlatformTable platforms={platforms} onEditClicked={this.onEditPlatform} />
            <Row>
              <Col lg={6}>
                <div id="create-platform-button">
                  <LinkWithFilters to={`/topics/${topicId}/platforms/create`}>
                    <AppButton primary label={messages.addPlatform} />
                  </LinkWithFilters>
                </div>
              </Col>
            </Row>
          </Grid>
          <NewVersionPlatformComparisonContainer />
          <ConfirmationDialog
            open={this.state.removeDialogOpen}
            title={formatMessage(localMessages.removePlatform)}
            okText={formatMessage(localMessages.removeOk)}
            onCancel={this.onCancelDeletePlatform}
            onOk={this.onDeletePlatform}
          >
            <FormattedHTMLMessage {...localMessages.removePlatform} />
          </ConfirmationDialog>
        </div>
      </div>
    );
  }
}

ManagePlatformsContainer.propTypes = {
  // from composition
  topicId: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  platforms: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  handleDeletePlatform: PropTypes.func.isRequired,
  handleSelectPlatform: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  platforms: state.topics.selected.platforms.all.results,
  fetchStatus: state.topics.selected.platforms.all.fetchStatus,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleDeletePlatform: (topicId, platformId) => {
    dispatch(deleteTopicPlatform(topicId, platformId))
      .then((results) => {
        if (results.success === 0) {
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removePlatformFailed) }));
        } else {
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.removePlatformSucceeded) }));
          dispatch(setTopicNeedsNewSnapshot(true));
          dispatch(fetchPlatformsInTopicList(topicId));
        }
      });
  },
  handleSelectPlatform: (platformId, url) => {
    selectPlatform(platformId);
    dispatch(push(url));
  },
});

const fetchAsyncData = (dispatch, { topicId }) => {
  dispatch(fetchPlatformsInTopicList(topicId));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      ManagePlatformsContainer
    )
  )
);