const form = document.getElementById('student-form');
const list = document.getElementById('student-list');
const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');

let editMode = false;
let currentEditId = null;

function fetchStudents() {
  fetch('http://localhost:5000/students')
    .then(res => res.json())
    .then(data => {
      list.innerHTML = '';
      data.forEach(student => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = `ID: ${student.id}, Name: ${student.name}`;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => startEdit(student);
        editBtn.style.marginRight = '6px';

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteStudent(student.id);

        const buttonGroup = document.createElement('div');
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(delBtn);

        li.appendChild(span);
        li.appendChild(buttonGroup);
        list.appendChild(li);
      });
    });
}

function deleteStudent(id) {
  fetch(`http://localhost:5000/students/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Delete failed');
      return response.text();
    })
    .then(() => fetchStudents())
    .catch(err => console.error('Delete error:', err));
}

function startEdit(student) {
  idInput.value = student.id;
  nameInput.value = student.name;
  currentEditId = student.id;
  editMode = true;
  form.querySelector('button[type="submit"]').textContent = 'Update Student';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const student = {
    id: idInput.value.trim(),
    name: nameInput.value.trim()
  };

  if (!student.id || !student.name) return;

  if (editMode) {
    fetch(`http://localhost:5000/students/${encodeURIComponent(currentEditId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    }).then(() => {
      editMode = false;
      currentEditId = null;
      form.reset();
      form.querySelector('button[type="submit"]').textContent = 'Add Student';
      fetchStudents();
    });
  } else {
    fetch('http://localhost:5000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    }).then(() => {
      form.reset();
      fetchStudents();
    });
  }
});

fetchStudents();
