<?php
/**
 * Japanese line breaking, adapted from Google BudouX 0.7.0 parser.
 * Copyright 2021 Google LLC. Apache License 2.0; see BUDOUX-LICENSE.
 * Adaptation: UTF-8 character slicing, protected app names, WordPress rendering.
 * Stored editor text stays plain; no text is sent to a service.
 */
function apps_reading_units($text) {
    if (!preg_match('/[\p{Han}\p{Hiragana}\p{Katakana}]/u', $text)) return [$text];
    static $model = null, $base = 0;
    if ($model === null) {
        $model = json_decode(file_get_contents(__DIR__ . '/budoux-ja.json'), true);
        foreach ($model as $group) $base -= 0.5 * array_sum($group);
    }
    $chars = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);
    $length = count($chars);
    $ranges = [];
    foreach (['撮影のものさし', '伝わる文字', '道の記録', '被写界深度', 'マニュアルフォーカス'] as $term) {
        $offset = 0;
        while (($start = mb_strpos($text, $term, $offset)) !== false) {
            $ranges[] = [$start, $start + mb_strlen($term)];
            $offset = $start + mb_strlen($term);
        }
    }
    $slice = function ($a, $b) use ($chars, $length) { return implode('', array_slice($chars, max(0, $a), max(0, min($length, $b) - max(0, $a)))); };
    $features = ['UW1'=>[-3,-2], 'UW2'=>[-2,-1], 'UW3'=>[-1,0], 'UW4'=>[0,1], 'UW5'=>[1,2], 'UW6'=>[2,3], 'BW1'=>[-2,0], 'BW2'=>[-1,1], 'BW3'=>[0,2], 'TW1'=>[-3,0], 'TW2'=>[-2,1], 'TW3'=>[-1,2], 'TW4'=>[0,3]];
    $units = []; $start = 0;
    for ($i = 1; $i < $length; $i++) {
        $score = $base;
        foreach ($features as $group => [$a, $b]) $score += $model[$group][$slice($i + $a, $i + $b)] ?? 0;
        $protected = false;
        foreach ($ranges as [$a, $b]) if ($i > $a && $i < $b) $protected = true;
        if ($score > 0 && !$protected) { $units[] = $slice($start, $i); $start = $i; }
    }
    $units[] = $slice($start, $length);
    return $units;
}
function apps_readable_html($html) {
    if (!class_exists('DOMDocument')) return $html;
    $doc = new DOMDocument('1.0', 'UTF-8');
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="apps-readable-root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors(); libxml_use_internal_errors($previous);
    $xpath = new DOMXPath($doc);
    $nodes = iterator_to_array($xpath->query('//text()[not(ancestor::code) and not(ancestor::pre) and not(ancestor::script) and not(ancestor::style) and not(ancestor::span[contains(concat(" ", normalize-space(@class), " "), " readable-unit ")])]'));
    foreach ($nodes as $node) {
        $units = apps_reading_units($node->nodeValue);
        if (count($units) <= 1) continue;
        $fragment = $doc->createDocumentFragment();
        foreach ($units as $i => $unit) {
            if ($i) $fragment->appendChild($doc->createElement('wbr'));
            $span = $doc->createElement('span'); $span->setAttribute('class', 'readable-unit');
            $span->appendChild($doc->createTextNode($unit)); $fragment->appendChild($span);
        }
        $node->parentNode->replaceChild($fragment, $node);
    }
    $root = $doc->getElementById('apps-readable-root');
    if (!$root) return $html;
    $out = ''; foreach ($root->childNodes as $node) $out .= $doc->saveHTML($node);
    return $out;
}
add_filter('render_block', function ($html, $block) {
    if (!in_array($block['blockName'] ?? '', ['core/paragraph', 'core/heading', 'core/list-item', 'core/details'], true)) return $html;
    return apps_readable_html($html);
}, 10, 2);
