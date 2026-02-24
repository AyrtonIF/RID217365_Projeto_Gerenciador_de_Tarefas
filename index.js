const initializeTasks = () => {
  const existingTasks = localStorage.getItem('tasks')

  if (!existingTasks) {
    const initialTasks = [
      {
        id: 1,
        description: 'Implementar tela de listagem de tarefas',
        label: 'frontend',
        createdAt: '2024-08-21',
        status: 'pending',
      },
      {
        id: 2,
        description: 'Criar endpoint para cadastro de tarefas',
        label: 'backend',
        createdAt: '2024-08-21',
        status: 'pending',
      },
      {
        id: 3,
        description: 'Implementar protótipo da listagem de tarefas',
        label: 'backend',
        createdAt: '2024-08-21',
        status: 'done',
      },
    ]

    localStorage.setItem('tasks', JSON.stringify(initialTasks))
  }
}

const renderTasksProgressData = (tasks) => {
  let tasksProgress
  const tasksProgressDOM = document.getElementById('tasks-progress')

  if (tasksProgressDOM) tasksProgress = tasksProgressDOM
  else {
    const newTasksProgressDOM = document.createElement('div')
    newTasksProgressDOM.id = 'tasks-progress'
    document.getElementById('todo-footer').appendChild(newTasksProgressDOM)
    tasksProgress = newTasksProgressDOM
  }

  const doneTasks = tasks.filter((task) => task.status === 'done').length

  tasksProgress.textContent =
    `${doneTasks} tarefa${doneTasks === 1 ? '' : 's'} concluída${doneTasks === 1 ? '' : 's'}`
}

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'))
    return localTasks ? localTasks : []
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage()
    const lastId = tasks[tasks.length - 1]?.id
    return lastId ? lastId + 1 : 1
}

const formatDateBR = (date) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR')
  }

  return new Date(date).toLocaleDateString('pt-BR')
}

const getNewTaskData = (event) => {
  const description = event.target.elements.description.value.trim()
  const label = event.target.elements.label.value.trim()
  const id = getNewTaskId()

  return {
    id,
    description,
    label,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }
}

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event))
    }, 3000)
})

const markAsDone = (taskId) => {
  const tasks = getTasksFromLocalStorage()

  const updatedTasks = tasks.map((task) =>
    Number(task.id) === Number(taskId) ? { ...task, status: 'done' } : task
  )

  setTasksInLocalStorage(updatedTasks)
  renderAllTasks()
}

const createTaskCard = (task) => {
  const list = document.getElementById('todo-list')

  const li = document.createElement('li')
  li.id = task.id
  li.className = 'task-card'
  if (task.status === 'done') li.classList.add('done')

  const left = document.createElement('div')
  left.className = 'task-card-left'

  const title = document.createElement('h3')
  title.className = 'task-title'
  title.textContent = task.description

  const meta = document.createElement('div')
  meta.className = 'task-meta'

  const pill = document.createElement('span')
  pill.className = 'task-pill'
  pill.textContent = task.label

  const date = document.createElement('span')
  date.className = 'task-date'
  date.textContent = ` Criado em: ${formatDateBR(task.createdAt)}`

  meta.appendChild(pill)
  meta.appendChild(date)

  left.appendChild(title)
  left.appendChild(meta)

  const button = document.createElement('button')
  button.className = 'task-action'

  if (task.status === 'pending') {
    button.textContent = 'Concluir'
    button.onclick = () => markAsDone(task.id)
  } else {
    button.innerHTML = `<img src="assets/checked.svg" alt="Concluído">`
    button.disabled = true
  }

  li.appendChild(left)
  li.appendChild(button)

  list.appendChild(li)
}

const renderAllTasks = () => {
  const list = document.getElementById('todo-list')
  list.innerHTML = ''

  const tasks = getTasksFromLocalStorage()

  const ordered = [...tasks].sort((taskA, taskB) => {
    const priorityA = taskA.status === 'pending' ? 0 : 1
    const priorityB = taskB.status === 'pending' ? 0 : 1
    return priorityA - priorityB
  })

  ordered.forEach(createTaskCard)
  renderTasksProgressData(tasks)
}

const createTask = async (event) => {
  event.preventDefault()

  const saveBtn = document.getElementById('save-task')
  saveBtn.setAttribute('disabled', true)

  const newTaskData = await getCreatedTaskInfo(event)

  if (!newTaskData.description || !newTaskData.label) {
    saveBtn.removeAttribute('disabled')
    return
  }

  const tasks = getTasksFromLocalStorage()
  const updatedTasks = [...tasks, newTaskData]

  setTasksInLocalStorage(updatedTasks)
  renderAllTasks()

  document.getElementById('description').value = ''
  document.getElementById('label').value = ''
  saveBtn.removeAttribute('disabled')
}

window.onload = function () {
  const form = document.getElementById('creat-todo-form')
  form.addEventListener('submit', createTask)

  initializeTasks()
  renderAllTasks()
}