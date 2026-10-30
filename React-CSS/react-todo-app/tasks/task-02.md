---
topic: "Component Props"
taskNumber: 2
---

## Task 2: Create a ToDoItem Component

**Description:**  
Create a component `ToDoItem` that accepts a todo object as a prop and displays its title and completed status. The component should show the todo title and indicate whether it's completed or not.

**Requirements:**
- Accept a `todo` prop with `id`, `title`, and `completed` properties
- Display the todo title
- Show completion status (completed/not completed) based on the `completed` boolean
- Export the component as `export const ToDoItem`
- Handle both completed and uncompleted todos

**Example:**
```jsx
<ToDoItem todo={{id:1, title:'Test', completed:true}} />
// Output: Test (completed)
```

**Theoretical Questions:**
1. How do you destructure props in React functional components?
In react funcitonal component we can destrucutre props and get the values one by one, we can either access them directly in the function parameter list (e.g., ({ title, completed })) or access them via the props object and destructure them inside the function body. 

2. How do you pass and type props for a component using TypeScript interfaces?
for example:
interface ButtonProps {
  label: string;
  onClick: () => void;
}
export const CustomButton = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};

3. How can you conditionally render content in React components? 
By checking the condition, for example:
if(publish){
    <div>published</div>
}else{
    <p>not published</p>
}

or: 
<p>{published ?? 'published' : 'not published'}</p>
