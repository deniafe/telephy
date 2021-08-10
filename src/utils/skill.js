const uuid = () => {
  return Math.random()
    .toString(16)
    .slice(2)
}

export function bot() {
  return {
    id: uuid(),
    title: '',
    key: '',
    skills: []
  }
}

export function skill() {
  return {
    id: uuid(),
    title: '',
    actions: []
  }
}

export function action() {
  return {
    id: uuid(),
    title: '',
    body: ''
  }
}
