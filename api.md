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
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
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
  avatar?: string | null;    // presigned URL
  code?: string;             // auto-generated sequential code
  lastLogin?: string;        // ISO datetime
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
List all categories.

**Response:** `ApiResponse<Category[]>`

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
  benefits: { items: { title: string; desc: string }[]; fontSize?: number | null }; // exactly 3, fixed order (mission, vision, responsibility)
  support: {
    title: string;
    description: string;
    items: { title: string; detail: string; footerText: string; buttonValue: string }[]; // exactly 3, fixed order (phone, email, telegram)
    fontSize?: number | null;
  };
  terms: { title: string; content: string; fontSize?: number | null };
  // site-wide footer; null/absent = the frontend defaults in `lib/constants/footer.ts`
  footer?: {
    phone: string;         // support number, displayed as typed (Persian digits ok)
    instagramUrl: string;  // href of the Instagram icon
    copyright: string;     // bottom line of the footer
  } | null;
  // overrides for the public-site copy (hero, statistics, "why", homepage
  // sections, artists search, page titles), keyed by the frontend LANDING_COPY
  // registry in `lib/constants/landingCopy.ts`. Missing keys fall back to the
  // defaults, so this may be `{}` or absent.
  landing?: Record<string, string> | null;
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

---

### `GET /user/`
List all users (no auth required).

**Response:** `ApiResponse<Pick<User, "id" | "phone_number" | "avatar" | "lastLogin">[]>`

---

### `GET /user/profile/`
Get own profile. **Auth required.**

**Response:** `ApiResponse<Pick<User, "id" | "phone_number" | "avatar" | "lastLogin" | "firstName" | "lastName" | "email">>`

---

### `PATCH /user/profile/`
Update own profile. **Auth required.**

**Body:**
```json
{ "firstName": "string", "lastName": "string", "email": "string" }
```

**Response:** `ApiResponse<User>`

---

### `POST /user/avatar`
Upload user avatar. **Auth required.** `multipart/form-data`

**Form field:** `file` (image)

**Response:**
```json
{ "path": "users/{id}/avatar.{ext}" }
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

### `PATCH /user/artist-requests/:id/`
Update own artist request. **Auth required.**

**Body:** same shape as create (all optional). `answers` overwrites wholesale if provided. `portfolios` array replaces existing if provided.

---

### `GET /categories/:id/form-schema/`
Fetch the dynamic step/field schema for a category. No auth. Resolves child categories to
their top-level parent's schema (only top-level categories own a schema).

Auth is optional and only changes `registrationAmount`: a caller who has already paid one
registration fee gets `0` here, because the fee is charged once per user (see
`GET /user/purchase/`). Anonymous callers always see the category price.

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
    }[];
  }[];
  // copy for the post-payment result pages, set in the admin form builder
  successTitle: string | null;
  successDescription: string | null;
  failTitle: string | null;
  failDescription: string | null;
  // overrides for the form's fixed copy (button labels, step counter, payment
  // block, validation messages ...), keyed by the frontend FORM_COPY registry
  // in `lib/constants/formCopy.ts`. Missing keys fall back to the defaults.
  formCopy: Record<string, string>;
}>
```

**Response (200):**
```ts
ApiResponse<{
  artistRequestId: number;
  status: ArtistRequestStatus;
  portfolios: { id: number; filePath: string; type: PortfolioType }[];
}>
```

---

### `POST /user/supports/`
Create a support ticket. No auth required.

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
List own support tickets. **Auth required.**

**Response:** `ApiResponse<Support[]>`

---

### `GET /user/purchase/`
Initiate the artist registration payment — returns the gateway URL to redirect to. **Auth required.**

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| requestId | number | Artist request ID |

The fee is resolved server-side from the request's category (`registrationAmount`,
inherited from the top-level category, falling back to `REGISTRATION_AMOUNT`). A
client-supplied `amount` is ignored — it used to be honored, which let a user pick
what they paid by editing the URL.

The registration fee is charged **once per user**: if the caller already has a COMPLETED
payment on one of their own artist requests where money actually moved (gateway amount or
wallet share above zero), the fee resolves to `0` and every later registration form is
free for them, in any category. A COMPLETED payment of `0` for a free category does not
count — otherwise one free form would make every later paid form free. A fee later
refunded (rejection or revision) still counts as paid.

When the resolved fee is `0` the category is free: a `COMPLETED` payment is recorded,
the request moves to `PENDING`, and `redirectUrl` comes back `null` — there is no
gateway stop to make, so the client goes straight to the result page. The wallet
covering the whole fee settles the same way.

**Response:**
```json
{ "result": { "redirectUrl": "https://sep.shaparak.ir/OnlinePG/OnlinePG?Token=...&GetMethod=true|null" } }
```

The client fetches this over XHR rather than navigating at it, because the route
requires the `Authorization` header.

---

### `ALL /user/purchase/callback/`
SEP payment callback (internal, called by gateway). No auth.

SEP returns the result as a **urlencoded form POST**, not a query string — `State`,
`Status`, `RefNum`, `ResNum`, `TraceNo`, `Amount`, `SecurePan`. The leg counts as settled
only when `State` is `OK` and a `RefNum` is present; the server then calls SEP's
`verifyTransaction` and rejects the payment unless the amount it settled matches what was
charged.

---

## Contact-detail purchases

An artist's contact fields are the paid product. They are served only by
`GET /user/artists-requests/:id/contact/`, and only to a caller who owns a `COMPLETED`
`ContactRequest` for that artist (or is the artist). Every other endpoint strips them.

### `GET /artists-requests/:id/contact-price/`
Price, in Toman, to unlock this artist's contact details. No auth.

The price comes from the artist's category (`contactAmount`), inherited from the
top-level category, falling back to `CONTACT_REQUEST_AMOUNT`. **`0` means free.**

**Response:** `ApiResponse<{ amount: number }>`

---

### `POST /user/artists-requests/:id/contact-requests/`
Start a purchase. **Auth required.**

**Body:** `{ requesterName: string }`

The amount is read from the category — a client-supplied price is never trusted.

**Response:** `ApiResponse<{ id, trackingCode, status, redirectUrl }>`

`redirectUrl` is SEP's hosted payment page, or `null` when there is nothing to pay:
either the artist was already unlocked, or the category is free (in which case the
request is stored as `COMPLETED` immediately).

---

### `ALL /contact-requests/callback/?contactRequestId=` 
Gateway return URL. No auth (the gateway drives the browser here, so it cannot carry a
token). Verifies the payment, then redirects to
`/artists/{id}?contact=success|failed|canceled`.

---

### `GET /user/artists-requests/:id/contact/`
The paid payload: `firstName`, `lastName`, `phoneNumber`, `email`, `address`,
`postalCode`. **Auth required.**

**403** unless the caller owns a `COMPLETED` `ContactRequest` for this artist or is the
artist themselves.

---

### `GET /user/contact-requests/`
The caller's own purchases, paginated. **Auth required.**

---

## Wallet

A ledger, not a stored balance: the balance is always `SUM(amount)` over the user's
`wallet_transactions` rows, so it cannot drift from its own history. `amount` is signed —
positive credits, negative debits.

**Money enters** when an admin sets an artist request to `REJECTED` or
`NEED_TO_REVISION` (the registration fee is returned, once per payment), when a gateway
leg fails and a reservation is released, or when an admin adjusts a balance by hand.

**Money leaves** automatically: both purchase flows take from the wallet first and send
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

**Response:** `ApiResponse<{ id, amount, type, typeLabel, description, createdAt }[]>`

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
| sort | string | Sort by `category` |
| createdAt | string | Filter by created date |
| updatedAt | string | Filter by updated date |

**Response:** `ApiResponse<ArtistRequest[]>` (includes `rejectedReasons`) + pagination

---

### `GET /admin/artist-requests/:id/`
Retrieve single artist request (admin view, includes rejectedReasons).

**Response:** `ApiResponse<ArtistRequest>`

---

### `PATCH /admin/artist-requests/:id/`
Update artist request status (triggers SMS to user).

**Body:**
```ts
{
  status: ArtistRequestStatus;
  rejectedReason?: string;  // required when status is REJECTED or NEED_TO_REVISION
}
```

**Response:** `ApiResponse<ArtistRequest>`

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

Two price fields, both in Toman, both following the same rule — **`0` means free, `null`
means "not set here"** (inherit the top-level category, then the env fallback):

| Field | Who pays | Fallback |
|-------|----------|----------|
| contactAmount | a viewer unlocking an artist's contact details | `CONTACT_REQUEST_AMOUNT` |
| registrationAmount | an artist registering in this category | `REGISTRATION_AMOUNT` |

**Response:** `ApiResponse<Category>`

---

### `GET /admin/payment-settings/`
SEP gateway settings.

**Response:**
`ApiResponse<{ terminalId, hasTerminalId, tokenUrl, verifyUrl, paymentUrl, defaults, usingEnvFallback }>`

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

**Body:** `{ terminalId?: string, tokenUrl?: string, verifyUrl?: string, paymentUrl?: string }`

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
| TRANSACTION | a contact-detail purchase or registration payment reaches `COMPLETED` |
| SUPPORT_TICKET | a user opens a support ticket |

The toggles are global: every stored number receives every enabled event.

---

### `GET /admin/users/:id/wallet/`
One user's balance and ledger.

**Response:** `ApiResponse<{ balance, transactions[] }>` — each row adds `adminUsername`,
set only for manual adjustments.

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
Every contact-detail purchase, paginated — the transactions table.

**Query params:** `page`, `count`, `status` (`PENDING` / `COMPLETED` / `FAILED` /
`CANCELED`), `search` (tracking code, requester name, or buyer phone)

**Response:** `ApiResponse<Transaction[]>` with buyer and artist summaries

---

### `GET /admin/categories/:id/form-schema/`
Get the step/field schema for a top-level category. 400 if `:id` has a parent.

**Response:** same shape as the public `GET /categories/:id/form-schema/`.

---

### `PATCH /admin/categories/:id/form-schema/`
Set the editable copy of a top-level category's form. 400 if `:id` has a parent.

**Body:** `{ successTitle?, successDescription?, failTitle?, failDescription? }` (all `string | null`)
plus `formCopy?: Record<string, string>` — merged key by key into the stored
overrides; a key sent empty/blank deletes that override so the frontend default
applies again.

**Response:** `ApiResponse<{ successTitle, successDescription, failTitle, failDescription, formCopy }>`

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
  syncToUserField?: "firstName" | "lastName" | "avatar" | "email";
  multiple?: boolean;      // IMAGE/VIDEO: allow more than one upload
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

### `GET /admin/supports/`
List all support tickets (paginated).

**Query params:** `page`, `count`

**Response:** `ApiResponse<Support[]>` + pagination

---

### `GET /admin/supports/:id/`
Get support ticket by ID.

**Response:** `ApiResponse<Support>`

---

### `PATCH /admin/supports/:id/`
Update support ticket status.

**Body:**
```json
{ "status": "SupportStatus" }
```

**Response:** `ApiResponse<Support>`

---

### `GET /admin/users/`
List all users.

**Response:** `ApiResponse<User[]>`

---

### `GET /admin/users/:id/artist-requests/`
Get all artist requests for a specific user (admin view).

**Response:** `ApiResponse<ArtistRequest[]>`

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
{ "text": "string", "fontSize": null }
```

**Response:** `ApiResponse<AboutUs>`

---

### `GET /admin/site-content/`
Get site-content (see `GET /site-content/` above for shape). Admin auth.

**Response:** `ApiResponse<SiteContent>`

---

### `PATCH /admin/site-content/:id/`
Partial update of site-content. Single row, `id` hardcoded to `1`. Any top-level key (`benefits`, `support`, `terms`, `footer`, `landing`, `contactForm`) may be sent independently; unspecified keys are left unchanged.

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
  "ctaLabelFontSize": null
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
{ "path": "banners/{uuid}.{ext}" }
```

The returned `path` is sent back in the `image` field of `POST`/`PATCH /admin/banners/`; it's resolved to a full URL when the banner is read via `GET /banners/` or `GET /admin/banners/:id/`.

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
