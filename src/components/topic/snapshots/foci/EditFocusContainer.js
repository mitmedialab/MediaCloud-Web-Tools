import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FocusBuilderWizard from './builder/FocusBuilderWizard';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchFocalSetDefinitions } from '../../../../actions/topicActions';


class EditFocusContainer extends React.Component {

  getInitialValues = () => {
    const { topicId, focusDefinition } = this.props;
    return {
      topicId,
      focusName: focusDefinition.name,
      focusDescription: focusDefinition.description,
      focalSetDefinitionId: focusDefinition.focal_set_definitions_id,
      focusDefinitionId: focusDefinition.focus_definitions_id,
      focalTechnique: focusDefinition.focalTechnique,
      keywords: focusDefinition.query,
    };
  }

  render() {
    const { topicId, location } = this.props;
    const intialValues = this.getInitialValues();
    return (
      <FocusBuilderWizard
        topicId={topicId}
        startStep={1}
        initialValues={intialValues}
        location={location}
      />
    );
  }

}

EditFocusContainer.propTypes = {
  // from context:
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  // from state
  focusDefinition: PropTypes.object.isRequired,
  // from dispatch
  fetchStatus: PropTypes.string.isRequired,
};

const findFocalSetDefById = (state, focusDefId) => {
  const focalSetDefinitions = state.topics.selected.focalSets.definitions.list;
  if (focalSetDefinitions.length === 0) {
    return null;
  }
  const matchingFocalSetDef = focalSetDefinitions.find(
    focalSetDef => focalSetDef.focus_definitions.map(
        focusDef => focusDef.focus_definitions_id
      ).includes(focusDefId)
  );
  const matchingFocusDef = matchingFocalSetDef.focus_definitions.find(
    focusDef => focusDef.focus_definitions_id === focusDefId
  );
  return { ...matchingFocusDef, focalTechnique: matchingFocalSetDef.focal_technique };
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
  focusDefinition: findFocalSetDefById(state, parseInt(ownProps.params.focusDefId, 10)),  // find the one we want to edit
});

const mapDispatchToProps = dispatch => ({
  fetchData: topicId => dispatch(fetchFocalSetDefinitions(topicId)),
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.topicId);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        EditFocusContainer
      )
    )
  );
