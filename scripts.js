const saveBtn = document.getElementById("btnSave");
const inputTodo = document.getElementById("name");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const saveTodo = () => {
  // Ensure input exists and has a non-empty value
  if (!inputTodo) {
    console.error('Input element with id "name" not found.');
    return;
  }

  const nameValue = inputTodo.value ? inputTodo.value.trim() : "";
  if (!nameValue) {
    alert("Vui lòng nhập tên todo.");
    return;
  }

  const myTodo = {
    id: getRandomInt(1, 100000),
    name: nameValue,
  };

  const currentTodoStr = localStorage.getItem("todo");

  if (currentTodoStr) {
    // Convert String to Object và đảm bảo nó là array
    let currentTodo = JSON.parse(currentTodoStr);

    // Kiểm tra nếu không phải array thì chuyển thành array
    if (!Array.isArray(currentTodo)) {
      currentTodo = [currentTodo];
    }

    // Thêm todo mới vào array
    currentTodo.push(myTodo);
    localStorage.setItem("todo", JSON.stringify(currentTodo));
  } else {
    // Nếu chưa có todo nào, tạo array mới với todo đầu tiên
    localStorage.setItem("todo", JSON.stringify([myTodo]));
  }

  // success — redirect back to index
  window.location.href = "index.html";
};

if (saveBtn) {
  saveBtn.addEventListener("click", saveTodo);
}

// Allow Enter key to save
if (inputTodo) {
  inputTodo.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveTodo();
    }
  });
}

const generateTodoTable = () => {
  const todoListStr = localStorage.getItem("todo");
  const tbody = document.querySelector("#todoList tbody");
  const table = document.querySelector("#todoList");

  if (!tbody) return;

  // Remove empty state if it exists
  const emptyState = document.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }

  if (todoListStr) {
    let todoList = JSON.parse(todoListStr);

    if (todoList && Array.isArray(todoList) && todoList.length) {
      tbody.innerHTML = "";
      todoList.forEach((todo) => {
        tbody.innerHTML += `
        <tr>
          <td>${todo.id}</td>
          <td>${todo.name}</td>
          <td>
            <button data-id="${todo.id}" class="btnDelete">🗑️ Delete</button>
          </td>
        </tr>
        `;
      });
      if (table) table.style.display = "table";
    } else {
      showEmptyState();
    }
  } else {
    showEmptyState();
  }
};

const showEmptyState = () => {
  const tbody = document.querySelector("#todoList tbody");
  const table = document.querySelector("#todoList");

  if (tbody && table) {
    table.style.display = "none";
    const container = document.querySelector(".container");
    let emptyState = document.querySelector(".empty-state");

    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">📋</div>
        <p>Chưa có công việc nào. Hãy thêm công việc mới!</p>
      `;
      container.appendChild(emptyState);
    }
  }
};

generateTodoTable();

// Use event delegation for delete buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnDelete")) {
    const id = e.target.getAttribute("data-id");
    if (id) {
      if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
        handleDeleteTodo(id);
      }
    }
  }
});

const handleDeleteTodo = (id) => {
  const todoListStr = localStorage.getItem("todo");
  if (todoListStr) {
    const todoList = JSON.parse(todoListStr);
    const newTodo = todoList.filter((todo) => todo.id != id);
    localStorage.setItem("todo", JSON.stringify(newTodo));
    generateTodoTable(); // Refresh table without reload
  }
};
