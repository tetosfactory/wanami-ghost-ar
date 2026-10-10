"""Generate printable QR after the actual HTTPS Pages URL has been verified."""
import argparse, pathlib, sys, urllib.request
sys.path.insert(0, str(pathlib.Path(__file__).parent / 'qr-runtime'))
import qrcode
from qrcode.image.svg import SvgPathImage

parser=argparse.ArgumentParser()
parser.add_argument('url',help='Actual, deployed HTTPS app URL (not a repository URL)')
args=parser.parse_args()
if not args.url.startswith('https://') or args.url.startswith('https://github.com/'):
    parser.error('Use the HTTPS published app URL, not the repository URL.')
with urllib.request.urlopen(args.url, timeout=30) as response:
    html=response.read().decode('utf-8')
    if response.status != 200 or 'id="ghost"' not in html:
        raise RuntimeError('The deployed AR page could not be verified.')
out=pathlib.Path(__file__).parent.parent/'qr-output'
out.mkdir(exist_ok=True)
qr=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,box_size=24,border=4)
qr.add_data(args.url)
qr.make(fit=True)
qr.make_image().save(out/'wanami-ghost-ar-qr.png')
qr.make_image(image_factory=SvgPathImage).save(out/'wanami-ghost-ar-qr.svg')
(out/'URL.txt').write_text(args.url+'\n',encoding='utf-8')
print('QR_READY',out)
