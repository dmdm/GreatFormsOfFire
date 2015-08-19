import users from 'app/users/Users';
import { ExternalLogger } from 'app/utils/LogDecorator';

let $log = new ExternalLogger();
    $log = $log.getInstance( "BOOTSTRAP" );
    $log.debug( "Configuring 'main' module" );

export default angular.module('main', [ users, 'constants' ] ).name;
