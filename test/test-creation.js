/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

var testData = {
    githubUser: 'chevdor',
    pluginName: 'my.test plugin#name',
    pluginTitle: 'Super Duper plugin',
    pluginVersion: '0.1.0.0',
    pluginType: 'Custom',

    pluginAuthors: 'Chevdor',
    pluginOwners: 'Chevdor',

    pluginSummary: 'Some blabla',
    pluginDescription: 'Some other blabla',
    readmeFormat: '',
    pluginProjectURL: 'http://www.someurl.com',
    pluginTags: 'tag1, tag2',

    licenseRequired: 'N',
    pluginLicenseURL: 'http://license.org',
    pluginCopyright: 'Some more blabla'
}

describe('nrs-plugin generator', function() {
    beforeEach(function(done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function(err) {
            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('nrs-plugin:app', [
                '../../app'
            ]);
            done();
        }.bind(this));
    });

    it('creates expected files', function(done) {
        var expected = [
            // add files you expect to exist here.
            'css/' + testData.pluginName + '.css',
            'html/' + testData.pluginName + '.css',
            'html/' + testData.pluginName + '.css',
            'js/' + testData.pluginName + '.css',
            'README.adoc'
        ];

        helpers.mockPrompt(this.app, {
            'githubUser': testData.githubUser,
            'pluginName': testData.pluginName,
            'pluginTitle': testData.pluginTitle,
            'pluginVersion': testData.pluginVersion,
            'pluginType': testData.pluginType,

            'pluginAuthors': testData.pluginAuthors,
            'pluginOwners': testData.pluginOwners,

            'pluginSummary': testData.pluginSummary,
            'pluginDescription': testData.pluginDescription,
            'readmeFormat': testData.readmeFormat,
            'pluginProjectURL': testData.pluginProjectURL,
            'pluginTags': testData.pluginTags,

            'licenseRequired': testData.licenseRequired,
            'pluginLicenseURL': testData.pluginLicenseURL,
            'pluginCopyright': testData.pluginCopyright
        });
        this.app.options['skip-install'] = true;
        this.app.run({}, function() {
            helpers.assertFile(expected);
            done();
        });
    });
});
