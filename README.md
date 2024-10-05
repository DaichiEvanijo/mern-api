<h2>Please log in with the following usernames and passwords <br>
to see how the website behaves based on roles !! </h2>
<ul>
<li>Username:Daichi Password:Aa$12345 roles:[2001, 5150]</li>
<li>Username:Takahiro Password:Bb$12345 roles:[2001]</li>
<li>Username:David Password:Cc$12345 roles:[2001]</li>
<li>Username:John Password:Dd$12345 roles:[2001]</li>
<li>Username:Stefanie Password:Ee$12345 roles:[2001]</li>
</ul>

<p>const ROLES_LIST = {<br/>
  "Admin":5150,<br/>
  "Editor":1984,<br/>
  "User":2001,<br/>
}</p>


<p>※Without login → <br/>website visitor can only see posts</p>
<p>※Login as User(2001) (e.g.Takahiro) → <br/>login user is able to create, edit/delete(only the posts only this user created), see the posts by users and react by liking a post created by other users</p>
<p>※Login as Admin(5150) (e.g.Daichi) → <br/>login user is able to create, edit/delete(only the posts only this user created), see the posts by users and react by liking a post created by other users and visit the Admin page</p>


<h3>Implemented skills</h3>
<p>MERN, JWT Authorization/Authentication, role-based protected routes, persistent login, Typesript, Redux toolkit, Zod, React-hook-form, SASS</p>
