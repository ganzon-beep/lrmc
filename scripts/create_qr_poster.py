from pathlib import Path
import os

from PIL import Image, ImageDraw, ImageFont
from reportlab.graphics.barcode.qr import QrCodeWidget


ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = Path(
    "/Users/dganzon/.codex/generated_images/019fb3ea-5923-7db1-a188-0f12b442ef6c/"
    "exec-fcdab855-b2a7-45c8-be53-1022862ac836.png"
)
OUTPUT = ROOT / "output" / "qr" / "lrmc-companion-qr-poster.png"
TARGET_URL = os.environ.get("LRMC_SITE_URL", "http://localhost:5174/")

WIDTH, HEIGHT = 1080, 1350
NAVY = "#173F67"
SLATE = "#506B82"
CHARCOAL = "#161C21"
OFF_WHITE = "#FAF9F6"
COOL_GREY = "#D8DEE3"

ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def fit_background() -> Image.Image:
    source = Image.open(BACKGROUND).convert("RGB")
    target_ratio = WIDTH / HEIGHT
    source_ratio = source.width / source.height
    if source_ratio > target_ratio:
        crop_width = round(source.height * target_ratio)
        left = (source.width - crop_width) // 2
        source = source.crop((left, 0, left + crop_width, source.height))
    else:
        crop_height = round(source.width / target_ratio)
        top = (source.height - crop_height) // 2
        source = source.crop((0, top, source.width, top + crop_height))
    return source.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)


def tracking_text(draw, position, text, font, fill, spacing):
    x, y = position
    for character in text:
        draw.text((x, y), character, font=font, fill=fill)
        x += draw.textlength(character, font=font) + spacing


def make_qr(module_size=10, border=4) -> Image.Image:
    widget = QrCodeWidget(TARGET_URL, barLevel="H")
    widget.qr.make()
    modules = widget.qr.modules
    count = len(modules)
    size = (count + border * 2) * module_size
    qr = Image.new("RGB", (size, size), OFF_WHITE)
    draw = ImageDraw.Draw(qr)
    for row, values in enumerate(modules):
        for column, active in enumerate(values):
            if active:
                x0 = (column + border) * module_size
                y0 = (row + border) * module_size
                draw.rectangle((x0, y0, x0 + module_size - 1, y0 + module_size - 1), fill=NAVY)
    return qr


def main():
    canvas = fit_background()
    draw = ImageDraw.Draw(canvas)

    # A restrained frame keeps the post feeling designed without obscuring the compass.
    draw.rounded_rectangle((58, 64, 1022, 1286), radius=34, outline=COOL_GREY, width=2)
    draw.rectangle((58, 64, 76, 1286), fill=NAVY)

    eyebrow_font = ImageFont.truetype(ARIAL_BOLD, 23)
    heading_font = ImageFont.truetype(ARIAL_BOLD, 84)
    helper_font = ImageFont.truetype(ARIAL_BOLD, 22)
    url_font = ImageFont.truetype(ARIAL, 20)

    tracking_text(draw, (118, 116), "LANDSTUHL", eyebrow_font, SLATE, 7)
    draw.text((112, 173), "YOUR LRMC", font=heading_font, fill=CHARCOAL, stroke_width=0)
    draw.text((112, 254), "COMPANION", font=heading_font, fill=NAVY, stroke_width=0)
    draw.rectangle((115, 374, 348, 380), fill=NAVY)

    qr = make_qr()
    qr_x = (WIDTH - qr.width) // 2
    qr_y = 478
    draw.rounded_rectangle(
        (qr_x - 24, qr_y - 24, qr_x + qr.width + 24, qr_y + qr.height + 24),
        radius=24,
        fill=OFF_WHITE,
        outline=COOL_GREY,
        width=2,
    )
    canvas.paste(qr, (qr_x, qr_y))

    label = "SCAN TO OPEN"
    label_width = draw.textlength(label, font=helper_font)
    draw.text(((WIDTH - label_width) / 2, 1052), label, font=helper_font, fill=CHARCOAL)

    display_url = TARGET_URL.removeprefix("https://").removeprefix("http://").rstrip("/")
    url_width = draw.textlength(display_url, font=url_font)
    draw.text(((WIDTH - url_width) / 2, 1093), display_url, font=url_font, fill=SLATE)

    draw.line((114, 1171, 966, 1171), fill=COOL_GREY, width=2)
    draw.ellipse((114, 1207, 164, 1257), fill=NAVY)
    g_font = ImageFont.truetype(ARIAL_BOLD, 20)
    g_box = draw.textbbox((0, 0), "LR", font=g_font)
    g_width = g_box[2] - g_box[0]
    g_height = g_box[3] - g_box[1]
    draw.text((139 - g_width / 2, 1232 - g_height / 2 - g_box[1]), "LR", font=g_font, fill=OFF_WHITE)
    tracking_text(draw, (184, 1219), "SELFLESS SERVICE", eyebrow_font, NAVY, 3)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT, format="PNG", optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
