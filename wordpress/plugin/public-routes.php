<?php
if (!defined('WP_CLI') || !WP_CLI) exit;
$routes = [];
foreach (get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>-1,'has_password'=>false]) as $page) {
    $route = apps_route($page->ID);
    if (!str_starts_with($route,'/apps/')) continue;
    $routes[] = ['path'=>$route,'lang'=>apps_english($route)?'en':'ja','indexable'=>!str_contains($route,'/feedback/') && !get_post_meta($page->ID,'_apps_noindex',true)];
}
usort($routes,fn($a,$b)=>strcmp($a['path'],$b['path']));
echo wp_json_encode($routes,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) . "\n";
