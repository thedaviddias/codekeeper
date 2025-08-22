# Real Examples: AI Code Before & After Guardrails

## 🎯 Type Safety Examples

### Before Guardrails (AI-generated)
```typescript
// AI might generate this when unsure about types
function processApiResponse(response: any) {
  const data = response.data as any;
  const users = data.users as any[];

  return users.map(user => ({
    id: user.id as string,
    name: user.name as string,
    email: user.email as string,
    // AI doesn't know what fields exist
    ...user
  }));
}
```

### After Guardrails (Enforced)
```typescript
// Guardrails force proper typing
interface ApiResponse {
  data: {
    users: User[];
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

function processApiResponse(response: ApiResponse): ProcessedUser[] {
  const { users } = response.data;

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date(user.createdAt),
  }));
}
```

## 📁 Import Pattern Examples

### Before Guardrails (AI-generated)
```typescript
// AI creates messy imports
import { Button } from '../../../components/Button';
import { Input } from '../../../../shared/Input';
import { useApi } from '../../../../../hooks/useApi';
import { formatDate } from '../../../../../../utils/date';

// Or AI creates barrel files everywhere
import { Button, Input, Modal, Form } from '@/components';
```

### After Guardrails (Enforced)
```typescript
// Clean, explicit imports
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApi } from '@/hooks/api/useApi';
import { formatDate } from '@/lib/utils/date';
```

## 🏗️ Architecture Examples

### Before Guardrails (AI-generated)
```
src/
  components/
    UserProfile.tsx
    UserList.tsx
    UserForm.tsx
    api.ts          // ❌ API logic mixed with components
    types.ts        // ❌ Types scattered
    utils.ts        // ❌ Utils mixed with components
    hooks.ts        // ❌ Hooks mixed with components
```

### After Guardrails (Enforced)
```
components/
  ui/
    UserProfile.tsx
    UserList.tsx
    UserForm.tsx
lib/
  api/
    users.ts        // ✅ API logic separated
  types/
    user.ts         // ✅ Types organized
  utils/
    validation.ts   // ✅ Utils organized
hooks/
  api/
    useUsers.ts     // ✅ Hooks organized
```

## 📝 Documentation Examples

### Before Guardrails (AI-generated)
```typescript
// AI generates code without documentation
function validateUserInput(data) {
  if (!data.name || data.name.length < 2) {
    throw new Error('Invalid name');
  }
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  return true;
}
```

### After Guardrails (Enforced)
```typescript
/**
 * Validates user input data for registration
 * @param {UserInput} data - The user input data to validate
 * @returns {boolean} True if validation passes
 * @throws {ValidationError} When input data is invalid
 */
function validateUserInput(data: UserInput): boolean {
  if (!data.name || data.name.length < 2) {
    throw new ValidationError('Name must be at least 2 characters long');
  }
  if (!data.email || !data.email.includes('@')) {
    throw new ValidationError('Email must be a valid email address');
  }
  return true;
}
```

## 🧩 Complexity Examples

### Before Guardrails (AI-generated)
```typescript
// AI generates a massive component
function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);

  // 200+ lines of mixed concerns...
  // API calls, data processing, UI logic, event handlers
  // All in one massive component
}
```

### After Guardrails (Enforced)
```typescript
// Guardrails suggest breaking it down
function UserDashboard() {
  const { users, loading, error } = useUsers();
  const { filters, setFilters } = useUserFilters();
  const { sortBy, setSortBy } = useUserSorting();
  const { page, setPage } = usePagination();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <DashboardLayout>
      <UserFilters filters={filters} onFiltersChange={setFilters} />
      <UserTable
        users={users}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <Pagination page={page} onPageChange={setPage} />
    </DashboardLayout>
  );
}
```

## 🔒 Security Examples

### Before Guardrails (AI-generated)
```typescript
// AI might accidentally include secrets
const config = {
  apiKey: 'sk-1234567890abcdef', // ❌ Hardcoded secret
  baseUrl: 'https://api.example.com',
  timeout: 5000
};

// Or AI might create unsafe input handling
function processUserInput(input) {
  return eval(input); // ❌ Dangerous!
}
```

### After Guardrails (Enforced)
```typescript
// Guardrails catch these issues
const config = {
  apiKey: process.env.API_KEY, // ✅ Environment variable
  baseUrl: process.env.API_BASE_URL,
  timeout: 5000
};

function processUserInput(input: string): string {
  return input.trim().toLowerCase(); // ✅ Safe processing
}
```

## 🎯 Real-World Scenarios

### Scenario 1: New Feature Development
**AI Prompt**: "Create a user management system"

**Without Guardrails**:
- AI generates 1000+ lines in a single file
- Mixed concerns (UI, API, validation)
- No type safety
- Inconsistent patterns

**With Guardrails**:
- AI generates properly structured code
- Separate files for different concerns
- Type-safe interfaces
- Consistent patterns

### Scenario 2: Bug Fix
**AI Prompt**: "Fix the user authentication bug"

**Without Guardrails**:
- AI might add `as any` to bypass type errors
- Could introduce new bugs while fixing old ones
- No documentation of the fix

**With Guardrails**:
- AI must provide proper types
- Changes are documented
- Fix is properly tested

### Scenario 3: Code Review
**Without Guardrails**:
- Reviewers spend time on style issues
- Inconsistent patterns across the codebase
- Hard to understand AI-generated code

**With Guardrails**:
- Reviewers focus on logic and business requirements
- Consistent patterns make code easier to understand
- Clear documentation helps reviewers

## 🚀 The Impact

### Development Speed
- **Before**: 2 hours debugging type errors
- **After**: 0 hours - errors caught immediately

### Code Quality
- **Before**: Inconsistent patterns, hard to maintain
- **After**: Consistent, maintainable code

### Team Collaboration
- **Before**: "Whose style should we follow?"
- **After**: "The guardrails decide for us"

### AI Effectiveness
- **Before**: AI generates code that needs significant cleanup
- **After**: AI generates code that's ready to use

---

*These examples show how guardrails transform AI-generated code from "works but messy" to "works and follows best practices."*
