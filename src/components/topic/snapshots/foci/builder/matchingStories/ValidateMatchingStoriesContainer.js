import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import MatchingStory from './MatchingStory';
import AppButton from '../../../../../common/AppButton';
import withIntlForm from '../../../../../common/hocs/IntlForm';
import withAsyncData from '../../../../../common/hocs/AsyncDataContainer';
import messages from '../../../../../../resources/messages';
import { notEmptyString } from '../../../../../../lib/formValidators';
import { fetchMatchingStoriesSample } from '../../../../../../actions/topics/matchingStoriesActions';
import { goToCreateFocusStep, goToMatchingStoriesConfigStep } from '../../../../../../actions/topicActions';

const formSelector = formValueSelector('snapshotFocus');

const localMessages = {
  title: { id: 'focus.create.validate.title', defaultMessage: 'Validating the Model' },
  about: { id: 'focus.create.edit.about',
    defaultMessage: 'Here are 30 stories from the topic. Check to see if our model\'s predictions were correct.' },
  errorNoTopicName: { id: 'focalTechnique.matchingStories.error', defaultMessage: 'You need to specify a classification name.' },
  match: { id: 'focus.create.validate.match', defaultMessage: 'Match' },
  notMatch: { id: 'focus.create.validate.noMatch', defaultMessage: 'Not a match' },
};


const ValidateMatchingStoriesContainer = (props) => {
  const { currentFocalTechnique, handleSubmit, handlePreviousStep, handleNextStep, topicId, sampleStories, sampleProbs, sampleLabels, modelPrecision, modelRecall } = props;
  const { formatMessage } = props.intl;
  const roundedPrecision = Math.round(modelPrecision * 100 * 100) / 100;
  const roundedRecall = Math.round(modelRecall * 100 * 100) / 100;
  return (
    <Grid>
      <Row center="lg">
        <Col lg={10}>
          <form className="focus-create-validate-matchingStories" name="focusCreateValidateMatchingStoriesForm" onSubmit={handleSubmit(handleNextStep.bind(this))}>
            <Row start="lg">
              <Col lg={8} md={12}>
                <h1><FormattedMessage {...localMessages.title} values={{ technique: currentFocalTechnique }} /></h1>
                <p><FormattedMessage {...localMessages.about} /></p>
              </Col>
            </Row>
            <Row start="lg">
              <Col lg={6}>
                <Row middle="lg">
                  <Col lg={2}>
                    <p><b>Precision: </b></p>
                  </Col>
                  <Col lg={3}>
                    <code>{`${roundedPrecision}%`}</code>
                  </Col>
                  <Col lg={2}>
                    <p><b>Recall: </b></p>
                  </Col>
                  <Col lg={3}>
                    <code>{`${roundedRecall}%`}</code>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row start="lg">
              <Col lg={12}>
                <div className="sample-story-table">
                  <Row start="lg" className="sample-story-table-header">
                    <Col lg={7} className="story-title-col">
                      <b>Sample story</b>
                    </Col>
                    <Col lg={1} />
                    <Col lg={4} className="match-col">
                      <b>Is this story a match?</b>
                    </Col>
                  </Row>
                  <div className="sample-story-container">
                    {sampleStories.map((story, idx) => (
                      <MatchingStory
                        key={story.stories_id}
                        topicId={topicId}
                        story={story}
                        prob={sampleProbs[idx]}
                        label={sampleLabels[idx]}
                      />
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
            <Row end="lg">
              <Col lg={8} xs={12}>
                <br />
                <AppButton flat onClick={handlePreviousStep} label={formatMessage(messages.previous)} />
                &nbsp; &nbsp;
                <AppButton type="submit" label={formatMessage(messages.next)} primary />
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Grid>
  );
};

ValidateMatchingStoriesContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  // from state
  formData: PropTypes.object,
  currentKeywords: PropTypes.string,
  currentFocalTechnique: PropTypes.string,
  sampleStories: PropTypes.array.isRequired,
  sampleProbs: PropTypes.array.isRequired,
  sampleLabels: PropTypes.array.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  modelRecall: PropTypes.number.isRequired,
  modelPrecision: PropTypes.number.isRequired,
  // from dispatch
  handleNextStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  // from compositional helper
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  renderTextField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form.snapshotFocus,
  currentKeywords: formSelector(state, 'keywords'),
  currentFocalTechnique: formSelector(state, 'focalTechnique'),
  fetchStatus: state.topics.selected.focalSets.create.matchingStoriesSample.fetchStatus,
  sampleStories: state.topics.selected.focalSets.create.matchingStoriesSample.sampleStories,
  sampleProbs: state.topics.selected.focalSets.create.matchingStoriesSample.probs,
  sampleLabels: state.topics.selected.focalSets.create.matchingStoriesSample.labels,
  modelName: state.topics.selected.focalSets.create.matchingStoriesModelName.name,
  modelPrecision: state.topics.selected.focalSets.create.matchingStoriesGenerateModel.precision,
  modelRecall: state.topics.selected.focalSets.create.matchingStoriesGenerateModel.recall,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToMatchingStoriesConfigStep(1));
  },
  handleNextStep: () => {
    dispatch(goToCreateFocusStep(2));
  },
});

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.keywords)) {
    errors.keywords = localMessages.errorNoTopicName;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
};

const fetchAsyncData = (dispatch, { topicId, modelName }) => dispatch(fetchMatchingStoriesSample(topicId, modelName));

export default
injectIntl(
  withIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps)(
        withAsyncData(fetchAsyncData)(
          ValidateMatchingStoriesContainer
        )
      )
    )
  )
);
