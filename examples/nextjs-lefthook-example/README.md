# Next.js + Lefthook + CodeKeeper Example

This example shows CodeKeeper working with **Next.js 14 + Lefthook** - the fastest git hooks manager with parallel execution.

## 🚀 Quick Test

```bash
# Install dependencies
npm install

# Install Lefthook hooks
npx lefthook install

# See the problems CodeKeeper catches
npm run demo:problems

# Try to commit (will fail with validation errors)
git add .
git commit -m "test commit"

# Fix the problems and push successfully
npm run demo:fix
git add .
git commit -m "fixed with CodeKeeper"
```

## ⚡ Why Lefthook?

**Lefthook** is the fastest git hooks manager:
- **Parallel execution** - Runs multiple checks simultaneously
- **YAML configuration** - Simple, readable setup
- **Cross-platform** - Works on Mac, Linux, Windows
- **Zero dependencies** - Single binary, no Node.js required for hooks
- **Selective runs** - Only processes changed files

### Performance Comparison
| Hook Manager | Speed | Setup | Config |
|--------------|-------|--------|---------|
| **Lefthook** | 🟢 Fastest | 🟢 1 command | 🟢 YAML |
| Husky + lint-staged | 🟡 Good | 🟡 Multiple steps | 🟡 JSON |  
| pre-commit | 🔴 Slower | 🔴 Python setup | 🟡 YAML |

## 🛠️ What's Included

### Next.js 14 Features
- **App Router** - Modern Next.js routing
- **Server Components** - React Server Components
- **TypeScript** - Full TypeScript support
- **Built-in ESLint** - Next.js ESLint configuration
- **Turbopack** - Fast bundler for development

### Validation Pipeline
1. **Pre-commit (parallel)**:
   - ESLint + auto-fix → CodeKeeper validation → Prettier formatting
2. **Pre-push (sequential)**:
   - Full CodeKeeper validation → Build check → Type check

## 📁 Project Structure

```
nextjs-lefthook-example/
├── app/                          # Next.js App Router
│   ├── components/
│   │   ├── BadServerComponent.tsx    # ❌ Server Component issues
│   │   ├── BadClientComponent.tsx    # ❌ Client Component issues
│   │   └── GoodComponent.tsx         # ✅ Fixed version
│   ├── api/
│   │   └── problematic-route.ts      # ❌ API route problems
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── scripts/validation/          # CodeKeeper scripts
├── lefthook.yml                # Lefthook configuration
├── next.config.js              # Next.js config
└── .eslintrc.json             # ESLint + Next.js rules
```

## 🐛 Next.js Specific Problems

### 1. Server Component Issues (`BadServerComponent.tsx`)
```tsx
// ❌ AI often mixes client and server component patterns
import { useState } from 'react'; // Client hook in server component!

const BadServerComponent = async ({ searchParams }: any) => {
  // ❌ Unsafe type assertion
  const params = searchParams as any;
  
  // ❌ Client-side hook in server component
  const [data, setData] = useState();
  
  // ❌ Fetch without error handling
  const response = await fetch(`/api/data?q=${params.query}`);
  const result = await response.json() as any;
  
  return <div>{result.naem}</div>; // ❌ Typo will crash
};
```

**CodeKeeper Errors:**
```
❌ Server Component Issues:
   - Client hook 'useState' used in Server Component
   - Unsafe type assertions (2 found)
   - Missing error handling in fetch
   - Typo in property access: 'naem'
```

### 2. Client Component Issues (`BadClientComponent.tsx`)
```tsx
// ❌ Missing 'use client' directive but using client features
import { useRouter } from 'next/navigation';

const BadClientComponent = ({ data }: any) => {
  const router = useRouter(); // Client hook without 'use client'
  
  // ❌ Direct DOM access (bad pattern)
  const handleClick = () => {
    document.getElementById('modal').style.display = 'block';
  };
  
  return <div onClick={handleClick}>{(data as any).title}</div>;
};
```

**CodeKeeper Errors:**  
```
❌ Client Component Issues:
   - Missing 'use client' directive for client hooks
   - Direct DOM manipulation detected
   - Unsafe type assertion 'as any'
```

### 3. API Route Problems (`problematic-route.ts`)
```tsx
// ❌ API route with multiple issues
export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') as string; // Unsafe assertion
  
  // ❌ No input validation
  const data = await fetch(`https://api.example.com/search?q=${query}`);
  const result = await data.json() as any;
  
  // ❌ No error handling, direct return of external data
  return Response.json(result);
}
```

**CodeKeeper Errors:**
```
❌ API Route Issues:
   - Missing input validation
   - Unsafe type assertions
   - No error handling
   - Potential security risk: Direct external data return
```

## ✅ Fixed Versions

### Server Component (Fixed)
```tsx
// ✅ Proper Server Component
interface SearchParams {
  query?: string;
}

interface ServerComponentProps {
  searchParams: SearchParams;
}

/**
 * Server component that fetches and displays data
 * @param searchParams - URL search parameters
 */
const GoodServerComponent = async ({ searchParams }: ServerComponentProps) => {
  const query = searchParams.query || '';
  
  try {
    const response = await fetch(`/api/data?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const result: { name: string; title: string } = await response.json();
    
    return (
      <div>
        <h1>{result.title}</h1>
        <p>User: {result.name}</p>
      </div>
    );
  } catch (error) {
    return <div>Error loading data</div>;
  }
};
```

### Client Component (Fixed)
```tsx
'use client'; // ✅ Proper directive

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ClientComponentProps {
  data: {
    title: string;
    id: string;
  };
}

/**
 * Client component with proper state management
 * @param data - Component data with title and id
 */
const GoodClientComponent = ({ data }: ClientComponentProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleClick = () => {
    setIsModalOpen(true); // ✅ React state instead of DOM manipulation
  };
  
  return (
    <>
      <div onClick={handleClick}>{data.title}</div>
      {isModalOpen && (
        <div className="modal">
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
};
```

### API Route (Fixed)
```tsx
import { NextRequest } from 'next/server';

// ✅ Input validation schema
interface SearchQuery {
  q: string;
}

function validateSearchQuery(params: URLSearchParams): SearchQuery {
  const query = params.get('q');
  
  if (!query || query.length < 1) {
    throw new Error('Query parameter is required');
  }
  
  if (query.length > 100) {
    throw new Error('Query too long');
  }
  
  return { q: query.trim() };
}

/**
 * Search API endpoint with proper validation and error handling
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Proper request typing and validation
    const { searchParams } = new URL(request.url);
    const { q } = validateSearchQuery(searchParams);
    
    const response = await fetch(
      `https://api.example.com/search?q=${encodeURIComponent(q)}`,
      { 
        headers: { 'User-Agent': 'MyApp/1.0' },
        next: { revalidate: 300 } // Next.js caching
      }
    );
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // ✅ Data validation before returning
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from external API');
    }
    
    return Response.json(data);
    
  } catch (error) {
    console.error('Search API error:', error);
    
    return Response.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
```

## 🧪 Testing the Lefthook Setup

### Step 1: Install and Setup
```bash
npm install
npx lefthook install  # Installs git hooks
```

### Step 2: See Validation Errors
```bash
npm run demo:problems
```
Output:
```
⚡ Lefthook: Running pre-commit hooks
❌ ESLint found 15 issues:
  - 8 TypeScript errors
  - 4 Next.js specific issues  
  - 3 React hooks violations

❌ CodeKeeper found 12 validation errors:
  - 5 unsafe type assertions
  - 3 missing 'use client' directives
  - 2 server component violations
  - 2 API route security issues
```

### Step 3: Try to Commit (Fast Parallel Execution)
```bash
git add .
git commit -m "test commit"
```
Output:
```
⚡ Lefthook: Running pre-commit hooks in parallel
  ├── lint (running...)
  ├── validate (running...)  
  └── format (running...)

❌ Validation failed:
  - lint: 15 ESLint errors
  - validate: 12 CodeKeeper errors
  - format: 3 files formatted

Commit blocked! Fix issues and try again.
```

### Step 4: Parallel Execution Speed
**Lefthook runs all checks simultaneously:**
- Traditional (sequential): ESLint → CodeKeeper → Prettier = ~15 seconds
- Lefthook (parallel): All at once = ~5 seconds

### Step 5: Pre-push Validation
```bash
git push
```
Output:
```
⚡ Lefthook: Running pre-push hooks
  ├── full-validation ✅ (2.1s)
  ├── build-check ✅ (8.3s) 
  └── type-check ✅ (1.2s)

Push successful!
```

## 📊 Lefthook Configuration Breakdown

### Pre-commit (Parallel)
```yaml
pre-commit:
  parallel: true  # 🚀 Runs simultaneously
  commands:
    lint:
      glob: "*.{js,jsx,ts,tsx}"
      run: npx eslint --fix {staged_files}
      stage_fixed: true  # Re-stage fixed files
      
    validate:
      glob: "*.{ts,tsx}" 
      run: node scripts/validate-all.js {staged_files}
      
    format:
      glob: "*.{js,jsx,ts,tsx,json,css,md}"
      run: npx prettier --write {staged_files}
      stage_fixed: true
```

### Pre-push (Sequential)
```yaml
pre-push:
  parallel: false  # Run one after another
  commands:
    full-validation:
      run: node scripts/validate-all.js --all --verbose
    build-check:
      run: npm run build  # Ensure Next.js builds
    type-check:
      run: npx tsc --noEmit  # TypeScript check
```

## 🎯 Customization

### Adjust Hook Performance
```yaml
# For faster commits (skip some checks)
pre-commit:
  commands:
    quick-lint:
      glob: "*.{ts,tsx}"
      run: npx eslint {staged_files} --quiet
      
# For thorough validation (slower but comprehensive)  
pre-commit:
  commands:
    thorough-validation:
      run: |
        npm run lint
        npm run validate:all
        npm run test
        npx tsc --noEmit
```

### Next.js Specific Rules
```yaml
# Custom validation for Next.js patterns
pre-commit:
  commands:
    nextjs-checks:
      glob: "**/app/**/*.{ts,tsx}"
      run: node scripts/check-nextjs-patterns.js {staged_files}
```

## 🔧 IDE Integration

### VS Code Settings
```json
// .vscode/settings.json
{
  "eslint.workingDirectories": ["."],
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm Integration
1. Enable ESLint: **Settings** → **ESLint** → **Automatic configuration**
2. Add Lefthook as External Tool:
   - **Program**: `lefthook`
   - **Arguments**: `run pre-commit`

## 🚀 Next Steps

1. **Copy to your Next.js project**: Use as a template
2. **Customize Lefthook config**: Adjust for your team's workflow  
3. **Add more hooks**: Consider `commit-msg` for commit message validation
4. **Monitor performance**: Use `lefthook dump` to see hook execution times
5. **Team training**: Share the parallel validation benefits

## 📈 Performance Benefits

With Lefthook + CodeKeeper:
- **3x faster git hooks** (parallel vs sequential)
- **Instant feedback** on code issues
- **Automatic fixing** of simple problems
- **Selective validation** (only changed files)
- **Build-time error prevention**

---

**This example shows the fastest way to add CodeKeeper to Next.js projects with minimal setup time!**