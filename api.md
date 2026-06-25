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

enum Gender {
  MAN = "MAN",
  WOMAN = "WOMAN",
}

enum PortfolioType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
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

enum SkinColor {
  FAIR = "FAIR",
  WHEAT = "WHEAT",
  OLIVE = "OLIVE",
  DARKOLIVE = "DARKOLIVE",
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
  gender?: Gender;
  birthDate?: string;        // ISO date
  height?: number;
  weight?: number;
  language?: string;
  dialect?: string;
  address?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  education?: string;
  major?: string;
  aboutMe?: string;
  skinColor?: SkinColor;
  code?: string;             // auto-generated sequential code
  lastLogin?: string;        // ISO datetime
}

interface Category {
  id: number;
  faName: string;
  enName: string;
  parent?: Category | null;
  children?: Category[];
  config?: Record<string, any>;
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
}

interface Payment {
  id: number;
  amount: number;
  paymentGateway: string;
  paymentId: string;
  status: PaymentStatus;
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
Create an artist request. **Auth required.** `multipart/form-data`

**Body:**
```ts
{
  categoryIds: number[];        // required
  firstName?: string;
  lastName?: string;
  height?: number;
  weight?: number;
  language?: string;
  dialect?: string;
  email?: string;
  address?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  education?: string;
  major?: string;
  avatar?: string;              // minio path from upload endpoint
  birthDate?: string;           // ISO date
  gender?: Gender;
  skinColor?: SkinColor;
  portfolios?: { path: string; type: PortfolioType }[];  // form field: portfolios
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

**Body:** same fields as create (all optional). `portfolios` array replaces existing if provided.

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
Initiate Zarinpal payment — redirects browser to gateway. **Auth required.**

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| amount | number | Payment amount (positive) |
| requestId | number | Artist request ID |

**Response:** HTML redirect page (not JSON)

---

### `ALL /user/purchase/callback/`
Zarinpal payment callback (internal, called by gateway). No auth.

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
| city | string | Filter by user city |
| skinColor | SkinColor | Filter by skin color |
| height | number | Filter by height |
| weight | number | Filter by weight |
| dialect | string | Filter by dialect |
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

**Body:** partial `Category` fields

**Response:** `ApiResponse<Category>`

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

### `GET /admin/about-us/`
Get about-us content.

**Response:** `ApiResponse<AboutUs>`

---

### `PATCH /admin/about-us/:id/`
Update about-us text.

**Body:**
```json
{ "text": "string" }
```

**Response:** `ApiResponse<AboutUs>`
