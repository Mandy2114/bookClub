# Book Club
<body>
  <%- include('../partials/_navbar.ejs') %>
  <div>
    <p>Recipe: <%= recipe.name %></p>
    <br />
    <p>Instructions: <%= recipe.instructions %></p>
    <br />
    <p>Ingredients:</p>
    <% recipe.ingredients.forEach((ingredient) => { %> <%= ingredient.name %>
    <% })%>
  </div>
  <form action="/recipes/<%= recipe._id %>?_method=DELETE" method="POST">
    <button type="submit">Delete Recipe</button>
  </form>
  <a href="/recipes/<%= recipe._id %>/edit">
    <button>Edit Recipe</button>
  </a>
</body>