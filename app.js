'use strict';
const viewer = document.querySelector('#ghost');
const button = document.querySelector('#start-ar');
const label = document.querySelector('#button-label');
const status = document.querySelector('#status');
const retry = document.querySelector('#retry');
const loading = document.querySelector('#loading');
const ua = navigator.userAgent;
const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(ua);
const embedded = /Line\/|Instagram|FBAN|FBAV/i.test(ua);
let ready = false;
let starting = false;
function updateAvailability() {
  if (!ready) return;
  const supported = viewer.canActivateAR && (isIOS || isAndroid);
  button.disabled = !supported || starting;
  label.textContent = starting ? 'AR画面を開いています…' : supported ? 'ARでおばけを呼ぶ' : '3Dのおばけを見てみよう';
  status.textContent = embedded
    ? 'ARを使うには、このページをSafariかChromeで開いてください。'
    : supported
      ? '床を映して配置。指で大きさを変えられます。'
      : isIOS || isAndroid
        ? 'この環境ではARを起動できません。Safari / Chromeで開くか、下の案内をご覧ください。'
        : 'スマホでこのURLを開くと、対応端末でARを楽しめます。';
}
viewer.addEventListener('progress', (event) => {
  document.querySelector('#progress').style.width = `${Math.round(event.detail.totalProgress * 100)}%`;
});
viewer.addEventListener('load', () => {
  ready = true;
  loading.hidden = true;
  retry.hidden = true;
  updateAvailability();
});
viewer.addEventListener('error', () => {
  ready = false;
  button.disabled = true;
  label.textContent = 'おばけを読み込めませんでした';
  loading.hidden = true;
  retry.hidden = false;
  status.textContent = '通信を確認して「もう一度読み込む」を押してください。';
});
viewer.addEventListener('ar-status', (event) => {
  if (event.detail.status === 'failed') {
    starting = false;
    updateAvailability();
    status.textContent = 'ARを開けませんでした。カメラの設定と対応端末の案内をご確認ください。';
    document.querySelector('#troubleshooting').open = true;
  }
});
button.addEventListener('click', async () => {
  if (!ready || starting || !viewer.canActivateAR) return;
  starting = true;
  updateAvailability();
  try {
    // Called directly from the user gesture to launch the OS AR viewer.
    await viewer.activateAR();
  } catch {
    status.textContent = 'ARを開けませんでした。Safari / Chromeで開き直してお試しください。';
    document.querySelector('#troubleshooting').open = true;
  } finally {
    starting = false;
    button.disabled = !viewer.canActivateAR;
    label.textContent = viewer.canActivateAR ? 'ARでおばけを呼ぶ' : '3Dのおばけを見てみよう';
  }
});
retry.addEventListener('click', () => window.location.reload());
window.addEventListener('pageshow', updateAvailability);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { starting = false; updateAvailability(); }
});
// A library/network failure must not leave a permanent unexplained loading state.
setTimeout(() => {
  if (!customElements.get('model-viewer')) {
    button.disabled = true;
    label.textContent = '3D表示を開始できませんでした';
    loading.hidden = true;
    retry.hidden = false;
    status.textContent = 'ページを再読み込みしてください。JavaScriptが有効かもご確認ください。';
  } else if (!ready) {
    status.textContent = '読み込みに時間がかかっています。通信を確認してください。';
    retry.hidden = false;
  }
}, 30000);
