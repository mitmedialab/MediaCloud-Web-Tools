import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../hocs/AsyncDataContainer';
import { selectMediaPickerQueryArgs, fetchMediaPickerFeaturedCollections, fetchFavoriteCollections, fetchFavoriteSources, fetchMediaPickerCollections } from '../../../../actions/systemActions';
import TabSearchResultsContainer from './TabSearchResultsContainer';
import { MEDIAPICKER_FEATURED_QUERY_SETTING } from '../../../../lib/mediaUtil';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search collections by name' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
};


class FeaturedFavoriteGeoSearchResultsContainer extends React.Component {
  UNSAFE_componentWillMount() {
    this.correlateSelection(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // PICK_FEATURED
    if (nextProps.selectedMediaQueryType !== this.props.selectedMediaQueryType) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType });
    }
    if (nextProps.selectedMedia !== this.props.selectedMedia
      // if the results have changed from a keyword entry, we need to update the UI
      || (nextProps.featured && nextProps.featured.lastFetchSuccess !== this.props.featured.lastFetchSuccess)
      || (nextProps.favoritedCollections && nextProps.favoritedCollections.lastFetchSuccess !== this.props.favoritedCollections.lastFetchSuccess)
      || (nextProps.favoritedSources && nextProps.favoritedSources.lastFetchSuccess !== this.props.favoritedSources.lastFetchSuccess)) {
      this.correlateSelection(nextProps);
    }
  }

  correlateSelection(whichProps) {
    let whichList = [];

    if ((whichProps.favoritedCollections.list && whichProps.favoritedCollections.list.length > 0)
      || (whichProps.favoritedSources.list && whichProps.favoritedSources.list.length > 0)) {
      whichList = whichProps.favoritedCollections.list;
      whichList = whichList.concat(whichProps.favoritedSources.list);
    }
    whichList = whichList.concat(whichProps.featured.list);

    // if selected media has changed, update current results
    if (whichProps.selectedMedia
      // we can't be sure we have received results yet
      && whichList && whichList.length > 0) {
      // sync up selectedMedia and push to result sets.
      whichList.map((m) => {
        const mediaIndex = whichProps.selectedMedia.findIndex(q => q.id === m.id);
        if (mediaIndex < 0) {
          this.props.handleMediaConcurrency(m, false);
        } else if (mediaIndex >= 0) {
          this.props.handleMediaConcurrency(m, true);
        }
        return m;
      });
    }
  }

  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType, collectionsSet } = this.props;
    const updatedQueryObj = { ...values, type: selectedMediaQueryType };
    updateMediaQuerySelection(updatedQueryObj, collectionsSet);
  }

  render() {
    const { selectedMediaQueryType, featured, favoritedCollections, favoritedSources,
      onToggleSelected, fetchStatus, viewOnly } = this.props;
    const queryResults = {
      featured: featured.list,
      favoritedCollections: favoritedCollections.list,
      favoritedSources: favoritedSources.list,
      geographic: favoritedSources.list,
    };
    return (
      <div>
        <TabSearchResultsContainer
          fetchStatus={fetchStatus}
          onToggleSelected={onToggleSelected}
          selectedMediaQueryType={selectedMediaQueryType}
          queryResults={queryResults}
          initValues={{ mediaKeyword: '' }}
          onSearch={val => this.updateMediaQuery(val)}
          hintTextMsg={localMessages.hintText}
          handleMediaConcurrency={this.props.handleMediaConcurrency}
          viewOnly={viewOnly}
        />
      </div>
    );
  }
}

FeaturedFavoriteGeoSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  onToggleSelected: PropTypes.func.isRequired,
  handleMediaConcurrency: PropTypes.func.isRequired,
  whichTagSet: PropTypes.array,
  // from dispatch
  updateMediaQuerySelection: PropTypes.func.isRequired,
  // from state
  selectedMedia: PropTypes.array,
  selectedMediaQueryType: PropTypes.number,
  featured: PropTypes.object,
  favoritedCollections: PropTypes.object,
  favoritedSources: PropTypes.object,
  fetchStatus: PropTypes.array.isRequired,
  displayResults: PropTypes.bool,
  viewOnly: PropTypes.bool,
  geoCollectionsSet: PropTypes.number.isRequired,
  collectionsSet: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: [
    state.system.mediaPicker.favoritedCollections.fetchStatus,
    state.system.mediaPicker.favoritedSources.fetchStatus,
    state.system.mediaPicker.featured.fetchStatus,
  ],
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  featured: state.system.mediaPicker.featured ? state.system.mediaPicker.featured : null,
  favoritedCollections: state.system.mediaPicker.favoritedCollections ? state.system.mediaPicker.favoritedCollections : null,
  favoritedSources: state.system.mediaPicker.favoritedSources ? state.system.mediaPicker.favoritedSources : null,
  collectionResults: state.system.mediaPicker.collectionQueryResults,
  geoCollectionsSet: state.system.staticTags.tagSets.geoCollectionsSet,
  collectionsSet: state.system.staticTags.tagSets.collectionsSet,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values, collectionsSet) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerFeaturedCollections(collectionsSet));
      dispatch(fetchFavoriteCollections());
      dispatch(fetchFavoriteSources());
      dispatch(fetchMediaPickerCollections());
    }
  },
});

const fetchAsyncData = (dispatch, { geoCollectionsSet, collectionsSet }) => {
  dispatch(selectMediaPickerQueryArgs({ type: MEDIAPICKER_FEATURED_QUERY_SETTING }));
  dispatch(fetchMediaPickerFeaturedCollections(collectionsSet));
  dispatch(fetchFavoriteCollections());
  dispatch(fetchFavoriteSources());
  dispatch(fetchMediaPickerCollections({ media_keyword: '', which_set: geoCollectionsSet }));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      FeaturedFavoriteGeoSearchResultsContainer
    )
  )
);
