import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import matchingStoryCounts from './matchingStoryCounts';
import retweetCoverage from './retweetCoverage';
import retweetStoryCounts from './retweetStoryCounts';
import topCountriesCoverage from './topCountriesCoverage';
import topCountriesStoryCounts from './topCountriesStoryCounts';
import nytThemeCoverage from './nytThemeCoverage';
import nytThemeStoryCounts from './nytThemeStoryCounts';
import mediaTypeCoverage from './mediaTypeCoverage';
import mediaTypeStoryCounts from './mediaTypeStoryCounts';
import workflow from './workflow';
import mediaTypes from './mediaTypes';
import matchingStoriesConfigWorkflow from './matchingStoriesConfigWorkflow';
import matchingStoriesUploadCSV from './matchingStoriesUploadCSV';
import matchingStoriesGenerateModel from './matchingStoriesGenerateModel';
import matchingStoriesProbableWords from './matchingStoriesProbableWords';
import matchingStoriesSample from './matchingStoriesSample';

const createFocusReducer = combineReducers({
  matchingStories,
  matchingStoryCounts,
  retweetCoverage,
  retweetStoryCounts,
  topCountriesCoverage,
  topCountriesStoryCounts,
  nytThemeCoverage,
  nytThemeStoryCounts,
  mediaTypeCoverage,
  mediaTypeStoryCounts,
  workflow,
  mediaTypes,
  matchingStoriesConfigWorkflow,
  matchingStoriesUploadCSV,
  matchingStoriesGenerateModel,
  matchingStoriesProbableWords,
  matchingStoriesSample,
});

export default createFocusReducer;
