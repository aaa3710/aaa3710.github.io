(function (blocks, element, editor, components) {
  const h = element.createElement;
  blocks.registerBlockType('apps/navigation', {
    apiVersion: 3,
    title: '共通ナビゲーション',
    icon: 'menu',
    category: 'theme',
    attributes: {
      area: { type: 'string', default: 'app' },
      captionJa: { type: 'string' },
      captionEn: { type: 'string' },
    },
    edit: function (props) {
      const area = props.attributes.area;
      return h(
        'div',
        editor.useBlockProps({ className: 'apps-editor-navigation' }),
        area === 'footer'
          ? '全ページ共通のフッター'
          : area === 'header'
            ? 'Apps / アプリ / お問い合わせ / Language・言語'
            : '紹介 → サポート → プライバシー（このページに自動で対応）',
        area === 'footer' &&
          h(
            editor.InspectorControls,
            null,
            h(
              components.PanelBody,
              { title: 'フッターの文章' },
              h(components.TextareaControl, {
                label: '日本語',
                value:
                  props.attributes.captionJa ||
                  '自分で使いたいと思ったところから、ひとつずつ作っています。',
                onChange: (value) => props.setAttributes({ captionJa: value }),
              }),
              h(components.TextareaControl, {
                label: 'English',
                value:
                  props.attributes.captionEn ||
                  'Independent apps that began with something I wanted to use myself.',
                onChange: (value) => props.setAttributes({ captionEn: value }),
              }),
            ),
          ),
      );
    },
    save: function () {
      return null;
    },
  });
  blocks.registerBlockType('apps/store-link', {
    apiVersion: 3,
    title: 'App Storeへのボタン',
    icon: 'external',
    category: 'widgets',
    attributes: {
      kind: { type: 'string', default: 'app' },
      url: { type: 'string', default: '' },
      available: { type: 'boolean', default: false },
    },
    edit: function (props) {
      return h(
        'div',
        editor.useBlockProps({ className: 'apps-store-link' }),
        props.attributes.available
          ? 'App Storeへのボタン（日英のページに合わせて表示）'
          : 'App Storeの配信・一覧を準備中',
        h(
          editor.InspectorControls,
          null,
          h(
            components.PanelBody,
            { title: 'App Storeの掲載先' },
            h(components.TextControl, {
              label: 'App Store URL',
              value: props.attributes.url || '',
              onChange: (value) => props.setAttributes({ url: value }),
            }),
            h(components.ToggleControl, {
              label: '公開ページへの到達を確認済み',
              checked: !!props.attributes.available,
              onChange: (value) => props.setAttributes({ available: value }),
            }),
          ),
        ),
      );
    },
    save: function () {
      return null;
    },
  });
})(wp.blocks, wp.element, wp.blockEditor, wp.components);
