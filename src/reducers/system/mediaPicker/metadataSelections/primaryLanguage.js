import { SELECT_METADATA_QUERY_ARGS } from '../../../../actions/systemActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const primaryLanguage = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    selected: false,
    value: false,
  },
  action: SELECT_METADATA_QUERY_ARGS,
});

export default primaryLanguage;
