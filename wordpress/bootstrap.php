<?php
// Run once through Studio WP-CLI, after copying this file into the site directory.
if (!defined('WP_CLI') || !WP_CLI) exit;
if (get_option('apps_editor_migrated')) WP_CLI::error('この編集原本は移行済みです。再取込による上書きを中止しました。');
$pages = json_decode(file_get_contents(__DIR__ . '/apps-migration.json'), true, 512, JSON_THROW_ON_ERROR);
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
switch_theme('apps-common');
$active = activate_plugin('apps-editor/apps-editor.php');
if (is_wp_error($active)) WP_CLI::error($active->get_error_message());
update_option('blogname', 'Apps');
update_option('blogdescription', '個人制作のアプリ');
update_option('permalink_structure', '/%postname%/');
update_option('default_comment_status', 'closed');
update_option('default_ping_status', 'closed');
update_option('blog_public', '0'); // The editor itself is local and not indexed.

$ids = [];
function apps_import_parent($route, &$ids) {
    $route = trim($route, '/');
    if (!$route) return 0;
    if (isset($ids[$route])) return $ids[$route];
    if (get_page_by_path($route)) WP_CLI::error('既存のページと衝突しました: ' . $route);
    $segments = explode('/', $route); $slug = array_pop($segments);
    $parent = apps_import_parent(implode('/', $segments), $ids);
    $id = wp_insert_post(['post_type'=>'page','post_status'=>'private','post_title'=>$slug,'post_name'=>$slug,'post_parent'=>$parent,'post_content'=>'','comment_status'=>'closed','ping_status'=>'closed'], true);
    if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
    $ids[$route] = $id;
    return $id;
}
usort($pages, fn($a,$b)=>substr_count($a['path'],'/') <=> substr_count($b['path'],'/'));
foreach ($pages as $page) {
    $route = trim($page['path'], '/');
    $id = apps_import_parent($route, $ids);
    $result = wp_update_post(wp_slash(['ID'=>$id,'post_title'=>$page['title'],'post_content'=>$page['content'],'post_excerpt'=>$page['description'],'post_status'=>'publish']), true);
    if (is_wp_error($result)) WP_CLI::error($result->get_error_message());
    update_post_meta($id,'_apps_noindex', !$page['indexable']);
    update_post_meta($id,'_apps_migration_source', 'React public snapshot bbac184');
    delete_post_meta($id, '_apps_translation_check');
}
// Import visible icons into the real media library so the Image block can replace them.
$media = [];
foreach ($pages as $page) {
    preg_match_all('~<img[^>]+src="(/images/[^"?]+)"~u', $page['content'], $matches);
    foreach ($matches[1] as $src) {
        if (isset($media[$src])) continue;
        $file = ABSPATH . ltrim($src,'/');
        $temporary = wp_tempnam(basename($file)); copy($file,$temporary);
        $id = media_handle_sideload(['name'=>basename(dirname($file)).'-'.basename($file),'tmp_name'=>$temporary],0);
        if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
        $media[$src] = wp_get_attachment_url($id);
    }
}
foreach ($pages as $page) {
    $id = $ids[trim($page['path'],'/')];
    $content = str_replace(array_keys($media),array_values($media),$page['content']);
    wp_update_post(wp_slash(['ID'=>$id,'post_content'=>$content]));
    delete_post_meta($id, '_apps_translation_check');
}
// Remove only the untouched samples from this newly created site.
foreach (get_posts(['post_type'=>['post','page'],'post_status'=>'any','numberposts'=>-1]) as $post) {
    if (in_array($post->post_name,['hello-world','sample-page','privacy-policy'],true) && !in_array($post->ID,$ids,true)) wp_trash_post($post->ID);
}
flush_rewrite_rules();
update_option('apps_editor_migrated', gmdate('c'));
WP_CLI::success(count($pages).'ページを編集原本へ移行しました。');
