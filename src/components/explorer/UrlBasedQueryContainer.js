import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { schemeCategory10 } from 'd3';
import { push } from 'react-router-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import { LEVEL_ERROR } from '../common/Notice';
import { addNotice } from '../../actions/appActions';
import { saveParsedQueries, updateQuerySourceLookupInfo, updateQueryCollectionLookupInfo, updateQuerySearchLookupInfo,
  fetchQuerySourcesByIds, fetchQueryCollectionsByIds, fetchQuerySearchesByIds } from '../../actions/explorerActions';
import { autoMagicQueryLabel, decodeQueryParamString, serializeQueriesForUrl, uniqueQueryId, prepSearches } from '../../lib/explorerUtil';
import { replaceCurlyQuotes } from '../../lib/stringUtil';
import { notEmptyString } from '../../lib/formValidators';
import { PUBLICATION_COUNTRY, PUBLICATION_STATE, COUNTRY_OF_FOCUS, PRIMARY_LANGUAGE, MEDIA_TYPE } from '../../lib/tagUtil';

const localMessages = {
  errorInURLParams: { id: 'explorer.queryBuilder.urlParams',
    defaultMessage: 'Your URL query is incomplete. Check the URL and make sure the keyword(s), start and end dates, and collection(s) are properly specified.' },
};

/**
 * Only render the widget once we've pared the query from the URL - complicated because we do an async fetch
 * to get source and collection details from the server.
 */
function composeUrlBasedQueryContainer() {
  return (ChildComponent) => {
    class UrlBasedQueryContainer extends React.Component {
      state = {
        queryInStore: false,
      };

      UNSAFE_componentWillMount() {
        const { location } = this.props;
        // if from homepage, allow automagic, if from URL, do not...
        const autoMagic = location.query.auto === 'true';
        this.setState({ queryInStore: false }); // if/def automagic here
        // console.log('saving queries from will mount');
        this.updateQueriesFromLocation(location, autoMagic);
      }

      UNSAFE_componentWillReceiveProps(nextProps) {
        const { location, lastSearchTime, updateUrl } = this.props;
        // console.log('new props');
        // if URL has been updated by hand, reparse and store
        if ((nextProps.location.pathname !== location.pathname) && (lastSearchTime === nextProps.lastSearchTime)) {
          this.setState({ queryInStore: false }); // show spinner while parsing and loading query
          // console.log('  url change');
          this.updateQueriesFromLocation(location);
        // if we don't have all the data in the store yet
        } else if (this.state.queryInStore === false) { // make sure to only do this once
          // console.log('  waiting for media info from server');
          // mark the whole thing as ready once any sources and collections have been set
          if (this.isAllMediaDetailsReady()) {
            // console.log('  got media info from server, ready!');
            this.setState({ queryInStore: true }); // mark that the parsing process has finished
          }
          if (nextProps.queries.filter(q => q.sources.length > 0).length === 0 && nextProps.queries.filter(q => q.collections.length > 0).length === 0 && nextProps.queries.filter(q => q.searches.length > 0).length === 0) {
            // console.log('no sources or collections or searches');
            this.setState({ queryInStore: true });
            updateUrl(nextProps.queries);
          }
        } else if (lastSearchTime !== nextProps.lastSearchTime) {
          // console.log('got a new search time');
          updateUrl(nextProps.queries);
        } else {
          // console.log('  other change');
        }
      }

      updateQueriesFromLocation(location, autoName) {
        // read the URL and decide how to update the queries in the store
        const { addAppNotice } = this.props;
        const { formatMessage } = this.props.intl;
        // regular searches are in a queryParam
        if (location.query.q) {
          // this is a crazy fix to make embedded quotes work by forcing us to escape them all... partially because
          // react-router decided to decode url components, partially because the JSON parser isn't that clever
          this.updateQueriesFromQParam(location.query.q, autoName);
        } else if (location.query.qs) {
          // it uses the "new" full JSON way of serializing the queries
          this.updateQueriesFromQSParam(location.query.qs, autoName);
        } else {
          addAppNotice({ level: LEVEL_ERROR, message: formatMessage(localMessages.errorInURLParams) });
        }
      }

      updateQueriesFromQSParam(queryString, autoName) {
        // the newer, fully serialized way we are supporing going forward
        const { formatMessage } = this.props.intl;
        const { addAppNotice } = this.props;
        try {
          let cleanedQueryString = decodeURIComponent(queryString);
          cleanedQueryString = replaceCurlyQuotes(cleanedQueryString);
          const queriesFromUrl = JSON.parse(cleanedQueryString);
          this.updateQueriesFromString(queriesFromUrl, autoName);
        } catch (f) {
          addAppNotice({ level: LEVEL_ERROR, message: formatMessage(localMessages.errorInURLParams) });
        }
      }

      updateQueriesFromQParam(queryString, autoName) {
        const { addAppNotice } = this.props;
        const { formatMessage } = this.props.intl;
        // the older, "ugly" way that we are deprecating
        const text = queryString;
        const pattern = /:"([^,]*)"[,}]/g; // gotta end with , or } here to support demo case (})
        let match = pattern.exec(text);
        let cleanedText = '';
        let lastSpot = 0;
        while (match != null) {
          const matchText = text.substring(match.index + 2, pattern.lastIndex - 2);
          let cleanedMatch = matchText.replace(/"/g, '\\"');
          // also handle curly quotes
          cleanedMatch = replaceCurlyQuotes(cleanedMatch);
          cleanedText += `${text.substring(lastSpot, match.index)}:"${cleanedMatch}`;
          lastSpot = pattern.lastIndex - 2;
          match = pattern.exec(text);
        }
        cleanedText += text.substring(lastSpot, text.length);
        // now that we have a relatively clean url, lets use it!
        try {
          const queriesFromUrl = decodeQueryParamString(decodeURIComponent(cleanedText));
          // and update the queries
          this.updateQueriesFromString(queriesFromUrl, autoName);
        } catch (f) {
          addAppNotice({ level: LEVEL_ERROR, message: formatMessage(localMessages.errorInURLParams) });
        }
      }

      updateQueriesFromString(queriesFromUrl, autoNaming) {
        const { saveQueriesFromParsedUrl, mediaMetadataSetsByName } = this.props;
        let extraDefaults = {};
        extraDefaults = { autoNaming };
        const cleanedQueries = queriesFromUrl.map((query, index) => ({
          ...query, // let anything on URL override label and color
          label: notEmptyString(query.label) ? query.label : autoMagicQueryLabel(query),
          sources: query.sources ? query.sources.map(s => ({ id: s, media_id: s })) : [],
          collections: query.collections ? query.collections.filter(c => c != null).map(c => ({ id: c, tags_id: c })) : [],
          searches: query.searches ? query.searches : [],
          q: replaceCurlyQuotes(query.q),
          color: query.color ? query.color : schemeCategory10[index % 10],
          uid: uniqueQueryId(),
          sortPosition: index, // for now
          ...extraDefaults, // for demo mode
        }));
        // push the queries in to the store
        saveQueriesFromParsedUrl(cleanedQueries, mediaMetadataSetsByName);
      }

      isAllMediaDetailsReady() {
        // we will only render the wrapped component once all the details of the sources and collections
        // have been fetched from the server and put in the right place on each query
        const { queries } = this.props;
        if (queries.length === 0) return false; // need to bail if no queries (ie. first page mount)
        const queryCollectionStatus = queries.map(q => q.collections.length === 0
          || q.collections.reduce((combined, c) => combined && c.tag_sets_id !== undefined, true));
        const collectionsAreReady = queryCollectionStatus.reduce((combined, q) => combined && q, true);
        const querySourceStatus = queries.map(q => q.sources.length === 0
          || q.sources.reduce((combined, s) => combined && s.name !== undefined, true));
        const sourcesAreReady = querySourceStatus.reduce((combined, q) => combined && q, true);
        const querySearchStatus = queries.filter(q => Object.values(q.searches).length === 0).length === queries.length
          // if all searches fields are empty or if searches have fetched name && metadata info
          || queries.filter(q => JSON.stringify(q.searches).indexOf('name') > 0).length > 0;
        return collectionsAreReady && sourcesAreReady && querySearchStatus;
      }

      render() {
        const { queries } = this.props;
        let content;
        const sortedQueries = queries.sort((a, b) => a.sortPosition - b.sortPosition);
        if (this.state.queryInStore) {
          content = <ChildComponent {...this.props} queries={sortedQueries} />;
        } else {
          content = <LoadingSpinner />;
        }
        return (
          <div className="serializable-query">
            {content}
          </div>
        );
      }
    }

    UrlBasedQueryContainer.propTypes = {
      intl: PropTypes.object.isRequired,
      location: PropTypes.object,
      // from store
      queries: PropTypes.array,
      lastSearchTime: PropTypes.number,
      mediaMetadataSetsByName: PropTypes.object.isRequired,
      // from dispatch
      saveQueriesFromParsedUrl: PropTypes.func.isRequired,
      addAppNotice: PropTypes.func.isRequired,
      updateUrl: PropTypes.func.isRequired,
    };

    const mapStateToProps = state => ({
      queries: state.explorer.queries.queries,
      lastSearchTime: state.explorer.lastSearchTime.time,
      mediaMetadataSetsByName: state.system.staticTags.tagSets.mediaMetadataSetsByName,
    });

    // push any updates (including selected) into queries in state, will trigger async load in sub sections
    const mapDispatchToProps = dispatch => ({
      addAppNotice: (info) => {
        dispatch(addNotice(info));
      },
      saveQueriesFromParsedUrl: (queriesToUse, metadataLookup) => {
        dispatch(saveParsedQueries(queriesToUse)); // load query data into the store
        // lookup ancillary data eg collection and source info for display purposes in QueryForm
        queriesToUse.forEach((q) => {
          const queryInfo = {
            ...q,
          };
          const sourceDetailsAction = fetchQuerySourcesByIds;
          if (q.sources && q.sources.length > 0) {
            queryInfo.sources = q.sources.map(src => src.media_id || src.id || src); // the latter in case of sample search
            dispatch(sourceDetailsAction(queryInfo))
              .then((results) => {
                queryInfo.sources = results;
                dispatch(updateQuerySourceLookupInfo(queryInfo)); // updates the query and the selected query
              });
          }
          const collectionDetailsAction = fetchQueryCollectionsByIds;
          if (q.collections && q.collections.length > 0) {
            queryInfo.collections = q.collections.map(coll => coll.tags_id || coll.id || coll); // the latter in case of sample search
            dispatch(collectionDetailsAction(queryInfo))
              .then((results) => {
                queryInfo.collections = results;
                dispatch(updateQueryCollectionLookupInfo(queryInfo)); // updates the query and the selected query
              });
          }
          const metadataSetToReadableName = {};
          metadataSetToReadableName[metadataLookup.mediaPubCountrySet] = PUBLICATION_COUNTRY;
          metadataSetToReadableName[metadataLookup.mediaPubStateSet] = PUBLICATION_STATE;
          metadataSetToReadableName[metadataLookup.mediaPrimaryLanguageSet] = PRIMARY_LANGUAGE;
          metadataSetToReadableName[metadataLookup.mediaSubjectCountrySet] = COUNTRY_OF_FOCUS;
          metadataSetToReadableName[metadataLookup.mediaTypeSet] = MEDIA_TYPE;
          if (q.searches && q.searches !== undefined && Object.values(q.searches).length > 0) {
            queryInfo.searches = JSON.stringify(q.searches); // back to string
            queryInfo.metadataSetToReadableName = metadataSetToReadableName;
            dispatch(fetchQuerySearchesByIds(queryInfo))
              .then((results) => {
                queryInfo.searches = results;
                dispatch(updateQuerySearchLookupInfo(queryInfo)); // updates the query and the selected query
              });
          }
        });
      },
      updateUrl: (queries) => {
        const unDeletedQueries = queries.filter(q => q.deleted !== true);
        const nonEmptyQueries = unDeletedQueries.filter(q => q.q !== undefined && q.q !== '');
        const sortedQueries = nonEmptyQueries.sort((a, b) => a.uid - b.uid);
        const queriesToSerialize = sortedQueries.map(q => ({
          label: q.label,
          q: q.q,
          color: q.color,
          startDate: q.startDate,
          endDate: q.endDate,
          sources: q.sources.map(s => s.media_id), // de-aggregate media bucket into sources and collections
          collections: q.collections.map(c => c.tags_id),
          searches: prepSearches(q.searches), // for each query, go prep searches
        }));
        dispatch(push({ pathname: '/queries/search', search: `?qs=${serializeQueriesForUrl(queriesToSerialize)}` }));
      },
    });

    return injectIntl(
      connect(mapStateToProps, mapDispatchToProps)(
        UrlBasedQueryContainer
      )
    );
  };
}

export default composeUrlBasedQueryContainer;
