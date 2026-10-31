---
topic: "State Management"
taskNumber: 3
---

## Task 3: Add ToDo with useState

**Description:**  
Create a component with a button and an input. Typing a title and clicking the button should add a new todo to the list (use useState for state management). The component should maintain a list of todos and allow adding new ones.

**Requirements:**
- Use `useState` hook to manage todos state
- Include an input field with placeholder "Add todo"
- Include an "Add" button
- Add new todo to the list when button is clicked
- Display all todos in the list
- Export the component as `export const AddToDo`
- Handle input changes and form submission

**Example:**
```jsx
// User types "Walk dog", clicks Add, sees "Walk dog" in the list
```

**Theoretical Questions:**
1. What is the useState hook and how does it work?
useState is the react hook that is used for storing data, it has state_ where we save data and the setter funciton (for example: setState) that is the only funciton able ot change state. Main thing is that state is not durable to refreshing component
2. How do you update state in React functional components?
With setter funciton
3. What is the difference between state and props in React? 
props is the data passed from parent component to child comp. State is the data that belongs to one specific component but can be shared as a props