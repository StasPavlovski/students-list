// Этап 1. В HTML файле создайте верстку элементов, которые будут статичны(неизменны).

// window.addEventListener('load', () => {
//   console.log('Страница загружена!');
// });

// Этап 2. Создайте массив объектов студентов.Добавьте в него объекты студентов, например 5 студентов.

const studentsListOrig = [

  // Добавьте сюда объекты студентов
  {
    name: "Денис",
    surname: "Жданов",
    midname: "Игоревич",
    birthDate: new Date(1990, 10, 22),
    studyYear: 2018,
    faculty: "Технология сварки",
  },
  {
    name: "Олег",
    surname: "Иванов",
    midname: "Андреевич",
    birthDate: new Date(1992, 8, 14),
    studyYear: 2017,
    faculty: "Машиностроение",
  },
  {
    name: "Владислав",
    surname: "Углев",
    midname: "Петрович",
    birthDate: new Date(1989, 1, 8),
    studyYear: 2015,
    faculty: "Юриспруденция",
  },
  {
    name: "Андрей",
    surname: "Ростин",
    midname: "Андреевич",
    birthDate: new Date(1991, 2, 10),
    studyYear: 2020,
    faculty: "История",
  },
  {
    name: "Максим",
    surname: "Летов",
    midname: "Алексеевич",
    birthDate: new Date(1993, 5, 30),
    studyYear: 2021,
    faculty: "Информационные технологии",
  },
]

let studentsList = [];

async function loadFromDB() {
  const response = await fetch('http://localhost:3000/api/students')
  const data = await response.json()
  studentsList = await data;
  studentsList.forEach(e => {
    e.fullname = `${e.surname} ${e.name} ${e.midname}`;
    e.studyYearEnd = `${parseFloat(e.studyYear) + 4}`
  })
  console.log('loadFromDB --- studentList array is updated from DB', studentsList);
  return studentsList;
}

// studentsList = [async () => { await loadFromDB() }];

let studentsOfTable;
let deleteButton;
// deleteButton.style.position = 'absolute';

// studentsListOrig.get(fullName) {
//   return this.name + ' ' + this. surname + ' ' + this.midname
// }

// Этап 3. Создайте функцию вывода одного студента в таблицу, по аналогии с тем, как вы делали вывод одного дела в модуле 8. Функция должна вернуть html элемент с информацией и пользователе.У функции должен быть один аргумент - объект студента.

async function getStudentItem(studentObj) {
  const tableRow = table.insertRow(-1);
  tableRow.classList.add('student');
  tableRow.id = studentObj.id;
  // tableRow.style.position = 'relative';
  const studentBirthDateToDate = new Date(Date.parse(studentObj.birthDate));
  tableRow.insertCell(0).innerHTML = `${studentObj.surname} ${studentObj.name} ${studentObj.midname} <br/><button class="btn btn-light button-delete" id="button-delete">Удалить</button>`;
  // tableCell1.append(deleteButton);
  // console.log('dobavil');
  // tableRow.createElement(deleteButton);
  tableRow.insertCell(1).innerHTML = studentObj.faculty;
  // tableRow.insertCell(2).innerHTML = studentBirthDateToDate.toISOString().split('T')[0];
  tableRow.insertCell(2).innerHTML = `${studentBirthDateToDate.getDate()}.${studentBirthDateToDate.getMonth()}.${studentBirthDateToDate.getFullYear()} (${new Date().getFullYear() - studentBirthDateToDate.getFullYear()} лет)`;
  // tableRow.insertCell(2).innerHTML = `${studentObj.birthDate.getDate()}.${studentObj.birthDate.getMonth()}.${studentObj.birthDate.getFullYear()} (${new Date().getFullYear() - studentObj.birthDate.getFullYear()} лет)`;
  tableRow.insertCell(3).innerHTML = `${studentObj.studyYear}-${parseFloat(studentObj.studyYear) + 4} (${new Date().getFullYear() - studentObj.studyYear <= 4 ? (new Date().getFullYear() - studentObj.studyYear) + ' курс' : 'закончил'})`;
}

// Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.

async function renderStudentsTable(studentsArray) {
  // await loadFromDB();
  console.log('render --- Array before rendering is', studentsArray);
  tableClean();
  studentsArray.forEach(e => {
    getStudentItem(e)
  })
  // for (let i = 0; i <= studentsArray.length - 1; ++i) {
  //   getStudentItem(studentsArray[i]);
  // }
  //ниже описанный код получает данные из таблицы студентов и добавляет чувствительность на "клик"
  //почему-то это работает нормально только, когда вставил в код рендера, отдельно либо не работает, либо ошибка((
  deleteButton = document.querySelectorAll('#button-delete');
  deleteButton.forEach(e => {
    e.addEventListener('click', () => {
      if (confirm('Удалить элемент из таблицы?')) {
        (async function () {
          fetch(`http://localhost:3000/api/students/${e.parentElement.parentElement.id}`, {
            method: 'DELETE',
          })
        })();
        console.log(e.parentElement.parentElement.id);
        e.parentElement.parentElement.remove();
      }
    })
  })
  // await loadFromDB();
  console.log('render --- studentList array is rendered into DOM');
  // studentsOfTable = document.querySelectorAll('.student');
  // studentsOfTable.forEach(e => {
  //   e.addEventListener('click', () => {
  //     console.log('da');
  //     // console.log(e.parentElement.parentElement);
  //     // e.append(deleteButton);
  //   })
  // }
  // )
}


// Этап 5. К форме добавления студента добавьте слушатель события отправки формы, в котором будет проверка введенных данных.Если проверка пройдет успешно, добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.
let allInputs = document.getElementsByTagName('input');
const minBirthDate = new Date(1990, 1, 1);
const minStudyYear = 2000;
let form = document.getElementById('form');

form.addEventListener('submit', async e => {
  e.preventDefault();
  let name = document.getElementById('name').value;
  let surname = document.getElementById('surname').value;
  let midname = document.getElementById('midname').value;
  let birthDate = document.getElementById('birth-date').valueAsDate;
  let studyYear = document.getElementById('study-year').value;
  let faculty = document.getElementById('faculty').value;
  let errorDiv = document.getElementById('error');
  let errorList = [];

  // studentObj = {
  //   name: name.trim(),
  //   surname: surname.trim(),
  //   midname: midname.trim(),
  //   birthDate: new Date(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate()),
  //   studyYear: parseFloat(studyYear.trim()),
  //   faculty: faculty.trim(),
  //   get fullName() {
  //     return `${this.surname} ${this.name} ${this.midname}`;
  //   },
  //   get studyYearEnd() {
  //     return this.studyYear + 4;
  //   }
  // }

  async function sendToDB() {
    await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        surname: surname.trim(),
        midname: midname.trim(),
        birthDate: new Date(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate()),
        studyYear: parseFloat(studyYear.trim()),
        faculty: faculty.trim(),
        // fullname: `${surname.trim()} ${name.trim()} ${midname.trim()}`,
        // studyYearEnd: parseFloat(studyYear.trim()) + 4,
      })
    })
    console.log('sendToDB --- A new student sent to DB');
  }

  if (studyYear.trim() >= minStudyYear && studyYear.trim() < new Date().getFullYear() && birthDate > minBirthDate && birthDate < new Date()) {
    // console.log('years are ok');
    errorList = [];
    errorDiv.innerHTML = null;
    // studentsListOrig.push(studentObj);
    await sendToDB();
    // console.log('really sent!');
    tableClean();
    // console.log('table cleaned!');
    // await loadFromDB();
    await loadFromDB();
    // console.log('loaded from DB!');
    renderStudentsTable(studentsList);
    // console.log('All done in forms!', studentsList);
    form.reset();
  }

  if (birthDate < minBirthDate || birthDate > new Date()) {
    errorList.push('Дата рождения должна быть в диапазоне от 01.01.1900 до текущей даты')
  }

  if (studyYear.trim() < minStudyYear || studyYear.trim() > new Date().getFullYear()) {
    errorList.push('Год начала обучения должен быть в диапазоне от 2000 до текущего года')
  }

  if (errorList.length > 0) {
    e.preventDefault();
    errorDiv.innerHTML = errorList.join(', ')
    console.log('years are wrong');
  }
})

// Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.

function SortArr(arr, prop, dir = false) {
  return arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1)
}

const nameColumn = document.getElementById('full-name-th');
const facultyColumn = document.getElementById('faculty-th');
const birthColumn = document.getElementById('birth-date-th');
const studyColumn = document.getElementById('study-year-th');
const columnHead = document.getElementById('head-row').querySelectorAll('th');

let dir;

//вспомогательная функция для очистки таблицы
function tableClean() {
  let tr = document.getElementsByTagName('tr');
  const trLength = tr.length;
  for (let i = trLength - 1; i > 0; i--) {
    tr[i].remove();
  }
}

//вспомогательная функция записи данных из таблицы в массив

columnHead.forEach(async e => {
  e.addEventListener('click', async () => {
    // tableClean();
    let cat;
    if (e.id == 'full-name-th') {
      console.log('Full name column is clicked');
      cat = 'surname';
    }
    if (e.id == 'faculty-th') {
      console.log('Faculty column is clicked');
      cat = 'faculty';
    }
    if (e.id == 'birth-date-th') {
      console.log('Birth date column is clicked');
      cat = 'birthDate';
    }
    if (e.id == 'study-year-th') {
      console.log('Study year column is clicked');
      cat = 'studyYear';
    }
    dir = !dir;
    await loadFromDB();
    SortArr(studentsList, cat, dir);
    renderStudentsTable(studentsList);
  })
})

// Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.

// let studentsListFiltered = [];

function filterList(arr, prop, value) {
  let result = [],
    copy = [...arr]
  for (const item of copy) {
    if (String(item[prop]).toLowerCase().includes(value.toLowerCase()) == true) result.push(item)
  }
  return result
}

const filterTabs = document.getElementById('filters').querySelectorAll('input');

// for (let val of filterTabs) {
//   console.log(val.value);
// }

filterTabs.forEach(async e => {
  e.addEventListener('input', async () => {
    // tableClean();
    // let prop;
    // // studentsListFiltered = [];
    // if (e.id == 'filterByFullName') {
    //   prop = 'fullName';
    //   console.log('e val', e.value);
    // }
    // if (e.id == 'filterByFaculty') {
    //   prop = 'faculty';
    //   // console.log('e type is', prop);
    // }
    // if (e.id == 'filterByStudyYearStart') {
    //   prop = 'studyYear';
    //   // console.log('e type is', prop);
    // }
    // if (e.id == 'filterByStudyYearEnd') {
    //   prop = 'studyYearEnd';
    //   // console.log('e type is', prop);
    // }
    // if (e.value != '')
    // e.title.toLowerCase().includes(e.value.toLowerCase());
    // e.title.toUpperCase().includes(e.value.toUpperCase());
    await loadFromDB();
    studentsList = filterList(studentsList, 'fullname', filterTabs[0].value);
    studentsList = filterList(studentsList, 'faculty', filterTabs[1].value);
    studentsList = filterList(studentsList, 'studyYear', filterTabs[2].value);
    studentsList = filterList(studentsList, 'studyYearEnd', filterTabs[3].value);
    renderStudentsTable(studentsList);
    // console.log(studentsList);
    // for (let val of filterTabs) {
    //   tableClean();
    //   console.log(val.id, val.value);

    //   renderStudentsTable(studentsListFiltered);
    //   // renderStudentsTable(studentsListFiltered = filterList(studentsListFiltered, prop, e.value));
    //   // renderStudentsTable(studentsListFiltered);
    //   // console.log(studentsListFiltered);
    // }

    // filterList(studentsList, prop, e.value);
    //   for(let stud of studentsListOrig) {
    //     for(let prop in stud) {
    //         if(stud[prop].includes(e.value) == true) {
    //           studentsListFiltered.push(stud)
    //         }
    //     }
    // }
    // for(let stud of studentsListOrig) {
    //   for(let prop in stud) {
    //     if (String(stud[prop]).includes(e.value) == true) studentsListFiltered.push(stud)
    //     }
    //       // console.log(stud[prop])
    //   }
    //   renderStudentsTable(studentsListFiltered);
    // renderStudentsTable(studentsList = filterList(arr, prop, e.value)); //рендериться результат, который записан в studentsList
  })
})

document.addEventListener('DOMContentLoaded', async () => {
  await loadFromDB();
  renderStudentsTable(SortArr(studentsList, 'surname', dir));
  document.getElementById('birth-date').max = new Date().toISOString().split('T')[0];
});
