---
topic: "useEffect Hook"
taskNumber: 8
---

## Task 8: Fetch ToDos from API

**Description:**  
Use `useEffect` to fetch todos from an API endpoint (e.g., `/api/todos`) when the component mounts and display them. The component should handle loading states and display fetched data.

**Requirements:**
- Use `useEffect` hook to fetch data on component mount
- Use `useState` to manage todos and loading state
- Fetch data from a mock API endpoint
- Display fetched todos in a list format
- Handle loading state appropriately
- Export the component as `export const FetchToDos`
- Use proper error handling for API calls

**Example:**
```jsx
// On mount, fetch and display todos from /api/todos
```

**Theoretical Questions:**
1. What is the useEffect hook and when should you use it?
its a react hook that we use to execute some funcitons based on conditions, useeffect has a dep.array that we use to pass conditions/variables, when they change useeffect block executes again. if we leave it empty, it means that it will execute only on mount 
2. How do you handle async operations in useEffect?
with async/await and loaders i guess. basically, useeffect is used for  async funcitons, cause we need data to be fetched as soon as possible, but if it takes some time we can display the laoders in meanttime.
3. What is the difference between useEffect and useState hooks? 
usestate only saves data, useefects  execute things/funcitons in its block based on dep.array. but they work togather well.