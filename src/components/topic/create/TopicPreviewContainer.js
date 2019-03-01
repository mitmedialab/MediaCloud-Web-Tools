import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import AppButton from '../../common/AppButton';
import { goToTopicStep } from '../../../actions/topicActions';
import TopicCreatePreview from './preview/TopicCreatePreview';

const localMessages = {
  prev: { id: 'topic.create.preview.prev', defaultMessage: 'back to seed query' },
  next: { id: 'topic.create.preview.next', defaultMessage: 'Validate Some Stories' },
};

const TopicPreviewContainer = (props) => {
  const { handleNextStep, handlePreviousStep, formData, mode, currentStepText } = props;
  const { formatMessage } = props.intl;
  if (formData !== undefined) {
    const content = <TopicCreatePreview formData={formData} />;

    return (
      <Grid>
        <h1>{currentStepText.title}</h1>
        <p>{currentStepText.description}</p>
        { content }
        <br />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <AppButton variant="outlined" label={formatMessage(localMessages.prev)} onClick={() => handlePreviousStep(mode)} />
            &nbsp; &nbsp;
            <AppButton primary type="submit" label={formatMessage(localMessages.next)} onClick={() => handleNextStep(mode)} />
          </Col>
        </Row>
      </Grid>
    );
  } return (<div />);
};

TopicPreviewContainer.propTypes = {
  // from parent
  location: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  currentStepText: PropTypes.object,
  // form composition
  intl: PropTypes.object.isRequired,
  // from state
  currentStep: PropTypes.number,
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  // from form
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  currentStep: state.topics.modify.preview.workflow.currentStep,
  formData: state.form.topicForm.values,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: (mode) => {
    dispatch(push(`/topics/${mode}/0`));
    dispatch(goToTopicStep(0));
  },
  handleNextStep: (mode) => {
    dispatch(push(`/topics/${mode}/2`));
    dispatch(goToTopicStep(2));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleNextStep();
    },
  });
}

export default
injectIntl(
  withIntlForm(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      TopicPreviewContainer
    )
  )
);
