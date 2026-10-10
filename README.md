# おばけと、ハイチーズ。 — わなみフェス AR

GitHub Pagesで公開する静的Webアプリです。ビルド・npm・サーバー契約は不要です。

## GitHub Desktopで公開

1. GitHub Desktopで **File → Add local repository** を選び、この `wanami-ghost-ar` フォルダを追加します。上位のホラー素材フォルダを追加しないでください。
2. **Publish repository** でリポジトリ名を `wanami-ghost-ar` にし、一般公開するため **Keep this code private** のチェックを外して公開します。
3. GitHubのリポジトリで **Settings → Pages → Build and deployment** を開きます。
4. **Source: Deploy from a branch / Branch: main / Folder: /(root)** にして **Save**。
5. Pagesに表示された実際の公開URLを開きます。リポジトリURLとは異なります。公開には数分かかる場合があります。
6. 公開URLでスマホ実機の動作を確認し、そのURLをQRコードにします。

Pages URLが決まるまでは完成版QRを生成しません。独自ドメインを使わない場合の形式は `https://<GitHubログイン名>.github.io/wanami-ghost-ar/` です。

## 更新

`index.html`（文言）、`style.css`（デザイン）、`app.js`（状態表示）、`assets/ghost.glb`・`ghost.usdz`（モデル）を変更して、GitHub DesktopでCommit → Push origin。Pages再配信後に実機確認します。URLが変わらなければQRの作り直しは不要です。

## 使い方

- iPhone：Safari → ARボタン → AR表示 → 床を映して配置 → 2本指で拡大縮小 → 端末の撮影・保存操作。
- Android：Chrome → ARボタン → Scene Viewer → 床へ配置 → 2本指で拡大縮小 → 撮影・保存操作。
- 撮影ボタンのない端末ではスクリーンショット。カメラは背面なので、撮影者と写る人が別にいると撮りやすくなります。
- 全スマホにARを保証するものではありません。AndroidはARCore対応とGoogleのAR関連サービスが必要です。PC・非対応環境では3D表示のみです。
- 人物による遮蔽処理・アニメーション・動画撮影は実装していません。床認識とAR撮影はOSのビューアが行います。
- このアプリは写真をアップロードしません。GitHub・OSのARビューアの通信は各サービスの仕様に従います。

## ファイルとモデル

元モデルは上位フォルダの `friendly ghost 3d model.glb` に保持しています（Gitリポジトリには含めていません）。`tools/prepare_model.py` はBlender 5用の変換ソースです。配信用GLBは通常のglTF 2.0、USDZはiPhone用。高さ1m、底面が地面に接するよう正規化し、テクスチャを最大1024px、約6万ポリゴンに調整しています。

`model-viewer` 4.1.0を同梱し、ライセンスは `assets/MODEL-VIEWER-LICENSE.txt` に収録しています。モデルの権利は元モデルの条件に従います。

## 確認

ブラウザ確認結果・モデル情報は `VALIDATION.md` と `model-report.json`。実機ARは別途確認が必要です。

開発用の確認は、Node.jsとPlaywrightを用意してローカルHTTPサーバーを起動し、`node tools/check.cjs` を実行します。標準の確認先は `http://127.0.0.1:8766/`。`AR_TEST_URL` 環境変数で公開先やサブフォルダのURLにも変更できます。通常の公開・利用にこれらの開発ツールは不要です。

QRを再生成する場合は、Pythonと `qrcode` パッケージを用意し、`python tools/make_qr.py <確定したHTTPS公開URL>` を実行します。配信されたARページを検証してからPNGとSVGを `qr-output` に保存します。QR画像はリポジトリへ自動追加しません。

参考：[model-viewer](https://modelviewer.dev/docs/index.html)、[Scene Viewer](https://developers.google.com/ar/develop/scene-viewer)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
