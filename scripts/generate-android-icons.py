#!/usr/bin/env python3
"""Generate Android launcher icons from the ArchiveHonar logo."""

from __future__ import annotations

import base64
import re
import struct
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow is required. Install with: pip install pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
LOGO_SVG = ROOT / "public" / "assets" / "images" / "logo.svg"
LOGO_SOURCE = ROOT / "assets" / "logo-source.png"
ICON_SOURCE = ROOT / "assets" / "icon.png"
ANDROID_RES = ROOT / "android" / "app" / "src" / "main" / "res"

LAUNCHER_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FOREGROUND_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}


def extract_logo_from_svg() -> Image.Image:
    content = LOGO_SVG.read_text(encoding="utf-8")
    match = re.search(r'xlink:href="data:image/png;base64,([^"]+)"', content)
    if not match:
        raise RuntimeError(f"No embedded PNG found in {LOGO_SVG}")

    png_data = base64.b64decode(match.group(1))
    LOGO_SOURCE.parent.mkdir(parents=True, exist_ok=True)
    LOGO_SOURCE.write_bytes(png_data)
    return Image.open(LOGO_SOURCE).convert("RGBA")


def load_logo() -> Image.Image:
    if LOGO_SOURCE.exists():
        return Image.open(LOGO_SOURCE).convert("RGBA")
    return extract_logo_from_svg()


def fit_logo(
    logo: Image.Image,
    size: int,
    padding_ratio: float,
    background: tuple[int, ...] | None,
) -> Image.Image:
    if background is None:
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    else:
        canvas = Image.new("RGBA", (size, size), background)

    padding = int(size * padding_ratio)
    max_w = size - 2 * padding
    max_h = size - 2 * padding
    scale = min(max_w / logo.width, max_h / logo.height)
    new_w = int(logo.width * scale)
    new_h = int(logo.height * scale)
    resized = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def write_icon_source(logo: Image.Image) -> None:
    icon = fit_logo(logo, 1024, 0.15, (255, 255, 255, 255)).convert("RGB")
    ICON_SOURCE.parent.mkdir(parents=True, exist_ok=True)
    icon.save(ICON_SOURCE, "PNG")


def main() -> None:
    if not LOGO_SVG.exists() and not LOGO_SOURCE.exists():
        print("Missing logo source. Expected logo.svg or assets/logo-source.png.", file=sys.stderr)
        sys.exit(1)

    logo = load_logo()
    write_icon_source(logo)

    for folder, size in LAUNCHER_SIZES.items():
        out_dir = ANDROID_RES / folder
        out_dir.mkdir(parents=True, exist_ok=True)
        img = fit_logo(logo, size, 0.1, (255, 255, 255, 255)).convert("RGB")
        img.save(out_dir / "ic_launcher.png", "PNG")
        img.save(out_dir / "ic_launcher_round.png", "PNG")
        print(f"Wrote {folder}/ic_launcher.png ({size}x{size})")

    for folder, size in FOREGROUND_SIZES.items():
        out_dir = ANDROID_RES / folder
        fg = fit_logo(logo, size, 0.15, None)
        fg.save(out_dir / "ic_launcher_foreground.png", "PNG")
        print(f"Wrote {folder}/ic_launcher_foreground.png ({size}x{size})")

    print("Android icons generated successfully.")


if __name__ == "__main__":
    main()
