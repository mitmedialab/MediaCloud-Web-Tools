import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import QueryForm from './QueryForm';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery, updateQuery, addCustomQuery } from '../../../actions/explorerActions';
import { AddButton } from '../../common/IconButton';

const localMessages = {
  mainTitle: { id: 'explorer.querypicker.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.querypicker.intro', defaultMessage: 'Here are all available queries' },
  add: { id: 'explorer.querypicker.add', defaultMessage: 'Add query' },
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search For' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search for ' },
};

//
class QueryPicker extends React.Component {

  addACustomQuery(newQueryObj) {
    const { addAQuery } = this.props;
    addAQuery(newQueryObj);
  }

  updateQueryFromEditablePicker(event) {
    const { updateCurrentQuery, selected } = this.props;
    const updateObject = {};
    updateObject[event.target.name] = event.target.value;
    updateObject.id = selected.id;
    updateObject.index = selected.index;
    updateCurrentQuery(updateObject);
  }


  updateQuery(event) {
    const { updateCurrentQuery, selected } = this.props;
    // const editedFieldName = event.target.name;
    const updateObject = {};
    updateObject[event.target.name] = event.target.value;
    updateObject.id = selected.id;
    updateObject.index = selected.index;
    updateCurrentQuery(updateObject);
  }

  render() {
    const { selected, queries, setSelectedQuery, isEditable, handleSearch } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedQuerySlides = null;
    // if DEMO_MODE isEditable = true
    if (queries && queries.length > 0 && selected) {
      fixedQuerySlides = queries.map((query, index) => (
        <div key={index} className={selected.index === index ? 'query-picker-item-selected' : ''}>
          <QueryPickerItem
            query={query}
            selected={selected}
            isEditable={query.id === undefined ? true : isEditable} // if custom, true for either mode, else if logged in no
            selectThisQuery={() => setSelectedQuery(query, index)}
            updateQuery={q => this.updateQueryFromEditablePicker(q)}
          />
        </div>
      ));
      // note: no id here
      const customEmptyQuery = { index: queries.length, label: 'enter query', q: 'enter here', description: 'new', imagePath: '.', start_date: '2016-02-02', end_date: '2017-02-02', custom: true };

      const addEmptyQuerySlide = (
        <AddButton
          tooltip={formatMessage(localMessages.add)}
          onClick={() => this.addACustomQuery(customEmptyQuery)}
        />
      );

      fixedQuerySlides.push(addEmptyQuerySlide);
      content = (
        <ItemSlider
          title={formatMessage(localMessages.intro)}
          slides={fixedQuerySlides}
          settings={{ height: 60, dots: false, slidesToShow: 4, slidesToScroll: 1, infinite: false, arrows: fixedQuerySlides.length > 4 }}
        />
      );
    }

    // indicate which queryPickerItem is selected -

    return (
      <div className="query-picker">
        {content}
        <QueryForm
          initialValues={selected}
          buttonLabel={formatMessage(localMessages.querySearch)}
          onSave={handleSearch}
          onChange={event => this.updateQuery(event)}
          isEditable
        />
      </div>
    );
  }
}

QueryPicker.propTypes = {
  queries: React.PropTypes.array,
  selected: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  formData: React.PropTypes.object,
  updateCurrentQuery: React.PropTypes.func.isRequired,
  addAQuery: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  queries: state.explorer.queries,
  // formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});


const mapDispatchToProps = (dispatch, state) => ({
  setSelectedQuery: (query, index) => {
    // if anything changed? but I think this is taken cre of
    // dispatch(updateQuery(state.selected));
    const queryWithIndex = Object.assign({}, query, { index });
    dispatch(selectQuery(queryWithIndex));
  },
  updateCurrentQuery: (query) => {
    // const infoToQuery = queries;
    if (query) {
      dispatch(updateQuery(query));
      // now we need to update selected b/c why? to reflect the change in name from picker to form or back...
      // dispatch(selectQuery(state.selected));
    } else {
      dispatch(updateQuery(state.selected));
    }
  },
  addAQuery: (query) => {
    if (query) {
      dispatch(addCustomQuery(query));
      dispatch(selectQuery(query));
    }
  },
});

const reduxFormConfig = {
  form: 'queryForm',
  destroyOnUnmount: true,  // so the wizard works
};

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      reduxForm(reduxFormConfig)(
        QueryPicker
      )
    )
  );

