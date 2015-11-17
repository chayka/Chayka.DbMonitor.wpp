<?php

namespace Chayka\DbMonitor;

use Chayka\WP;

class Plugin extends WP\Plugin{

    /* chayka: constants */
    
    public static $instance = null;

    public static function init(){
        if(!static::$instance){
            static::$instance = $app = new self(__FILE__, array(
                /* chayka: init-controllers */
            ));
	        $app->addSupport_ConsolePages();
            if(OptionHelper::getOption('dbMonitorEnabled') && !defined('SAVEQUERIES')){
                define('SAVEQUERIES', true);
            }

            /* chayka: init-addSupport */
        }
    }


    /**
     * Register your action hooks here using $this->addAction();
     */
    public function registerActions() {
        if(OptionHelper::getOption('dbMonitorEnabled')){
            $cb = function (){
                global $wpdb;
                $view = Plugin::getView();
                $view->assign('queries', $wpdb->queries ? $wpdb->queries : []);
                echo $view->render('widget/db-monitor.phtml');
            };
            $this->addAction('wp_footer', $cb);
            $this->addAction('admin_footer', $cb);
        }
    	/* chayka: registerActions */
    }

    /**
     * Register your action hooks here using $this->addFilter();
     */
    public function registerFilters() {
		/* chayka: registerFilters */
    }

    /**
     * Register scripts and styles here using $this->registerScript() and $this->registerStyle()
     *
     * @param bool $minimize
     */
    public function registerResources($minimize = false) {
        $this->registerBowerResources(true);

        $this->populateResUrl('<%= appName %>');

        $this->setResSrcDir('src/');
        $this->setResDistDir('dist/');

        $this->registerNgScript('db-monitor', 'ng/db-monitor.js', ['chayka-modals', 'chayka-utils']);
        $this->registerNgStyle('db-monitor', 'ng/db-monitor.css', ['chayka-modals']);

        if(OptionHelper::getOption('dbMonitorEnabled')){
            $this->enqueueNgScriptStyle('db-monitor');
        }
		/* chayka: registerResources */
    }

    /**
     * Registering console pages
     */
    public function registerConsolePages(){
        $this->addConsoleSubPage('chayka-core', 'DB Monitor', 'update_core', 'db-monitor', '/admin/db-monitor');

        /* chayka: registerConsolePages */
    }
}