<?php
defined('ABSPATH') || exit;
add_action('after_setup_theme', function () {
    add_theme_support('editor-styles');
    add_editor_style(['assets/site.css', 'assets/wordpress.css']);
});
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('apps-site', get_theme_file_uri('assets/site.css'), [], '1.0.0');
    wp_enqueue_style('apps-wordpress', get_theme_file_uri('assets/wordpress.css'), ['apps-site'], '1.0.0');
    wp_add_inline_style('apps-wordpress', apps_design_css());
});

// Use the Site Editor's saved choices in the shared layout as well as core blocks.
function apps_design_css($styles = null) {
    $styles = $styles ?? wp_get_global_styles();
    $declarations = '';
    foreach ([
        '--background' => $styles['color']['background'] ?? null,
        '--foreground' => $styles['color']['text'] ?? null,
        '--font-sans' => $styles['typography']['fontFamily'] ?? null,
    ] as $property => $value) {
        if (is_string($value)) $declarations .= safecss_filter_attr($property . ':' . $value) . ';';
    }
    $size = $styles['typography']['fontSize'] ?? '1rem';
    return ':root{' . $declarations . '}html{' . safecss_filter_attr('font-size:' . $size) . '}';
}
add_filter('block_editor_settings_all', function ($settings) {
    $settings['styles'][] = ['css' => apps_design_css()];
    return $settings;
});
