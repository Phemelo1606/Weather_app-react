Topic: ReactTS <br />
Submission Date: 07 October 2025 <br />
Time: 09:00 <br /> <br />

Please submit by pushing to your GitHub repository and submitting the submission form

# Title: Task 3 - ReactTS Job Application Tracker 

## Objective
The objective of this task is to assess your understanding of React navigation, routing, URL queries and URL parameters, while testing your research skills when it comes to finding out ways to use new technology.

<strong>This is the third official task for React based on Lesson 3.</strong>
 
<strong>Scenario</strong>: You are tasked with building a simple (MVP) of a web application that allows job applicants to track the number of jobs they’ve applied for, which will help them assess how many applications are successful, pending and rejected. (You can extend the app in your free time to add more functionality such as an actual database, as this is only a mock application).


## Requirements

### Interface
<ol>
  <li>Create a user-friendly interface that is intuitive and easy to use</li>
  <li>The interface should be responsive to different screens</li>
  <li>Interface should make use of aesthetically pleasing color combinations</li>
  <li>The interface should have a good layout that is easy to navigate</li>
  <li>
    Pages
    <ul>
      <li>Six Pages: Login, Registration, Home, landing, more details page (job page), 404 page</li>
      <li>
        Registration Page: New users can register with the following details:
        <ul>
          <li>Username</li>
          <li>Password</li>
        </ul>
      </li>
      <li>Login Page: Users can log in with their credentials.</li>
      <li>Home Page: Display Jobs you applied for</li>
      <li>Landing Page: Displays details about the purpose of the web application. You can be creative in terms of the other details to include
      </li>
      <li>
        Job Page: This page can be used to display more details about the job and the company, such as address, contact details, duties, requirements, and any data applicants could find relevant to know about the company for interview purposes. You can use your creativity to see what details you want users to optionally add, bear in mind to include all necessary inputs.</li>
      <li>404 page: Catch all non-existent paths</li>
    </ul>
  </li>
</ol> 


### Functionality: 
1. Add Function: Users can add new jobs to the Job Application Tracker with the following details:
   <ul>
     <li>Company name</li>
     <li>Role</li>
     <li>Status: Applied, Interviewed, Rejected</li>
     <li>Date applied</li>
     <li>Job duties</li>
   </ul>
3. Delete Function: Users can delete existing Jobs from the job-application-tracker.
4. Update Function: Users can edit existing jobs on the job-application tracker.
5. Search Function: Users can search for items by company or role. The searched item should reflect on the URL bar
6. Status colors: use colours to represent status (e.g., Red for Rejected, Yellow for Applied, Green for Interviewed).
7. Filter function: Users can filter the jobs according to job status. The filter should reflect on the URL bar
8. Sort function: Users can sort by date. Descending and ascending. This should reflect on the URL bar


### General Requirements:
1. Use the previous design (color scheme, design style, and properties) to formulate a new design for the application
2. Implement CRUD (Create, Read, Update, Delete) operations to meet the functional requirements of the application
3. Use <a target="blank" href="https://www.npmjs.com/package/json-server">JSON server</a> to store the link details
4. Ensure the application is responsive and user-friendly
5. Implement user authentication and authorization to protect user data
6. Make sure to use queries and parameters in your application, allowing users to interact with the application from the URL bar while ensuring predictable results when the URL is updated.
7. Use proper validation for input fields to prevent errors.
8. Use protected routing in relevant routes/paths

### Persistence
1. Make use of JSON server to store the link details
 
### Concepts the task covers
1. Arrays and array methods
2. Objects and object method
3. React components
4. React state
5. React props
6. React hooks
7. JSON object and its methods
8. Web page responsiveness
9. Form validation
10. Design principles
11. React router navigation
12. Git principles
    <ul>
      <li>Git cloning</li>
      <li>Git branching</li>
      <li>Pull requests</li>
    </ul>

### Resources
1. <a target="blank" href="https://www.npmjs.com/package/json-server">JSON server</a>
2. <a target="blank" href="https://reactrouter.com/">React Router</a>
3. <a target="blank" href="https://react.dev">React</a>
4. <a target="blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts">Mozilla Developer: Flexbox basics</a>
5. <a target="blank" href="https://css-tricks.com/complete-guide-css-grid-layout/">CSS Tricks: CSS Grid Layout</a>
6. <a target="blank" href="https://www.w3schools.com/git/">W3Schools: Git</a>



### Instructions:
1. Come up with your own design for the problem statement
2. Use the design to guide your UI
3. Use the agreed logic design tools to plan your functionality
4. Follow your logic design tools to create the algorithm of the application
5. Test your application
6. Create a readme file for the application
7. Push your updates to the remote repo
8. Create a pull request to your main branch before the due date, with your mentor assigned

### Deliverables
1. Design file 
2. Step by step planning
3. Pseudo code
4. Design Implementation
5. Algorithm

### Evaluation Criteria:
1. User-friendliness of the design:
   <ul>
     <li>Is the design intuitive</li>
     <li>Does the design have a proper and understandable layout</li>
     <li>Does the app flow from one function to another in an understandable and easy to follow manner</li>
     <li>Does the app show notifications for processes occurring in the background</li>
     <li>Does the app use colors that make it easy for users to see everything on the UI</li>
     <li>Are elements easily accessible: colors, pressable height and width, font sizes</li>
     <li>Screen reader friendliness/accessibility considered</li>
     <li>Navigation segments are easily noticeable and accessible</li>
   </ul>
2. Aesthetics of the design
   <ul>
     <li>Does the design have colors that blend well together</li>
     <li>Does the design maintain a consistent typography</li>
     <li>Does the design have a consistent layout</li>
     <li>Does the design have a consistent spacing on the same screen sizes</li>
   </ul> 
3. Page interactivity:
    <ul>
      <li>Does the mouse cursor change when hovering over clickable elements</li>
      <li>Do clickable elements change color when hovered over</li>
      <li>Do buttons change states after onclicks and while processing</li>
      <li>Are loaders utilised while processing where relevant</li>
    </ul>
4. Proper utilisation of ReactTS features:
    <ul>
      <li>Did trainee create their own components</li>
      <li>Were the components reused where appropriate</li>
      <li>Was React state utilised properly</li>
      <li>Were props sent to components and handled properly</li>
      <li>Both representational and container components utilised</li>
      <li>Were reused components customised for similar design elements instead of creating new elements</li>
    </ul>
5. React router features:
    <ul>
      <li>React libraries (React router recommended) utilised for navigation</li>
      <li>Navlink used (in place of a tags) to route pages</li> 
      <li>Queries utilised</li>
      <li>Parameters utilised</li>
      <li>Protected routes utilised, and utilised correctly</li>
      <li>All page 404s handled correctly</li>
    </ul>
6. Responsiveness of the page: Is the page responsive to different web view sizes at different breakpoints, below is an example of common breakpoints:
    <ul>
      <li>320px</li>
      <li>480px</li>
      <li>768px</li>
      <li>1024px</li>
      <li>1200px</li>
    </ul>
