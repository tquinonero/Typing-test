<?php
/**
 * Plugin Name: Typing Test for WordPress
 * Plugin URI: https://innov8ion.tech
 * Description: A plugin to test your typing accuracy and speed
 * Version: 1.1
 * Author: Innov8ion.tech
 * Author URI: https://innov8ion.tech
 * License: The Unlicense
 * Text Domain: typing-test-wp
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

class Typing_Test_WP {
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('typing_test', array($this, 'typing_test_shortcode'));
    }

    public function enqueue_scripts() {
        wp_enqueue_style('typing-test-style', plugins_url('assets/css/style.css', __FILE__));
        wp_enqueue_script('typing-test-script', plugins_url('assets/js/typing-test-script.js', __FILE__), array('jquery'), '1.0', true);
    }

    public function typing_test_shortcode() {
        ob_start();
        ?>
        <div id="typing-test-container">
            <div id="test-text"></div>
            <textarea id="user-input" rows="5" disabled></textarea>
            <div id="results"></div>
            <button id="start-test">Start Test</button>
            <button id="stop-test" disabled>Stop Test</button>
        </div>
        <?php
        return ob_get_clean();
    }
}

// Initialize the plugin
new Typing_Test_WP();

