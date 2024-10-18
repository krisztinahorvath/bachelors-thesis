# Gamified Learning Management System

This is the web application that I developed for my bachelor's thesis titled `Enhancing Learning Experiences: A
Dynamic Approach to Interactive Web
Environments`.

# 1. Short Description

`Gamification` is a very efficient way of `enhancing` learning experiences by integrating game-like elements into non-game educational platforms. Most gamified
portals have some default gamification elements that students are forced to use,
without having the choice of removing or not interacting with them if they don’t
find them engaging.

In my thesis, I focus on implementing a `user-centered` gamified learning management system, that allows students to `customize` their experience by choosing the
different game elements they find stimulating and motivating from a given set. The
goal is to create a platform that is engaging and exciting for all students, not just for
the ones who prefer the exact game mechanics incorporated into the platform

Students are presented with a modern UI that utilizes gamification elements such as points, badges, levels, progress bars, and leaderboards to enhance their experience, motivate them to complete their assignments by turning them from mundane tasks into
fun and engaging activities, and positively impact their overall course performance.

# 2. Technologies

My implementation follows the client-server architecture. The server is an `ASP.NET Core Web API` developed in `C#`, storing data in an `MS SQL` database generated through migrations. The frontend stack consists of `React` with `TypeScript` and `Vite`, and the `Material UI` component library, which allowed me to create a modern, responsive, and dynamic user interface. Data from the server is provided to the client through HTTP endpoints.

# 3. Implementation

# Server

The server is an ASP.NET Core Web API developed with C#, managing `business logic`, `communication protocols`, and `data storage`, with a layered architecture:

- a `model layer` represents the domain data
- a `service layer` that handles data access and business logic, since most of the time the data has to be queried and returned directly, without too much additional processing. It uses asynchronous methods to fetch and modify data through LINQ queries, while also applying necessary logic and validations to process requests from controllers. Each service class corresponds to a controller and manages key entities.
- a `controller layer` routes HTTP requests, calls the service to do the necessary processing, and returns a response. It uses data transfer objects(DTOs) to hide unnecessary or sensitive data from the clients.

This design ensures that the backend can handle
HTTP requests efficiently, perform complex computations, manage authentication
and authorization processes, and interact with the database.

## Access Control

`Authentication` was implemented using `JWTs`. JWT settings are loaded from the application’s configuration, which includes a `32 byte secret key` for signing the tokens. The application expects an authorization header with a bearer token in incoming requests to verify the validity of the secret key used to sign the tokens and if the token is not yet expired.

`Authorization` is managed with ASP.NET Core's built-in authorization mechanisms with `authorization policies`. A user must be authenticated before making a request, if the request goes through, an `authorization filter` is applied for each endpoint. The are three authorization filters, one that only accepts requests from students, one that only accepts requests from teachers, and one that allows any authenticated user to perform
a request.

# Client

The client was developed using `React` with `TypeScript`, leveraging its component-based architecture, allowing me to create components that could be reused for teachers and students with minimal changes.

Additionally, React’s conditional rendering
of the components enabled me to create a `dynamic user interface`, that seamlessly
adapts based on the user’s role, permissions, or page settings. The web application
is fully `responsive` and makes use of some base `Material UI` components to offer a
pleasant and visually appealing user interface.

## Route Protection and Data Validation

I implemented `access control` for routes by adding a component that checks if users are authenticated and authorized before navigating. Unauthorized access results in the user being logged out and redirected to the home page.

Additionally, `client-side validations` such as format and completness are done before sending requests, with the server handling more in-depth validations like uniqueness and data integrity.

# 4. Features

The web application was designed for two user types: teachers and students, with a primary focus on students. Each user type has distinct features and are detailed below.

## General user features

- Register and log-in as teacher/student
- Update password
- Edit user profile
- Delete account

## Teacher features

Since the main focus of the platform was to enhance student experience by adding fun and visually appealing gamification elements, I kept the teacher dashboard simple, while still providing some important and useful features for managing course-related data such as:

- Add/update/delete courses
- Generate enrollment keys
- Add/remove teacher to/from course
- Remove student from course
- Add/update/delete assignments
- Grade student assignments
- Export grades as CSV files
- Import grades from spreadsheet

## Student features

The goal of the gamified platform is to engage and motivate students to complete their assignments and course work effectively and on time. Once a student is graded on an assignment, the grade is converted into points, levels, badges, and progress bars, adding a fun and interactive element to the learning experience. A lot of time and effort was put into designing a modern, visually appealing UI, ensuring that the game elements are both attractive and well-integrated.

Furthermore, students can customize their experience by choosing to enable or disable the integrated game elements, allowing them to tailor their learning environment to better suit their preferences and motivation levels.

The features offered to students are (the game elements are included in the courses' section):

- Enroll to course
- View course data
- View assignments
- View grades
- Enable/disable game elements (points, badges, levels, learboards, and progress bars)

_To see how the gamification features detailed bellow look in the web app check out the `ThesisPresentation.pdf` file, starting from slide 6._

### `Points`

Points are displayed in the form of `XPs` or `grades` on a scale of 0 to 10. If the XPs are
turned on in the page settings, the grades, leaderboard, and achievements sections
will display student grades as XPs, otherwise they will displayed as simple points.

### `Progress bars`

In the grades section of each course a progress bar is displayed showcasing how much of the course work a student has completed based on their grades
at their assignments. If the progress bars are disabled on the settings page, the
progress bar will not be rendered.

### `Levels`

There are `5 levels` represented by a stepper, and below it, the student’s current
points are displayed, as well as how many points are needed to reach the next level.
The criteria for achieving a level and the corresponding badge in the achievements
section are the same. If the levels are disabled, the
component will not be displayed. However, if the levels are enabled but the badges
are disabled, the badges will still appear in the stepper as a visual aid to indicate
status.

### `Badges`

Badges are awarded at each course for achieving different `milestones`. There are six
badges, five encouraging getting higher grades to reach an amount of points, and
one to encourage students to present their assignments on time to their instructors. When a badge is not unlocked, it appears as a gray, blurred image. If the badges are disabled in the page settings, the achievements section will not
appear in the course menu.

### `Leaderboards`

Each course has a leaderboard that displays the `top 10` students based on the number of points achieved, to encourage `healthy competition` and for students to see it as
a challenge to appear on the leaderboard.

Each leaderboard card contains the student’s `position` on the leaderboard, their
`profile picture`, `nickname`, the `achieved points` or `XPs`, their `level`, and achieved `badges`. If any of these elements is disabled in the page settings, it will
not be displayed.
If the leaderboards are disabled, the leaderboard section will not
appear in the course menu.
