const $ = require("jquery");
const Store = require("electron-store");

const store = new Store();

// store.clear();
// console.log("🦄 :", store.store);

// On document.ready, render store
$(() => {
  for (value of store) {
    const id = value[0];
    const { title, completed } = value[1];
    renderTodo(title, completed, id);
  }
});

// Clear all completed todos from store and DOM
function clearCompletedTodos() {
  for (value of store) {
    const id = value[0];

    if (value[1].completed) {
      store.delete(id);
      $(`#check-${id}`).remove();
      $(`#label-${id}`).remove();
    }
  }
}

// Pop up for clearing to dos
$("#clear-completed").on("click", (e) => {
  if (confirm("Are you sure you want to delete all completed tasks?")) {
    clearCompletedTodos();
  }
  e.preventDefault();
});

// On checkbox press
$(document).on("change", ":checkbox", (e) => {
  // Toggle todo
  const id = e.target.id.split("-")[1];
  const todo = store.get(id);

  const completed = !todo.completed;

  if (store.has(id)) {
    store.set(id, { ...todo, completed });
    const labelId = `#label-${id}`;

    if (completed) {
      return $(labelId).addClass("todo-completed");
    }

    $(labelId).removeClass("todo-completed");
  }
});

function renderTodo(title, completed = false, id = store.size) {
  const todoContainer = $("#todos");
  const row = document.createElement("div");

  const checkboxId = `check-${id}`;
  const labelId = `label-${id}`;

  let checkbox;

  if (completed) {
    checkbox = `<input type="checkbox" id="${checkboxId}" checked />
        <label class="todo-completed ml-2" for="${checkboxId}" id="${labelId}">
            ${title}
        </label>`;
  } else {
    checkbox = `<input type="checkbox" id="${checkboxId}"/>
    <label class="todo ml-2" for="${checkboxId}" id="${labelId}">
       ${title}
    </label>`;
  }

  row.innerHTML = checkbox;
  todoContainer.append(row);
}

function addNewTodo(value) {
  // Render new todo
  renderTodo(value);
  // Save in store
  store.set(store.size.toString(), { title: value, completed: false });
}

// Handle new todo submit
$("#todo-form").on("submit", (e) => {
  const value = $("#todo").val();

  if (!value) {
    return;
  }

  addNewTodo(value);
  e.preventDefault();
  $("#todo-form").trigger("reset");
});
