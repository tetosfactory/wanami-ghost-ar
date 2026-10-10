# 検証記録

2026-10-11（日本時間）

## 確認済み

- Edgeによる1280×1000と390×844の表示：GLB読込成功、JavaScript例外なし、横方向のはみ出しなし。
- ブラウザの3D表示で白いおばけの形状・目・材質を目視確認。
- 読込失敗を再現：エラー案内と再読込ボタンが表示され、AR起動ボタンは無効。
- GLB：glTF 2.0、必須拡張なし、高さ約1.0002m、ar-scale=auto。
- USDZ：ZIP整合性良好、全ファイル無圧縮、64バイト境界配置、内部テクスチャを同梱。
- 元GLB：18,660,528 bytes → 配信用GLB：3,500,012 bytes。USDZ：6,126,174 bytes。

## 実機確認が必要

- iPhone SafariでのQuick Look起動・材質・床認識・移動・拡大縮小・撮影・写真保存。
- ARCore対応Android ChromeでのScene Viewer起動・床認識・移動・拡大縮小・撮影・写真保存。
- カメラ拒否後のOS側挙動、LINE等のアプリ内ブラウザからSafari / Chromeで開き直す操作。
- 3D確認や構造確認は、実機ARの成功を証明するものではありません。

## 公開後の確認

GitHub Desktopから `https://github.com/tetosfactory/wanami-ghost-ar` へmainブランチのアップロードを確認しました。
GitHub Pages公開状態とURL、QRの読取結果は、公開後に追記します。
