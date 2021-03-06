import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import withAsyncData from '../../hocs/AsyncDataContainer';
import { selectSystemUser, updateSystemUser, fetchSystemUser } from '../../../../actions/systemActions';
import { updateFeedback } from '../../../../actions/appActions';
import UserForm from './UserForm';
import { PERMISSION_ADMIN } from '../../../../lib/auth';
import Permissioned from '../../Permissioned';
import PageTitle from '../../PageTitle';

const localMessages = {
  userTitle: { id: 'user.details.title', defaultMessage: '{name}: ' },
  updateTitle: { id: 'user.details.title.update', defaultMessage: 'Update User' },
  updateButton: { id: 'user.deatils.update.button', defaultMessage: 'Update' },
  feedback: { id: 'user.deatils.feedback', defaultMessage: 'Successfully updated this user.' },
};

const UpdateUserContainer = (props) => {
  const { user, handleSave } = props;
  const { formatMessage } = props.intl;
  const content = null;
  let roles = user.roles.map(r => r.role);
  roles = roles.reduce((o, key) => ({ ...o, [key]: true }), {});
  const intialValues = {
    ...user,
    roles, // prep roles for UI checkbox
  };
  if (user === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <Grid className="details user-details">
      <PageTitle value={localMessages.updateTitle} />
      <h1>
        <FormattedMessage {...localMessages.updateTitle} />
      </h1>
      <Permissioned onlyRole={PERMISSION_ADMIN}>
        <UserForm
          initialValues={intialValues}
          user={user}
          onSave={handleSave}
          buttonLabel={formatMessage(localMessages.updateButton)}
        />
      </Permissioned>
    </Grid>
  );
};

UpdateUserContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleSave: PropTypes.func.isRequired,
  // from context
  params: PropTypes.object.isRequired, // params from router
  // from state
  fetchStatus: PropTypes.string.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.system.users.userDetails.fetchStatus,
  user: state.system.users.userDetails.user,
  userId: ownProps.params.id,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const updatedRoles = {};
    Object.keys(values.roles).forEach((k) => { // ensure roles have a true value
      if (values.roles[k]) updatedRoles[k] = k;
    });
    const infoToSave = {
      ...values,
      active: values.active || false,
      'roles[]': Object.keys(updatedRoles).join(','),
      // TODO: if password is changed, track that
    };
    return dispatch(updateSystemUser(ownProps.params.id, infoToSave))
      .then((result) => {
        if (result.success) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // need to fetch it again because something may have changed
          window.location.reload();
        }
      });
  },
});

const fetchAsyncData = (dispatch, { userId }) => {
  dispatch(selectSystemUser(userId));
  dispatch(fetchSystemUser(userId));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      UpdateUserContainer
    )
  )
);
