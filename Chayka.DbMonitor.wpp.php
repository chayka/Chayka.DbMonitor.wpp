<?php
/**
 * Plugin Name: Chayka.DbMonitor
 * Plugin URI: git@github.com:chayka/Chayka.DbMonitor.wpp.git
 * Description: WordPress plugin for DB usage analysis
 * Version: 0.0.1
 * Author: Boris Mossounov <borix@tut.by>
 * Author URI: http://anotherguru.me/
 * License: MIT
 */

require_once __DIR__.'/vendor/autoload.php';

if(!class_exists("Chayka\\WP\\Plugin")){
    add_action( 'admin_notices', function () {
?>
    <div class="error">
        <p>Chayka.Core plugin is required in order for Chayka.DbMonitor to work properly</p>
    </div>
<?php
	});
}else{
//    require_once dirname(__FILE__).'/Plugin.php';
	add_action('init', array("Chayka\\DbMonitor\\Plugin", "init"));
}
