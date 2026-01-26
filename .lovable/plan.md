

# Audiences Feature: Wallet-Based Audience Builder

## Overview
Transform the `/audiences` page from a placeholder into a fully functional audience management system. Users will be able to:
1. View a list of their saved audiences
2. Create new audiences by selecting wallets from their tracked visitors
3. Edit existing audiences (rename, add/remove wallets)
4. Delete audiences

---

## User Flow

```text
/audiences (List View)
+----------------------------------------------------------+
|  Audiences                           [+ Create Audience]  |
|                                                           |
|  Search audiences...                                      |
+----------------------------------------------------------+
|  ┌──────────────────────────────────────────────────────┐ |
|  │ High-Value Traders          150 wallets   Jan 25     │ |
|  │ Website: mydefiapp.com      [Edit] [Delete]          │ |
|  ├──────────────────────────────────────────────────────┤ |
|  │ Early Stakers               42 wallets    Jan 20     │ |
|  │ Website: mydefiapp.com      [Edit] [Delete]          │ |
|  └──────────────────────────────────────────────────────┘ |
+----------------------------------------------------------+

Create/Edit Audience Dialog
+----------------------------------------------------------+
|  Create New Audience                              [X]     |
|                                                           |
|  Name                                                     |
|  [High-Value Traders                              ]       |
|                                                           |
|  Website                                                  |
|  [mydefiapp.com ▼]                                       |
|                                                           |
|  Select Wallets                                           |
|  ┌────────────────────────────────────────────────────┐  |
|  │ Search wallets...         [Type ▼] [Sort ▼]        │  |
|  ├────────────────────────────────────────────────────┤  |
|  │ [✓] 0x1234...abcd  connected,staked  Jan 25  12x   │  |
|  │ [✓] 0x5678...efgh  connected         Jan 24  8x    │  |
|  │ [ ] 0x9abc...ijkl  purchased         Jan 23  3x    │  |
|  │ ...                                                 │  |
|  └────────────────────────────────────────────────────┘  |
|                                                           |
|  Selected: 2 wallets                                      |
|                                                           |
|                        [Cancel]  [Create Audience]        |
+----------------------------------------------------------+
```

---

## 1. API Integration

### New Types in `src/lib/api.ts`

```typescript
// Wallet List types
export interface WalletRow {
  wallet_id: string;
  types: string[];  // ["connected", "staked", etc.]
  first_seen: string;
  last_seen: string;
  visit_count: number;
}

export interface WalletListRequest {
  tag_id: string;
  range: RangeConfig;
  types?: string[];           // optional filter by wallet action types
  search?: string;            // optional search by wallet address
  sort_by?: "wallet_id" | "first_seen" | "last_seen" | "visit_count";
  sort_dir?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface WalletListResponse {
  success: boolean;
  rows: WalletRow[];
  pagination: {
    limit: number;
    offset: number;
    total_rows: number;
  };
}

// Audience types
export interface Audience {
  id: string;
  name: string;
  website_id: string;
  wallet_count: number;
  wallets: string[];
  created_at: string;
  updated_at: string;
}

export interface AudienceListResponse {
  audiences: Audience[];
}

export interface AudienceResponse {
  audience: Audience;
}

export interface CreateAudienceRequest {
  name: string;
  website_id: string;
  wallets: string[];
}

export interface UpdateAudienceRequest {
  name?: string;
  wallets?: string[];
}
```

### New API Functions

```typescript
// Wallet list
export async function fetchWallets(request: WalletListRequest): Promise<WalletListResponse>;

// Audiences CRUD
export async function listAudiences(websiteId?: string): Promise<AudienceListResponse>;
export async function getAudience(id: string): Promise<AudienceResponse>;
export async function createAudience(data: CreateAudienceRequest): Promise<AudienceResponse>;
export async function updateAudience(id: string, data: UpdateAudienceRequest): Promise<AudienceResponse>;
export async function deleteAudience(id: string): Promise<void>;
```

---

## 2. Component Architecture

### New Components

| Component | Purpose |
|-----------|---------|
| `src/components/audiences/AudienceList.tsx` | Table/list showing all audiences with actions |
| `src/components/audiences/AudienceDialog.tsx` | Create/Edit audience modal dialog |
| `src/components/audiences/WalletSelector.tsx` | Searchable, filterable wallet picker with checkboxes |
| `src/components/audiences/WalletTable.tsx` | Table displaying wallets with selection state |

### Component Relationships

```text
Audiences.tsx (page)
├── AudienceList
│   └── (displays audiences, triggers edit/delete)
└── AudienceDialog
    └── WalletSelector
        └── WalletTable
```

---

## 3. Page State Management

### Audiences.tsx State

```typescript
// Audiences list
const [audiences, setAudiences] = useState<Audience[]>([]);
const [loading, setLoading] = useState(true);

// Dialog state
const [dialogOpen, setDialogOpen] = useState(false);
const [editingAudience, setEditingAudience] = useState<Audience | null>(null);

// Website context
const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

// Delete confirmation
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [audienceToDelete, setAudienceToDelete] = useState<Audience | null>(null);
```

### AudienceDialog State

```typescript
// Form fields
const [name, setName] = useState("");
const [websiteId, setWebsiteId] = useState("");
const [selectedWallets, setSelectedWallets] = useState<string[]>([]);

// Wallet loading
const [wallets, setWallets] = useState<WalletRow[]>([]);
const [walletsLoading, setWalletsLoading] = useState(false);

// Filters for wallet selector
const [walletSearch, setWalletSearch] = useState("");
const [walletTypes, setWalletTypes] = useState<string[]>([]);
const [walletSortBy, setWalletSortBy] = useState<"last_seen" | "first_seen" | "visit_count">("last_seen");
const [walletSortDir, setWalletSortDir] = useState<"desc" | "asc">("desc");
```

---

## 4. WalletSelector Component Details

This is the most complex component - a searchable, paginated wallet picker.

### Features

1. **Search**: Filter by wallet address (debounced 300ms)
2. **Type Filter**: Multi-select for wallet action types (connected, staked, purchased, signed)
3. **Sort**: Sort by last_seen (default), first_seen, or visit_count
4. **Selection**: Checkbox for each wallet, "Select All" for current page
5. **Pagination**: Load more / infinite scroll for large datasets
6. **Persistence**: When editing, pre-check wallets from existing audience

### UI Layout

```text
+----------------------------------------------------------+
|  Select Wallets                                           |
+----------------------------------------------------------+
|  [Search by address...        ]  [Type ▼]  [Sort ▼]      |
+----------------------------------------------------------+
|  [✓] Select all on this page           Showing 1-50 of 234|
+----------------------------------------------------------+
|  Wallet Address          Type          Last Seen  Visits  |
|  ─────────────────────────────────────────────────────────|
|  [✓] 0x1234...abcd      connected      2h ago     12     |
|  [✓] 0x5678...efgh      staked         1d ago     8      |
|  [ ] 0x9abc...ijkl      purchased      3d ago     3      |
+----------------------------------------------------------+
|  [Load more...]                                           |
+----------------------------------------------------------+
|  Selected: 2 wallets                                      |
+----------------------------------------------------------+
```

---

## 5. Delete Confirmation

Use an AlertDialog for delete confirmation:

```text
+------------------------------------------+
|  Delete Audience?                        |
|                                          |
|  Are you sure you want to delete         |
|  "High-Value Traders"? This cannot       |
|  be undone.                              |
|                                          |
|           [Cancel]  [Delete]             |
+------------------------------------------+
```

---

## 6. File Changes Summary

| File | Change |
|------|--------|
| `src/lib/api.ts` | Add wallet list types and audience CRUD functions |
| `src/pages/Audiences.tsx` | Full rewrite: list view with create/edit/delete |
| `src/components/audiences/AudienceList.tsx` | New: audience table with actions |
| `src/components/audiences/AudienceDialog.tsx` | New: create/edit modal |
| `src/components/audiences/WalletSelector.tsx` | New: wallet picker component |
| `src/components/audiences/WalletTable.tsx` | New: wallet display table with checkboxes |
| `src/components/audiences/DeleteAudienceDialog.tsx` | New: delete confirmation |

---

## 7. Technical Considerations

### API Endpoint Distinction

The wallet list endpoint uses the analytics API base (`cdn.audiencescan.io/api`), while the audiences CRUD endpoints use the main API (`api-wldojy4riq-uc.a.run.app`):

```typescript
// Wallet list - analytics API
POST https://cdn.audiencescan.io/api/analytics/wallets

// Audiences CRUD - main API
GET/POST/PUT/DELETE https://api-wldojy4riq-uc.a.run.app/audiences
```

### Website Context

The page should read the selected website from localStorage (same pattern as Overview):
- If no website selected, show a message prompting user to select one
- When creating an audience, auto-populate website_id from context
- When listing audiences, optionally filter by current website

### Optimistic Updates

For better UX, implement optimistic updates:
- Delete: Remove from list immediately, rollback on error
- Create: Add to list on success, show loading state
- Update: Reflect changes immediately, rollback on error

### Wallet Selection Limits

Consider adding:
- Maximum wallet limit (e.g., 10,000 wallets per audience)
- Warning when selecting large numbers
- Bulk selection helpers ("Select all matching filters")

### Empty States

Handle three empty states:
1. No website selected: "Select a website to manage audiences"
2. No audiences yet: Current empty state with "Create your first audience"
3. No wallets found: "No wallets match your filters" in the selector

---

## 8. UX Refinements

### Responsive Design

- Mobile: Stack filters vertically, use full-width dialog
- Desktop: Inline filters, centered dialog with max-width

### Loading States

- Skeleton loaders for audience list
- Spinner on wallet table during search/filter
- Disabled "Create" button while submitting

### Success Feedback

- Toast notifications for create/update/delete actions
- Auto-close dialog on success
- Refresh list after mutations

