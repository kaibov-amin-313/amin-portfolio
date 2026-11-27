"""Turn a phone photo of a certificate into a clean flat "scan".

Usage: python scripts/scan.py <photo> <out-base> [--corners='[[x,y],[x,y],[x,y],[x,y]]']
Writes <out-base>.webp (web preview, max 1800px) and <out-base>.pdf (A4-sized page),
and prints JSON with the preview size and whether a page outline was found.
"""

import json
import sys

import cv2
import numpy as np
from PIL import Image, ImageOps

A4 = 297 / 210
MAX_LONG = 2480  # A4 long side at ~210 dpi — plenty for a certificate, keeps the PDF light
PREVIEW_LONG = 1800


def load(path):
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    return cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)


def order_corners(pts):
    pts = np.asarray(pts, dtype=np.float32)
    s, d = pts.sum(axis=1), np.diff(pts, axis=1).ravel()
    return np.array([pts[np.argmin(s)], pts[np.argmin(d)], pts[np.argmax(s)], pts[np.argmax(d)]], dtype=np.float32)


def find_page(img):
    """Largest convex quadrilateral covering a good part of the photo, in full-size coordinates."""
    h, w = img.shape[:2]
    scale = 1000 / max(h, w)
    small = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    gray = cv2.GaussianBlur(cv2.cvtColor(small, cv2.COLOR_BGR2GRAY), (5, 5), 0)
    area_min = 0.2 * small.shape[0] * small.shape[1]

    edges = cv2.dilate(cv2.Canny(gray, 40, 120), np.ones((5, 5), np.uint8), iterations=2)
    _, bright = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    best = None
    for mask in (edges, bright):
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in sorted(contours, key=cv2.contourArea, reverse=True)[:5]:
            hull = cv2.convexHull(c)
            area = cv2.contourArea(hull)
            if area < area_min:
                break
            quad = cv2.approxPolyDP(hull, 0.02 * cv2.arcLength(hull, True), True)
            if len(quad) == 4 and (best is None or area > best[0]):
                best = (area, quad.reshape(4, 2) / scale)

    if best is None:
        return None
    # The "page" is the whole frame: nothing to straighten.
    if best[0] > 0.97 * small.shape[0] * small.shape[1]:
        return None
    return order_corners(best[1])


def warp(img, corners):
    tl, tr, br, bl = corners
    width = max(np.linalg.norm(tr - tl), np.linalg.norm(br - bl))
    height = max(np.linalg.norm(bl - tl), np.linalg.norm(br - tr))
    ratio = max(width, height) / min(width, height)
    # Certificates are almost always A4: snap when the measured page is close to it.
    if abs(ratio - A4) / A4 < 0.07:
        ratio = A4
    long_side = min(max(width, height), MAX_LONG)
    short_side = long_side / ratio
    w, h = (long_side, short_side) if width >= height else (short_side, long_side)
    w, h = int(round(w)), int(round(h))
    dst = np.array([[0, 0], [w - 1, 0], [w - 1, h - 1], [0, h - 1]], dtype=np.float32)
    m = cv2.getPerspectiveTransform(corners, dst)
    page = cv2.warpPerspective(img, m, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    # Trim a hair off every edge so no sliver of the table survives a slightly loose outline.
    dx, dy = int(w * 0.01), int(h * 0.01)
    return cv2.resize(page[dy : h - dy, dx : w - dx], (w, h), interpolation=cv2.INTER_CUBIC)


def fill_map(values, valid, full_shape):
    """Smooth a coarse per-cell map, filling cells without paper from their neighbours."""
    weight = cv2.GaussianBlur(valid, (0, 0), 2)
    smooth = cv2.GaussianBlur(values * valid, (0, 0), 2) / np.maximum(weight, 1e-3)
    smooth[weight < 1e-3] = np.median(values[valid > 0]) if valid.any() else 0
    return cv2.resize(smooth, (full_shape[1], full_shape[0]), interpolation=cv2.INTER_CUBIC)


def flatten_light(img):
    """Even out shadows and colour cast using only the areas where bare paper is visible,
    so dark borders, colour bands and stamps keep their colour."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    lum, a, b = cv2.split(lab)
    paper = np.percentile(lum, 95)
    cells = (96, max(12, int(96 * lum.shape[0] / lum.shape[1])))
    shrink = lambda m: cv2.resize(m, cells, interpolation=cv2.INTER_AREA)

    # Brightest value per cell ≈ paper brightness there. A cell counts as paper when that brightest
    # tone is neutral: paper in deep shadow is dark but grey, borders and bands are saturated.
    near_max = cv2.dilate(lum, np.ones((9, 9), np.uint8))
    local_max = shrink(near_max)
    bright = (lum >= 0.92 * near_max).astype(np.float32)
    chroma = np.hypot(a - 128, b - 128)
    bright_chroma = shrink(chroma * bright) / np.maximum(shrink(bright), 1e-3)
    valid = ((local_max > 0.4 * paper) & (bright_chroma < 20)).astype(np.float32)
    gain = fill_map(paper / np.maximum(local_max, 1), valid, lum.shape)
    lum = lum * np.clip(gain, 0.8, 2.4)

    # Local colour of the paper (light, low-chroma pixels), removed per region: light under a
    # shadow is often a different colour from the rest of the sheet.
    paper_px = ((lum > 0.85 * paper) & (np.abs(a - 128) < 22) & (np.abs(b - 128) < 28)).astype(np.float32)
    share = shrink(paper_px)
    has_paper = (share > 0.15).astype(np.float32)
    a_cast = fill_map(shrink(a * paper_px) / np.maximum(share, 1e-3), has_paper, lum.shape)
    b_cast = fill_map(shrink(b * paper_px) / np.maximum(share, 1e-3), has_paper, lum.shape)
    a = 128 + (a - a_cast) * 1.12
    b = 128 + (b - b_cast) * 1.12

    # Levels: paper to white, a gentle black point so ink and stamps read crisply.
    white = np.percentile(lum, 90)
    black = min(np.percentile(lum, 0.5), 45)
    lum = np.clip((lum - black) * 255 / max(white - black, 1), 0, 255)

    # Scanner-clean paper: near-white goes to white and loses any leftover tint.
    t = np.clip((lum - 205) / 35, 0, 1)
    t = t * t * (3 - 2 * t)
    lum = lum + (255 - lum) * t
    a = 128 + (a - 128) * (1 - 0.9 * t)
    b = 128 + (b - 128) * (1 - 0.9 * t)

    out = cv2.merge([lum, np.clip(a, 0, 255), np.clip(b, 0, 255)]).astype(np.uint8)
    return cv2.cvtColor(out, cv2.COLOR_LAB2BGR)


def finish(img):
    img = cv2.fastNlMeansDenoisingColored(img, None, 3, 3, 7, 21)
    soft = cv2.GaussianBlur(img, (0, 0), 1.1)
    return cv2.addWeighted(img, 1.45, soft, -0.45, 0)


def main():
    src, out_base = sys.argv[1], sys.argv[2]
    corners_arg = next((a.split("=", 1)[1] for a in sys.argv[3:] if a.startswith("--corners=")), None)

    img = load(src)
    corners = order_corners(json.loads(corners_arg)) if corners_arg else find_page(img)
    page = warp(img, corners) if corners is not None else img
    if corners is None and max(page.shape[:2]) > MAX_LONG:
        f = MAX_LONG / max(page.shape[:2])
        page = cv2.resize(page, None, fx=f, fy=f, interpolation=cv2.INTER_AREA)
    page = finish(flatten_light(page))

    rgb = Image.fromarray(cv2.cvtColor(page, cv2.COLOR_BGR2RGB))
    long_px = max(rgb.size)
    # Page size in the PDF = A4 (11.69 in on the long side).
    rgb.save(f"{out_base}.pdf", "PDF", resolution=long_px / 11.69, quality=88)
    preview = rgb.copy()
    preview.thumbnail((PREVIEW_LONG, PREVIEW_LONG), Image.LANCZOS)
    preview.save(f"{out_base}.webp", "WEBP", quality=84, method=6)
    print(json.dumps({"width": preview.width, "height": preview.height, "found_page": corners is not None}))


if __name__ == "__main__":
    main()
