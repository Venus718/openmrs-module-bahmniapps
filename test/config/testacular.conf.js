basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
    '../app/components/angular/angular.js',
    '../app/components/angular-mocks/angular-mocks.js',
    '../app/components/ngInfiniteScroll/ng-infinite-scroll.js',
    '../app/scripts/constants.js',
    '../app/modules/**/*.js',
    'unit/**/*.js'
];

singleRun = true;

browsers = ['PhantomJS'];

reporters = ['dots', 'junit'];
junitReporter = {
  outputFile: 'output/unit.xml',
  suite: 'unit'
};
