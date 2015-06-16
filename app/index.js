'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    os = require('os'),
    chalk = require('chalk');

/* jshint -W106 */
var proxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy ||
    process.env.HTTPS_PROXY || null;
/* jshint +W106 */
var githubOptions = {
    version: '3.0.0'
};

if (proxy) {
    var proxyUrl = url.parse(proxy);
    githubOptions.proxy = {
        host: proxyUrl.hostname,
        port: proxyUrl.port
    };
}
var GitHubApi = require('github');
var github = new GitHubApi(githubOptions);

var githubUserInfo = function(name, cb) {
    github.user.getFrom({
        user: name
    }, function(err, res) {
        if (err) {
            //throw new Error(err.message +
            //  '\n\nCannot fetch your github profile. Make sure you\'ve typed it correctly.');
            cb(null);
        } else
            cb(JSON.parse(JSON.stringify(res)));
    });
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
        callback(stdout);
    });
};

var NRSPluginGenerator = yeoman.generators.Base.extend({
    init: function() {
        this.pkg = require('../package.json');

        this.on('end', function() {
            //if (!this.options['skip-install']) {
            //  this.installDependencies();
            //}
        });
    },

    bePoliteAndExplain: function() {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the extravasome NRS Plugin generator!'));

        this.log('I know I am kinda curious and asking a lot but I need those answers to help you out.');
        this.log('Hang on tight, it won´t be that hard :) The more you tell me, the more I can go ahead and prepare all for you.\n');
    },

    askForGithubAccount: function() {
        var done = this.async();

        var prompts = [{
            type: 'input',
            name: 'githubUser',
            message: 'Would you mind telling me your username on GitHub?',
            default: 'someuser'
        }];
        this.prompt(prompts, function(props) {
            this.githubUser = props.githubUser;

            done();
        }.bind(this));
    },

    userInfo: function() {
        var done = this.async();

        githubUserInfo(this.githubUser, function(res) {
            /*jshint camelcase:false */
            //console.log(res);
            if (res) {
                //console.log('Hey hi ' + res.name);
                this.realname = res.name;
                this.email = res.email;
                this.githubUrl = res.html_url;
            } else {
                this.realname = 'n/a';
                this.email = 'n/a';
                this.githubUrl = 'n/a';
            }
            done();
        }.bind(this));
    },

    askFor: function() {
        var done = this.async();
        var prompts = [{
            type: 'input',
            name: 'pluginTitle',
            message: 'What is the title of your plugin?',
            default: this.appname

        }, {
            type: 'input',
            name: 'pluginName',
            message: 'OK, what would be the internal name?',
            default: function(answers) {
                return answers['pluginTitle'].replace(/ /g, '_');
            },
            validate: function(input) {
                var done = this.async();
                if (input.search(/^(\w+(_\w+)?)$/i) != 0) {
                    done("You need to provide a version such as abcd_hgsdf");
                    return;
                }
                // Pass the return value in the done callback
                done(true);
            }
        }, {
            type: 'input',
            name: 'pluginAuthors',
            message: 'What is your name?',
            default: this.realname
        }, {
            type: 'input',
            name: 'pluginVersion',
            message: 'What is the first version going to be?',
            default: '0.0.1.0',
            validate: function(input) {
                var done = this.async();
                if (input.search(/\d+\.\d+\.\d+(\.\d+)?/i) != 0) {
                    done("You need to provide a version such as 1.2.3.4");
                    return;
                }
                // Pass the return value in the done callback
                done(true);
            }
        }, {
            type: 'input',
            name: 'pluginDescription',
            message: 'How would you describe this awesome plugin?',
            validate: function(input) {
                var done = this.async();
                if (input.search(/.+/i) != 0) {
                    done("Hey! The description is mandatory. Come on, you can do it!");
                    return;
                }
                done(true);
            }
        }];

        this.prompt(prompts, function(props) {
            this.githubUser = props.githubUser;
            this.pluginName = props.pluginName;
            this.pluginTitle = props.pluginTitle;
            this.pluginVersion = props.pluginVersion;
            this.pluginAuthors = props.pluginAuthors;
            this.pluginDescription = props.pluginDescription;

            done();
        }.bind(this));

    },
    projectLocation: function() {
        var done = this.async();
        var prompts = [{
            type: 'input',
            name: 'pluginProjectURL',
            message: 'Where can the world find this piece of magic?',
            default: this.githubUrl + '/' + this.pluginName
        }];
        this.prompt(prompts, function(props) {
            this.pluginProjectURL = props.pluginProjectURL;

            done();
        }.bind(this));
    },

    app: function() {
        this.mkdir('css');
        this.mkdir('html');
        this.mkdir('html/pages');
        this.mkdir('html/modals');
        this.mkdir('js');
        this.mkdir('img');
    },

    projectfiles: function() {
        this.template('css/_plugin.css', 'css/' + this.pluginName + '.css');
        this.copy('img/screenshot.jpg', 'img/screenshot.jpg');
        this.template('html/modals/_plugin.html', 'html/modals/' + this.pluginName + '.html');
        this.template('html/pages/_plugin.html', 'html/pages/' + this.pluginName + '.html');
        this.template('js/_plugin.js', 'js/' + 'nrs.' + this.pluginName + '.js');
        this.template('_manifest.json', 'manifest.json');

        this.template('_README.adoc', this.pluginName + '.adoc');
        this.template('_deploy_mac.sh', 'deploy_mac.sh');
        this.template('_deploy_pc.bat', 'deploy_pc.bat');
        this.template('_deploy_linux.sh', 'deploy_linux.sh');
    }
});

module.exports = NRSPluginGenerator;
