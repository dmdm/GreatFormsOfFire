<%inherit file="greatformsoffire:templates/layouts/default.mako" />
<%block name="styles">
${parent.styles()}
</%block>

<md-toolbar layout="row">
    <md-button class="menu" hide-gt-sm ng-click="ul.toggleList()" aria-label="Show User List">
        <md-icon md-svg-icon="menu"></md-icon>
    </md-button>
    <h1>Angular Material - Starter App</h1>
</md-toolbar>

<div flex layout="row">

    <md-sidenav md-is-locked-open="$mdMedia('gt-sm')" class="md-whiteframe-z2" md-component-id="left">
        <md-list>
            <md-item ng-repeat="it in ul.users">
                <md-button ng-click="ul.selectUser(it)" ng-class="{'selected' : it === ul.selected }">
                    <md-icon md-svg-icon="{{it.avatar}}" class="avatar"></md-icon>
                    {{it.name}}
                </md-button>
            </md-item>
        </md-list>
    </md-sidenav>

    <md-content flex id="content">
        <md-icon md-svg-icon="{{ul.selected.avatar}}" class="avatar"></md-icon>
        <h2>{{ul.selected.name}}</h2>

        <p>{{ul.selected.content}}</p>

        <md-button class="share" md-no-ink ng-click="ul.share($event)" aria-label="Share">
            <md-icon md-svg-icon="share"></md-icon>
        </md-button>
    </md-content>

</div>