<%namespace name="pym" file="pym:templates/lib/pym.mako" inheritable="True"/>

<!DOCTYPE html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title><%block name="meta_title">${request.registry.settings['project.title']}</%block></title>
    <meta name="description" content="<%block name="meta_descr">${request.registry.settings['project.description']}</%block>">
    <meta name="keywords" content="<%block name="meta_keywords">${request.registry.settings['project.keywords']}</%block>">
    <meta name="author" content="<%block name="meta_author">${request.registry.settings['project.author']}</%block>">
    <%block name="styles">
        % if request.registry.settings['environment'] == 'production':
            <link rel="stylesheet" href="${request.static_url('greatformsoffire:static/bower_components/angular-material/angular-material.min.css')}">
            <link rel="stylesheet" href="${request.static_url('greatformsoffire:static/assets/css/app.css')}">
        % else:
            <link rel="stylesheet" href="${request.static_url('greatformsoffire:static/bower_components/angular-material/angular-material.css')}">
            <link rel="stylesheet" href="${request.static_url('greatformsoffire:static/assets/css/app.css')}">
        % endif
        % if request.registry.settings['environment'] != 'production':
            <link rel="stylesheet" href="${request.static_url('pym:static/css/styles-' + request.registry.settings['environment'] + '.css')}">
        % endif
    </%block>
</head>
<body ng-app="starterApp" ng-strict-di layout="column" ng-controller="UserController as ul">

<!--[if lt IE 10]>
    <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
<![endif]-->

<div id="page_container"><!-- BEGIN #page_container -->

    <div id="page_content"><!-- BEGIN #page_content -->
        ${next.body()}
    </div>
    <!-- END #page_content -->

</div><!-- END #page_container -->

##
## Load 3rd-party libraries
##
% if request.registry.settings['environment'] == 'production':
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular/angular.min.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular-animate/angular-animate.min.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular-aria/angular-aria.min.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular-material/angular-material.min.js')}"></script>
% else:
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular/angular.min.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular-animate/angular-animate.min.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular-aria/angular-aria.min.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/bower_components/angular-material/angular-material.min.js')}"></script>
% endif

##
## Load our app
##

## Consts must precede the main app!
## Cannot put them in their own JS file, because we need to build the JSON data
## from the server.
<script type="text/javascript">
(function () {
    'use strict';

    angular
        .module('constants', [])
        .constant('RC', ${h.json_serializer(rc)|n})
        .constant('T', ${h.json_serializer(t)|n});

}());
</script>
% if request.registry.settings['environment'] == 'production':
    <script src="${request.static_url('greatformsoffire:static/app/main.min.js')}"></script>
% else:
    <script src="${request.static_url('greatformsoffire:static/app/_forward_declarations.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/app/app.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/app/users/UserController.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/app/users/UserService.js')}"></script>
% endif

</body>
</html>

