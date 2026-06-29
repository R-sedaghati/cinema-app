THEME.md — ArchiveHonar Theme (Persian Cinema Edition)

Edit values in this file, then prompt Claude:

implement THEME.md changes

Only app/globals.css should be updated. Do not modify components or layouts.

⸻

Design Direction

The website should feel like a premium Persian cultural platform rather than a tech dashboard.

Keywords

* Warm
* Elegant
* Cinematic
* Premium
* Persian
* Editorial
* Soft
* Calm
* Glass
* Gold

The visual language should resemble the provided reference screenshots:

* blue-gray backgrounds
* warm amber / gold accents
* soft gradients
* frosted cards
* subtle shadows
* rounded corners
* warm typography

Avoid:

* bright reds
* neon colors
* heavy glow
* pure black
* sharp corners

⸻

1. Brand Colors

Token	Value	Notes
--background	#23353d	Main background
--foreground	#F8F3EA	Warm white
--accent	#D89A2B	Brand gold
--accent-foreground	#FFFFFF	Text on gold
--secondary-black	#344851	Card surface

⸻

2. Primary Color Scale

Replace the existing red palette with a warm amber palette.

Token	Value
--primary-50	#FFF8EB
--primary-100	#FDEBC5
--primary-200	#F8D98F
--primary-300	#F1C45E
--primary-400	#E7AE38
--primary-500	#D89A2B
--primary-600	#BF831C
--primary-700	#9B6712
--primary-800	#744A0A

⸻

3. DGS UI Kit Primary Scale (RGB)

Replace with:

Token	Value
--dgs-color-primary-50	45 35 15
--dgs-color-primary-100	65 49 20
--dgs-color-primary-200	95 69 24
--dgs-color-primary-300	130 92 30
--dgs-color-primary-400	170 118 36
--dgs-color-primary-500	216 154 43
--dgs-color-primary-600	231 180 80
--dgs-color-primary-700	241 200 120
--dgs-color-primary-800	248 220 170
--dgs-color-primary-900	255 236 205

This remains an inverted dark-mode scale.

⸻

4. DGS Gray Scale

Replace neutral gray with blue-gray.

Token	Value
--dgs-color-gray-50	24 34 40
--dgs-color-gray-100	37 49 56
--dgs-color-gray-200	54 69 78
--dgs-color-gray-300	78 95 105
--dgs-color-gray-400	110 126 137
--dgs-color-gray-500	145 160 170
--dgs-color-gray-600	190 200 206
--dgs-color-gray-700	220 226 230
--dgs-color-gray-800	240 244 246
--dgs-color-gray-900	250 251 252

⸻

5. UI Kit White Override

--dgsuikit-color-white: #344851;

This should remain a dark surface so inverted ui-kit components render correctly.

⸻

6. Shadows

Remove the strong colored glow.

Replace

0 0 50px rgb(var(--dgs-color-primary-500) / .2)

with

0 10px 30px rgb(0 0 0 / .18)

Use a secondary subtle glow

0 0 24px rgb(var(--dgs-color-primary-500) / .08)

Shadows should be soft and elegant.

⸻

7. Scrollbar

Width

10px

Thumb

#8B6D2D

Track

transparent

Radius

999px

⸻

8. Inputs

Replace the current red focus style.

Wrapper hover border

border-primary-500

Wrapper hover ring

ring-primary-500/20

Focused ring

ring-primary-500/30

Input background

#455861

Input text

text-zinc-50

Placeholder

text-zinc-400

Inputs should feel soft and premium.

⸻

9. Utility Classes

Update

bg-radial-primary

to

radial-gradient(
circle,
rgba(216,154,43,.18) 0%,
transparent 70%
)

The effect should be subtle.

⸻

10. Typography

Keep the existing Meem font.

Visual hierarchy:

Headings

* Weight 700–800

Body

* Weight 400

Buttons

* Weight 600

No font replacement is required.

⸻

11. Overall Theme Guidelines

The resulting theme should resemble the provided screenshots.

Background

Use a deep blue-gray gradient instead of solid black.

Preferred background

linear-gradient(
180deg,
#263840 0%,
#22353D 100%
)

Overlay multiple large radial gradients at 5–8% opacity to create depth.

⸻

Cards

Cards should feel like frosted glass.

Surface

#3D4F58

Border

rgba(255,255,255,.12)

Radius

28px

Avoid flat black cards.

⸻

Buttons

Buttons should use a warm gold gradient.

Gradient

linear-gradient(
135deg,
#EFBC4E 0%,
#D89A2B 100%
)

Radius

999px

Shadow

0 8px 20px rgba(216,154,43,.25)

Buttons should feel tactile without excessive glow.

⸻

Overall Feel

Target aesthetic:

* Persian cultural archive
* Museum
* Cinema
* Warm editorial design
* Luxury without looking corporate

Avoid:

* Material Design appearance
* Dashboard look
* Gaming UI
* Neon effects
* High saturation
* Pure black backgrounds
* Bright red branding

The interface should feel calm, elegant, and timeless while maintaining full compatibility with the existing DGS UI Kit and requiring changes only inside app/globals.css.