# ArchiveHonar API Reference

Base URL: configure per environment. All paths below are relative to the API root.

**Auth header:** `Authorization: Bearer <token>`

---

## Standard Response Envelope

```ts
interface ApiResponse<T> {
  message: string | null;
  result?: T;           // present when data exists
  errors?: unknown;     // present on error
  // pagination (when paginated)
  count?: number;
  next?: string | null;
  previous?: string | null;
}
```

---

## Enums

```ts
enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}

enum PortfolioType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

// CRM pipeline stage. Independent of ArtistRequestStatus: that one drives payment and
// publication, this one only tracks how far an admin has got with the applicant.
enum CrmStage {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  AWAITING_DOCS = "AWAITING_DOCS",
  NEGOTIATING = "NEGOTIATING",
  WON = "WON",
  LOST = "LOST",
}

enum CrmNoteChannel {
  INTERNAL = "INTERNAL",  // admin-only
  SMS = "SMS",            // also texted to the applicant
}

// Pipeline events that can fire an automated SMS. Closed set — the backend owns the
// trigger points, the admin owns only the text and the on/off switch of each row.
enum SmsEvent {
  FORM_SUBMITTED  = "FORM_SUBMITTED",   // applicant completed and submitted the registration form
  NEED_REVISION   = "NEED_REVISION",    // admin moved the request to NEED_TO_REVISION
  APPROVED        = "APPROVED",         // admin approved / published the request
  REJECTED        = "REJECTED",         // admin rejected the request
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED  = "PAYMENT_FAILED",
  SUPPORT_REPLY   = "SUPPORT_REPLY",    // admin replied to a support ticket (vars: subject, ticketId)
}

// Named validations an admin picks in the form-builder; enforced on submit by the API
// (backend/utils/fieldValidation.ts) and mirrored client-side for instant feedback.
enum ValidationPreset {
  MOBILE = "MOBILE",               // 09xxxxxxxxx
  LANDLINE = "LANDLINE",
  NATIONAL_CODE = "NATIONAL_CODE", // 10 digits + mod-11 checksum
  POSTAL_CODE = "POSTAL_CODE",     // 10 digits
  EMAIL = "EMAIL",
  IBAN = "IBAN",                   // IR + 24 digits
  URL = "URL",
}

enum ArtistRequestStatus {
  PENDING = "PENDING",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NEED_TO_REVISION = "NEED_TO_REVISION",
}

enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

enum SupportStatus {
  OPEN = "OPEN",           // waiting on an admin (new, or the user replied last)
  ANSWERED = "ANSWERED",   // an admin replied last
  CLOSED = "CLOSED",       // closed by an admin; the user can no longer reply
}

enum FormFieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  SELECT = "SELECT",
  SELECT_PROVINCE = "SELECT_PROVINCE",   // options served by GET /provinces
  SELECT_CITY = "SELECT_CITY",           // options served by GET /provinces/:id/cities
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  BOOLEAN = "BOOLEAN",   // single checkbox, answer is true/false
  DATE = "DATE",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
```

---

## Types

```ts
interface User {
  id: number;
  phone_number: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  nationalCode?: string;     // 10 digits, mod-11 checksum. Never in public responses.
  avatar?: string | null;    // presigned URL
  code?: string;             // auto-generated sequential code
  lastLogin?: string;        // ISO datetime
  // Values of admin-added profile fields (see ProfileField), keyed by ProfileField.key.
  profileData?: Record<string, unknown>;
  // GET /user/profile only. End of the yearly subscription (ISO); null = never paid.
  // Every form submits free while it runs. Once past, the artist stays public;
  // POST /user/subscription/purchase/ renews it (+1 year, stacked onto any time left).
  subscriptionExpiresAt?: string | null;
}

interface Category {
  id: number;
  faName: string;
  enName: string;
  parent?: Category | null;
  children?: Category[];
}

interface FormField {
  id: number;
  key: string;               // storage key inside ArtistRequest.answers
  label: string;
  type: FormFieldType;
  placeholder?: string | null;
  helpText?: string | null;   // hint rendered under the input
  required: boolean;
  order: number;
  options?: { label: string; value: string }[] | null;
  validation?: { preset?: ValidationPreset; min?: number; max?: number; minLength?: number; maxLength?: number; pattern?: string } | null;
  isPrivate: boolean;        // stripped publicly, served by the contact endpoint after approval
}

interface FormStep {
  id: number;
  title: string;
  description?: string | null;   // copy under the step title
  order: number;
  icon?: string | null;
  fields: FormField[];
}

interface Portfolio {
  id: number;
  type: PortfolioType;
  filePath: string;
  url: string | null;        // presigned URL
}

interface RejectedReason {
  id: number;
  reason: string;
  createdAt: string;
}

interface ArtistRequest {
  id: number;
  status: ArtistRequestStatus;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
  categories: Pick<Category, "id" | "faName" | "enName">[];
  portfolios: Portfolio[];
  user: User;
  answers: Record<string, unknown>;    // dynamic fields, keyed by FormField.key
  rejectedReasons?: RejectedReason[];  // admin view only
}

interface Support {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  phoneNumber?: string;
  status: SupportStatus;
  category?: Category;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface AboutUs {
  id: number;
  text: string;
  fontSize: number | null; // px override for the about text; null = use the default size
  color: string | null;    // #rrggbb text color; null = use the default color
}

interface Payment {
  id: number;
  amount: number;
  paymentGateway: string;
  paymentId: string;
  status: PaymentStatus;
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  titleFontSize: number | null; // px override for the title; null = use the default size
  subtitleFontSize: number | null; // px override for the subtitle; null = use the default size
  ctaLabelFontSize: number | null; // px override for the CTA label; null = use the default size
  titleColor: string | null;       // #rrggbb; null = default color (same for the two below)
  subtitleColor: string | null;
  ctaLabelColor: string | null;
  image: string; // full public URL on read; storage path on write (see POST /admin/upload/image)
  ctaLabel: string;
  ctaLink: string;
  priority: number; // ascending sort key
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Tutorial {
  id: number;
  title: string;
  content: string;
  videoUrl: string; // Aparat embed URL, e.g. https://www.aparat.com/video/video/embed/videohash/{hash}/vt/frame
  thumbnail: string | null; // full public URL on read; storage path on write (see POST /admin/upload/image)
  priority: number; // ascending sort key
  isActive: boolean;
  isMain: boolean; // if true, rendered as the featured video on the homepage; at most one tutorial can be main
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

---

## Common Endpoints (no auth)

### `GET /categories/`
List the main categories with their subcategories, both sorted by `priority` ascending
(never-ordered rows, whose `priority` is null, come last). Admins set that order in
«صفحه‌ساز صفحه ثبت‌نام» or on a category's own page.

**Response:** `ApiResponse<Category[]>`

**Paginated, and not the way the envelope suggests:** the server pages over the flat
category rows (main + sub) but answers with only the main categories inside that slice,
so `count` is not the total, `next` is always `null`, and a main category whose
subcategories straddle a page boundary comes back on both pages. `count=100` currently
spreads the 17 forms over pages 1–3. Clients must read until a page adds nothing new and
merge repeats by id — `fetchAllCategoryPages` in `lib/services/categoryPages.ts`.

---

### `GET /artists-requests/`
List approved artist requests (public). Sensitive user fields excluded.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| category | number | Filter by category ID |
| search | string | Search by category name |
| sort | string | Sort field |
| page | number | Page number |

**Response:** `ApiResponse<ArtistRequest[]>`

---

### `GET /artists-requests/:id/`
Get single approved artist request.

**Response:** `ApiResponse<ArtistRequest>`

---

### `GET /provinces`
List all provinces.

**Response:** `ApiResponse<{ id: number; name: string }[]>`

---

### `GET /provinces/:id/cities`
List cities in a province.

**Response:** `ApiResponse<{ id: number; name: string }[]>`

---

### `GET /cities/search`
Search cities by name.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | Search term |

**Response:** `ApiResponse<{ id: number; name: string }[]>`

---

### `GET /cities/:id`
Get city by ID.

**Response:** `ApiResponse<{ id: number; name: string }>`

---

### `GET /faqs/`
List FAQs.

**Response:** `ApiResponse<FAQ[]>`

---

### `GET /about-us/`
Get about-us content.

**Response:** `ApiResponse<AboutUs>`

---

### `GET /site-content/`
Get site-wide editable copy (about-page benefit cards, support-page copy, terms/privacy page). Single row, no auth.

**Response:** `ApiResponse<SiteContent>` where:
```ts
interface SiteContent {
  id: 1;
  // every `fontSize` is a px override; null/absent = use the default size
  // every `color` is a `#rrggbb` text color; null/absent = use the default color
  benefits: { items: { title: string; desc: string }[]; fontSize?: number | null; color?: string | null }; // exactly 3, fixed order (mission, vision, responsibility)
  support: {
    title: string;
    description: string;
    items: { title: string; detail: string; footerText: string; buttonValue: string }[]; // exactly 3, fixed order (phone, email, telegram)
    fontSize?: number | null;
    color?: string | null;
  };
  terms: { title: string; content: string; fontSize?: number | null; color?: string | null };
  // site-wide footer; null/absent = the frontend defaults in `lib/constants/footer.ts`
  footer?: {
    phone: string;         // support number, displayed as typed (Persian digits ok)
    instagramUrl: string;  // href of the Instagram icon
    copyright: string;     // bottom line of the footer
    enamadId?: string;     // Enamad trust seal id; seal shown only when both id and code are set
    enamadCode?: string;   // Enamad trust seal Code
  } | null;
  // overrides for the public-site copy (hero, statistics, "why", homepage
  // sections, artists search, page titles), keyed by the frontend LANDING_COPY
  // registry in `lib/constants/landingCopy.ts`. Missing keys fall back to the
  // defaults, so this may be `{}` or absent. Per-key style overrides ride in the
  // same map as suffixed keys: `"<key>@size": "18"` (px, 8–120) and
  // `"<key>@color": "#rrggbb"`; empty/absent = default styling. Same for `form`.
  landing?: Record<string, string> | null;
  // home-page section order, visibility and layout variant, set in the admin
  // page-builder. Keyed by the frontend catalog in `lib/constants/homeSections.ts`;
  // empty/absent = the shipped catalog order. Optional size overrides, all
  // integers in px (40–2000), absent = default: fixed `width`/`height` and
  // `maxWidth`/`minHeight` of the section, `cardWidth`/`cardHeight` of its cards. Inner spacing `paddingTop`/`paddingBottom`/`paddingX`
  // is px 0–200 (0 kept). Must be stored as sent.
  // `background`: section bg color, strict `#rrggbb` (anything else dropped); absent = transparent.
  // `backgroundImage`: bare storage path on write (from `POST /admin/upload/image`), public URL on read;
  // `backgroundOverlay`: 0–90 % black over it (absent = 50), kept only with an image.
  // `styles`: per-element overrides, `{ "title-size": "24", "title-size-md": "40", "item-bg": "#1a1a1a", "align": "center" }`.
  // Keys kebab-case (`-md` suffix = desktop ≥768px), values `#rrggbb` | unsigned integer | `start|center|end`;
  // anything else dropped. Which keys a section reads is the frontend catalog (`lib/constants/homeSections.ts`).
  homeSections?: { key: string; hidden: boolean; variant?: string; width?: number; height?: number; maxWidth?: number; minHeight?: number; cardWidth?: number; cardHeight?: number; paddingTop?: number; paddingBottom?: number; paddingX?: number; background?: string; backgroundImage?: string; backgroundOverlay?: number; styles?: Record<string, string> }[] | null;
  // same, for the artist-registration page, keyed by
  // `lib/constants/registrationSections.ts` and set in `/admin/registration-builder`.
  registrationSections?: { key: string; hidden: boolean; variant?: string; width?: number; height?: number; maxWidth?: number; minHeight?: number; cardWidth?: number; cardHeight?: number; paddingTop?: number; paddingBottom?: number; paddingX?: number; background?: string; backgroundImage?: string; backgroundOverlay?: number; styles?: Record<string, string> }[] | null;
  // per-page backgrounds, set in `/admin/page-backgrounds`. Keyed by the frontend
  // catalog `lib/constants/pageBackgrounds.ts` (first path segment, `home` for `/`,
  // `default` for every page without its own entry). `color` is `#rrggbb`; `image`
  // is a storage path on write (from `/admin/upload/image`), full URL on read;
  // `overlay` is 0–90 (% black over the image). Entries with neither are dropped.
  pageBackgrounds?: Record<string, { color?: string; image?: string; overlay?: number }> | null;
  // per-page content box, same keys as `pageBackgrounds`, set in `/admin/page-backgrounds`.
  // `default` is the base each page merges over field by field. All integers in px:
  // `maxWidth` 320–2400, the rest 0–200. `*Desktop` applies from 768px up (else the
  // mobile value holds). Absent = the page's shipped layout. Empty entries are dropped.
  pageLayouts?: Record<string, {
    maxWidth?: number;
    paddingX?: number; paddingXDesktop?: number;
    paddingTop?: number; paddingTopDesktop?: number;
    paddingBottom?: number; paddingBottomDesktop?: number;
    gap?: number; gapDesktop?: number;   // space between the page's stacked blocks
  }> | null;
  // site-wide table colors, set in `/admin/page-backgrounds`. Each `#rrggbb`; unknown
  // keys and non-hex values are dropped. Absent key = theme default.
  tableColors?: { headerBg?: string; headerText?: string; rowBg?: string; rowText?: string; border?: string } | null;
  uploadLimits: { imageMb: number; videoMb: number }; // per-file caps in MB (defaults 10/100, max 200); enforced by /user/avatar and /user/upload/* (413 when exceeded)
  // Admin-uploaded logo/favicon: public URLs on read, storage paths on write (upload via
  // POST /admin/upload/image). Absent key = shipped `/assets/images/logo.svg` / `/favicon-default.ico`.
  branding: { logo?: string; favicon?: string };
  // field definition of the support contact form; null/absent = the default
  // form in `lib/constants/contactForm.ts`
  contactForm?: {
    title: string;
    submitLabel: string;
    fields: {
      key: string;         // a built-in key (firstName, lastName, email, phoneNumber,
                           // category, subCategory, subject, message) or any custom id
      label: string;
      type: FormFieldType;
      placeholder?: string | null;
      helpText?: string | null;
      required: boolean;
      options?: { label: string; value: string }[] | null;
      validation?: { preset?: ValidationPreset; min?: number; max?: number; minLength?: number; maxLength?: number; pattern?: string } | null;
    }[];
  } | null;
  // same shape as contactForm, for the resume-request form; every key is free-form and
  // answers are stored whole on the request. null/absent/empty fields = the default in
  // `lib/constants/resumeRequestForm.ts` (mirrored by backend `services/resumeRequest.ts`)
  // `guestMode` = requests without login (no OTP); `persist` on a field = remembered in the
  // guest's browser for the next request.
  resumeRequestForm?: { title: string; submitLabel: string; guestMode?: boolean; fields: (ContactFormField & { persist?: boolean })[] } | null;
}
```

---

### `GET /banners/`
List active banners for the homepage hero slider. Only returns rows where `isActive = true`, sorted by `priority` ascending.

**Response:** `ApiResponse<Banner[]>`

---

### `GET /tutorials/`
List active tutorials. Only returns rows where `isActive = true`, sorted by `priority` ascending.

**Response:** `ApiResponse<Tutorial[]>`

---

## User Endpoints (prefix: `/user`)

### `POST /user/login/`
OTP-based login. Two-step flow.

**Step 1 — send OTP** (omit `code`):
```json
{ "phone_number": "09..." }
```
**Step 2 — verify OTP**:
```json
{ "phone_number": "09...", "code": "12345" }
```

**Step 2 Response:**
```ts
ApiResponse<{
  type: "user";
  id: number;
  phone_number: string;
  accessToken: string;
}>
```

**Limits** (per phone, 5-min window): step 1 over `OTP_RATE_LIMIT_ATTEMPTS` sends → **429**
«کد ورود قبلا ارسال شده است» (code still live — client jumps to the OTP step). Step 2 allows
5 attempts, then **400**. The two counters are separate.

---

### `GET /user/`
List all users (no auth required).

**Response:** `ApiResponse<Pick<User, "id" | "phone_number" | "avatar" | "lastLogin">[]>`

---

### `GET /profile-fields/`
Visible account profile fields, in display order — what the profile page and the
post-login completion drawer render. No auth.

**Response:** `ApiResponse<ProfileField[]>`

```ts
interface ProfileField {
  id: number;
  key: string;              // builtin: users column name; custom: profileData key. Immutable.
  label: string;
  type: FormFieldType;
  placeholder: string | null;
  helpText: string | null;
  required: boolean;
  order: number;
  options: { label: string; value: string }[] | null;
  validation: FormFieldValidation | null;
  multiple: boolean;
  builtin: boolean;         // avatar, firstName, lastName, email, nationalCode — never deleted
  hidden: boolean;          // always false here; admins can hide fields
}
```

---

### `GET /user/profile/`
Get own profile. **Auth required.**

**Response:** `Pick<User, "id" | "phone_number" | "avatar" | "lastLogin" | "firstName" | "lastName" | "email" | "nationalCode" | "profileData" | "subscriptionExpiresAt">`

Note: this endpoint returns the object directly, **not** wrapped in `ApiResponse`.

---

### `PATCH /user/profile/`
Update own profile. **Auth required.**

**Body:** `{ [profileFieldKey]: value }` — keys are the visible `ProfileField` keys from
`GET /profile-fields/`. Builtin keys (`firstName`, `lastName`, `email`, `nationalCode`) write
the `users` column; custom keys write `profileData`. Unknown and hidden keys are ignored, as
is `avatar` (set by `POST /user/avatar`).

Keys missing from the body are left untouched; an empty value clears the field. Each value
runs through its field's validation (type, options, preset, min/max, pattern);
`nationalCode` is always checksummed. After applying, every visible required field
(except `avatar`) must be non-empty — otherwise `400` `"<label> الزامی است"`.

**Response:** `ApiResponse<User>`

---

### `POST /user/avatar`
Upload user avatar. **Auth required.** `multipart/form-data`

**Form field:** `file` (image)

Sets the account's profile picture — the headshot every resume of this user shows
(`ArtistRequest.user.avatar`). Non-`image/*` files are a `400`. Each upload gets a fresh
key, so a new picture is never masked by a cached old one.

**Response:**
```json
{ "path": "users/{id}/avatar-{uuid}.{ext}", "url": "https://storage.archivehonar.ir/users/{id}/avatar-{uuid}.{ext}" }
```

---

### `POST /user/upload/video`
Upload a video. **Auth required.** `multipart/form-data`

**Form field:** `file` (video)

**Response:**
```json
{ "path": "users/{id}/videos/{uuid}.{ext}", "filename": "{uuid}.{ext}" }
```

---

### `POST /user/artist-requests`
Create an artist request. **Auth required.**

Fields are dynamic — driven by the `FormStep`/`FormField` schema defined per top-level
category in the admin panel. Fetch the schema first via `GET /categories/:id/form-schema/`
to know which keys/types/required-ness apply to the selected category.

**One form per account per top-level category.** An account (one phone number, one
account) that already has a request in the selected category — filed under it or under
any of its children — gets `409` with «شما قبلاً در این دسته‌بندی فرم ثبت کرده‌اید.».

**Pay first, then save:** without a running yearly subscription the request is refused
with `402` and nothing is stored — buy it via `POST /user/subscription/purchase/` first.
Accepted requests always start `PENDING`.
Every status counts, `REJECTED` included; a request needing changes is edited via
`PATCH /user/artist-requests/:id/`, never re-submitted here. The check runs inside the
create transaction, under the write lock on the user row, so parallel submissions cannot
both pass it.

**Body:**
```ts
{
  categoryIds: number[];                 // required
  answers: Record<string, unknown>;      // keyed by FormField.key
  portfolios?: { path: string; type: PortfolioType }[];
  sampleType?: ESampleType;
}
```

SELECT/RADIO/CHECKBOX answers must be option `value`s of the field (each picked value for
CHECKBOX); anything else is `400`. `PATCH` below applies the same required-field and
validation checks to the answers it receives.

**Response (201):**
```ts
ApiResponse<{
  artistRequestId: number;
  status: ArtistRequestStatus;
  portfolios: { id: number; filePath: string; type: PortfolioType }[];
}>
```

---

### `GET /user/artist-requests`
List own artist requests. **Auth required.**

**Query params:** `page`, `count`

**Response:** `ApiResponse<ArtistRequest[]>` + pagination

---

### `GET /user/artist-requests/:id/`
Retrieve one of the caller's own artist requests, whatever its status. **Auth required.**

Same payload shape as the public `GET /artists-requests/:id/`, but nothing is stripped:
identity answers (`fullName`, `email`, `nationalCode`, `postalCode`, ...) and the full
`user` object are all present, because the caller owns them. Someone else's request answers
`404`, not `403`. This — not the public route — is what an edit form hydrates from: `PATCH`
below overwrites `answers` wholesale, so hydrating from a stripped payload would delete the
missing keys.

**Response (200):** `ApiResponse<ArtistRequest>` (`answers` complete, `portfolios[]` carry
both `filePath` and a presigned `url`)

---

### `PATCH /user/artist-requests/:id/`
Update own artist request. **Auth required.**

**Body:** same shape as create (all optional). `answers` overwrites wholesale if provided. `portfolios` array replaces existing if provided.

Resubmitting a `NEED_TO_REVISION` request moves it back to `PENDING`, but only inside a
running subscription — otherwise `402` and nothing changes (renew, then resend).

**Response (200):**
```ts
ApiResponse<{
  artistRequestId: number;
  status: ArtistRequestStatus;
  portfolios: { id: number; filePath: string; type: PortfolioType; fieldKey: string | null }[];
}>
```

---

### `GET /categories/:id/form-schema/`
Fetch the dynamic step/field schema for a category. No auth. Resolves child categories to
their top-level parent's schema (only top-level categories own a schema).

Auth is optional and only changes `registrationAmount`, which is the **yearly subscription
price** (`PaymentSetting.subscriptionPrice`, falling back to `REGISTRATION_AMOUNT`): a caller
with a running subscription gets `0` (submit directly). Anonymous callers see the price.
Categories no longer carry a price.

**Response:**
```ts
ApiResponse<{
  steps: {
    id: number;
    title: string;
    description: string | null;
    order: number;
    icon: string | null;
    fields: {
      id: number;
      key: string;
      label: string;
      type: "TEXT" | "TEXTAREA" | "NUMBER" | "SELECT" | "SELECT_PROVINCE" | "SELECT_CITY" | "RADIO" | "CHECKBOX" | "BOOLEAN" | "DATE" | "IMAGE" | "VIDEO";
      placeholder: string | null;
      helpText: string | null;
      required: boolean;
      order: number;
      options: { label: string; value: string }[] | null;
      validation: { preset?: ValidationPreset; min?: number; max?: number; minLength?: number; maxLength?: number; pattern?: string } | null;
      isPrivate: boolean;
    }[];
  }[];
  // overrides for the form's fixed copy (button labels, step counter, payment
  // block, validation messages ...), keyed by the frontend FORM_COPY registry
  // in `lib/constants/formCopy.ts`. Missing keys fall back to the defaults.
  formCopy: Record<string, string>;
}>
```

---

### `GET /user/messages/`
The caller's message inbox, newest first. One row is written here for every message the
system sends the user — both an automated `SmsEvent` send and an admin's `CrmNote` with
`channel: "SMS"` — so the inbox is complete by construction rather than by an admin
remembering to post the text twice.

| Query param | Type | Description |
|-------------|------|-------------|
| page | number | Page number |
| count | number | Items per page |

**Response:** `ApiResponse<UserMessage[]>` + pagination
```ts
{
  id: number;
  body: string;                    // already rendered — placeholders substituted at send time
  event: SmsEvent | null;          // null when an admin typed the message
  artistRequestId: number | null;  // the request the message is about, when there is one
  readAt: string | null;
  createdAt: string;
}
```

---

### `PATCH /user/messages/:id/`
Mark one message read. Idempotent — re-sending on an already-read message keeps the original
`readAt`.

**Body:**
```ts
{ read: true }
```

**Response:** `ApiResponse<UserMessage>`
404 when the message does not belong to the caller (deliberately not 403 — a stranger's
message id should not be confirmable).

---

### `GET /user/badge-counts/`
Badge numbers for the site header and profile menu.

**Response:** `ApiResponse<{ messages: number; forms: number }>`

`messages` = unread inbox messages, `forms` = the caller's artist requests in `NEED_TO_REVISION`.

---

### `POST /user/supports/`
Create a support ticket. Auth **optional**: with a valid user token the ticket is linked
to the account (`user_id`), missing name/email are filled from the profile, and the
account's phone replaces `phoneNumber`. Without a token (or with an invalid one) it is an
anonymous public-form ticket. `subject` and `message` are required (400 otherwise).

The form is admin-defined (`SiteContent.contactForm`). Fields whose key is one of
the built-ins below map to the columns; answers to admin-added fields are appended
to `message` as `label: value` lines, since there is no free-form answers column.

**Body:**
```ts
{
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  phoneNumber?: string;
  categoryId?: number;
}
```

**Response:** `ApiResponse<Support>`

---

### `GET /user/supports/`
List own support tickets, newest first. **Auth required.**

"Own" = linked to the caller's account, plus legacy tickets with no account whose
`phoneNumber` matches the caller. A public-form ticket that is linked to nobody no longer
leaks into a stranger's list once any account claims it.

**Query params:** `page`, `count`

**Response:** `ApiResponse<Support[]>` + pagination

---

### `GET /user/supports/:id/`
One own ticket with its thread. **Auth required.** 404 for a stranger's ticket.

**Response:** `ApiResponse<Support & { userId: number | null; messages: SupportMessage[] }>`

```ts
type SupportMessage = {
  id: number;
  body: string;
  createdAt: string;
  admin: { id: number; firstName: string | null; lastName: string | null } | null; // null = the user
};
```

`message` on the ticket is the opening post; `messages` are the replies, oldest first.

---

### `POST /user/supports/:id/messages/`
Reply to an own ticket. **Auth required.**

**Body:** `{ body: string }`

Status becomes `OPEN`; admins are notified (`SUPPORT_TICKET`). A legacy phone-matched
ticket gets linked to the replying account. 400 when `body` is empty or the ticket is
`CLOSED`; 404 when not own.

**Response:** `ApiResponse<SupportMessage>` (201)

---

### `POST /user/subscription/purchase/`
Buy (or renew) the yearly subscription — returns the gateway URL. **Auth required.**

**Query params:** `categoryId` (optional) — only carried to the result page for its copy.

The price is server-side only (`PaymentSetting.subscriptionPrice`, else
`REGISTRATION_AMOUNT`). The wallet pays first; if it covers everything (or the price is 0)
a `COMPLETED` payment is recorded, the subscription extends by a year and `redirectUrl`
comes back `null`. `400` if the subscription is already active.

The payment carries `user` and no artist request: the form is not saved yet. The client
keeps the answers in localStorage and submits `POST /user/artist-requests` (or the
revision `PATCH`) from the result page once the payment has settled. Those payments are
therefore never refunded by a later rejection/revision.

**Response:** `{ "result": { "redirectUrl": "https://sep.shaparak.ir/...|null" } }`

---

### `ALL /user/subscription/callback/`
SEP callback for the above. No auth. Same settlement rules as `/user/purchase/callback/`
(token picks the payment, RefNum claimed then verified). Redirects to
`/artist-registration/result?status=success|failed&kind=subscription&categoryId=…`.

---

### `GET /user/purchase/`
**Legacy.** Pays for a request saved as `PENDING_PAYMENT` before subscriptions moved ahead
of the form. Charges the yearly subscription price. **Auth required.**

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| requestId | number | Artist request ID |

The amount is the yearly subscription price, or `0` inside a running subscription. A
client-supplied `amount` is ignored.

When the resolved amount is `0`: a `COMPLETED` payment is recorded,
the request moves to `PENDING`, and `redirectUrl` comes back `null` — there is no
gateway stop to make, so the client goes straight to the result page. The wallet
covering the whole fee settles the same way.

**Response:**
```json
{ "result": { "redirectUrl": "https://sep.shaparak.ir/OnlinePG/OnlinePG?Token=...&GetMethod=true|null" } }
```

The client fetches this over XHR rather than navigating at it, because the route
requires the `Authorization` header.

Only a request in `PENDING_PAYMENT` (or `NEED_TO_REVISION`, for the revision re-pay) can be
paid; any other status gets `400`. A failed attempt leaves the request `PENDING_PAYMENT`, so
calling this again is how the client retries the payment.

---

### `ALL /user/purchase/callback/`
SEP payment callback (internal, called by gateway). No auth.

SEP returns the result as a **urlencoded form POST**, not a query string — `State`,
`Status`, `RefNum`, `ResNum`, `TraceNo`, `Amount`, `SecurePan`. The leg counts as settled
only when `State` is `OK` and a `RefNum` is present; the server then calls SEP's
`verifyTransaction` and rejects the payment unless the amount it settled matches what was
charged.

It then redirects the browser to `/artist-registration/result?status=success|failed&categoryId=…&requestId=…`.
The fail page uses `requestId` to retry the payment.

---

## Resume requests

An artist's contact fields are unlocked per viewer by an admin-approved request. They are
served only by `GET /user/artists-requests/:id/contact/`, and only to a caller who owns an
`APPROVED` `ContactRequest` for that artist (or is the artist). Every other endpoint strips
them: answers to fields marked `isPrivate` in the form builder, portfolios uploaded through
those fields, and the user's name/phone/email/national code. Private fields are also
never filters or search targets.

Requests are free. `status` is `PENDING` → `APPROVED` (requester gets the
`RESUME_REQUEST_APPROVED` SMS) or `REJECTED` (silent; the viewer may request again).
Rows from the paid era were migrated: `COMPLETED` → `APPROVED`, everything else →
`REJECTED`.

### `POST /user/artists-requests/:id/contact-requests/`
Request an artist's resume. **Auth required.**

**Body:** `{ answers: Record<string, unknown> }` — answers to `SiteContent.resumeRequestForm`
(or the default fields `firstName`, `lastName`, `organization`, `reason` while the admin has
not customised it). Unknown keys are dropped; required + validation rules are enforced
server-side. `requesterName` is taken from `firstName`/`lastName`, else the account name.

**Response:** `201 ApiResponse<{ id, trackingCode, status }>`

**400** invalid answers (`errors: string[]`) · **404** artist not approved ·
**409** a `PENDING` or `APPROVED` request for this artist already exists.

---

### `GET /user/artists-requests/:id/contact/`
The unlocked payload: `firstName`, `lastName`, `phoneNumber`, `email`, `address`,
`postalCode`, plus `fields: { key, label, type, options, value }[]` — every non-empty
answer to a field marked `isPrivate` in the artist's form (IMAGE/VIDEO `value` is a list
of file URLs). **Auth required.**

**403** unless the caller owns an `APPROVED` `ContactRequest` for this artist or is the
artist themselves.

---

### Guest (no-OTP) mode

On when `SiteContent.resumeRequestForm.guestMode` is `true` (admin switch in the form
editor). Visitors without an account request by filling the form; logged-in users keep the
endpoints above. The typed phone is **unverified**, so it never grants access — the create
call returns a random `accessToken` the browser keeps (localStorage), and only that token
reaches the unlocked data. Fields with `persist: true` are also remembered in the browser
to prefill the next guest request. Tokens keep working after the mode is switched off.

#### `POST /artists-requests/:id/guest-contact-requests/`
No auth. **Body:** `{ answers }` — the form's fields plus `phoneNumber` (always required,
`MOBILE` preset; appended if the form lacks it).

**Response:** `201 ApiResponse<{ id, trackingCode, status, accessToken }>`

**403** guest mode off · **404** artist not approved · **400** invalid answers ·
**409** a `PENDING` request from this phone for this artist exists · **429** over
10 requests/hour per IP or 3/hour per phone. An earlier `APPROVED` request does not block
(its token may be in a lost browser).

#### `POST /contact-requests/guest/status/`
No auth. **Body:** `{ tokens: string[] }` (first 50 used).

**Response:** `ApiResponse<{ token, trackingCode, status, createdAt, artistId }[]>` — unknown
tokens are skipped.

#### `GET /artists-requests/:id/guest-contact/`
No auth. **Header:** `X-Resume-Token: <accessToken>`. Same payload as
`GET /user/artists-requests/:id/contact/`; **403** unless the token belongs to an
`APPROVED` request for this artist.

---

### `GET /user/contact-requests/`
The caller's own requests, paginated. **Auth required.**

**Response:** `ApiResponse<{ id, trackingCode, status, createdAt, reviewedAt, artist }[]>`

---

## Wallet

A ledger, not a stored balance: the balance is always `SUM(amount)` over the user's
`wallet_transactions` rows, so it cannot drift from its own history. `amount` is signed —
positive credits, negative debits.

**Money enters** when an admin sets an artist request to `REJECTED` or
`NEED_TO_REVISION` (the registration fee is returned, once per payment), when a gateway
leg fails and a reservation is released, or when an admin adjusts a balance by hand.

**Money leaves** automatically: the registration fee takes from the wallet first and send
only the remainder to the gateway. The wallet is reserved when the purchase starts — not
at the callback — because that reservation is what stops a second purchase spending the
same balance while the first is still at the gateway. A leg that never settles returns it.

A request sent back for revision has its fee refunded, so resubmitting charges again;
the refund normally covers it in full, so the artist never sees a gateway.

### `GET /user/wallet/`
Current balance. **Auth required.**

**Response:** `ApiResponse<{ balance: number }>`

---

### `GET /user/wallet/transactions/`
The caller's own ledger, paginated. **Auth required.**

**Response:** `ApiResponse<{ id, amount, type, typeLabel, description, artist, createdAt }[]>`

`artist` is `{ id, code, name } | null` — the profile whose contact details a
`SPEND_CONTACT` (or its failed-payment refund) paid for; null otherwise.

`type` is one of `REFUND_REJECTED`, `REFUND_REVISION`, `REFUND_FAILED_PAYMENT`,
`ADMIN_ADJUST`, `SPEND_REGISTRATION`, `SPEND_CONTACT`.

---

## Admin Endpoints (prefix: `/admin`, all require admin JWT)

### `POST /admin/login`
Admin login.

**Body:**
```json
{ "username": "string", "password": "string" }
```

**Response:**
```ts
ApiResponse<{ accessToken: string; type: "admin" }>
```

---

### `GET /admin/profile/`
The calling admin's own profile (sidebar name and picture).

**Response:** `ApiResponse<{ id, username, email, role, firstName, lastName, avatar }>` (`avatar` is a public URL or `null`)

---

### `PATCH /admin/profile/`
Edit the calling admin's own name and picture. Every key optional.

**Body:**
```ts
{
  firstName?: string;
  lastName?: string;
  avatar?: string | null;  // storage path from POST /admin/upload/image; null clears
}
```

`400` when `avatar` is not a path that upload produced (`banners/...`).

**Response:** same shape as `GET /admin/profile/`.

---

### `GET /admin/artist-requests`
List all artist requests with full detail.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number |
| count | number | Items per page (max 100, default 20) |
| categoryId | number | Filter by category ID |
| categoryName | string | Filter by category name |
| status | ArtistRequestStatus | Filter by status |
| city | string | Filter by `answers.city` (convention key, category-dependent) |
| skinColor | string | Filter by `answers.skinColor` (convention key, category-dependent) |
| height | number | Filter by `answers.height` (convention key, category-dependent) |
| weight | number | Filter by `answers.weight` (convention key, category-dependent) |
| dialect | string | Filter by `answers.dialect` (convention key, category-dependent) |
| search | string | Search by name or phone |
| sort | string | Sort by `id`, `userName`, `category`, `status`, `crmStage`, `createdAt`, `updatedAt`, `followUpAt` |
| order | `ASC` \| `DESC` | Sort direction (default `DESC`) |
| hidden | boolean | `true` lists only hidden (soft-deleted) requests; omitted lists only visible ones |
| createdAt | string | Filter by created date |
| updatedAt | string | Filter by updated date |
| crmStage__in | CrmStage[] | Filter by CRM pipeline stage (comma-separated) |
| assignedAdminId | number | Filter by assigned admin |
| followUpAt__lte | string | Follow-ups due on or before this date |

**Response:** `ApiResponse<ArtistRequest[]>` (includes `rejectedReasons`, `hiddenAt`, and the
CRM fields `crmStage`, `followUpAt`, `assignedAdmin`) + pagination

---

### `GET /admin/artist-requests/:id/`
Retrieve single artist request (admin view, includes rejectedReasons).

**Response:** `ApiResponse<ArtistRequest>`

---

### `PATCH /admin/artist-requests/:id/`
Update artist request status. Sends the applicant the SMS template bound to the new status
(`NEED_TO_REVISION` → `NEED_REVISION`, `ACCEPTED` → `APPROVED`, `REJECTED` → `REJECTED`) and
records it in the applicant's message inbox. When that template's `isActive` is false, no SMS
and no inbox row are produced — the status change itself still applies.

**Body:**
```ts
{
  status: ArtistRequestStatus;
  rejectedReason?: string;  // required when status is REJECTED or NEED_TO_REVISION
}
```

**Response:** `ApiResponse<ArtistRequest>`

---

### `PATCH /admin/artist-requests/:id/hidden/`
Soft delete. A hidden request drops out of the admin list (unless `?hidden=true`), out of
the public artist listing, detail page and filter facets. Nothing is erased: the owner keeps
the form in their profile and payments are untouched. Reversible with `hidden: false`.

**Body:**
```ts
{ hidden: boolean }
```

**Response:** `ApiResponse<{ id: number; hiddenAt: string | null }>`
400 when `hidden` is not a boolean, 404 on an unknown request.

---

### `PATCH /admin/artist-requests/:id/crm/`
Update the CRM fields of an artist request. Deliberately separate from the status PATCH
above — nothing here touches `status`, so no CRM edit can trigger payment, refund, or
publication side effects. Every field is optional; `null` clears the owner or follow-up.

**Body:**
```ts
{
  crmStage?: CrmStage;
  assignedAdminId?: number | null;
  followUpAt?: string | null;   // ISO date
}
```

**Response:** `ApiResponse<{ id, crmStage, followUpAt, assignedAdmin }>`
400 on an unknown stage or a non-existent admin, 404 on an unknown request.

---

### `GET /admin/artist-requests/:id/notes/`
CRM timeline for one request, newest first.

**Response:** `ApiResponse<CrmNote[]>`
```ts
{
  id: number;
  body: string;
  channel: CrmNoteChannel;
  smsDelivered: boolean | null;   // null for INTERNAL notes
  admin: { id, username, firstName, lastName } | null;
  createdAt: string;
}
```

---

### `POST /admin/artist-requests/:id/notes/`
Add a note to the timeline. With `channel: "SMS"` the body is also texted to the applicant
before the note is stored; the send is awaited, and the outcome recorded in `smsDelivered`.

**Body:**
```ts
{
  body: string;              // required, max 500 chars when channel is SMS
  channel?: CrmNoteChannel;  // default INTERNAL
}
```

**Response:** `201` + `ApiResponse<CrmNote>`.
A failed SMS still stores the note but returns `502` with `smsDelivered: false`, so the UI
must not report success on a 2xx assumption. 400 on an empty body, an over-long SMS, an
invalid channel, or an applicant with no phone number.

---

### `GET /admin/admins/`
Admin list for the CRM assignee picker. Never includes `password`.

**Response:** `ApiResponse<{ id, username, firstName, lastName, role }[]>`

---

### `GET /admin/sms-templates/`
The automated-SMS pipeline. The backend seeds exactly one row per `SmsEvent` — there is no
create and no delete, because a template no trigger point references would never fire.

**Response:** `ApiResponse<SmsTemplate[]>`
```ts
{
  event: SmsEvent;
  body: string;            // Persian text, may contain {placeholders}
  isActive: boolean;       // false = this event sends nothing
  variables: string[];     // placeholders valid for THIS event, e.g. ["firstName", "reason"]
  updatedAt: string;
  updatedBy: { id, username, firstName, lastName } | null;
}
```

`variables` is served per event rather than assumed client-side, so the panel can only offer
placeholders the renderer will actually substitute.

---

### `PATCH /admin/sms-templates/:event/`
Edit one template's text or flip it on/off. `:event` is the `SmsEvent` value, not an id.

**Body:**
```ts
{
  body?: string;      // max 500 chars
  isActive?: boolean;
}
```

**Response:** `ApiResponse<SmsTemplate>`
400 on an unknown event, an empty body, a body over 500 chars, or a `{placeholder}` that is
not in that event's `variables`. 404 on an event with no seeded row.

---

### `POST /admin/sms-templates/:event/test/`
Send one sample of this template to the admin phone numbers stored in
`/admin/notification-settings/` — never to an applicant, so a test can never leak a
half-written message to a real user. Placeholders are filled with sample values by the
server, and the rendered text is prefixed with a marker so a recipient cannot mistake it
for a live notification.

**Body:**
```ts
{
  body?: string;   // the unsaved draft to test; omitted = test what is stored
}
```

The optional `body` exists because the point of a test is to check the text *before*
committing it. It is validated exactly like a `PATCH` body (max 500 chars, placeholders
must be in `variables`).

**Response:** `ApiResponse<{ ok: boolean, sentTo: number, message: string }>`

A provider rejection is a normal answer, not a transport error: the call succeeds with
`ok: false` and the provider's own message. `sentTo` is the count of numbers actually
texted. 400 when no admin phone numbers are configured — there is nowhere to send it.

---

### `GET /admin/categories/`
List categories.

**Response:** `ApiResponse<Category[]>`

---

### `GET /admin/categories/:id/`
Get category by ID.

**Response:** `ApiResponse<Category>`

---

### `PATCH /admin/categories/:id/`
Update category.

**Body:** partial `Category` fields (`config` is no longer supported — use the form-builder endpoints below)

`registrationAmount` and `contactAmount` are no longer read or written (registration is
covered by the yearly subscription, resume requests are free); the columns are kept for
history.

**Response:** `ApiResponse<Category>`

`parentId` (`number | null`) moves the category; `null` makes it top-level. `400` if the
target is itself a subcategory, is the category itself, or the category has subcategories
(two levels only).

`priority` orders a category among its siblings — the main categories among themselves, or
one parent's subcategories among themselves. Setting it to a taken slot shifts the rows
between the old and the new position, so the list stays a gap-free sequence. To reorder a
whole list at once, use `PATCH /admin/categories/reorder/` instead. `400` unless `priority`
is `null` or an integer ≥ 1. `POST /admin/categories/` follows the same rule: a given
`priority` opens that slot among the new category's siblings; without one it goes last.

---

### `PATCH /admin/categories/reorder/`
Set a whole sibling list's display order in one statement. Use this for drag-to-reorder —
the per-category `PATCH` above shifts the rows around the one it moves, which is right for
a single move but scrambles a list sent as one request per row.

**Body:**
```ts
{
  parentId: number | null; // null reorders the main categories; an id, that parent's subcategories
  ids: number[];           // the sibling ids in their new order; priority becomes each id's index
}
```

`400` if `ids` is empty, holds a non-integer or a duplicate, contains an id that is not
a child of `parentId`, or `parentId` is not an integer or `null`.

Siblings missing from `ids` (e.g. created mid-drag) are kept after the sent ones, in their
current order, so every sibling ends up with a distinct `priority`.

**Response:** `ApiResponse<{ ids: number[] }>` — the full sibling order that was applied.

---

### `DELETE /admin/categories/:id/`
Soft-delete a category **and all its subcategories** in one statement
(`deleted_at = NOW()`, `is_active = false`).

`409` if the category or any subcategory has artist requests — deactivate it instead.

**Response:** `ApiResponse<{ deletedIds: number[] }>`

---

### `GET /admin/payment-settings/`
SEP gateway settings.

**Response:**
`ApiResponse<{ terminalId, hasTerminalId, tokenUrl, verifyUrl, paymentUrl, defaults, usingEnvFallback, subscriptionPrice, defaultSubscriptionPrice }>`

`subscriptionPrice` (Toman) is the yearly subscription price; `null` means
`defaultSubscriptionPrice` (`REGISTRATION_AMOUNT`) applies.

`terminalId` is always **masked** (`****-****-****-abc1`) — the real terminal never
leaves the server. `usingEnvFallback` is true while no terminal is stored and the gateway
is still running off `SEP_TERMINAL_ID`.

The three endpoints come back **resolved**, so the response always shows what the gateway
will actually call rather than an empty box; `defaults` carries the shipped values, so a
client can tell an override from an inherited one. They only need changing to point at a
UAT host.

There is no sandbox flag: SEP's test environment is a separate terminal ID against the
same host, so testing means storing the test terminal here.

---

### `PATCH /admin/payment-settings/`
Update gateway settings.

**Body:** `{ terminalId?: string, tokenUrl?: string, verifyUrl?: string, paymentUrl?: string, subscriptionPrice?: number | null }`

`subscriptionPrice`: `0` = free, `null`/blank = back to the default.

Because reads are masked, a submitted `terminalId` that still looks like a mask is
treated as *unchanged* rather than written. An empty string clears the stored terminal,
falling back to the env var; an empty endpoint clears the override, falling back to the
shipped default.

**400** if an endpoint is not a valid `http`/`https` URL. Nothing is written in that
case — the settings row is validated in full before any field is applied.

---

### `POST /admin/payment-settings/test/`
Prove the stored settings work. **Admin auth required.**

Requests a throwaway token from SEP with whatever is currently stored. No money moves and
nobody is sent to the payment page — the token simply expires.

**Response:** `ApiResponse<{ ok: boolean, message: string }>`

A rejected terminal is a normal answer, not a transport error: the call succeeds with
`ok: false` and SEP's own message. Note this checks what is **stored**, so unsaved edits
in the admin form are not covered.

---

### `GET /admin/gateway-logs/`
Gateway health log, newest first. **Admin auth required.**

**Query:** `page`, `count` (max 50), `level?` (`ok` | `warning` | `error`)

**Response:** paginated envelope (`count`/`next`/`previous`) whose `result` is
`{ status: "ok" | "error" | "unknown", statusMessage, checkedAt, lastOkAt, items: GatewayLog[] }`,
`GatewayLog = { id, action: "check" | "token" | "verify" | "reverse", level: "ok" | "warning" | "error", message, detail, createdAt }`.

`message` is plain Persian for a non-technical admin; `detail` is the raw error. `status`
comes from the latest non-`warning` row — `warning` is one buyer refused by the bank, not
a gateway fault. The server runs a `check` at startup and hourly, and keeps 30 days.
`POST /admin/payment-settings/test/` also writes a `check` row.

---

### `GET /admin/sms-logs/`
SMS panel log, newest first. **Admin auth required.**

**Query:** `page`, `count` (max 50), `level?` (`ok` | `error`), `action?` (`send` | `pattern` | `check`)

**Response:** paginated envelope whose `result` is
`{ status: "ok" | "error" | "unknown", statusMessage, checkedAt, lastOkAt, sentToday, failedToday, items: SmsLog[] }`,
`SmsLog = { id, action: "send" | "pattern" | "check", level: "ok" | "error", receptor, message, detail, createdAt }`.

Every SMS sent through Melli Payamak writes a row (`send` stores the text; `pattern` is the
OTP login and never stores the code). `status` comes from the latest `check`: the server
asks the panel for its credit at startup and hourly — `error` means bad credentials, the
operator is unreachable, or credit is low. `sentToday`/`failedToday` count non-check rows
since local midnight. Kept 30 days.

---

### `GET /admin/payments/`
Every registration payment, newest first — gateway, wallet and free. **Admin auth required.**

**Query:** `page`, `count` (max 50), `status?` (`PENDING` | `COMPLETED` | `FAILED` | `CANCELED`)

**Response:** paginated envelope whose `result` is
`{ id, amount, walletAmount, gateway: "saman" | "wallet" | "free", refNum, status, artist: { id, code, name } | null, phone, kind: "registration" | "subscription", createdAt }[]`.

`kind: "subscription"` rows were bought before the form was saved, so `artist` is null;
`phone` comes from the buyer.

`amount` is what the gateway charged; `walletAmount` came from the wallet. Total paid = both.

---

### `GET /admin/notification-settings/`
Admin SMS recipients, and which events trigger a message.

**Response:** `ApiResponse<{ phones: string[]; events: NotificationEvent[] }>`

---

### `PATCH /admin/notification-settings/`
Update recipients / events.

**Body:** `{ phones?: string[], events?: NotificationEvent[] }`

Each field **replaces** the stored list rather than merging into it — the admin form
always sends the full list. Numbers are normalized to `09xxxxxxxxx` (Persian digits
accepted) and deduped; an invalid number is a `400`. An empty `phones` disables admin SMS.

`NotificationEvent` is one of:

| Value | Fires when |
|-------|-----------|
| REGISTRATION | a new artist request is submitted, or its registration payment completes |
| TRANSACTION | a registration payment reaches `COMPLETED` |
| RESUME_REQUEST | a viewer submits a resume request |
| SUPPORT_TICKET | a user opens a support ticket |

The toggles are global: every stored number receives every enabled event.

---

### `GET /admin/notifications/`
In-panel feed: every `NotificationEvent` above is also recorded here, whether or not SMS
is enabled for it. Newest 50 entries, no pagination.

**Response:** `ApiResponse<{ unread: number; items: { id: number; event: NotificationEvent; message: string; link: string | null; readAt: string | null; createdAt: string }[] }>`

`link` is the admin panel path the entry opens. Read state is shared by all admins.

---

### `PATCH /admin/notifications/read/`
Mark one entry read (`{ id }`), or every unread entry (empty body). Idempotent.

**Response:** `ApiResponse<{ unread: number }>`

---

### `GET /admin/badge-counts/`
Sidebar badges: work still waiting on an admin.

**Response:** `ApiResponse<{ supports: number; contactRequests: number; registrations: number; notifications: number }>`

`supports` = tickets `OPEN`, `contactRequests` = resume requests `PENDING`,
`registrations` = non-hidden artist requests `PENDING`, `notifications` = unread feed entries.

---

### `GET /admin/users/:id/wallet/`
One user's balance and ledger.

**Response:** `ApiResponse<{ balance, transactions[] }>` — each row adds `adminUsername`,
set only for manual adjustments, and `artist` (`{ id, code, name } | null`): the profile
viewed for a contact purchase, else the user's own artist request.

---

### `POST /admin/users/:id/wallet/`
Manual adjustment.

**Body:** `{ amount: number, description: string }`

`amount` is signed and must not be zero; `description` is required, because this is the
only place a balance moves without a payment behind it. A deduction may take the balance
negative — refusing that would leave an admin unable to correct a mistaken credit the
user has already partly spent.

**Response:** `ApiResponse<{ balance: number }>`

---

### `GET /admin/contact-requests/`
Every resume request, paginated — the "درخواست‌های مشاهده رزومه" table.

**Query params:** `page`, `count`, `status` (`PENDING` / `APPROVED` / `REJECTED`),
`search` (tracking code, requester name, account phone, or guest phone)

**Response:** `ApiResponse<{ id, trackingCode, status, createdAt, reviewedAt, requesterName, isGuest, buyer: { id, phoneNumber }, artist: { id, code, name, categories } }[]>`

For a guest row `buyer.id` is null and `buyer.phoneNumber` is the typed (unverified) phone.

---

### `GET /admin/contact-requests/:id/`
One request for the review page.

**Response:** `ApiResponse<{ id, trackingCode, status, createdAt, reviewedAt, requesterName, isGuest, answers, requester, artist }>`
— `answers` is `{ key, label, type, options, value }[]` labelled by the current form
(answers to since-removed fields keep their key as label); `requester` is the account
(`id, code, firstName, lastName, phoneNumber, email, avatar, createdAt`); `artist` is
`{ id, code, name, phoneNumber, email, avatar, categories, privateFields }`, where
`privateFields` is exactly what approval unlocks.

---

### `PATCH /admin/contact-requests/:id/`
Review a request. **Body:** `{ status: "APPROVED" | "REJECTED" }`.

Only from `PENDING` (**409** otherwise). Sets `reviewedAt`. `APPROVED` sends the
`RESUME_REQUEST_APPROVED` SMS template (variables `firstName`, `lastName`, `fullName`,
`artistCode`, `trackingCode`) and files it in the requester's inbox.

---

### `GET /admin/categories/:id/form-schema/`
Get the step/field schema for a top-level category. 400 if `:id` has a parent.

**Response:** same shape as the public `GET /categories/:id/form-schema/`.

---

### `PATCH /admin/categories/:id/form-schema/`
Set the editable copy of a top-level category's form. 400 if `:id` has a parent.

**Body:** `{ formCopy?: Record<string, string> }` — merged key by key into the stored
overrides; a key sent empty/blank deletes that override so the frontend default
applies again.

**Response:** `ApiResponse<{ formCopy }>`

Result-page texts (paid / free-submit / fail) are site-wide FORM_COPY keys
`result{Paid,Submit,Fail}{Title,Desc}` in `SiteContent.form`, not per category.

---

### `POST /admin/categories/:id/form-steps/`
Create a step for a top-level category.

**Body:** `{ title: string; description?: string; order?: number; icon?: string }`

---

### `PATCH /admin/form-steps/:stepId/`
Update a step. **Body:** `{ title?: string; description?: string; order?: number; icon?: string }`

---

### `DELETE /admin/form-steps/:stepId/`
Delete a step (cascades to its fields).

---

### `POST /admin/form-steps/:stepId/fields/`
Create a field on a step.

**Body:**
```ts
{
  key: string;             // unique within the top-level category
  label: string;
  type: "TEXT" | "TEXTAREA" | "NUMBER" | "SELECT" | "SELECT_PROVINCE" | "SELECT_CITY" | "RADIO" | "CHECKBOX" | "BOOLEAN" | "DATE" | "IMAGE" | "VIDEO";
  placeholder?: string;
  helpText?: string;       // hint rendered under the input
  required?: boolean;
  order?: number;
  options?: { label: string; value: string }[];   // SELECT/RADIO/CHECKBOX
  validation?: { preset?: ValidationPreset; min?: number; max?: number; minLength?: number; maxLength?: number; pattern?: string };
  // Links the field to the account: prefilled from the profile, and written back on submit.
  // `phoneNumber` is read-only (login identity) — prefilled, never written back.
  // `null` clears an existing link.
  // a ProfileField key (builtin or custom; custom answers sync into profileData),
  // or the read-only "phoneNumber". Unknown keys are a 400.
  syncToUserField?: string | null;
  multiple?: boolean;      // IMAGE/VIDEO: allow more than one upload
  isPrivate?: boolean;     // default false; true = shown only after an approved resume request
}
```

---

### `PATCH /admin/form-fields/:fieldId/`
Update a field. **Body:** same shape as create, all optional, plus:

```ts
{
  stepId?: number;   // move the field to another step (must belong to the same category)
}
```

---

### `DELETE /admin/form-fields/:fieldId/`
Delete a field.

---

### `GET /admin/profile-fields/`
All profile fields including hidden ones. **Response:** `ApiResponse<ProfileField[]>`

### `POST /admin/profile-fields/`
Add a custom field. **Body:** `{ key, label, type, placeholder?, helpText?, required?, options?, validation?, multiple?, hidden? }`.
`key` must match `^[a-zA-Z][a-zA-Z0-9_]*$`, be unique, and not be a builtin/reserved name. Appended last.

### `PATCH /admin/profile-fields/:id/`
Same body minus `key` (immutable). A builtin's `type` and `multiple` cannot change.

### `DELETE /admin/profile-fields/:id/`
Custom fields only (`400` for builtins — hide them instead). Stored values stay in `profileData`.

### `PATCH /admin/profile-fields/order/`
**Body:** `{ ids: number[] }` in display order. **Response:** the full list.

---

### `GET /admin/supports/`
List all support tickets (paginated, newest first).

**Query params:** `page`, `count`

**Response:** `ApiResponse<Support[]>` + pagination

---

### `GET /admin/supports/:id/`
Get support ticket by ID, with its thread (same shape as `GET /user/supports/:id/`).

**Response:** `ApiResponse<Support & { userId: number | null; messages: SupportMessage[] }>`

---

### `PATCH /admin/supports/:id/`
Update support ticket status — used to close (`CLOSED`) or reopen (`OPEN`). 400 on an
unknown status.

**Body:**
```json
{ "status": "OPEN" | "ANSWERED" | "CLOSED" }
```

**Response:** `ApiResponse<Support>`

---

### `POST /admin/supports/:id/messages/`
Reply to a ticket as the calling admin.

**Body:** `{ body: string }`

Status becomes `ANSWERED` (stays `CLOSED` if closed). Fires the `SUPPORT_REPLY` SMS
template to the account's phone (or the ticket's `phoneNumber` for public-form tickets);
for linked tickets the rendered text also lands in the user's profile inbox. 400 on an
empty body.

**Response:** `ApiResponse<SupportMessage>` (201)

---

### `GET /admin/users/`
List all users.

**Response:** `ApiResponse<User[]>`

---

### `GET /admin/users/:id/`
Profile of one user — works whether or not they have any artist request. `404` if missing.

**Response:** `ApiResponse<{ id, firstName, lastName, avatar, phoneNumber, email, nationalCode, profileData, code }>` (`avatar` is a public URL)

---

### `PATCH /admin/users/:id/`
Edit a user's profile. Same body and validation as `PATCH /user/profile/`, but hidden
fields are editable too and required fields are **not** enforced. `404` if the user is missing.

**Body:** `{ [profileFieldKey]: value }`

**Response:** `ApiResponse<{ id, firstName, lastName, phoneNumber, email, nationalCode, profileData, code }>`

---

### `GET /admin/users/:id/artist-requests/`
Get all artist requests for a specific user (admin view).

**Response:** `ApiResponse<ArtistRequest[]>`

---

### `DELETE /admin/users/:id/`
Delete a user and everything they own. **SUPER_ADMIN only** — an ordinary `ADMIN` token
gets `403`. Irreversible.

Three things happen, none of which the FKs' `ON DELETE CASCADE` would do on its own (it
only fires on a hard delete, and TypeORM's `softRemove` does not cascade):

1. **Soft-delete cascade** (`deleted_at = NOW()`, `is_active = false`), children first:
   `artist_portfolios`, `artist_requests_rejected_reasons`, `crm_notes`,
   `contact_requests` (both as buyer and as target), `wallet_transactions`,
   `user_messages`, `artist_requests`, and the user row. `supports` is included too,
   matched on `user_id` or phone/email (legacy and public-form tickets have no user FK and
   copy the name, email and phone in as plain columns), along with their `support_messages`.
2. **PII scrub.** `first_name`, `last_name`, `email`, `national_code` and `avatar_path`
   are set to `NULL`; `artist_requests.answers` is emptied to `{}` (it holds the name,
   email, national code and address the form collected);
   `contact_requests.requester_name` and the matched support tickets' name/email/phone
   are cleared. `users.code` is kept — a public artist number, not personal data.
3. **The phone number is released.** `phone_number` becomes `deleted:{id}:{original}`.
   The unique index still covers soft-deleted rows, so without this the person's number
   could never log in again (`POST /user/login/` does `findOneBy({ phone_number })`,
   which skips deleted rows, then `save`). After deletion the same number registers as a
   fresh, empty account.

Uploaded objects (avatar, portfolio files, and any `users/{id}/…` path stored as a form
answer) are deleted from object storage after the transaction commits, best-effort: a
missing object is logged, not surfaced as a failure.

`payments` and `gateway_receipts` are deliberately left untouched — they carry no personal
data and they are the money audit trail.

**Response:** `ApiResponse<null>` — `400` if there is no such live user, `403` if the
caller is not a super admin.

---

### `GET /admin/faqs/`
List FAQs.

**Response:** `ApiResponse<FAQ[]>`

---

### `POST /admin/faqs/`
Create FAQ.

**Body:**
```json
{ "question": "string", "answer": "string" }
```

**Response:** `ApiResponse<FAQ>`

---

### `GET /admin/faqs/:id/`
Get FAQ by ID.

**Response:** `ApiResponse<FAQ>`

---

### `PATCH /admin/faqs/:id/`
Update single FAQ.

**Body:** `{ question?: string; answer?: string }`

**Response:** `ApiResponse<FAQ>`

---

### `PATCH /admin/faqs/`
Bulk update FAQs.

**Body:** array of FAQ update objects

---

### `DELETE /admin/faqs/:id/`
Delete FAQ.

**Response:** `ApiResponse<null>`

---

### `GET /admin/about-us/`
Get about-us content.

**Response:** `ApiResponse<AboutUs>`

---

### `PATCH /admin/about-us/:id/`
Update about-us text.

**Body:**
```json
{ "text": "string", "fontSize": null, "color": null }
```

**Response:** `ApiResponse<AboutUs>`

---

### `GET /favicon`
302 to the admin-uploaded favicon URL, else to `/favicon-default.ico`. `Cache-Control: public, max-age=300`. Used as `<link rel="icon">` by the root layout.

### `GET /admin/site-content/`
Get site-content (see `GET /site-content/` above for shape). Admin auth.

**Response:** `ApiResponse<SiteContent>`

---

### `PATCH /admin/site-content/:id/`
Partial update of site-content. Single row, `id` hardcoded to `1`. Any top-level key (`benefits`, `support`, `terms`, `footer`, `landing`, `contactForm`, `resumeRequestForm`, `uploadLimits`, `branding`) may be sent independently; unspecified keys are left unchanged.

**Body:** `Partial<Omit<SiteContent, "id">>`

**Response:** `ApiResponse<SiteContent>`

---

### `GET /admin/banners/`
List all banners (active and inactive), sorted by `priority` ascending.

**Query params:** `page`, `count`, `search` (matches `title`), `isActive` (boolean filter)

**Response:** `ApiResponse<Banner[]>` (paginated)

---

### `GET /admin/banners/:id/`
Get a banner by id.

**Response:** `ApiResponse<Banner>`

---

### `POST /admin/banners/`
Create a banner slide.

**Body:**
```json
{
  "title": "string",
  "subtitle": "string",
  "image": "banners/{uuid}.{ext}",
  "ctaLabel": "string",
  "ctaLink": "string",
  "priority": 0,
  "isActive": true,
  "titleFontSize": null,
  "subtitleFontSize": null,
  "ctaLabelFontSize": null,
  "titleColor": null,
  "subtitleColor": null,
  "ctaLabelColor": null
}
```

**Response:** `ApiResponse<Banner>`

---

### `PATCH /admin/banners/:id/`
Update a banner slide. Full replace of the same body shape as create.

**Body:** same shape as `POST /admin/banners/`

**Response:** `ApiResponse<Banner>`

---

### `DELETE /admin/banners/:id/`
Soft-delete a banner slide. Excluded from both list endpoints thereafter.

**Response:** `ApiResponse<null>`

---

### `POST /admin/upload/image`
Upload a banner image. **Auth required.** `multipart/form-data`

**Form field:** `file` (image)

**Response:**
```json
{ "path": "banners/{uuid}.{ext}", "url": "https://storage.archivehonar.ir/banners/{uuid}.{ext}" }
```

`url` is for previewing before save only. The returned `path` is sent back in the `image` field of `POST`/`PATCH /admin/banners/`; it's resolved to a full URL when the banner is read via `GET /banners/` or `GET /admin/banners/:id/`.

---

### `GET /admin/tutorials/`
List all tutorials (active and inactive), sorted by `priority` ascending.

**Query params:** `page`, `count`, `search` (matches `title`), `isActive` (boolean filter)

**Response:** `ApiResponse<Tutorial[]>` (paginated)

---

### `GET /admin/tutorials/:id/`
Get a tutorial by id.

**Response:** `ApiResponse<Tutorial>`

---

### `POST /admin/tutorials/`
Create a tutorial.

**Body:**
```json
{
  "title": "string",
  "content": "string",
  "videoUrl": "https://www.aparat.com/video/video/embed/videohash/{hash}/vt/frame",
  "thumbnail": "banners/{uuid}.{ext}",
  "priority": 0,
  "isActive": true,
  "isMain": false
}
```

**Response:** `ApiResponse<Tutorial>`

---

### `PATCH /admin/tutorials/:id/`
Update a tutorial. Full replace of the same body shape as create.

**Body:** same shape as `POST /admin/tutorials/`

**Response:** `ApiResponse<Tutorial>`

---

### `DELETE /admin/tutorials/:id/`
Soft-delete a tutorial. Excluded from both list endpoints thereafter.

**Response:** `ApiResponse<null>`

Note: tutorial thumbnails reuse the existing `POST /admin/upload/image` endpoint (no dedicated upload route) — the returned `path` is sent back in the `thumbnail` field of `POST`/`PATCH /admin/tutorials/`.

Note: `isMain` is optional and defaults to `false`. Setting it to `true` on one tutorial automatically unsets it on all others — at most one tutorial can be main at a time. If no tutorial has `isMain: true`, the homepage simply omits the featured video section.
