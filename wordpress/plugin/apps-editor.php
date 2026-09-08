<?php
/**
 * Plugin Name: Apps — Web編集
 * Description: 日英の対応、共通ナビゲーションと静的公開用の情報を管理します。
 * Version: 1.0.0
 */
defined('ABSPATH') || exit;
require_once __DIR__ . '/readable.php';

function apps_route($id = 0) {
    $id = $id ?: get_the_ID();
    return '/' . trim((string) get_page_uri($id), '/') . '/';
}
function apps_english($route = '') { return str_starts_with($route ?: apps_route(), '/apps/en/'); }
function apps_pair_route($route) {
    return apps_english($route) ? '/apps/' . substr($route, 9) : '/apps/en/' . substr($route, 6);
}
function apps_partner($id) {
    $page = get_page_by_path(trim(apps_pair_route(apps_route($id)), '/'));
    return $page ? $page->ID : 0;
}
function apps_nav_render($attributes) {
    $route = apps_route();
    $en = apps_english($route);
    $base = $en ? '/apps/en/' : '/apps/';
    $home = $en ? 'Apps' : 'アプリ';
    $contact = $en ? 'Contact' : 'お問い合わせ';
    $area = $attributes['area'] ?? 'app';
    $mark = '<a class="site-mark" href="' . $base . '"><span class="site-mark-dot" aria-hidden="true"></span><span>Apps</span></a>';
    if ($area === 'header') {
        return '<header class="site-header">' . $mark . '<nav class="site-nav" aria-label="' . ($en ? 'Main navigation' : '主なページ') . '"><a href="' . $base . '#apps">' . $home . '</a><a href="' . $base . 'contact/">' . $contact . '</a><a class="language-button" aria-label="Language / 言語" href="' . esc_url(apps_pair_route($route)) . '"><span aria-hidden="true">◎</span><span>' . ($en ? '日本語' : 'English') . '</span></a></nav></header>';
    }
    if ($area === 'footer') {
        $caption = $en ? ($attributes['captionEn'] ?? 'Independent apps that began with something I wanted to use myself.') : ($attributes['captionJa'] ?? '自分で使いたいと思ったところから、ひとつずつ作っています。');
        return '<footer class="site-footer"><div>' . $mark . '<p>' . esc_html($caption) . '</p></div><nav aria-label="' . ($en ? 'Footer navigation' : 'フッターナビゲーション') . '"><a href="' . $base . '#apps">' . $home . '</a><a href="' . $base . 'contact/">' . $contact . '</a><a href="#top">' . ($en ? 'Back to top' : '先頭へ') . ' ↑</a></nav></footer>';
    }
    $parts = explode('/', trim(substr($route, strlen($base)), '/'));
    $slug = end($parts);
    $kind = count($parts) === 1 ? 'app' : $parts[0];
    $labels = $en ? ['app' => 'Overview', 'support' => 'Support', 'privacy' => 'Privacy'] : ['app' => '紹介', 'support' => 'サポート', 'privacy' => 'プライバシー'];
    $html = '<nav class="app-navigation" aria-label="' . ($en ? 'App navigation' : 'このアプリのページ') . '">';
    foreach ($labels as $key => $label) {
        $url = $base . ($key === 'app' ? '' : $key . '/') . $slug . '/';
        $html .= '<a href="' . esc_url($url) . '"' . ($kind === $key ? ' aria-current="page"' : '') . '>' . $label . '</a>';
    }
    return $html . '</nav>';
}
add_action('init', function () {
    add_post_type_support('page', 'excerpt');
    wp_register_script('apps-editor-blocks', plugins_url('editor.js', __FILE__), ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'], '1.0.0', true);
    register_block_type('apps/navigation', [
        'api_version' => 3,
        'attributes' => ['area' => ['type' => 'string', 'default' => 'app'], 'captionJa' => ['type' => 'string'], 'captionEn' => ['type' => 'string']],
        'editor_script' => 'apps-editor-blocks',
        'render_callback' => 'apps_nav_render',
    ]);
});
add_filter('language_attributes', function ($attributes) {
    return is_admin() ? $attributes : 'lang="' . (apps_english() ? 'en' : 'ja') . '"';
});
// Core's skip link follows the page language, independently of the editor locale.
add_filter('gettext_default', function ($translated, $text) {
    if ($text === 'Skip to content' && !is_admin() && is_page()) {
        return apps_english() ? 'Skip to content' : '内容をスキップ';
    }
    return $translated;
}, 10, 2);
add_filter('pre_get_document_title', function ($title) { return is_page() ? get_the_title() : $title; });
add_filter('wp_robots', function ($robots) {
    if (str_contains(apps_route(), '/feedback/') || get_post_meta(get_the_ID(), '_apps_noindex', true)) {
        return ['noindex' => true, 'nofollow' => true];
    }
    return ['max-image-preview' => 'large'];
});
remove_action('wp_head', 'rel_canonical');
add_action('wp_head', function () {
    if (!is_page()) return;
    $route = apps_route();
    $origin = 'https://aaa3710.github.io';
    $en = apps_english($route);
    $ja = $en ? apps_pair_route($route) : $route;
    $english = $en ? $route : apps_pair_route($route);
    $feedback = str_contains($route, '/feedback/');
    if (!$feedback) echo '<link rel="canonical" href="' . esc_url($origin . $route) . '">' . "\n";
    if (!$feedback && apps_partner(get_the_ID())) {
        echo '<link rel="alternate" hreflang="ja" href="' . esc_url($origin . $ja) . '">' . "\n";
        echo '<link rel="alternate" hreflang="en" href="' . esc_url($origin . $english) . '">' . "\n";
        echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($origin . $ja) . '">' . "\n";
    }
    echo '<meta name="description" content="' . esc_attr(get_the_excerpt()) . '">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr(get_the_title()) . '">' . "\n";
    echo '<meta property="og:description" content="' . esc_attr(get_the_excerpt()) . '">' . "\n";
    echo '<meta property="og:url" content="' . esc_url($origin . $route) . '">' . "\n";
    if (preg_match('~^/apps/(en/)?focus-exposure-calculator/$~', $route)) {
        $image = $origin . '/images/focus-exposure-calculator/og-' . ($en ? 'en' : 'ja') . '.png';
        echo '<meta property="og:image" content="' . esc_url($image) . '">' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url($image) . '">' . "\n";
        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    }
});
add_action('init', function () {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_footer', 'wp_print_speculation_rules');
});
add_filter('show_admin_bar', '__return_false');
add_filter('wp_resource_hints', function ($urls) { return is_admin() ? $urls : []; });

add_action('post_updated', function ($id, $after, $before) {
    if ($after->post_type !== 'page' || $after->post_status !== 'publish' || $after->post_content === $before->post_content) return;
    $partner = apps_partner($id);
    if ($partner) update_post_meta($partner, '_apps_translation_check', current_time('mysql'));
}, 10, 3);
add_action('admin_menu', function () {
    add_menu_page('Webサイト', 'Webサイト', 'edit_pages', 'apps-editor', 'apps_editor_page', 'dashicons-layout', 3);
});
add_action('admin_post_apps_pair_checked', function () {
    $id = absint($_POST['page_id'] ?? 0);
    check_admin_referer('apps-pair-' . $id);
    if (!current_user_can('edit_post', $id)) wp_die('編集権限がありません。');
    delete_post_meta($id, '_apps_translation_check');
    $partner = apps_partner($id);
    if ($partner && current_user_can('edit_post', $partner)) delete_post_meta($partner, '_apps_translation_check');
    wp_safe_redirect(admin_url('admin.php?page=apps-editor'));
    exit;
});
function apps_editor_page() {
    echo '<div class="wrap"><h1>Webサイトを編集</h1><p>文章・画像・節の順序は各ページで、全体の色や文字は「共通デザイン」で編集できます。本人の編集もCodexによる修正も、このWordPressに保存します。保存はこのMac内です。</p>';
    echo '<p><a class="button" href="' . esc_url(admin_url('site-editor.php?path=%2Fwp_global_styles')) . '">共通デザイン</a> <a class="button" href="' . esc_url(home_url('/apps/')) . '" target="_blank" rel="noopener">ローカルで確認</a></p>';
    echo '<p>片方の言語を変更すると、もう片方に「確認が必要」と表示します。「ローカルで確認」で仕上がりを見たら、Codexに「現在のWordPressを公開して」と伝えてください。書き出しと公開はCodexが行います。保存だけでは一般公開されません。</p><table class="widefat striped"><thead><tr><th>ページ</th><th>日本語</th><th>English</th><th>日英の照合</th></tr></thead><tbody>';
    foreach (get_posts(['post_type' => 'page', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'menu_order title', 'order' => 'ASC']) as $page) {
        $route = apps_route($page->ID);
        if (!str_starts_with($route, '/apps/') || apps_english($route)) continue;
        $partner = apps_partner($page->ID);
        echo '<tr><td>' . esc_html($page->post_title) . '</td>';
        foreach ([$page->ID, $partner] as $id) {
            echo '<td>' . ($id ? '<a href="' . esc_url(get_edit_post_link($id)) . '">編集</a>' . (get_post_meta($id, '_apps_translation_check', true) ? ' — 確認が必要' : '') : '未作成') . '</td>';
        }
        echo '<td><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="apps_pair_checked"><input type="hidden" name="page_id" value="' . (int)$page->ID . '">';
        wp_nonce_field('apps-pair-' . $page->ID);
        echo '<button class="button">日英を確認済みにする</button></form></td></tr>';
    }
    echo '</tbody></table></div>';
}
