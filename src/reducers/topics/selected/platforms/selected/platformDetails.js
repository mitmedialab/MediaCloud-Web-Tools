import { FETCH_TOPIC_PLATFORM_BY_ID } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const platformDetails = createAsyncReducer({
  initialState: {
  },
  action: FETCH_TOPIC_PLATFORM_BY_ID,
});


export default platformDetails;