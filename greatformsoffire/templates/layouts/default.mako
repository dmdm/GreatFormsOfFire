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
        <style type="text/css">
            [ng-cloak] { display: none; }
        </style>
        <link rel="stylesheet" href="${request.static_url('greatformsoffire:static/assets/css/app.css')}">
        % if request.registry.settings['environment'] != 'production':
            <link rel="stylesheet" href="${request.static_url('pym:static/css/styles-' + request.registry.settings['environment'] + '.css')}">
        % endif
    </%block>
</head>
<body ng-cloak layout="column" ng-controller="UsersController as ul">

<!--[if lt IE 10]>
    <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
<![endif]-->

<div id="page_container"><!-- BEGIN #page_container -->

    <div id="page_content"><!-- BEGIN #page_content -->
        ${next.body()}
    </div>
    <!-- END #page_content -->

</div><!-- END #page_container -->

% if request.registry.settings['environment'] == 'production':
    <script src="${request.static_url('greatformsoffire:static/app/main.min.js')}"></script>
% else:
    <script src="${request.static_url('greatformsoffire:static/jspm_packages/system.js')}"></script>
    <script src="${request.static_url('greatformsoffire:static/config.js')}"></script>
    <script type="text/javascript">
        System.import('angular').then(function (angular) {
            angular
                .module('constants', [])
                .constant('RC', ${h.json_serializer(rc)|n})
                .constant('T', ${h.json_serializer(t)|n});
        });
        System
            .import('app/boot');
            //.catch( console.error.bind(console) );
    </script>
% endif

</body>
</html>

