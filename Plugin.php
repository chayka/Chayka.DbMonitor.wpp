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
            $app->dbUpdate(array());
	        $app->addSupport_ConsolePages();


            /* chayka: init-addSupport */
        }
    }


    /**
     * Register your action hooks here using $this->addAction();
     */
    public function registerActions() {
        $view = $this->getView();
        $this->addAction('wp_footer', function() use ($view) {
            global $wpdb;
            $view->assign('queries', $wpdb->queries?$wpdb->queries:[]);
            echo $view->render('widget/db-monitor');
        });

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

		/* chayka: registerResources */
    }

    /**
     * Registering console pages
     */
    public function registerConsolePages(){
        /* chayka: registerConsolePages */
    }
}